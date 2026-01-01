using System.Text;
using System.Text.Json;
using Brevit.NET;

static string? GetArg(string[] args, string name)
{
    for (var i = 0; i < args.Length; i++)
    {
        if (args[i] == name && i + 1 < args.Length) return args[i + 1];
    }
    return null;
}

static bool HasFlag(string[] args, string name) => args.Any(a => a == name);

var save = HasFlag(args, "--save");
var caseName = GetArg(args, "--case");
var manifestArg = GetArg(args, "--manifest");
var extractedArg = GetArg(args, "--extracted");
var llm = HasFlag(args, "--llm");
var model = GetArg(args, "--model") ?? "llama3.1:8b";

var here = AppContext.BaseDirectory;
// Navigate from: tests/dotnet/Brevit.FixturesRunner/bin/... -> repo root
var repoRoot = Path.GetFullPath(Path.Combine(here, "..", "..", "..", "..", "..", ".."));
var manifestPath = !string.IsNullOrWhiteSpace(manifestArg)
    ? Path.GetFullPath(Path.Combine(repoRoot, manifestArg))
    : Path.Combine(repoRoot, "tests", "shared", "file-fixtures.json");
var extractedDir = !string.IsNullOrWhiteSpace(extractedArg)
    ? Path.GetFullPath(Path.Combine(repoRoot, extractedArg))
    : Path.Combine(repoRoot, "tests", "shared", "extracted");

static string BuildPrompt(string? intent, string brevitOutput)
{
    var intentLine = !string.IsNullOrWhiteSpace(intent) ? $"Intent: {intent}\n" : "";
    return
        "You are a strict evaluator. Read the Brevit-optimized input and answer the intent.\n" +
        intentLine +
        "Return a concise, factual answer.\n\n" +
        "BrevitInput:\n" +
        brevitOutput + "\n";
}

static async Task<string> CallOllamaAsync(string model, string prompt)
{
    using var http = new HttpClient();
    var payload = new
    {
        model,
        prompt,
        stream = false,
        options = new { temperature = 0 }
    };
    var json = JsonSerializer.Serialize(payload);
    using var content = new StringContent(json, Encoding.UTF8, "application/json");
    HttpResponseMessage resp;
    try
    {
        resp = await http.PostAsync("http://localhost:11434/api/generate", content);
    }
    catch (Exception ex)
    {
        throw new Exception(
            "Ollama is not reachable at http://localhost:11434.\n" +
            $"Start it (e.g., `ollama serve`) and ensure the model exists (e.g., `ollama pull {model}`).\n" +
            $"Original error: {ex.Message}"
        );
    }

    var body = await resp.Content.ReadAsStringAsync();
    if (!resp.IsSuccessStatusCode)
    {
        throw new Exception($"Ollama error ({(int)resp.StatusCode}): {body}");
    }
    using var doc = JsonDocument.Parse(body);
    if (doc.RootElement.TryGetProperty("response", out var r))
    {
        return (r.GetString() ?? "").Trim();
    }
    return "";
}

var outDir = Path.Combine(repoRoot, "tests", "outputs", "dotnet");
if (save) Directory.CreateDirectory(outDir);

var client = new BrevitClient(
    new BrevitConfig(JsonMode: JsonOptimizationMode.Flatten),
    new DefaultJsonOptimizer(),
    new DefaultTextOptimizer(),
    new DefaultImageOptimizer()
);

var manifestJson = await File.ReadAllTextAsync(manifestPath);
using var manifestDoc = JsonDocument.Parse(manifestJson);
var root = manifestDoc.RootElement;
if (!root.TryGetProperty("cases", out var casesEl) || casesEl.ValueKind != JsonValueKind.Array)
{
    Console.Error.WriteLine("Expected manifest JSON to contain a 'cases' array.");
    return 1;
}

var cases = new List<(string name, string type, string? intent)>();
foreach (var c in casesEl.EnumerateArray())
{
    var name = c.GetProperty("name").GetString() ?? "";
    var type = c.GetProperty("type").GetString() ?? "";
    string? intent = null;
    if (c.TryGetProperty("intent", out var intentEl) && intentEl.ValueKind == JsonValueKind.String)
    {
        intent = intentEl.GetString();
    }
    if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(type)) continue;
    cases.Add((name, type, intent));
}

if (!string.IsNullOrWhiteSpace(caseName))
{
    if (!cases.Any(c => c.name == caseName))
    {
        Console.Error.WriteLine($"Unknown case \"{caseName}\". Available: {string.Join(", ", cases.Select(c => c.name))}");
        return 1;
    }
    cases = cases.Where(c => c.name == caseName).ToList();
}

foreach (var c in cases)
{
    var extractedJsonPath = Path.Combine(extractedDir, $"{c.name}.json");
    var extractedTextPath = Path.Combine(extractedDir, $"{c.name}.txt");
    string brevitInput;
    string extractedSrcPath;
    string extractedExt;

    if (c.type == "json")
    {
        brevitInput = await File.ReadAllTextAsync(extractedJsonPath);
        extractedSrcPath = extractedJsonPath;
        extractedExt = "json";
    }
    else
    {
        brevitInput = await File.ReadAllTextAsync(extractedTextPath);
        extractedSrcPath = extractedTextPath;
        extractedExt = "txt";
    }

    var output = await client.BrevityAsync(brevitInput);

    Console.WriteLine($"=== Fixture: {c.name} ===");
    Console.WriteLine("Output:");
    Console.WriteLine(output);
    Console.WriteLine();

    if (save)
    {
        File.Copy(extractedSrcPath, Path.Combine(outDir, $"{c.name}.extracted.{extractedExt}"), overwrite: true);

        await File.WriteAllTextAsync(Path.Combine(outDir, $"{c.name}.brevit.txt"), output + "\n");

        var metaSrc = Path.Combine(extractedDir, $"{c.name}.meta.json");
        var metaDst = Path.Combine(outDir, $"{c.name}.meta.json");
        if (File.Exists(metaSrc))
        {
            File.Copy(metaSrc, metaDst, overwrite: true);
        }

        if (llm)
        {
            var llmOut = await CallOllamaAsync(model, BuildPrompt(c.intent, output));
            Console.WriteLine("LLM Output:");
            Console.WriteLine(llmOut);
            Console.WriteLine();
            await File.WriteAllTextAsync(Path.Combine(outDir, $"{c.name}.llm.txt"), llmOut + "\n");
        }
    }
}

if (save)
{
    Console.WriteLine($"✅ Saved outputs to: {outDir}");
}

return 0;



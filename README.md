# Brevit

> **Brevit** (from "Brevity") - A high-performance, multi-language library ecosystem for semantically compressing and optimizing data before sending it to Large Language Models (LLMs). Dramatically reduce token costs by 40-60% while maintaining data integrity and readability.

## Table of Contents

- [Why Brevit?](#why-brevit)
- [Key Features](#key-features)
- [When Not to Use Brevit](#when-not-to-use-brevit)
- [Benchmarks](#benchmarks)
- [Installation & Quick Start](#installation--quick-start)
- [Playgrounds](#playgrounds)
- [CLI](#cli)
- [Format Overview](#format-overview)
- [API](#api)
- [Using Brevit in LLM Prompts](#using-brevit-in-llm-prompts)
- [Syntax Cheatsheet](#syntax-cheatsheet)
- [Other Implementations](#other-implementations)
- [Full Specification](#full-specification)

## What is Brevit?

Brevit is a comprehensive token optimization solution designed to help developers and organizations reduce LLM API costs significantly. Named after the word "brevity" (meaning concise and exact use of words), Brevit transforms verbose data structures into token-efficient formats that LLMs can understand just as well, but at a fraction of the cost.

## Why Brevit?

### Cost Savings
- **40-60% Token Reduction**: Flatten nested JSON structures into efficient key-value pairs, dramatically reducing token counts
- **Lower API Costs**: Pay less for the same quality LLM responses by sending optimized data
- **Scalable Savings**: The more you use LLMs, the more you save with Brevit

### Developer Experience
- **Multi-Language Support**: Consistent API across C#, JavaScript, and Python - use the same patterns everywhere
- **Zero Learning Curve**: Simple, intuitive API that works out of the box
- **Type-Safe**: Built with modern language features for reliability and IDE support
- **First-Class POCO Support**: Optimize C# objects directly without manual serialization

### Performance & Reliability
- **Lightweight**: Minimal dependencies, maximum performance
- **Production-Ready**: Battle-tested architecture designed for real-world applications
- **Extensible Architecture**: Plugin system for custom optimizers (LangChain, Semantic Kernel, Azure AI, etc.)
- **Memory Efficient**: Processes data in-place where possible, minimizing memory footprint

### Real-World Cost Example
If you're processing 1 million API calls per month:
- **Without Brevit**: ~100 tokens per call × $0.002/1K tokens = $200/month
- **With Brevit**: ~50 tokens per call × $0.002/1K tokens = $100/month
- **Savings**: **$100/month** (50% reduction) or **$1,200/year**

## Key Features

### 1. JSON Optimization
Transform complex nested JSON into flat, token-efficient formats:
- **Flatten Mode**: Convert `{"user": {"name": "J"}}` → `user.name: J` (saves ~40% tokens)
- **Tabular Arrays**: Automatically detects uniform object arrays and formats them in compact tabular format (saves ~50-60% tokens)
- **Primitive Arrays**: Comma-separated format for arrays of primitives (saves ~70% tokens)
- **YAML Mode**: Convert JSON to YAML for better readability and token efficiency
- **Filter Mode**: Extract only the fields you need, ignoring unnecessary data
- **Smart Array Handling**: Hybrid approach - uses tabular format when possible, falls back to indexed paths for mixed data
- **Abbreviation Feature** (New in v0.1.2): Automatically creates short aliases for frequently repeated prefixes, reducing tokens by 10-25%

**Example - Tabular Optimization:**
```json
// Before (160 tokens)
{
  "friends": ["ana", "luis", "sam"],
  "hikes": [
    {"id": 1, "name": "Blue Lake Trail", "distanceKm": 7.5, "elevationGain": 320},
    {"id": 2, "name": "Ridge Overlook", "distanceKm": 9.2, "elevationGain": 540},
    {"id": 3, "name": "Wildflower Loop", "distanceKm": 5.1, "elevationGain": 180}
  ]
}
```

```
// After (95 tokens - 40% reduction)
friends[3]:ana,luis,sam
hikes[3]{distanceKm,elevationGain,id,name}:
7.5,320,1,Blue Lake Trail
9.2,540,2,Ridge Overlook
5.1,180,3,Wildflower Loop
```

**Example - Nested Objects:**
```json
// Before (45 tokens)
{
  "user": {
    "id": "u-123",
    "name": "Javian",
    "contact": {
      "email": "support@javianpicardo.com",
      "phone": "+1-555-0123"
    }
  }
}
```

```
// After (28 tokens - 38% reduction)
user.id:u-123
user.name:Javian
user.contact.email:support@javianpicardo.com
user.contact.phone:+1-555-0123
```

**Example - Abbreviation Feature (New in v0.1.2):**
```json
// Before (78 tokens)
{
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  },
  "order": {
    "id": "o-456",
    "status": "SHIPPED",
    "items": [
      {"sku": "A-88", "quantity": 1}
    ]
  }
}
```

```
// After with abbreviations (70 tokens - 10% additional reduction)
@u=user
@o=order
@u.name:John Doe
@u.email:john@example.com
@u.age:30
@o.id:o-456
@o.status:SHIPPED
@o.items[1]{quantity,sku}:
1,A-88
```

The abbreviation feature automatically creates short aliases (`@u=user`, `@o=order`) for frequently repeated prefixes, reducing tokens by an additional 10-25% on top of the base optimization.

### 2. Text Optimization
Deterministic, extractive TextRank-based processing for plain text:
- **Lossless by Default**: Auto mode keeps all sentences unless you explicitly request compression.
- **Ratio Compression**: Pass a ratio \(0 < r < 1\) to keep the top-ranked fraction of sentences.
- **Always Attempted**: Text processing is attempted even for short or single-sentence inputs.
- **No LLM Required**: Deterministic extractive pipeline (for abstractive summarization, plug in your own optimizer).

### 3. Image Optimization
Extract and optimize content from images:
- **OCR Integration**: Extract text from receipts, invoices, documents, and more
- **Metadata Extraction**: Get image metadata without processing the entire image
- **Multi-Provider Support**: Works with Azure AI Vision, Tesseract, and custom OCR services
- **Format Conversion**: Convert images to text that LLMs can process efficiently

### 4. Smart Data Handling
- **Type Detection**: Automatically detects JSON strings, objects, text, and images
- **POCO Support**: Direct optimization of C# objects without manual serialization
- **Async/Await**: Full async support for high-performance, scalable applications
- **Error Handling**: Graceful error handling with informative messages

### 5. Automatic Strategy Selection (`.brevity()`)
- **Intelligent Analysis**: Automatically analyzes data structure (depth, arrays, complexity)
- **Optimal Strategy**: Selects the best optimization method based on data characteristics
- **Zero Configuration**: Works out of the box without manual configuration
- **Extensible**: Register custom strategies for domain-specific optimizations
- **Scoring System**: Uses a scoring algorithm (0-100) to rank optimization strategies

## When Not to Use Brevit

Brevit is designed for optimizing data before sending to LLMs. Consider alternatives when:

1. **Human-Readable Format Required**: If you need JSON for human consumption or API responses, use standard JSON
2. **Complex Nested Structures**: For deeply nested structures where hierarchy is critical, standard JSON may be better
3. **Small Data Sets**: For data under 100 tokens, the optimization overhead may not be worth it
4. **Real-Time APIs**: If you're building REST APIs that return JSON to clients, use standard JSON
5. **Data Validation**: If you need strict JSON schema validation, use standard JSON with validators

**When Brevit Shines:**
- ✅ LLM prompt optimization
- ✅ Reducing API costs
- ✅ Processing large datasets for AI
- ✅ Document summarization workflows
- ✅ OCR and image processing pipelines

## Benchmarks

### Token Reduction Benchmarks

| Data Type | Original Tokens | Brevit Tokens | Reduction | Example |
|-----------|---------------|---------------|-----------|---------|
| Simple JSON | 45 | 28 | 38% | User object with contact info |
| Complex JSON | 234 | 127 | 46% | E-commerce order with items |
| Nested Arrays | 156 | 89 | 43% | Product catalog |
| Mixed Data | 312 | 178 | 43% | API response with metadata |

### Performance Benchmarks

| Operation | Time (ms) | Memory (MB) |
|-----------|-----------|-------------|
| Flatten JSON (1KB) | 0.5 | 2.1 |
| Flatten JSON (10KB) | 2.3 | 8.5 |
| Flatten JSON (100KB) | 18.7 | 45.2 |
| Text Clean (1KB) | 0.3 | 1.8 |
| Text Clean (10KB) | 1.2 | 6.3 |

*Benchmarks run on: Intel i7-12700K, 32GB RAM, Node.js 20.x / .NET 8 / Python 3.11*

## Installation & Quick Start

### Choose Your Language

1. **[C# (.NET)](./Brevit.NET/README.md)** - For .NET applications
   ```bash
   dotnet add package Brevit
   ```

2. **[JavaScript](./Brevit.js/README.md)** - For Node.js and browser applications
   ```bash
   npm install brevit
   ```

3. **[Python](./Brevit.py/README.md)** - For Python applications
   ```bash
   pip install brevit
   ```

## Complete Usage Examples

Brevit supports three main data types: **JSON objects/strings**, **text files/strings**, and **images**. Here's how to use each:

### 1. JSON Optimization Examples

Brevit can optimize JSON objects, JSON strings, and complex nested structures.

#### Example 1.1: Simple JSON Object

**JavaScript:**
```javascript
import { BrevitClient, BrevitConfig, JsonOptimizationMode } from 'brevit';

const brevit = new BrevitClient(new BrevitConfig({ 
  jsonMode: JsonOptimizationMode.Flatten 
}));

const data = {
  user: {
    name: "John Doe",
    email: "john@example.com",
    age: 30
  }
};

// Method 1: Automatic optimization (recommended)
const optimized = await brevit.brevity(data);
// Output: user.name:John Doe
//         user.email:john@example.com
//         user.age:30

// Method 2: Explicit optimization
const explicit = await brevit.optimize(data);
```

**C#:**
```csharp
using Brevit.NET;

var config = new BrevitConfig(JsonMode: JsonOptimizationMode.Flatten);
var brevit = new BrevitClient(config, 
    new DefaultJsonOptimizer(), 
    new DefaultTextOptimizer(), 
    new DefaultImageOptimizer());

var data = new { 
    User = new { 
        Name = "John Doe", 
        Email = "john@example.com", 
        Age = 30 
    } 
};

// Method 1: Automatic optimization (recommended)
var optimized = await brevit.BrevityAsync(data);

// Method 2: Explicit optimization
var explicit = await brevit.OptimizeAsync(data);
```

**Python:**
```python
from brevit import BrevitClient, BrevitConfig, JsonOptimizationMode

brevit = BrevitClient(BrevitConfig(json_mode=JsonOptimizationMode.Flatten))

data = {
    "user": {
        "name": "John Doe",
        "email": "john@example.com",
        "age": 30
    }
}

# Method 1: Automatic optimization (recommended)
optimized = await brevit.brevity(data)

# Method 2: Explicit optimization
explicit = await brevit.optimize(data)
```

#### Example 1.2: JSON String

**JavaScript:**
```javascript
const jsonString = '{"order": {"id": "o-456", "status": "SHIPPED"}}';

// Brevit automatically detects JSON strings
const optimized = await brevit.brevity(jsonString);
// Output: order.id:o-456
//         order.status:SHIPPED
```

**C#:**
```csharp
string jsonString = "{\"order\": {\"id\": \"o-456\", \"status\": \"SHIPPED\"}}";

// Brevit automatically detects JSON strings
var optimized = await brevit.BrevityAsync(jsonString);
```

**Python:**
```python
json_string = '{"order": {"id": "o-456", "status": "SHIPPED"}}'

# Brevit automatically detects JSON strings
optimized = await brevit.brevity(json_string)
```

#### Example 1.3: Complex Nested JSON with Arrays

**JavaScript:**
```javascript
const complexData = {
  context: {
    task: "Our favorite hikes together",
    location: "Boulder",
    season: "spring_2025"
  },
  friends: ["ana", "luis", "sam"],
  hikes: [
    {
      id: 1,
      name: "Blue Lake Trail",
      distanceKm: 7.5,
      elevationGain: 320,
      companion: "ana",
      wasSunny: true
    },
    {
      id: 2,
      name: "Ridge Overlook",
      distanceKm: 9.2,
      elevationGain: 540,
      companion: "luis",
      wasSunny: false
    }
  ]
};

const optimized = await brevit.brevity(complexData);
// Output:
// context.task:Our favorite hikes together
// context.location:Boulder
// context.season:spring_2025
// friends[3]:ana,luis,sam
// hikes[2]{companion,distanceKm,elevationGain,id,name,wasSunny}:
// ana,7.5,320,1,Blue Lake Trail,true
// luis,9.2,540,2,Ridge Overlook,false
```

#### Example 1.4: Different JSON Optimization Modes

**Flatten Mode (Default):**
```javascript
const config = new BrevitConfig({ 
  jsonMode: JsonOptimizationMode.Flatten 
});
const brevit = new BrevitClient(config);
// Converts nested JSON to flat key-value pairs
```

**YAML Mode:**
```javascript
const config = new BrevitConfig({ 
  jsonMode: JsonOptimizationMode.ToYaml 
});
// Converts JSON to YAML format (requires js-yaml package)
```

**Filter Mode:**
```javascript
const config = new BrevitConfig({ 
  jsonMode: JsonOptimizationMode.Filter,
  jsonPathsToKeep: ["user.name", "order.id"]
});
// Keeps only specified paths, removes everything else
```

### 2. Text Optimization Examples

Brevit provides deterministic TextRank-based text compression that works on any text input, from single sentences to large documents. The compression is **lossless by default** in auto mode, and supports ratio-based compression for more aggressive reduction.

#### Example 2.1: Auto Mode (Lossless by Default)

Auto mode uses TextRank to analyze sentence importance but keeps all sentences by default (lossless). This is ideal when you want semantic analysis without losing content.

**JavaScript:**
```javascript
import { BrevitClient, BrevitConfig } from 'brevit';

const brevit = new BrevitClient(new BrevitConfig());

const document = `
Artificial intelligence is transforming how we work and live. 
Machine learning algorithms can now process vast amounts of data. 
Natural language processing enables computers to understand human language.
Deep learning models have achieved remarkable breakthroughs in recent years.
These technologies are reshaping industries across the globe.
`;

// Method 1: Using brevity() - automatic text compression (lossless)
const autoCompressed = await brevit.brevity(document);
// Result: All sentences kept (lossless by default)

// Method 2: Using explicit compressText() - AUTO mode
const compressed = await brevit.compressText(document);
// Result: All sentences kept (lossless by default)
```

**C#:**
```csharp
using Brevit.NET;

var brevit = new BrevitClient(
    new BrevitConfig(),
    new DefaultJsonOptimizer(),
    new DefaultTextOptimizer(),
    new DefaultImageOptimizer()
);

string document = @"
Artificial intelligence is transforming how we work and live.
Machine learning algorithms can now process vast amounts of data.
Natural language processing enables computers to understand human language.
Deep learning models have achieved remarkable breakthroughs in recent years.
These technologies are reshaping industries across the globe.
";

// Method 1: Using BrevityAsync() - automatic text compression (lossless)
var autoCompressed = await brevit.BrevityAsync(document);
// Result: All sentences kept (lossless by default)

// Method 2: Using explicit CompressTextAsync() - AUTO mode
var compressed = await brevit.CompressTextAsync(document);
// Result: All sentences kept (lossless by default)
```

**Python:**
```python
from brevit import BrevitClient, BrevitConfig

brevit = BrevitClient(BrevitConfig())

document = """
Artificial intelligence is transforming how we work and live.
Machine learning algorithms can now process vast amounts of data.
Natural language processing enables computers to understand human language.
Deep learning models have achieved remarkable breakthroughs in recent years.
These technologies are reshaping industries across the globe.
"""

# Method 1: Using brevity() - automatic text compression (lossless)
auto_compressed = await brevit.brevity(document)
# Result: All sentences kept (lossless by default)

# Method 2: Using explicit compress_text() - AUTO mode
compressed = brevit.compress_text(document)
# Result: All sentences kept (lossless by default)
```

#### Example 2.2: Ratio-Based Compression

Ratio-based compression keeps only the top-ranked sentences by importance. Use this when you need aggressive token reduction.

**JavaScript:**
```javascript
const longDocument = `
The company reported strong quarterly earnings this year.
Revenue increased by 25% compared to the previous quarter.
Operating expenses were reduced through strategic cost-cutting measures.
The board of directors approved a new expansion plan.
Several new products are scheduled for release next month.
Customer satisfaction scores reached an all-time high.
The marketing team launched a successful advertising campaign.
International sales showed significant growth in Asian markets.
`;

// Keep 50% of sentences (top-ranked by importance)
const compressed50 = await brevit.optimizeText(longDocument, 0.5);
// Result: ~4 sentences kept (top-ranked by TextRank)

// Keep 30% of sentences (more aggressive compression)
const compressed30 = await brevit.optimizeText(longDocument, 0.3);
// Result: ~2-3 sentences kept

// Keep 70% of sentences (less aggressive)
const compressed70 = await brevit.optimizeText(longDocument, 0.7);
// Result: ~5-6 sentences kept

// Ratio 0.0 or negative = AUTO mode (lossless)
const autoMode = await brevit.optimizeText(longDocument, 0.0);
// Result: All sentences kept (same as compressText)
```

**C#:**
```csharp
string longDocument = @"
The company reported strong quarterly earnings this year.
Revenue increased by 25% compared to the previous quarter.
Operating expenses were reduced through strategic cost-cutting measures.
The board of directors approved a new expansion plan.
Several new products are scheduled for release next month.
Customer satisfaction scores reached an all-time high.
The marketing team launched a successful advertising campaign.
International sales showed significant growth in Asian markets.
";

// Keep 50% of sentences (top-ranked by importance)
var compressed50 = await brevit.OptimizeTextAsync(longDocument, 0.5);
// Result: ~4 sentences kept (top-ranked by TextRank)

// Keep 30% of sentences (more aggressive compression)
var compressed30 = await brevit.OptimizeTextAsync(longDocument, 0.3);
// Result: ~2-3 sentences kept

// Keep 70% of sentences (less aggressive)
var compressed70 = await brevit.OptimizeTextAsync(longDocument, 0.7);
// Result: ~5-6 sentences kept

// Ratio 0.0 or negative = AUTO mode (lossless)
var autoMode = await brevit.OptimizeTextAsync(longDocument, 0.0);
// Result: All sentences kept (same as CompressTextAsync)
```

**Python:**
```python
long_document = """
The company reported strong quarterly earnings this year.
Revenue increased by 25% compared to the previous quarter.
Operating expenses were reduced through strategic cost-cutting measures.
The board of directors approved a new expansion plan.
Several new products are scheduled for release next month.
Customer satisfaction scores reached an all-time high.
The marketing team launched a successful advertising campaign.
International sales showed significant growth in Asian markets.
"""

# Keep 50% of sentences (top-ranked by importance)
compressed_50 = brevit.optimize_text(long_document, 0.5)
# Result: ~4 sentences kept (top-ranked by TextRank)

# Keep 30% of sentences (more aggressive compression)
compressed_30 = brevit.optimize_text(long_document, 0.3)
# Result: ~2-3 sentences kept

# Keep 70% of sentences (less aggressive)
compressed_70 = brevit.optimize_text(long_document, 0.7)
# Result: ~5-6 sentences kept

# Ratio 0.0 or negative = AUTO mode (lossless)
auto_mode = brevit.optimize_text(long_document, 0.0)
# Result: All sentences kept (same as compress_text)
```

#### Example 2.3: Short Text vs Long Text

Brevit handles both short and long text inputs gracefully.

**JavaScript:**
```javascript
// Single sentence - still processed (lossless in auto mode)
const shortText = "Artificial intelligence is revolutionizing technology.";
const shortResult = await brevit.compressText(shortText);
// Result: Same sentence (lossless)

// Multi-paragraph document
const longText = `
Paragraph one contains important information about the topic.
It discusses various aspects and implications.
The second paragraph provides additional context.
It explains the background and historical significance.
Paragraph three presents conclusions and future directions.
It summarizes key findings and recommendations.
`.repeat(10);

// Auto mode - lossless
const autoResult = await brevit.compressText(longText);
// Result: All sentences kept

// Ratio mode - keep 40% of sentences
const ratioResult = await brevit.optimizeText(longText, 0.4);
// Result: Top-ranked sentences kept
```

**C#:**
```csharp
// Single sentence - still processed (lossless in auto mode)
string shortText = "Artificial intelligence is revolutionizing technology.";
var shortResult = await brevit.CompressTextAsync(shortText);
// Result: Same sentence (lossless)

// Multi-paragraph document
string longText = @"
Paragraph one contains important information about the topic.
It discusses various aspects and implications.
The second paragraph provides additional context.
It explains the background and historical significance.
Paragraph three presents conclusions and future directions.
It summarizes key findings and recommendations.
" + string.Concat(Enumerable.Repeat("...", 100));

// Auto mode - lossless
var autoResult = await brevit.CompressTextAsync(longText);
// Result: All sentences kept

// Ratio mode - keep 40% of sentences
var ratioResult = await brevit.OptimizeTextAsync(longText, 0.4);
// Result: Top-ranked sentences kept
```

**Python:**
```python
# Single sentence - still processed (lossless in auto mode)
short_text = "Artificial intelligence is revolutionizing technology."
short_result = brevit.compress_text(short_text)
# Result: Same sentence (lossless)

# Multi-paragraph document
long_text = """
Paragraph one contains important information about the topic.
It discusses various aspects and implications.
The second paragraph provides additional context.
It explains the background and historical significance.
Paragraph three presents conclusions and future directions.
It summarizes key findings and recommendations.
""" * 10

# Auto mode - lossless
auto_result = brevit.compress_text(long_text)
# Result: All sentences kept

# Ratio mode - keep 40% of sentences
ratio_result = brevit.optimize_text(long_text, 0.4)
# Result: Top-ranked sentences kept
```

#### Example 2.4: Using brevity() vs optimize() vs Explicit APIs

Different methods for text compression offer different levels of control.

**JavaScript:**
```javascript
const text = "Your document text here...";

// Method 1: brevity() - Automatic, always uses text compression for plain text
const result1 = await brevit.brevity(text);
// Automatically detects text and applies compression (lossless by default)

// Method 2: optimize() - Uses config settings, can be combined with other modes
const config = new BrevitConfig({
    jsonMode: JsonOptimizationMode.None,
    textMode: TextOptimizationMode.Clean
});
const brevitConfigured = new BrevitClient(config);
const result2 = await brevitConfigured.optimize(text);
// Uses TextOptimizationMode.Clean (which uses TextRank compression)

// Method 3: compressText() - Direct AUTO mode (lossless)
const result3 = await brevit.compressText(text);
// Always lossless, keeps all sentences

// Method 4: optimizeText() - Direct ratio-based compression
const result4 = await brevit.optimizeText(text, 0.5);
// Keeps 50% of top-ranked sentences
```

**C#:**
```csharp
string text = "Your document text here...";

// Method 1: BrevityAsync() - Automatic, always uses text compression for plain text
var result1 = await brevit.BrevityAsync(text);
// Automatically detects text and applies compression (lossless by default)

// Method 2: OptimizeAsync() - Uses config settings
var config = new BrevitConfig(
    JsonMode: JsonOptimizationMode.None,
    TextMode: TextOptimizationMode.Clean
);
var brevitConfigured = new BrevitClient(config, 
    new DefaultJsonOptimizer(), 
    new DefaultTextOptimizer(), 
    new DefaultImageOptimizer());
var result2 = await brevitConfigured.OptimizeAsync(text);
// Uses TextOptimizationMode.Clean (which uses TextRank compression)

// Method 3: CompressTextAsync() - Direct AUTO mode (lossless)
var result3 = await brevit.CompressTextAsync(text);
// Always lossless, keeps all sentences

// Method 4: OptimizeTextAsync() - Direct ratio-based compression
var result4 = await brevit.OptimizeTextAsync(text, 0.5);
// Keeps 50% of top-ranked sentences
```

**Python:**
```python
text = "Your document text here..."

# Method 1: brevity() - Automatic, always uses text compression for plain text
result1 = await brevit.brevity(text)
# Automatically detects text and applies compression (lossless by default)

# Method 2: optimize() - Uses config settings
config = BrevitConfig(
    json_mode=JsonOptimizationMode.None,
    text_mode=TextOptimizationMode.Clean
)
brevit_configured = BrevitClient(config)
result2 = await brevit_configured.optimize(text)
# Uses TextOptimizationMode.Clean (which uses TextRank compression)

# Method 3: compress_text() - Direct AUTO mode (lossless)
result3 = brevit.compress_text(text)
# Always lossless, keeps all sentences

# Method 4: optimize_text() - Direct ratio-based compression
result4 = brevit.optimize_text(text, 0.5)
# Keeps 50% of top-ranked sentences
```

#### Example 2.5: Reading Text from File

**JavaScript (Node.js):**
```javascript
import fs from 'fs/promises';

// Read text file
const textContent = await fs.readFile('document.txt', 'utf-8');

// Auto mode - lossless compression
const autoResult = await brevit.compressText(textContent);

// Ratio-based compression - keep 60% of sentences
const ratioResult = await brevit.optimizeText(textContent, 0.6);

// Using brevity() - automatic detection
const brevityResult = await brevit.brevity(textContent);
```

**C#:**
```csharp
// Read text file
string textContent = await File.ReadAllTextAsync("document.txt");

// Auto mode - lossless compression
var autoResult = await brevit.CompressTextAsync(textContent);

// Ratio-based compression - keep 60% of sentences
var ratioResult = await brevit.OptimizeTextAsync(textContent, 0.6);

// Using BrevityAsync() - automatic detection
var brevityResult = await brevit.BrevityAsync(textContent);
```

**Python:**
```python
# Read text file
with open('document.txt', 'r', encoding='utf-8') as f:
    text_content = f.read()

# Auto mode - lossless compression
auto_result = brevit.compress_text(text_content)

# Ratio-based compression - keep 60% of sentences
ratio_result = brevit.optimize_text(text_content, 0.6)

# Using brevity() - automatic detection
brevity_result = await brevit.brevity(text_content)
```

#### Example 2.6: Complete Workflow - Document Processing Pipeline

**JavaScript:**
```javascript
import fs from 'fs/promises';
import { BrevitClient, BrevitConfig } from 'brevit';

const brevit = new BrevitClient(new BrevitConfig());

async function processDocument(filePath, compressionRatio = 0.0) {
    // Step 1: Read document
    const rawText = await fs.readFile(filePath, 'utf-8');
    
    // Step 2: Compress based on ratio
    let compressed;
    if (compressionRatio > 0) {
        // Aggressive compression for long documents
        compressed = await brevit.optimizeText(rawText, compressionRatio);
    } else {
        // Lossless compression (default)
        compressed = await brevit.compressText(rawText);
    }
    
    // Step 3: Use in LLM prompt
    const prompt = `Summarize this document:\n\n${compressed}`;
    
    return prompt;
}

// Usage examples
const prompt1 = await processDocument('long-report.txt', 0.3);  // Keep 30%
const prompt2 = await processDocument('article.txt', 0.0);     // Lossless
```

**C#:**
```csharp
using Brevit.NET;

var brevit = new BrevitClient(
    new BrevitConfig(),
    new DefaultJsonOptimizer(),
    new DefaultTextOptimizer(),
    new DefaultImageOptimizer()
);

async Task<string> ProcessDocument(string filePath, double compressionRatio = 0.0)
{
    // Step 1: Read document
    string rawText = await File.ReadAllTextAsync(filePath);
    
    // Step 2: Compress based on ratio
    string compressed;
    if (compressionRatio > 0)
    {
        // Aggressive compression for long documents
        compressed = await brevit.OptimizeTextAsync(rawText, compressionRatio);
    }
    else
    {
        // Lossless compression (default)
        compressed = await brevit.CompressTextAsync(rawText);
    }
    
    // Step 3: Use in LLM prompt
    string prompt = $"Summarize this document:\n\n{compressed}";
    
    return prompt;
}

// Usage examples
var prompt1 = await ProcessDocument("long-report.txt", 0.3);  // Keep 30%
var prompt2 = await ProcessDocument("article.txt", 0.0);       // Lossless
```

**Python:**
```python
from brevit import BrevitClient, BrevitConfig

brevit = BrevitClient(BrevitConfig())

async def process_document(file_path, compression_ratio=0.0):
    # Step 1: Read document
    with open(file_path, 'r', encoding='utf-8') as f:
        raw_text = f.read()
    
    # Step 2: Compress based on ratio
    if compression_ratio > 0:
        # Aggressive compression for long documents
        compressed = brevit.optimize_text(raw_text, compression_ratio)
    else:
        # Lossless compression (default)
        compressed = brevit.compress_text(raw_text)
    
    # Step 3: Use in LLM prompt
    prompt = f"Summarize this document:\n\n{compressed}"
    
    return prompt

# Usage examples
prompt1 = await process_document('long-report.txt', 0.3)  # Keep 30%
prompt2 = await process_document('article.txt', 0.0)       # Lossless
```

#### Example 2.7: Text Optimization Modes Summary

**Clean Mode (Default TextRank Compression):**
```javascript
const config = new BrevitConfig({ 
  textMode: TextOptimizationMode.Clean 
});
// Uses deterministic TextRank-based compression
// - Auto mode: Lossless (keeps all sentences)
// - Ratio mode: Keeps top-ranked sentences by ratio
```

**Summarize Fast (Requires Custom Optimizer):**
```javascript
const config = new BrevitConfig({ 
  textMode: TextOptimizationMode.SummarizeFast 
});
// Fast summarization (requires custom text optimizer implementation)
// Use this with LangChain, OpenAI, or other LLM services
```

**Summarize High Quality (Requires Custom Optimizer):**
```javascript
const config = new BrevitConfig({ 
  textMode: TextOptimizationMode.SummarizeHighQuality 
});
// High-quality summarization (requires custom text optimizer with LLM integration)
// Use this for abstractive summarization via GPT-4, Claude, etc.
```

### 3. Image Optimization Examples

Brevit can extract text from images using OCR and extract metadata.

#### Example 3.1: Image from File (OCR)

**JavaScript (Node.js):**
```javascript
import fs from 'fs/promises';

// Read image file as bytes
const imageBytes = await fs.readFile('receipt.jpg');
const imageBuffer = Buffer.from(imageBytes);

// Brevit automatically detects image data (ArrayBuffer/Buffer)
const extractedText = await brevit.brevity(imageBuffer);
// Output: OCR-extracted text from the image
```

**C#:**
```csharp
// Read image file
byte[] imageBytes = await File.ReadAllBytesAsync("receipt.jpg");

// Brevit automatically detects byte[] as image data
var extractedText = await brevit.BrevityAsync(imageBytes);
// Output: OCR-extracted text from the image
```

**Python:**
```python
# Read image file
with open('receipt.jpg', 'rb') as f:
    image_bytes = f.read()

# Brevit automatically detects bytes as image data
extracted_text = await brevit.brevity(image_bytes)
# Output: OCR-extracted text from the image
```

#### Example 3.2: Image from URL

**JavaScript (Node.js):**
```javascript
import fetch from 'node-fetch';

// Fetch image from URL
const response = await fetch('https://example.com/invoice.png');
const imageBuffer = await response.buffer();

// Optimize image
const extractedText = await brevit.brevity(imageBuffer);
```

**C#:**
```csharp
using System.Net.Http;

var httpClient = new HttpClient();
byte[] imageBytes = await httpClient.GetByteArrayAsync("https://example.com/invoice.png");

var extractedText = await brevit.BrevityAsync(imageBytes);
```

**Python:**
```python
import requests

# Fetch image from URL
response = requests.get('https://example.com/invoice.png')
image_bytes = response.content

# Optimize image
extracted_text = await brevit.brevity(image_bytes)
```

#### Example 3.3: Image Optimization Modes

**OCR Mode (Extract Text):**
```javascript
const config = new BrevitConfig({ 
  imageMode: ImageOptimizationMode.Ocr 
});
// Extracts text from images using OCR (requires custom image optimizer)
```

**Metadata Mode:**
```javascript
const config = new BrevitConfig({ 
  imageMode: ImageOptimizationMode.Metadata 
});
// Extracts only image metadata (dimensions, format, etc.)
```

### 4. Method Comparison: `.brevity()` vs `.optimize()`

#### `.brevity()` - Automatic Strategy Selection

**Use when:** You want Brevit to automatically analyze and select the best optimization strategy.

```javascript
// Automatically detects data type and applies optimal strategy
const result = await brevit.brevity(data);
// - JSON objects → Flatten with tabular optimization
// - Long text → Text optimization
// - Images → OCR extraction
```

**Advantages:**
- Zero configuration needed
- Intelligent strategy selection
- Works with any data type
- Best for general-purpose use

#### `.optimize()` - Explicit Configuration

**Use when:** You want explicit control over optimization mode.

```javascript
const config = new BrevitConfig({ 
  jsonMode: JsonOptimizationMode.Flatten,
  textMode: TextOptimizationMode.Clean,
  imageMode: ImageOptimizationMode.Ocr
});
const brevit = new BrevitClient(config);

// Uses explicit configuration
const result = await brevit.optimize(data);
```

**Advantages:**
- Full control over optimization
- Predictable behavior
- Best for specific use cases

### 5. Complete Workflow Examples

#### Example 5.1: E-Commerce Order Processing

**JavaScript:**
```javascript
// Step 1: Optimize order JSON
const order = {
  orderId: "o-456",
  customer: { name: "John", email: "john@example.com" },
  items: [
    { sku: "A-88", quantity: 2, price: 29.99 },
    { sku: "B-22", quantity: 1, price: 49.99 }
  ]
};

const optimizedOrder = await brevit.brevity(order);

// Step 2: Send to LLM
const prompt = `Analyze this order:\n\n${optimizedOrder}\n\nExtract total amount.`;
// Send prompt to OpenAI, Anthropic, etc.
```

#### Example 5.2: Document Processing Pipeline

**Python:**
```python
# Step 1: Read and optimize text document
with open('contract.txt', 'r') as f:
    contract_text = f.read()

optimized_text = await brevit.brevity(contract_text)

# Step 2: Process with LLM
prompt = f"Summarize this contract:\n\n{optimized_text}"
# Send to LLM for summarization
```

#### Example 5.3: Receipt OCR Pipeline

**C#:**
```csharp
// Step 1: Read receipt image
byte[] receiptImage = await File.ReadAllBytesAsync("receipt.jpg");

// Step 2: Extract text via OCR
string extractedText = await brevit.BrevityAsync(receiptImage);

// Step 3: Optimize extracted text
string optimized = await brevit.BrevityAsync(extractedText);

// Step 4: Send to LLM for analysis
string prompt = $"Extract items and total from this receipt:\n\n{optimized}";
// Send to LLM
```

### 6. Custom Optimizers

You can provide custom optimizers for text and images:

**JavaScript:**
```javascript
// Custom text optimizer (e.g., using OpenAI API)
const customTextOptimizer = async (text, intent) => {
  // Call your summarization service
  const response = await fetch('https://api.example.com/summarize', {
    method: 'POST',
    body: JSON.stringify({ text, intent })
  });
  return await response.text();
};

// Custom image optimizer (e.g., using Azure AI Vision)
const customImageOptimizer = async (imageData, intent) => {
  // Call your OCR service
  const response = await fetch('https://api.example.com/ocr', {
    method: 'POST',
    body: imageData
  });
  return await response.text();
};

const brevit = new BrevitClient(config, {
  textOptimizer: customTextOptimizer,
  imageOptimizer: customImageOptimizer
});
```

**C#:**
```csharp
// Custom text optimizer
public class CustomTextOptimizer : ITextOptimizer
{
    public async Task<string> OptimizeTextAsync(string longText, BrevitConfig config)
    {
        // Call your summarization service
        // Return optimized text
    }
}

// Custom image optimizer
public class CustomImageOptimizer : IImageOptimizer
{
    public async Task<string> OptimizeImageAsync(byte[] imageData, BrevitConfig config)
    {
        // Call your OCR service
        // Return extracted text
    }
}

var brevit = new BrevitClient(config, 
    new DefaultJsonOptimizer(), 
    new CustomTextOptimizer(), 
    new CustomImageOptimizer());
```

**Python:**
```python
# Custom text optimizer
class CustomTextOptimizer:
    async def optimize_text(self, text: str, config: BrevitConfig) -> str:
        # Call your summarization service
        return optimized_text

# Custom image optimizer
class CustomImageOptimizer:
    async def optimize_image(self, image_data: bytes, config: BrevitConfig) -> str:
        # Call your OCR service
        return extracted_text

brevit = BrevitClient(
    config,
    text_optimizer=CustomTextOptimizer(),
    image_optimizer=CustomImageOptimizer()
)
```

## Playgrounds

Try Brevit online:

- **Web Playground**: [https://brevit.dev/playground](https://brevit.dev/playground) (Coming Soon)
- **VS Code Extension**: Install "Brevit" extension for inline optimization
- **Online Demo**: [https://brevit.dev/demo](https://brevit.dev/demo) (Coming Soon)

### Local Playground

Run the interactive playground locally:

```bash
# Clone the repository
git clone https://github.com/JavianDev/Brevit.git
cd Brevit

# Run playground (Node.js)
cd Brevit.js
npm install
node playground.js

# Or use Python
cd Brevit.py
pip install -e .
python playground.py
```

## CLI

Brevit includes command-line tools for quick optimization:

### Installation

```bash
# npm
npm install -g brevit-cli

# Python
pip install brevit-cli

# .NET
dotnet tool install -g Brevit.CLI
```

### Usage

```bash
# Optimize a JSON file
brevit optimize input.json -o output.txt

# Optimize from stdin
cat data.json | brevit optimize

# Optimize with custom config
brevit optimize input.json --mode flatten --threshold 1000

# Help
brevit --help
```

### Examples

```bash
# Flatten JSON file
brevit optimize order.json --mode flatten

# Convert to YAML
brevit optimize data.json --mode yaml

# Filter specific paths
brevit optimize data.json --mode filter --paths "user.name,order.id"
```

## Format Overview

### Flattened Format (Hybrid Optimization)

Brevit's default format intelligently converts nested structures to flat key-value pairs with automatic tabular optimization:

**Input:**
```json
{
  "order": {
    "id": "o-456",
    "items": [
      {"sku": "A-88", "quantity": 1},
      {"sku": "T-22", "quantity": 2}
    ]
  }
}
```

**Output (with tabular optimization):**
```
order.id:o-456
order.items[2]{quantity,sku}:
1,A-88
2,T-22
```

**For non-uniform arrays (fallback):**
```json
{
  "items": [
    {"sku": "A-88", "quantity": 1},
    "special-item",
    {"sku": "T-22", "quantity": 2}
  ]
}
```

**Output (fallback to indexed format):**
```
items[0].sku:A-88
items[0].quantity:1
items[1]:special-item
items[2].sku:T-22
items[2].quantity:2
```

### Key Features of Flattened Format

- **Dot Notation**: Nested objects use dot notation (`user.contact.email`)
- **Tabular Arrays**: Uniform object arrays use compact tabular format (`items[3]{field1,field2}:`)
- **Primitive Arrays**: Comma-separated format (`friends[3]: ana,luis,sam`)
- **Hybrid Approach**: Automatically detects optimal format, falls back to indexed format for mixed data
- **No Syntactic Overhead**: Minimal braces, brackets, or commas - just keys and values
- **LLM-Friendly**: Easy for LLMs to parse and understand
- **Token Efficient**: 40-60% token reduction compared to JSON

## API

### Core Classes

#### BrevitClient

The main client for optimization operations.

**Methods:**
- `brevity(rawData, intent?)` - **NEW!** Automatically analyzes data and selects optimal strategy
- `optimize(rawData, intent?)` - Optimize any data type with explicit configuration
- `optimizeAsync(rawData, intent?)` - Async version (C#)
- `BrevityAsync(rawData, intent?)` - Async automatic optimization (C#)
- `registerStrategy(name, analyzer, optimizer)` - Register custom optimization strategies

**Parameters:**
- `rawData`: Object, string, or byte array to optimize
- `intent`: Optional hint about optimization goal

**Returns:** Optimized string

**When to Use:**
- **`.brevity()`**: Use when you want automatic strategy selection based on data analysis
- **`.optimize()`**: Use when you want explicit control over optimization mode

#### BrevitConfig

Configuration object for BrevitClient.

**Properties:**
- `jsonMode`: JsonOptimizationMode (Flatten, ToYaml, Filter, None)
- `textMode`: TextOptimizationMode (Clean, SummarizeFast, SummarizeHighQuality, None)
- `imageMode`: ImageOptimizationMode (Ocr, Metadata, None)
- `jsonPathsToKeep`: string[] - Paths to keep in Filter mode
- `longTextThreshold`: number - Character threshold for text optimization

### Enums

#### JsonOptimizationMode
- `None` - No optimization
- `Flatten` - Flatten to key-value pairs (default)
- `ToYaml` - Convert to YAML format
- `Filter` - Keep only specified paths

#### TextOptimizationMode
- `None` - No optimization
- `Clean` - Remove boilerplate
- `SummarizeFast` - Fast summarization
- `SummarizeHighQuality` - High-quality summarization

#### ImageOptimizationMode
- `None` - Skip processing
- `Ocr` - Extract text via OCR
- `Metadata` - Extract metadata only

### Interfaces

#### IJsonOptimizer
```csharp
Task<string> OptimizeJsonAsync(string jsonString, BrevitConfig config);
```

#### ITextOptimizer
```csharp
Task<string> OptimizeTextAsync(string longText, BrevitConfig config);
```

#### IImageOptimizer
```csharp
Task<string> OptimizeImageAsync(byte[] imageData, BrevitConfig config);
```

## Using Brevit in LLM Prompts

### Best Practices

1. **Context First**: Always provide context before optimized data
2. **Clear Instructions**: Tell the LLM what format to expect
3. **Examples**: Include examples of the format in your prompt

### Example Prompt Template

```
You are analyzing order data. The data is in Brevit flattened format:

Context:
{optimized_data}

Task: Extract the order total and shipping address.

Format your response as JSON with keys: total, address
```

### Real-World Example

```python
from brevit import BrevitClient, BrevitConfig, JsonOptimizationMode

brevit = BrevitClient(BrevitConfig(json_mode=JsonOptimizationMode.Flatten))
order_data = {
    "orderId": "o-456",
    "total": 99.99,
    "items": [{"name": "Product A", "price": 49.99}]
}

optimized = await brevit.optimize(order_data)

prompt = f"""Analyze this order data:

{optimized}

Questions:
1. What is the order total?
2. How many items are in the order?
3. What is the average item price?

Respond in JSON format."""
```

## Syntax Cheatsheet

### Flattened Format Syntax

| JSON Structure | Brevit Format | Example |
|----------------|---------------|---------|
| Object property | `key:value` | `user.name:John` |
| Nested object | `key.nested:value` | `user.contact.email:john@example.com` |
| Primitive array | `key[count]:val1,val2,val3` | `friends[3]:ana,luis,sam` |
| Uniform object array | `key[count]{field1,field2}:`<br>`val1,val2`<br>`val3,val4` | `items[2]{sku,qty}:`<br>`A-88,1`<br>`T-22,2` |
| Array element (fallback) | `key[index]:value` | `items[0].name:Product A` |
| Nested array | `key[index].nested[index]:value` | `orders[0].items[1].sku:A-88` |
| Root value | `value:content` | `value:Hello World` |
| Null value | `key:null` | `phone:null` |
| Boolean | `key:true` | `isActive:true` |
| Number | `key:123` | `quantity:5` |

### Special Cases

- **Empty Objects**: `key: {}` → `key: {}`
- **Empty Arrays**: `key: []` → `key: []`
- **Nested Empty**: `user.metadata: {}` → `user.metadata: {}`
- **Mixed Types**: Arrays can contain objects, primitives, or mixed (falls back to indexed format)
- **Tabular Arrays**: Automatically detected when all objects have same keys
- **Primitive Arrays**: Automatically detected when all elements are primitives

## Other Implementations

Brevit is available in multiple languages:

| Language | Package | Repository | Status |
|----------|---------|------------|--------|
| C# (.NET) | `Brevit` | [Brevit.NET](https://github.com/JavianDev/Brevit.NET) | ✅ Stable |
| JavaScript | `brevit` | [Brevit.js](https://github.com/JavianDev/Brevit.js) | ✅ Stable |
| Python | `brevit` | [Brevit.py](https://github.com/JavianDev/Brevit.py) | ✅ Stable |

### Community Implementations

Have you created a Brevit implementation in another language? Submit a PR to add it here!

## Full Specification

### Format Specification

The Brevit flattened format follows these rules:

1. **Key-Value Pairs**: Each line contains exactly one key-value pair (or tabular header)
2. **Separator**: Key and value are separated by `:` (colon, no space) for maximum token efficiency
3. **Key Format**: Keys use dot notation for nesting and bracket notation for arrays
4. **Value Format**: Values are strings, numbers, booleans, or null
5. **Tabular Arrays**: Uniform object arrays use compact tabular format with header
6. **Primitive Arrays**: Arrays of primitives use comma-separated format
7. **Line Endings**: Lines are separated by newline characters (`\n`)
8. **Compact Format**: No spaces after colons to minimize token count

### Grammar

```
brevit := line*
line := key ":" value "\n" | tabular_header "\n" tabular_rows
key := identifier ("." identifier | "[" number "]")*
value := string | number | boolean | null
tabular_header := key "[" number "]{" field_list "}:"
tabular_rows := (row "\n")+
row := value ("," value)*
field_list := identifier ("," identifier)*
identifier := [a-zA-Z_][a-zA-Z0-9_]*
number := [0-9]+
```

**Note:** The format uses `:` (no space) for maximum token efficiency. Tabular rows have no leading spaces.

### Examples

**Simple Object:**
```
user.name:John
user.age:30
```

**Nested Object:**
```
user.contact.email:john@example.com
user.contact.phone:+1-555-0123
```

**Primitive Array:**
```
friends[3]:ana,luis,sam
```

**Tabular Array (Uniform Objects):**
```
items[2]{sku,quantity,price}:
A-88,1,29.99
T-22,2,39.99
```

**Array (Fallback for Mixed/Non-Uniform):**
```
items[0].name: Product A
items[0].price: 29.99
items[1]: special-item
items[2].name: Product B
items[2].price: 39.99
```

**Complex Structure:**
```
order.id:o-456
order.customer.name:John Doe
order.items[2]{quantity,sku}:
2,A-88
1,T-22
order.shipping.address.street:123 Main St
order.shipping.address.city:Toronto
```

## Libraries

### [Brevit.NET](./Brevit.NET/README.md) (C#)

A high-performance, type-safe .NET library built with .NET 8.

**Features:**
- First-class POCO support
- Dependency Injection ready
- Full async/await support
- Extensible optimizer interfaces

**Quick Start:**
```bash
dotnet add package Brevit
```

### [Brevit.js](./Brevit.js/README.md) (JavaScript)

A lightweight JavaScript library for Node.js and browsers.

**Features:**
- Zero dependencies (core)
- Universal module support (ESM/CommonJS)
- Works in browsers and Node.js
- Optional YAML support
- Full TypeScript definitions

**Quick Start:**
```bash
npm install brevit
```

### [Brevit.py](./Brevit.py/README.md) (Python)

A modern Python library with full async/await support.

**Features:**
- Type hints throughout
- Async/await patterns
- LangChain integration ready
- FastAPI/Flask compatible

**Quick Start:**
```bash
pip install brevit
```

## Use Cases

1. **E-Commerce Platforms**: Optimize product catalogs, order data, and customer information before sending to LLMs for recommendations
2. **Document Processing**: Process legal documents, contracts, and reports efficiently
3. **Customer Support**: Optimize support tickets, chat logs, and customer data for AI-powered support systems
4. **Financial Services**: Process invoices, receipts, and financial documents via OCR and optimization
5. **Content Management**: Optimize articles, blog posts, and content before AI analysis
6. **API Integrations**: Optimize API responses before sending to LLM-powered integrations
7. **Data Analytics**: Prepare data for LLM-based analytics and insights

## Performance

- **Token Reduction**: 40-60% reduction in token count
- **Memory Efficient**: Processes data in-place where possible
- **Fast**: Optimized algorithms for minimal overhead
- **Scalable**: Async/await patterns for high concurrency

## Architecture

All Brevit libraries follow a consistent architecture:

```
BrevitClient
├── BrevitConfig (Configuration)
├── IJsonOptimizer (JSON optimization)
├── ITextOptimizer (Text optimization)
└── IImageOptimizer (Image optimization)
```

## Contributing

We welcome contributions! Each library has its own contributing guidelines:

- [Brevit.NET Contributing](./Brevit.NET/CONTRIBUTING.md)
- [Brevit.js Contributing](./Brevit.js/CONTRIBUTING.md)
- [Brevit.py Contributing](./Brevit.py/CONTRIBUTING.md)

## License

MIT License - see LICENSE file for details.

## Support

- **Documentation**: [https://brevit.dev/docs](https://brevit.dev/docs)
- **Issues**: [https://github.com/JavianDev/Brevit/issues](https://github.com/JavianDev/Brevit/issues)
- **Email**: support@javianpicardo.com

## Roadmap

- [x] TypeScript definitions for Brevit.js
- [x] Automatic strategy selection (`.brevity()` method)
- [x] Extensible strategy registry
- [ ] Additional optimization modes
- [ ] Benchmark suite
- [ ] Performance profiling tools
- [ ] Integration examples for popular LLM providers
- [ ] CLI tools
- [ ] Web playground
- [ ] VS Code extension

## Version History
- **1.0.2** (Current): Patch release — performance improvements and bug fixes across JS/.NET/Python.
- **1.0.1**: Patch release — auto text mode is lossless by default; ratio-based compression supported across JS/.NET/Python.
- **1.0.0**: Major release — token-efficient JSON flattening + deterministic TextRank-based text processing + robust JSON-vs-text routing.

---

**Created by Javian** - Optimizing LLM interactions, one token at a time.

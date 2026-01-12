using Brevit.NET;
using System.Text.RegularExpressions;
using Xunit;

namespace Brevit.Tests;

public class AbbreviationTests
{
    [Fact]
    public async Task TestAbbreviationsEnabled()
    {
        var config = new BrevitConfig(JsonMode: JsonOptimizationMode.Flatten)
        {
            EnableAbbreviations = true,
            AbbreviationThreshold = 2
        };
        
        var brevit = new BrevitClient(
            config,
            new DefaultJsonOptimizer(),
            new DefaultTextOptimizer(),
            new DefaultImageOptimizer()
        );

        var data = new
        {
            Customer = new
            {
                Personal = new { FirstName = "Jane", LastName = "Smith" },
                Contact = new { Email = "jane@example.com", Phone = "+1-555-0123" },
                Address = new
                {
                    Street = "123 Main St",
                    City = "Toronto",
                    Province = "ON",
                    PostalCode = "M5H 2N2"
                }
            }
        };

        var result = await brevit.BrevityAsync(data);
        
        // With enough repeated nested prefixes, we should emit at least one abbreviation definition.
        Assert.Matches(new Regex(@"@\w+=.+", RegexOptions.Multiline), result);
        Assert.Contains("Customer", result);
    }

    [Fact]
    public async Task TestAbbreviationsDisabled()
    {
        var config = new BrevitConfig(JsonMode: JsonOptimizationMode.Flatten)
        {
            EnableAbbreviations = false
        };
        
        var brevit = new BrevitClient(
            config,
            new DefaultJsonOptimizer(),
            new DefaultTextOptimizer(),
            new DefaultImageOptimizer()
        );

        var data = new
        {
            User = new
            {
                Name = "John Doe",
                Email = "john@example.com"
            },
            Order = new
            {
                Id = "o-456",
                Status = "SHIPPED"
            }
        };

        var result = await brevit.BrevityAsync(data);
        
        Assert.DoesNotMatch(new Regex(@"@\w+=", RegexOptions.Multiline), result);
        Assert.Contains("User.Name:John Doe", result);
        Assert.Contains("Order.Id:o-456", result);
    }

    [Fact]
    public async Task TestCustomAbbreviationThreshold()
    {
        var config = new BrevitConfig(JsonMode: JsonOptimizationMode.Flatten)
        {
            EnableAbbreviations = true,
            AbbreviationThreshold = 3
        };
        
        var brevit = new BrevitClient(
            config,
            new DefaultJsonOptimizer(),
            new DefaultTextOptimizer(),
            new DefaultImageOptimizer()
        );

        var data = new
        {
            User = new
            {
                Name = "John",
                Email = "john@example.com"
            },
            Order = new
            {
                Id = "o-456"
            }
        };

        var result = await brevit.BrevityAsync(data);
        
        // With threshold 3, user/order should not be abbreviated (only 2 occurrences each)
        Assert.DoesNotMatch(new Regex(@"@\w+=", RegexOptions.Multiline), result);
    }
}


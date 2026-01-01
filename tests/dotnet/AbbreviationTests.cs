using Brevit.NET;
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
        
        Assert.Contains("@U=User", result);
        Assert.Contains("@O=Order", result);
        Assert.Contains("@U.Name:John Doe", result);
        Assert.Contains("@O.Id:o-456", result);
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
        
        Assert.DoesNotContain("@U=User", result);
        Assert.DoesNotContain("@O=Order", result);
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
        Assert.DoesNotContain("@U=User", result);
        Assert.DoesNotContain("@O=Order", result);
    }
}


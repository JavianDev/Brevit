using Brevit.NET;
using Xunit;

namespace Brevit.Tests;

public class BasicTests
{
    private readonly BrevitClient _brevit;

    public BasicTests()
    {
        var config = new BrevitConfig(JsonMode: JsonOptimizationMode.Flatten);
        _brevit = new BrevitClient(
            config,
            new DefaultJsonOptimizer(),
            new DefaultTextOptimizer(),
            new DefaultImageOptimizer()
        );
    }

    [Fact]
    public async Task TestSimpleNestedObject()
    {
        var data = new
        {
            User = new
            {
                Name = "John Doe",
                Email = "john@example.com",
                Age = 30
            }
        };

        var result = await _brevit.BrevityAsync(data);
        
        Assert.Contains("@U=User", result);
        Assert.Contains("@U.Name:John Doe", result);
        Assert.Contains("@U.Email:john@example.com", result);
        Assert.Contains("@U.Age:30", result);
    }

    [Fact]
    public async Task TestPrimitiveArray()
    {
        var data = new
        {
            Friends = new[] { "ana", "luis", "sam" }
        };

        var result = await _brevit.BrevityAsync(data);
        
        Assert.Contains("Friends[3]:ana,luis,sam", result);
    }

    [Fact]
    public async Task TestObjectArray()
    {
        var data = new
        {
            Items = new[]
            {
                new { Sku = "A-88", Quantity = 1, Price = 29.99 },
                new { Sku = "B-22", Quantity = 2, Price = 49.99 }
            }
        };

        var result = await _brevit.BrevityAsync(data);
        
        Assert.Contains("Items[2]", result);
        Assert.Contains("{Quantity,Price,Sku}", result);
    }

    [Fact]
    public async Task TestAbbreviationsEnabled()
    {
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

        var result = await _brevit.BrevityAsync(data);
        
        Assert.Contains("@U=User", result);
        Assert.Contains("@O=Order", result);
        Assert.Contains("@U.Name:John Doe", result);
        Assert.Contains("@O.Id:o-456", result);
    }
}


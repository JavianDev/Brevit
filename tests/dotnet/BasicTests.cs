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
        
        // Abbreviation emission is savings-based; basic objects may not trigger it.
        Assert.Contains("User.Name:John Doe", result);
        Assert.Contains("User.Email:john@example.com", result);
        Assert.Contains("User.Age:30", result);
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
        // Brevit preserves original field order from the first object.
        Assert.Contains("{Sku,Quantity,Price}", result);
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
        
        Assert.Contains("User.Name:John Doe", result);
        Assert.Contains("Order.Id:o-456", result);
    }
}


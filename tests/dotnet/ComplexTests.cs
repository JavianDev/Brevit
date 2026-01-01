using Brevit.NET;
using Xunit;

namespace Brevit.Tests;

public class ComplexTests
{
    private readonly BrevitClient _brevit;

    public ComplexTests()
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
    public async Task TestEcommerceOrder()
    {
        var data = new
        {
            OrderId = "o-456",
            Customer = new
            {
                Id = "c-123",
                Name = "Jane Smith",
                Email = "jane@example.com",
                Address = new
                {
                    Street = "123 Main St",
                    City = "Toronto",
                    Province = "ON",
                    PostalCode = "M5H 2N2"
                }
            },
            Items = new[]
            {
                new { Sku = "A-88", Name = "Product A", Quantity = 2, Price = 29.99 },
                new { Sku = "B-22", Name = "Product B", Quantity = 1, Price = 49.99 }
            },
            Total = 185.94
        };

        var result = await _brevit.BrevityAsync(data);
        
        Assert.Contains("OrderId:o-456", result);
        Assert.Contains("@C=Customer", result);
        Assert.Contains("Items[2]", result);
    }

    [Fact]
    public async Task TestDeeplyNested()
    {
        var data = new
        {
            User = new
            {
                Profile = new
                {
                    Personal = new
                    {
                        FirstName = "John",
                        LastName = "Doe"
                    },
                    Contact = new
                    {
                        Email = "john@example.com",
                        Phone = "+1-555-0123"
                    }
                }
            }
        };

        var result = await _brevit.BrevityAsync(data);
        
        Assert.Contains("@U=User", result);
        Assert.Contains("@P=Profile", result);
    }

    [Fact]
    public async Task TestEdgeCases()
    {
        var data = new
        {
            NullValue = (string?)null,
            EmptyObject = new { },
            EmptyArray = Array.Empty<string>(),
            MixedArray = new object[]
            {
                "string",
                123,
                true,
                null,
                new { Key = "value" }
            }
        };

        var result = await _brevit.BrevityAsync(data);
        
        Assert.NotNull(result);
        Assert.Contains("NullValue:null", result);
        Assert.Contains("EmptyArray:[]", result);
    }
}


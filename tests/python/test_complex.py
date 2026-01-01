import asyncio
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../Brevit.py/src'))

from brevit import BrevitClient, BrevitConfig, JsonOptimizationMode

async def test_complex():
    print('=== Complex JSON Structure Tests ===\n')

    brevit = BrevitClient(BrevitConfig(json_mode=JsonOptimizationMode.Flatten))

    # Test 1: E-commerce order
    print('Test 1: E-commerce order')
    ecommerce = {
        "orderId": "o-456",
        "customer": {
            "id": "c-123",
            "name": "Jane Smith",
            "email": "jane@example.com",
            "address": {
                "street": "123 Main St",
                "city": "Toronto",
                "province": "ON",
                "postalCode": "M5H 2N2"
            }
        },
        "items": [
            {"sku": "A-88", "name": "Product A", "quantity": 2, "price": 29.99},
            {"sku": "B-22", "name": "Product B", "quantity": 1, "price": 49.99},
            {"sku": "C-33", "name": "Product C", "quantity": 3, "price": 19.99}
        ],
        "shipping": {
            "method": "express",
            "cost": 15.99,
            "estimatedDays": 2
        },
        "total": 185.94
    }
    result1 = await brevit.brevity(ecommerce)
    print('Output:')
    print(result1)
    print('\n')

    # Test 2: Deeply nested structure
    print('Test 2: Deeply nested structure')
    deep_nested = {
        "user": {
            "profile": {
                "personal": {
                    "firstName": "John",
                    "lastName": "Doe",
                    "birthDate": "1990-01-15"
                },
                "contact": {
                    "email": "john@example.com",
                    "phone": "+1-555-0123"
                },
                "settings": {
                    "theme": "dark",
                    "notifications": True,
                    "language": "en"
                }
            }
        }
    }
    result2 = await brevit.brevity(deep_nested)
    print('Output:')
    print(result2)
    print('\n')

    # Test 3: Edge cases
    print('Test 3: Edge cases (null, empty, mixed)')
    edge_cases = {
        "nullValue": None,
        "emptyObject": {},
        "emptyArray": [],
        "mixedArray": [
            "string",
            123,
            True,
            None,
            {"key": "value"},
            ["nested", "array"]
        ]
    }
    result3 = await brevit.brevity(edge_cases)
    print('Output:')
    print(result3)
    print('\n')

    print('✅ Complex tests completed!')

if __name__ == '__main__':
    asyncio.run(test_complex())


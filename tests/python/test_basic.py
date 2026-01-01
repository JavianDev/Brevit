import asyncio
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../Brevit.py/src'))

from brevit import BrevitClient, BrevitConfig, JsonOptimizationMode

async def test_basic():
    print('=== Basic JSON Flattening Tests ===\n')

    brevit = BrevitClient(BrevitConfig(json_mode=JsonOptimizationMode.Flatten))

    # Test 1: Simple nested object
    print('Test 1: Simple nested object')
    simple = {
        "user": {
            "name": "John Doe",
            "email": "john@example.com",
            "age": 30
        }
    }
    result1 = await brevit.brevity(simple)
    print('Input:', simple)
    print('Output:')
    print(result1)
    print('\n')

    # Test 2: Primitive array
    print('Test 2: Primitive array')
    primitive_array = {
        "friends": ["ana", "luis", "sam"]
    }
    result2 = await brevit.brevity(primitive_array)
    print('Input:', primitive_array)
    print('Output:')
    print(result2)
    print('\n')

    # Test 3: Object array (should use tabular format)
    print('Test 3: Object array (tabular format)')
    object_array = {
        "items": [
            {"sku": "A-88", "quantity": 1, "price": 29.99},
            {"sku": "B-22", "quantity": 2, "price": 49.99}
        ]
    }
    result3 = await brevit.brevity(object_array)
    print('Input:', object_array)
    print('Output:')
    print(result3)
    print('\n')

    # Test 4: Abbreviations enabled by default
    print('Test 4: Abbreviations (enabled by default)')
    with_abbr = {
        "user": {
            "name": "John Doe",
            "email": "john@example.com"
        },
        "order": {
            "id": "o-456",
            "status": "SHIPPED"
        }
    }
    result4 = await brevit.brevity(with_abbr)
    print('Input:', with_abbr)
    print('Output:')
    print(result4)
    print('\n')

    print('✅ Basic tests completed!')

if __name__ == '__main__':
    asyncio.run(test_basic())


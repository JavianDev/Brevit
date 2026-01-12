import asyncio
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../Brevit.py'))

from src.brevit import BrevitClient, BrevitConfig, JsonOptimizationMode

async def test_abbreviations():
    print('=== Abbreviation Feature Tests ===\n')

    # Test 1: Abbreviations enabled (default)
    print('Test 1: Abbreviations enabled (default)')
    brevit_with_abbr = BrevitClient(BrevitConfig(
        json_mode=JsonOptimizationMode.Flatten,
        enable_abbreviations=True,
        abbreviation_threshold=2
    ))

    data1 = {
        "user": {
            "name": "John Doe",
            "email": "john@example.com",
            "age": 30,
            "profile": {
                "bio": "Software developer",
                "location": "Toronto"
            }
        },
        "order": {
            "id": "o-456",
            "status": "SHIPPED",
            "items": [
                {"sku": "A-88", "quantity": 1}
            ]
        }
    }

    result1 = await brevit_with_abbr.brevity(data1)
    print('Output:')
    print(result1)
    print('\n')

    # Test 2: Multiple repeated prefixes
    print('Test 2: Multiple repeated prefixes')
    data2 = {
        "customer": {
            "personal": {
                "firstName": "Jane",
                "lastName": "Smith"
            },
            "contact": {
                "email": "jane@example.com",
                "phone": "+1-555-0123"
            },
            "billing": {
                "address": "123 Main St",
                "city": "Toronto"
            }
        },
        "order": {
            "items": [
                {"sku": "A-1", "qty": 1},
                {"sku": "B-2", "qty": 2}
            ],
            "shipping": {
                "method": "express",
                "cost": 15.99
            }
        }
    }

    result2 = await brevit_with_abbr.brevity(data2)
    print('Output:')
    print(result2)
    print('\n')

    # Test 3: Abbreviations disabled
    print('Test 3: Abbreviations disabled')
    brevit_no_abbr = BrevitClient(BrevitConfig(
        json_mode=JsonOptimizationMode.Flatten,
        enable_abbreviations=False
    ))

    result3 = await brevit_no_abbr.brevity(data1)
    print('Output (no abbreviations):')
    print(result3)
    print('\n')

    print('OK: Abbreviation tests completed!')

if __name__ == '__main__':
    asyncio.run(test_abbreviations())


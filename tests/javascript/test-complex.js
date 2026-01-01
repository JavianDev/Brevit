import { BrevitClient, BrevitConfig, JsonOptimizationMode } from '../../Brevit.js/src/brevit.js';
import fs from 'fs';

async function testComplex() {
  console.log('=== Complex JSON Structure Tests ===\n');

  const brevit = new BrevitClient(new BrevitConfig({
    jsonMode: JsonOptimizationMode.Flatten
  }));

  // Test 1: E-commerce order with nested structures
  console.log('Test 1: E-commerce order');
  const ecommerce = {
    orderId: "o-456",
    customer: {
      id: "c-123",
      name: "Jane Smith",
      email: "jane@example.com",
      address: {
        street: "123 Main St",
        city: "Toronto",
        province: "ON",
        postalCode: "M5H 2N2"
      }
    },
    items: [
      { sku: "A-88", name: "Product A", quantity: 2, price: 29.99 },
      { sku: "B-22", name: "Product B", quantity: 1, price: 49.99 },
      { sku: "C-33", name: "Product C", quantity: 3, price: 19.99 }
    ],
    shipping: {
      method: "express",
      cost: 15.99,
      estimatedDays: 2
    },
    total: 185.94
  };
  const result1 = await brevit.brevity(ecommerce);
  console.log('Output:');
  console.log(result1);
  console.log('\n');

  // Test 2: Deeply nested structure
  console.log('Test 2: Deeply nested structure');
  const deepNested = {
    user: {
      profile: {
        personal: {
          firstName: "John",
          lastName: "Doe",
          birthDate: "1990-01-15"
        },
        contact: {
          email: "john@example.com",
          phone: "+1-555-0123"
        },
        settings: {
          theme: "dark",
          notifications: true,
          language: "en"
        }
      }
    }
  };
  const result2 = await brevit.brevity(deepNested);
  console.log('Output:');
  console.log(result2);
  console.log('\n');

  // Test 3: Complex array with nested objects
  console.log('Test 3: Complex array with nested objects');
  const complexArray = {
    user: {
      orders: [
        {
          orderId: "o-001",
          status: "completed",
          items: [
            { sku: "A-1", qty: 1 },
            { sku: "B-2", qty: 2 }
          ]
        },
        {
          orderId: "o-002",
          status: "pending",
          items: [
            { sku: "C-3", qty: 3 }
          ]
        }
      ]
    }
  };
  const result3 = await brevit.brevity(complexArray);
  console.log('Output:');
  console.log(result3);
  console.log('\n');

  // Test 4: Edge cases
  console.log('Test 4: Edge cases (null, empty, mixed)');
  const edgeCases = {
    nullValue: null,
    emptyObject: {},
    emptyArray: [],
    mixedArray: [
      "string",
      123,
      true,
      null,
      { key: "value" },
      ["nested", "array"]
    ]
  };
  const result4 = await brevit.brevity(edgeCases);
  console.log('Output:');
  console.log(result4);
  console.log('\n');

  console.log('✅ Complex tests completed!');
}

testComplex().catch(console.error);


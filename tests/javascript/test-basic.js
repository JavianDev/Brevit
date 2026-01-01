import { BrevitClient, BrevitConfig, JsonOptimizationMode } from '../../Brevit.js/src/brevit.js';
import fs from 'fs';

async function testBasic() {
  console.log('=== Basic JSON Flattening Tests ===\n');

  const brevit = new BrevitClient(new BrevitConfig({
    jsonMode: JsonOptimizationMode.Flatten
  }));

  // Test 1: Simple nested object
  console.log('Test 1: Simple nested object');
  const simple = {
    user: {
      name: "John Doe",
      email: "john@example.com",
      age: 30
    }
  };
  const result1 = await brevit.brevity(simple);
  console.log('Input:', JSON.stringify(simple, null, 2));
  console.log('Output:');
  console.log(result1);
  console.log('\n');

  // Test 2: Primitive array
  console.log('Test 2: Primitive array');
  const primitiveArray = {
    friends: ["ana", "luis", "sam"]
  };
  const result2 = await brevit.brevity(primitiveArray);
  console.log('Input:', JSON.stringify(primitiveArray, null, 2));
  console.log('Output:');
  console.log(result2);
  console.log('\n');

  // Test 3: Object array (should use tabular format)
  console.log('Test 3: Object array (tabular format)');
  const objectArray = {
    items: [
      { sku: "A-88", quantity: 1, price: 29.99 },
      { sku: "B-22", quantity: 2, price: 49.99 }
    ]
  };
  const result3 = await brevit.brevity(objectArray);
  console.log('Input:', JSON.stringify(objectArray, null, 2));
  console.log('Output:');
  console.log(result3);
  console.log('\n');

  // Test 4: Abbreviations enabled by default
  console.log('Test 4: Abbreviations (enabled by default)');
  const withAbbr = {
    user: {
      name: "John Doe",
      email: "john@example.com"
    },
    order: {
      id: "o-456",
      status: "SHIPPED"
    }
  };
  const result4 = await brevit.brevity(withAbbr);
  console.log('Input:', JSON.stringify(withAbbr, null, 2));
  console.log('Output:');
  console.log(result4);
  console.log('\n');

  console.log('✅ Basic tests completed!');
}

testBasic().catch(console.error);


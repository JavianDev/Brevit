import { BrevitClient, BrevitConfig, JsonOptimizationMode } from '../../Brevit.js/src/brevit.js';

async function testAbbreviations() {
  console.log('=== Abbreviation Feature Tests ===\n');

  // Test 1: Abbreviations enabled (default)
  console.log('Test 1: Abbreviations enabled (default)');
  const brevitWithAbbr = new BrevitClient(new BrevitConfig({
    jsonMode: JsonOptimizationMode.Flatten,
    enableAbbreviations: true,
    abbreviationThreshold: 2
  }));

  const data1 = {
    user: {
      name: "John Doe",
      email: "john@example.com",
      age: 30,
      profile: {
        bio: "Software developer",
        location: "Toronto"
      }
    },
    order: {
      id: "o-456",
      status: "SHIPPED",
      items: [
        { sku: "A-88", quantity: 1 }
      ]
    }
  };

  const result1 = await brevitWithAbbr.brevity(data1);
  console.log('Output:');
  console.log(result1);
  console.log('\n');

  // Test 2: Multiple repeated prefixes
  console.log('Test 2: Multiple repeated prefixes');
  const data2 = {
    customer: {
      personal: {
        firstName: "Jane",
        lastName: "Smith"
      },
      contact: {
        email: "jane@example.com",
        phone: "+1-555-0123"
      },
      billing: {
        address: "123 Main St",
        city: "Toronto"
      }
    },
    order: {
      items: [
        { sku: "A-1", qty: 1 },
        { sku: "B-2", qty: 2 }
      ],
      shipping: {
        method: "express",
        cost: 15.99
      }
    }
  };

  const result2 = await brevitWithAbbr.brevity(data2);
  console.log('Output:');
  console.log(result2);
  console.log('\n');

  // Test 3: Abbreviations disabled
  console.log('Test 3: Abbreviations disabled');
  const brevitNoAbbr = new BrevitClient(new BrevitConfig({
    jsonMode: JsonOptimizationMode.Flatten,
    enableAbbreviations: false
  }));

  const result3 = await brevitNoAbbr.brevity(data1);
  console.log('Output (no abbreviations):');
  console.log(result3);
  console.log('\n');

  // Test 4: Custom abbreviation threshold
  console.log('Test 4: Custom abbreviation threshold (threshold: 3)');
  const brevitCustom = new BrevitClient(new BrevitConfig({
    jsonMode: JsonOptimizationMode.Flatten,
    enableAbbreviations: true,
    abbreviationThreshold: 3
  }));

  const data4 = {
    user: {
      name: "John",
      email: "john@example.com"
    },
    order: {
      id: "o-456",
      status: "SHIPPED"
    }
  };

  const result4 = await brevitCustom.brevity(data4);
  console.log('Output (threshold 3, should not abbreviate user/order):');
  console.log(result4);
  console.log('\n');

  console.log('✅ Abbreviation tests completed!');
}

testAbbreviations().catch(console.error);



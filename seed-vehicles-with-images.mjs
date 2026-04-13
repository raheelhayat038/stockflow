import { createConnection } from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL || 'mysql://user:password@localhost/stockflow';

// Parse database URL
const url = new URL(DATABASE_URL);
const config = {
  host: url.hostname,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
};

// Japanese vehicle data with realistic images
const vehiclesData = [
  {
    make: "Toyota",
    model: "Camry",
    year: 2023,
    price: 24999,
    region: "Tokyo",
    color: "Silver",
    mileage: 15000,
    condition: "excellent",
    stock: 5,
    description: "Premium sedan with full features, excellent condition",
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&h=600&fit=crop"
    ]
  },
  {
    make: "Honda",
    model: "Civic",
    year: 2022,
    price: 19999,
    region: "Osaka",
    color: "Blue",
    mileage: 32000,
    condition: "good",
    stock: 3,
    description: "Reliable compact car, well maintained",
    images: [
      "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606611013016-969c19d14444?w=800&h=600&fit=crop"
    ]
  },
  {
    make: "Nissan",
    model: "Altima",
    year: 2023,
    price: 22999,
    region: "Yokohama",
    color: "White",
    mileage: 8000,
    condition: "excellent",
    stock: 4,
    description: "Luxury sedan with advanced features",
    images: [
      "https://images.unsplash.com/photo-1606611013016-969c19d14444?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=800&h=600&fit=crop"
    ]
  },
  {
    make: "Mazda",
    model: "CX-5",
    year: 2022,
    price: 26999,
    region: "Kobe",
    color: "Red",
    mileage: 28000,
    condition: "good",
    stock: 2,
    description: "Compact SUV, perfect for families",
    images: [
      "https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop"
    ]
  },
  {
    make: "Subaru",
    model: "Outback",
    year: 2023,
    price: 28999,
    region: "Sapporo",
    color: "Black",
    mileage: 5000,
    condition: "excellent",
    stock: 3,
    description: "All-wheel drive adventure vehicle",
    images: [
      "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop"
    ]
  },
  {
    make: "Mitsubishi",
    model: "Outlander",
    year: 2021,
    price: 21999,
    region: "Nagoya",
    color: "Gray",
    mileage: 45000,
    condition: "fair",
    stock: 2,
    description: "Spacious 7-seater SUV",
    images: [
      "https://images.unsplash.com/photo-1606611013016-969c19d14444?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=800&h=600&fit=crop"
    ]
  },
  {
    make: "Toyota",
    model: "RAV4",
    year: 2023,
    price: 27999,
    region: "Tokyo",
    color: "Pearl White",
    mileage: 12000,
    condition: "excellent",
    stock: 4,
    description: "Popular compact SUV with hybrid option",
    images: [
      "https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop"
    ]
  },
  {
    make: "Honda",
    model: "Accord",
    year: 2022,
    price: 23999,
    region: "Osaka",
    color: "Silver",
    mileage: 28000,
    condition: "good",
    stock: 3,
    description: "Mid-size sedan, fuel efficient",
    images: [
      "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606611013016-969c19d14444?w=800&h=600&fit=crop"
    ]
  },
  {
    make: "Nissan",
    model: "Qashqai",
    year: 2023,
    price: 25999,
    region: "Yokohama",
    color: "Black",
    mileage: 10000,
    condition: "excellent",
    stock: 3,
    description: "Stylish crossover SUV",
    images: [
      "https://images.unsplash.com/photo-1606611013016-969c19d14444?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=800&h=600&fit=crop"
    ]
  },
  {
    make: "Mazda",
    model: "3",
    year: 2022,
    price: 18999,
    region: "Kobe",
    color: "Red",
    mileage: 35000,
    condition: "good",
    stock: 4,
    description: "Sporty compact car",
    images: [
      "https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop"
    ]
  },
  {
    make: "Subaru",
    model: "Forester",
    year: 2023,
    price: 26999,
    region: "Sapporo",
    color: "Blue",
    mileage: 8000,
    condition: "excellent",
    stock: 2,
    description: "Compact SUV with excellent safety",
    images: [
      "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop"
    ]
  },
  {
    make: "Toyota",
    model: "Corolla",
    year: 2022,
    price: 17999,
    region: "Tokyo",
    color: "White",
    mileage: 42000,
    condition: "good",
    stock: 5,
    description: "Best-selling compact sedan",
    images: [
      "https://images.unsplash.com/photo-1606611013016-969c19d14444?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=800&h=600&fit=crop"
    ]
  },
  {
    make: "Honda",
    model: "CR-V",
    year: 2023,
    price: 28999,
    region: "Osaka",
    color: "Gray",
    mileage: 6000,
    condition: "excellent",
    stock: 3,
    description: "Reliable compact SUV",
    images: [
      "https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop"
    ]
  },
  {
    make: "Nissan",
    model: "Rogue",
    year: 2022,
    price: 24999,
    region: "Yokohama",
    color: "Silver",
    mileage: 30000,
    condition: "good",
    stock: 2,
    description: "Spacious crossover SUV",
    images: [
      "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606611013016-969c19d14444?w=800&h=600&fit=crop"
    ]
  },
  {
    make: "Mazda",
    model: "6",
    year: 2023,
    price: 25999,
    region: "Kobe",
    color: "Blue",
    mileage: 9000,
    condition: "excellent",
    stock: 2,
    description: "Premium mid-size sedan",
    images: [
      "https://images.unsplash.com/photo-1606611013016-969c19d14444?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=800&h=600&fit=crop"
    ]
  },
  {
    make: "Subaru",
    model: "Legacy",
    year: 2022,
    price: 23999,
    region: "Sapporo",
    color: "Black",
    mileage: 35000,
    condition: "good",
    stock: 2,
    description: "Luxury sedan with AWD",
    images: [
      "https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop"
    ]
  },
  {
    make: "Toyota",
    model: "Highlander",
    year: 2023,
    price: 34999,
    region: "Tokyo",
    color: "Pearl White",
    mileage: 7000,
    condition: "excellent",
    stock: 2,
    description: "Premium 3-row SUV",
    images: [
      "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop"
    ]
  },
  {
    make: "Honda",
    model: "Pilot",
    year: 2022,
    price: 32999,
    region: "Osaka",
    color: "Gray",
    mileage: 25000,
    condition: "good",
    stock: 1,
    description: "3-row family SUV",
    images: [
      "https://images.unsplash.com/photo-1606611013016-969c19d14444?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=800&h=600&fit=crop"
    ]
  },
  {
    make: "Nissan",
    model: "Murano",
    year: 2023,
    price: 29999,
    region: "Yokohama",
    color: "Red",
    mileage: 5000,
    condition: "excellent",
    stock: 2,
    description: "Luxury crossover SUV",
    images: [
      "https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop"
    ]
  },
  {
    make: "Mazda",
    model: "CX-9",
    year: 2022,
    price: 31999,
    region: "Kobe",
    color: "Black",
    mileage: 22000,
    condition: "good",
    stock: 1,
    description: "Premium 3-row SUV",
    images: [
      "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606611013016-969c19d14444?w=800&h=600&fit=crop"
    ]
  }
];

async function seedVehicles() {
  const connection = await createConnection(config);
  
  try {
    let inserted = 0;
    let errors = 0;

    for (const vehicle of vehiclesData) {
      try {
        // Insert vehicle
        const [result] = await connection.execute(
          `INSERT INTO vehicles 
           (make, model, year, price, region, color, mileage, condition, stock, description, importedFrom, isActive) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            vehicle.make,
            vehicle.model,
            vehicle.year,
            vehicle.price.toString(),
            vehicle.region,
            vehicle.color,
            vehicle.mileage,
            vehicle.condition,
            vehicle.stock,
            vehicle.description,
            "japan",
            true
          ]
        );

        const vehicleId = result.insertId;

        // Insert vehicle images
        for (const imageUrl of vehicle.images) {
          await connection.execute(
            `INSERT INTO vehicleImages (vehicleId, imageUrl, displayOrder) VALUES (?, ?, ?)`,
            [vehicleId, imageUrl, vehicle.images.indexOf(imageUrl)]
          );
        }

        inserted++;
        console.log(`✓ ${vehicle.make} ${vehicle.model} (${vehicle.year}) - ${vehicle.images.length} images`);
      } catch (error) {
        errors++;
        console.error(`✗ Error inserting ${vehicle.make} ${vehicle.model}:`, error.message);
      }
    }

    console.log(`\n✅ Seeding complete: ${inserted} vehicles inserted with images, ${errors} errors`);
  } finally {
    await connection.end();
  }
}

seedVehicles().catch(console.error);

import fs from 'fs';
import { parse } from 'csv-parse/sync';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL || 'mysql://user:password@localhost/stockflow';

// Parse database URL
const url = new URL(DATABASE_URL);
const config = {
  host: url.hostname,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
};

async function seedVehicles() {
  const connection = await mysql.createConnection(config);
  
  try {
    // Read CSV file
    const csvContent = fs.readFileSync('/tmp/vehicles_100.csv', 'utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    let inserted = 0;
    let errors = 0;

    for (const record of records) {
      try {
        await connection.execute(
          'INSERT INTO vehicles (make, model, year, price, region, color, mileage, condition, stock, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            record.make,
            record.model,
            parseInt(record.year),
            parseFloat(record.price),
            record.region,
            record.color,
            parseInt(record.mileage),
            record.condition,
            parseInt(record.stock),
            record.description,
          ]
        );
        inserted++;
      } catch (error) {
        console.error(`Error inserting ${record.make} ${record.model}:`, error.message);
        errors++;
      }
    }

    console.log(`✅ Seeding complete: ${inserted} vehicles inserted, ${errors} errors`);
  } finally {
    await connection.end();
  }
}

seedVehicles().catch(console.error);

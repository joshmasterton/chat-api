import pg from 'pg';
import dotenv from 'dotenv';

// Initialize env file dev/prod
if (process.env.NODE_ENV === 'development') {
  dotenv.config({
    path: './env/.development.env',
  });
}

// Postgres client
const { Client } = pg;

// Postgres client deatils
const {
  DB_HOST, DB_USER, DB_PASSWORD, DATABASE_URL,
} = process.env;

// Query the client
const queryDatabase = async (query, values) => {
  // Connect to client
  const client = new Client({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    connectionString: DATABASE_URL,
  });

  try {
    // Connect to client
    await client.connect();
    const queryResponse = await client.query({
      text: query,
      values,
    });
    await client.end();

    // Return response from query
    return queryResponse.rows;
  } catch (err) {
    return console.log(err.message);
  }
};

export default queryDatabase;

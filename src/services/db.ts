import mysql, { Connection, RowDataPacket } from 'mysql2/promise';
import { dbConfig } from '../config/database';

// Create a single connection pool instance
const pool = mysql.createPool(dbConfig);

// Test the connection on startup
pool.getConnection()
  .then((connection: Connection) => {
    console.log('Database connection established successfully');
    connection.release();
  })
  .catch((err: Error) => {
    console.error('Error connecting to the database:', err);
  });

export async function query<T extends RowDataPacket[]>(sql: string, params?: any[]) {
  try {
    const connection = await pool.getConnection();
    try {
      const [results] = await connection.execute<T>(sql, params);
      return [results];
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Database error occurred');
  }
}

export async function transaction<T>(callback: (connection: Connection) => Promise<T>) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
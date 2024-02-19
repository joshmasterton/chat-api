/* eslint-disable import/extensions */
import queryDatabase from './queryDatabase.js';

// Database Initialization
const initializeDatabase = async () => {
  try {
    // // Drop tables
    // await queryDatabase('DROP TABLE IF EXISTS users');
    // await queryDatabase('DROP TABLE IF EXISTS chat_group');
    // await queryDatabase('DROP TABLE IF EXISTS chat');

    // User table
    await queryDatabase(`CREATE TABLE IF NOT EXISTS users(
      user_id SERIAL PRIMARY KEY,
      username VARCHAR(250),
      usernameLowerCase VARCHAR(250),
      password VARCHAR(1000),
      created_on TIMESTAMPTZ,
      last_online TIMESTAMPTZ);`);

    // Chat_group table
    await queryDatabase(`CREATE TABLE IF NOT EXISTS chat_group(
      chat_group_id SERIAL PRIMARY KEY,
      chat_group_name VARCHAR(250),
      created_on TIMESTAMPTZ);`);

    // Chat table
    await queryDatabase(`CREATE TABLE IF NOT EXISTS chat(
      chat_id SERIAL PRIMARY KEY,
      chat_group_id INT,
      username VARCHAR(250),
      content VARCHAR(500),
      created_on TIMESTAMPTZ);`);

    // Friends
    await queryDatabase(`CREATE TABLE IF NOT EXISTS friends(
      friends_id SERIAL PRIMARY KEY,
      friend_one_id INT,
      friend_two_id INT,
      created_on TIMESTAMPTZ);`);

    // Initialization successful
    return console.log('Initialized Database');
  } catch (err) {
    // Error
    return console.log(err.message);
  }
};

export default initializeDatabase;

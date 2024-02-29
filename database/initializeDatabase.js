/* eslint-disable import/extensions */
import queryDatabase from './queryDatabase.js';

// Database Initialization
const initializeDatabase = async () => {
  try {
    // // Drop tables
    // await queryDatabase('DROP TABLE IF EXISTS users');
    // await queryDatabase('DROP TABLE IF EXISTS friends');
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
      chat_group_privacy BOOLEAN,
      chat_group_friend_one VARCHAR(250),
      chat_group_friend_two VARCHAR(250),
      chat_group_created_on TIMESTAMPTZ,
      chat_group_last_message TIMESTAMPTZ);`);

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
      friend_one_username VARCHAR(250),
      friend_two_username VARCHAR(250),
      friend_one_accepted BOOLEAN,
      friend_two_accepted BOOLEAN,
      created_on TIMESTAMPTZ);`);

    // Initialization successful
    return console.log('Initialized Database');
  } catch (err) {
    // Error
    return console.log(err.message);
  }
};

export default initializeDatabase;

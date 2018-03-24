const {assert} = require('chai');
const {mongoose, databaseUrl, options} = require('../../database');

async function connectDatabase() {
  await mongoose.connect(databaseUrl, options);
  await mongoose.connection.db.dropDatabase();
}

async function disconnectDatabase() {
  await mongoose.disconnect();
}

module.exports = {
  connectDatabase,
  disconnectDatabase,
}
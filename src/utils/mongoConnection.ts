import mongoose from 'mongoose';
require('dotenv').config({path: __dirname + '/.env'});

function handleError(error: any) {
  console.log('Error on MongoConnection', error);
}

class MongoConnection {
  constructor() {}

  async init() {
    const {
      MONGO_PASSWORD = '',
      MONGO_USER = '',
    } = process.env;

    const USER = encodeURIComponent(MONGO_USER);
    const PASSWORD = encodeURIComponent(MONGO_PASSWORD);
    const uri = `mongodb+srv://${USER}:${PASSWORD}@cluster0.kqxzc.mongodb.net/test?retryWrites=true&w=majority`;
    
    const dbName = "testing";
    mongoose.connect(uri, {dbName})
    .then(() => console.log('Init MongoConnection'))
    .catch(error => handleError(error))
  }
}

export default MongoConnection;



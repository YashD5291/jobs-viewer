// Simple script to test MongoDB connection and list collections
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://occupy-mars:1234567890@cluster0.xok8xgd.mongodb.net/job_database?retryWrites=true&w=majority&appName=Cluster0';

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    const connection = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    
    console.log('Connected to MongoDB!');
    console.log('Database name:', connection.connection.db.databaseName);
    
    // List all collections
    const collections = await connection.connection.db.listCollections().toArray();
    console.log('Available collections:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Get sample document from each collection
    for (const collection of collections) {
      try {
        const collName = collection.name;
        const count = await connection.connection.db.collection(collName).countDocuments();
        console.log(`\nCollection '${collName}' has ${count} documents`);
        
        if (count > 0) {
          const sample = await connection.connection.db.collection(collName).findOne({});
          console.log(`Sample document structure:`, 
            Object.keys(sample).map(key => `${key}: ${typeof sample[key]}`).join(', ')
          );
        }
      } catch (err) {
        console.error(`Error with collection ${collection.name}:`, err.message);
      }
    }
    
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    
  } catch (error) {
    console.error('Connection error:', error);
  }
}

testConnection();

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // Connect to the database
    const connection = await connectToDatabase();
    
    const dbInfo = {
      connected: connection.readyState === 1,
      host: connection.host,
      name: connection.name,
      models: Object.keys(mongoose.models),
    };

    console.log('Database info:', dbInfo);
    
    // Get all collections in the database
    let collections: any[] = [];
    if (connection && connection.db) {
      collections = await connection.db.listCollections().toArray();
    }
    
    // Try to get a single document from each collection
    const samplesFromCollections: Record<string, any> = {};
    for (const collection of collections) {
      try {
        if (collection && typeof collection === 'object' && 'name' in collection) {
          const collName = collection.name;
          if (connection && connection.db) {
            const sample = await connection.db.collection(collName).findOne({});
            samplesFromCollections[collName] = sample;
          }
        }
      } catch (err: any) {
        if (collection && typeof collection === 'object' && 'name' in collection) {
          samplesFromCollections[collection.name] = `Error: ${err?.message || 'Unknown error'}`;
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      connectionInfo: dbInfo,
      collections: collections.map(c => c?.name || 'unknown'),
      samples: samplesFromCollections
    });
  } catch (error: any) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

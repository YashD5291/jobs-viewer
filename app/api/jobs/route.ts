import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Job from '@/models/Job';

export async function GET(request: Request) {
  try {
    // Connect to the database
    const connection = await connectToDatabase();
    console.log('Connected to MongoDB!');
    console.log('Database name:', connection.db?.databaseName);
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const isRemote = searchParams.get('isRemote') === 'true';
    const site = searchParams.get('site') || '';
    const scrapedFor = searchParams.get('scrapedFor') || '';
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build query
    let query: any = {};
    
    // Add search conditions if search term provided
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    // Add site filter if provided
    if (site) {
      query.site = site; // Exact match for site as it's a specific value
    }
    
    // Add scraped_for filter if provided
    if (scrapedFor) {
      query.search_term = scrapedFor; // Exact match for job title
    }
    
    // Add remote filter if requested
    if (isRemote) {
      query.is_remote = true;
    }
    
    console.log('Query:', JSON.stringify(query));
    
    // Check if collection exists and has documents
    if (connection && connection.db) {
      const collections = await connection.db.listCollections().toArray();
      const collectionNames = collections.map(col => col.name);
      console.log('Available collections:', collectionNames);
    } else {
      console.log('Connection or connection.db is undefined');
    }
    
    // Get one document to check structure
    const sampleDoc = await Job.findOne().lean();
    console.log('Sample document:', sampleDoc);
    
    // Execute query
    const jobs = await Job.find(query)
      .sort({ added_on: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    console.log('Found jobs count:', jobs.length);
    
    // Get total count for pagination
    const total = await Job.countDocuments(query);
    
    console.log('Total matching documents:', total);
    
    return NextResponse.json({
      success: true,
      data: {
        jobs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch jobs', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

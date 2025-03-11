// Script to seed the MongoDB database with sample job data
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://occupy-mars:1234567890@cluster0.xok8xgd.mongodb.net/job_database?retryWrites=true&w=majority&appName=Cluster0';

// Sample job data
const sampleJobs = [
  {
    id: '1',
    site: 'LinkedIn',
    job_url: 'https://www.linkedin.com/jobs/view/123456',
    title: 'Software Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    date_posted: new Date('2025-02-15'),
    description: 'Join our team to build cutting-edge software solutions.',
    is_remote: false,
    company_url: 'https://www.google.com',
  },
  {
    id: '2',
    site: 'Indeed',
    job_url: 'https://www.indeed.com/jobs/view/789012',
    title: 'Frontend Developer',
    company: 'Microsoft',
    location: 'Redmond, WA',
    date_posted: new Date('2025-02-20'),
    description: 'Create beautiful and responsive user interfaces for our products.',
    is_remote: false,
    company_url: 'https://www.microsoft.com',
  },
  {
    id: '3',
    site: 'Glassdoor',
    job_url: 'https://www.glassdoor.com/jobs/view/345678',
    title: 'Backend Engineer',
    company: 'Amazon',
    location: 'Seattle, WA',
    date_posted: new Date('2025-02-25'),
    description: 'Build scalable backend services for our e-commerce platform.',
    is_remote: false,
    company_url: 'https://www.amazon.com',
  },
  {
    id: '4',
    site: 'RemoteOK',
    job_url: 'https://remoteok.com/jobs/901234',
    title: 'Full-Stack Developer',
    company: 'Principal Financial Group',
    location: 'Remote',
    date_posted: new Date('2025-03-01'),
    description: 'Work on all aspects of our financial services platform.',
    is_remote: true,
    company_url: 'https://www.principal.com',
  },
  {
    id: '5',
    site: 'WeWorkRemotely',
    job_url: 'https://weworkremotely.com/jobs/567890',
    title: 'DevOps Engineer',
    company: 'Principal Financial Group',
    location: 'Remote',
    date_posted: new Date('2025-03-05'),
    description: 'Manage our cloud infrastructure and CI/CD pipelines.',
    is_remote: true,
    company_url: 'https://www.principal.com',
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    console.log('Database:', mongoose.connection.db.databaseName);

    // Define a simple schema matching our data
    const jobSchema = new mongoose.Schema({}, { strict: false });
    
    // Try both collection names
    const JobPostingsModel = mongoose.model('JobPosting', jobSchema, 'job_postings');
    const JobsModel = mongoose.model('Job', jobSchema, 'jobs');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await JobPostingsModel.deleteMany({});
    await JobsModel.deleteMany({});
    
    // Insert sample data into both collections
    console.log('Inserting sample data...');
    await JobPostingsModel.insertMany(sampleJobs);
    await JobsModel.insertMany(sampleJobs);
    
    console.log('Successfully seeded the database with 5 sample jobs');
    
    // Count documents to verify
    const jobPostingsCount = await JobPostingsModel.countDocuments();
    const jobsCount = await JobsModel.countDocuments();
    
    console.log(`job_postings collection now has ${jobPostingsCount} documents`);
    console.log(`jobs collection now has ${jobsCount} documents`);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();

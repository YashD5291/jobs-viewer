# Job Listings Viewer

A Next.js application to view job listings stored in MongoDB. This application uses a modern stack with Next.js, TypeScript, Tailwind CSS, and MongoDB to display job postings scraped by an external scraper.

## Features

- View job listings from MongoDB in a clean, responsive UI
- Search for jobs by title, company, or description
- Filter jobs by company and remote status
- Pagination for browsing large datasets
- Responsive design that works on mobile and desktop

## MongoDB Configuration

The application connects to a MongoDB database with the following configuration:

- Connection URL: `mongodb://localhost:27017`
- Database: `job_database`
- Collection: `job_postings`

## Getting Started

### Prerequisites

- Node.js (version 18.0.0 or later)
- MongoDB running locally or accessible via network

### Environment Setup

1. Create a `.env.local` file in the root directory with the following:

```
MONGODB_URI=mongodb://localhost:27017/job_database
```

If your MongoDB is running on a different host or requires authentication, update the URI accordingly.

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

## Project Structure

- `app/` - Next.js app directory containing pages and API routes
- `app/api/jobs/` - API endpoint for fetching job listings
- `components/` - Reusable React components
- `lib/` - Utility functions and database connection
- `models/` - Mongoose models for MongoDB schemas
- `types/` - TypeScript type definitions

## Data Schema

The job postings follow this schema:

```typescript
{
  _id: ObjectId,
  id: String,
  site: String,
  job_url: String,
  job_url_direct: String | null,
  title: String,
  company: String,
  location: String,
  date_posted: Date,
  description: String,
  is_remote: Boolean,
  // Additional fields may be present
}
```

## Learn More

To learn more about Next.js and MongoDB, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

## License

This project is open source and available under the [MIT License](LICENSE).

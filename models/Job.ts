import mongoose, { Schema } from 'mongoose';

// Job posting schema based on the provided structure
const jobSchema = new Schema({
  id: String,
  site: String,
  job_url: String,
  job_url_direct: String,
  title: String,
  company: String,
  location: String,
  date_posted: Date,
  job_type: Schema.Types.Mixed,
  salary_source: Schema.Types.Mixed,
  interval: Schema.Types.Mixed,
  min_amount: Schema.Types.Mixed,
  max_amount: Schema.Types.Mixed,
  currency: Schema.Types.Mixed,
  is_remote: Boolean,
  job_level: String,
  job_function: String,
  listing_type: String,
  emails: Schema.Types.Mixed,
  description: String,
  company_industry: String,
  company_url: String,
  company_logo: String,
  company_url_direct: String,
  company_addresses: Schema.Types.Mixed,
  company_num_employees: Schema.Types.Mixed,
  company_revenue: Schema.Types.Mixed,
  company_description: String
}, {
  collection: 'job_postings', // Try different collection name - MongoDB Atlas might have a different collection name
  timestamps: false // Don't add timestamps as they're not in the original schema
});

// Ensure we're properly logging any Mongoose operations in development
if (process.env.NODE_ENV !== 'production') {
  mongoose.set('debug', true);
}

// Check if model exists before creating a new one (for Next.js hot reloading)
const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);

export default Job;

export interface Job {
  _id: string;
  id: string;
  site: string;
  job_url: string;
  job_url_direct?: string | null;
  title: string;
  company: string;
  location?: string;
  date_posted: string; 
  added_on?: string;
  job_type?: any;
  salary_source?: any;
  interval?: any;
  min_amount?: any;
  max_amount?: any;
  currency?: any;
  is_remote?: boolean;
  job_level?: string | null;
  job_function?: string | null;
  listing_type?: string | null;
  emails?: any;
  description?: string;
  company_industry?: string | null;
  company_url?: string | null;
  company_logo?: string | null;
  company_url_direct?: string | null;
  company_addresses?: any;
  company_num_employees?: any;
  company_revenue?: any;
  company_description?: string | null;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface JobsResponse {
  success: boolean;
  data: {
    jobs: Job[];
    pagination: PaginationData;
  };
}

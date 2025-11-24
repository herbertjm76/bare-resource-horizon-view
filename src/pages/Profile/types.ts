
export type Profile = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  date_of_birth: string | null;
  start_date: string | null;
  manager_id: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  social_linkedin: string | null;
  social_twitter: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  job_title: string | null;
  department: string | null;
  location: string | null;
  weekly_capacity: number;
  role?: string | null;
};

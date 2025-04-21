
export type CompanyFormData = {
  name: string;
  subdomain: string;
  address: string;
  country: string;
  city: string;
  size: string;
  website?: string;
  industry: string; // Changed from optional to required
};

export const emptyCompany: CompanyFormData = {
  name: '',
  subdomain: '',
  address: '',
  country: '',
  city: '',
  size: '',
  website: '',
  industry: ''
};

export const industryOptions = [
  "Architecture",
  "Interior Design",
  "Urban Planning",
  "Landscape Architecture",
  "Structural Engineering",
  "Civil Engineering",
  "Construction Management",
  "Project Management",
  "Surveying",
  "Building Services",
  "Environmental Engineering",
  "Property Development",
  "Sustainability Consulting",
  "Facility Management",
  "Other"
];


export interface Company {
  id: string;
  name: string;
  subdomain: string;
  industry?: string;
  size?: string;
  [key: string]: any;
}

export interface CompanyContextType {
  company: Company | null;
  loading: boolean;
  error: Error | null;
  isSubdomainMode: boolean;
  refreshCompany: () => Promise<void>;
}

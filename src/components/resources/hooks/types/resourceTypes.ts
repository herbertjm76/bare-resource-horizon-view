
export interface Resource {
  id: string;
  name: string;
  role: string;
  allocations?: Record<string, number>;
  isPending?: boolean;
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
}

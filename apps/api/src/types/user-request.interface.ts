export interface AuthUser {
  id: string;
  username: string;
  role: string;     
  role_id: string;  
  tenant_id: string | null;
  branch_id: string | null;
}
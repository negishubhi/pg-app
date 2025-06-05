import { apiRequest } from "./queryClient";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "tenant";
}

export async function signIn(email: string, password: string, role: "admin" | "tenant"): Promise<AuthUser> {
  try {
    const response = await apiRequest("POST", "/api/login", { email, password, role });
    
    // Store user session in localStorage
    localStorage.setItem("pgms_user", JSON.stringify(response.user));
    
    return response.user;
  } catch (error: any) {
    throw new Error(error.message || "Authentication failed");
  }
}

export async function signUp(email: string, password: string, name: string, role: "admin" | "tenant"): Promise<AuthUser> {
  try {
    const response = await apiRequest("POST", "/api/register", { email, password, name, role });
    
    // Store user session in localStorage
    localStorage.setItem("pgms_user", JSON.stringify(response.user));
    
    return response.user;
  } catch (error: any) {
    throw new Error(error.message || "Registration failed");
  }
}

export async function signOut(): Promise<void> {
  localStorage.removeItem("pgms_user");
}

export function getCurrentUser(): AuthUser | null {
  const userStr = localStorage.getItem("pgms_user");
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "alumni" | "admin";
  graduationYear?: number | null;
  major: string;
}

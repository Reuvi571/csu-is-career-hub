export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "alumni" | "admin";
  graduationYear?: number | null;
  major: string;
  targetRoles: string[];
  seekingTypes: string[];
  preferredLocation: string;
  bio: string;
  defaultResume?: {
    name: string;
    url: string;
  } | null;
}

export interface SavedItems {
  jobIds: string[];
  companyIds: number[];
  certificationIds: number[];
  certificationProgressIds: number[];
  alumniIds: number[];
  appliedJobIds: string[];
  jobs: { id: string; title: string; companyName: string }[];
  companies: { id: number; name: string; location: string }[];
  certifications: { id: number; name: string; organization: string; officialUrl?: string }[];
  certificationProgress: { id: number; status: string; targetCompletionDate?: string | null; notes?: string; updatedAt: string }[];
  alumni: { id: number; name: string; role: string; companyName: string }[];
  applications: { jobId: string; title: string; companyName: string; status: string; createdAt: string }[];
}

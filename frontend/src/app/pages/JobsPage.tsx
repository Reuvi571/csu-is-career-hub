import { useEffect, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { MapPin, Briefcase, Clock, DollarSign, X, Shield } from "lucide-react";
import { User } from "../types/user";
import { toast } from "sonner";

interface FilterState {
  location: string;
  experience: string;
  role: string;
}

interface JobRecord {
  id: string;
  title: string;
  company: {
    id: number;
    name: string;
  };
  location: string;
  description: string;
  experience_level: string;
  position_type: string;
  min_hourly_rate: number | null;
  max_hourly_rate: number | null;
  salary_range: string;
  certifications: string[];
  roles: string[];
  date_posted: string;
}

export function JobsPage() {
  const { user } = useOutletContext<{ user: User | null }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobRecord[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobRecord | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    location: "",
    experience: "",
    role: "",
  });

  const locations = Array.from(new Set(jobs.map((job) => job.location))).sort();
  const experiences = Array.from(new Set(jobs.map((job) => job.experience_level))).sort();
  const roles = Array.from(new Set(jobs.flatMap((job) => job.roles))).sort();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/jobs/")
      .then((res) => res.json())
      .then((data: JobRecord[]) => {
        setJobs(data);
        setFilteredJobs(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    let result = jobs;

    if (filters.location) {
      result = result.filter((job) => job.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.experience) {
      result = result.filter((job) => job.experience_level === filters.experience);
    }
    if (filters.role) {
      result = result.filter((job) =>
        job.roles.some((role) => role.toLowerCase().includes(filters.role.toLowerCase()))
      );
    }

    setFilteredJobs(result);
    if (selectedJob && !result.find((job) => job.id === selectedJob.id)) {
      setSelectedJob(null);
    }
  }, [filters, jobs, selectedJob]);

  useEffect(() => {
    const selectedFromQuery = searchParams.get("job");
    if (!selectedFromQuery) {
      return;
    }

    const matchedJob = jobs.find((job) => job.id === selectedFromQuery);
    if (matchedJob && matchedJob.id !== selectedJob?.id) {
      setSelectedJob(matchedJob);
    }
  }, [jobs, searchParams, selectedJob]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ location: "", experience: "", role: "" });
  };

  const logJobInteraction = (job: JobRecord) => {
    setSelectedJob(job);
    setSearchParams({ job: job.id });
    console.log("JOB_VIEW", {
      timestamp: new Date().toISOString(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company.name,
    });
  };

  const handleRejectJob = async () => {
    if (!selectedJob) {
      return;
    }

    const response = await fetch(`http://127.0.0.1:8000/api/admin/jobs/${selectedJob.id}/moderate/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "reject",
        note: "Returned to employer portal from the jobs page by admin.",
      }),
    });

    if (!response.ok) {
      toast.error("Unable to reject posting");
      return;
    }

    setJobs((prev) => prev.filter((job) => job.id !== selectedJob.id));
    setFilteredJobs((prev) => prev.filter((job) => job.id !== selectedJob.id));
    setSelectedJob(null);
    setSearchParams({});
    toast.success("Job posting removed from the live board and returned to the employer portal.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="max-w-full px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Job Opportunities</h1>
              <p className="mt-1 text-sm text-gray-600">{filteredJobs.length} positions available</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-100px)]">
        <div className="sticky top-16 w-72 overflow-y-auto border-r border-gray-200 bg-white p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Filters</h3>
              {(filters.location || filters.experience || filters.role) && (
                <button onClick={clearFilters} className="text-xs font-medium text-[#2d694f] hover:text-[#274c37]">
                  Clear
                </button>
              )}
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-900">Location</label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d694f]"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-900">Experience Level</label>
              <select
                value={filters.experience}
                onChange={(e) => handleFilterChange("experience", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d694f]"
              >
                <option value="">All Levels</option>
                {experiences.map((experience) => (
                  <option key={experience} value={experience}>
                    {experience}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-900">Role</label>
              <select
                value={filters.role}
                onChange={(e) => handleFilterChange("role", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d694f]"
              >
                <option value="">All Roles</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {(filters.location || filters.experience || filters.role) && (
              <div className="space-y-2 border-t border-gray-200 pt-4">
                {filters.location && (
                  <div className="flex items-center justify-between rounded border border-[#2d694f] bg-white p-2">
                    <span className="text-xs text-gray-700">{filters.location}</span>
                    <button onClick={() => handleFilterChange("location", "")} className="text-gray-400 hover:text-gray-600">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {filters.experience && (
                  <div className="flex items-center justify-between rounded border border-[#2d694f] bg-white p-2">
                    <span className="text-xs text-gray-700">{filters.experience}</span>
                    <button onClick={() => handleFilterChange("experience", "")} className="text-gray-400 hover:text-gray-600">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {filters.role && (
                  <div className="flex items-center justify-between rounded border border-[#2d694f] bg-white p-2">
                    <span className="text-xs text-gray-700">{filters.role}</span>
                    <button onClick={() => handleFilterChange("role", "")} className="text-gray-400 hover:text-gray-600">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-md flex-1 overflow-y-auto border-r border-gray-200 bg-white">
          {filteredJobs.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">No jobs found matching your filters</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => logJobInteraction(job)}
                  className={`cursor-pointer border-l-4 p-4 transition-all hover:bg-gray-50 ${
                    selectedJob?.id === job.id ? "border-l-[#2d694f] bg-white" : "border-l-transparent"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-200">
                      <Briefcase className="h-6 w-6 text-gray-600" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-semibold text-gray-900">{job.title}</h4>
                      <p className="text-xs font-medium text-gray-600">{job.company.name}</p>

                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>{job.location}</span>
                      </div>

                      {job.salary_range && (
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                          <DollarSign className="h-3 w-3" />
                          <span>{job.salary_range}</span>
                        </div>
                      )}

                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>Posted {new Date(job.date_posted).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50">
          {selectedJob ? (
            <div className="space-y-8 p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-1 items-start gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gray-300">
                    <Briefcase className="h-8 w-8 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                    <p className="mt-1 text-lg font-semibold text-gray-700">{selectedJob.company.name}</p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {selectedJob.location}
                      </Badge>
                      <Badge variant="secondary">{selectedJob.experience_level}</Badge>
                      <Badge className="bg-[#2d694f] text-white">{selectedJob.roles?.[0] || "Position"}</Badge>
                    </div>
                  </div>
                </div>
                {user?.role === "admin" && (
                  <Button
                    variant="outline"
                    onClick={handleRejectJob}
                    className="rounded-none border-[#274c37] text-[#274c37] hover:bg-white"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Reject Posting
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-lg border border-gray-200 bg-white p-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-600">Salary</p>
                  <p className="mt-1 text-sm font-bold text-gray-900">{selectedJob.salary_range || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-600">Posted</p>
                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {new Date(selectedJob.date_posted).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-bold text-gray-900">About this role</h3>
                <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
                  {selectedJob.description || "No description provided."}
                </p>
              </div>

              {selectedJob.certifications?.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-bold text-gray-900">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.certifications.map((certification, index) => (
                      <Badge key={`${certification}-${index}`} className="border border-[#7ebc45] bg-white text-sm text-[#2d694f]">
                        {certification}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="sticky bottom-0 flex gap-3 border-t border-gray-200 bg-gray-50 pt-4">
                <Button
                  className="flex-1 bg-[#2d694f] hover:bg-[#274c37]"
                  onClick={() => alert("Application feature coming next sprint!")}
                >
                  Easy Apply
                </Button>
                <Button variant="outline" className="flex-1">
                  Save Job
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Briefcase className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                <p className="font-medium text-gray-500">Select a job to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

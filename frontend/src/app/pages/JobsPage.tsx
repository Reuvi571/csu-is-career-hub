import { useEffect, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { MapPin, Briefcase, Clock, DollarSign, X } from "lucide-react";

interface FilterState {
  location: string;
  experience: string;
  role: string;
}

export function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    location: "",
    experience: "",
    role: "",
  });

  // Extract unique values for filters
  const locations = Array.from(new Set(jobs.map(j => j.location))).sort();
  const experiences = Array.from(new Set(jobs.map(j => j.experience_level))).sort();
  const roles = Array.from(new Set(jobs.flatMap(j => j.roles))).sort();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/jobs/")
      .then(res => res.json())
      .then(data => {
        console.log("JOBS:", data);
        setJobs(data);
        setFilteredJobs(data);
      })
      .catch(err => console.error(err));
  }, []);

  // Apply filters
  useEffect(() => {
    let result = jobs;

    if (filters.location) {
      result = result.filter(j => j.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.experience) {
      result = result.filter(j => j.experience_level === filters.experience);
    }
    if (filters.role) {
      result = result.filter(j => j.roles.some((r: string) => r.toLowerCase().includes(filters.role.toLowerCase())));
    }

    setFilteredJobs(result);
    // If selected job is filtered out, deselect it
    if (selectedJob && !result.find(j => j.id === selectedJob.id)) {
      setSelectedJob(null);
    }
  }, [filters, jobs, selectedJob]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ location: "", experience: "", role: "" });
  };

  // Analytics Logger
  const logJobInteraction = (job: any) => {
    setSelectedJob(job);
    console.log(`📊 [ANALYTICS LOGGED] EVENT: JOB_VIEW`, {
      timestamp: new Date().toISOString(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company?.name || job.company
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-full px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Job Opportunities</h1>
              <p className="text-sm text-gray-600 mt-1">{filteredJobs.length} positions available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Three Column Layout */}
      <div className="flex h-[calc(100vh-100px)]">
        {/* Left Sidebar - Filters */}
        <div className="w-72 bg-white border-r border-gray-200 overflow-y-auto p-6 sticky top-16">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Filters</h3>
              {(filters.location || filters.experience || filters.role) && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Experience Level Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Experience Level
              </label>
              <select
                value={filters.experience}
                onChange={(e) => handleFilterChange("experience", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Levels</option>
                {experiences.map((exp, idx) => (
                  <option key={`exp-${idx}`} value={exp}>{exp}</option>
                ))}
              </select>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Role
              </label>
              <select
                value={filters.role}
                onChange={(e) => handleFilterChange("role", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Active Filters Display */}
            {(filters.location || filters.experience || filters.role) && (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                {filters.location && (
                  <div className="flex items-center justify-between bg-blue-50 p-2 rounded">
                    <span className="text-xs text-gray-700">{filters.location}</span>
                    <button
                      onClick={() => handleFilterChange("location", "")}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {filters.experience && (
                  <div className="flex items-center justify-between bg-blue-50 p-2 rounded">
                    <span className="text-xs text-gray-700">{filters.experience}</span>
                    <button
                      onClick={() => handleFilterChange("experience", "")}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {filters.role && (
                  <div className="flex items-center justify-between bg-blue-50 p-2 rounded">
                    <span className="text-xs text-gray-700">{filters.role}</span>
                    <button
                      onClick={() => handleFilterChange("role", "")}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Middle - Job List */}
        <div className="flex-1 max-w-md bg-white border-r border-gray-200 overflow-y-auto">
          {filteredJobs.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No jobs found matching your filters</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => logJobInteraction(job)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-all border-l-4 ${
                    selectedJob?.id === job.id ? "border-l-blue-600 bg-blue-50" : "border-l-transparent"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Company Logo Placeholder */}
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-6 w-6 text-gray-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {job.title}
                      </h4>
                      <p className="text-xs text-gray-600 font-medium">
                        {job.company?.name || job.company}
                      </p>

                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>{job.location}</span>
                      </div>

                      {job.salary_range && (
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <DollarSign className="h-3 w-3" />
                          <span>{job.salary_range}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
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

        {/* Right - Job Details Panel */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          {selectedJob ? (
            <div className="p-8 space-y-8">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-8 w-8 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                    <p className="text-lg font-semibold text-gray-700 mt-1">
                      {selectedJob.company?.name || selectedJob.company}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-3">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {selectedJob.location}
                      </Badge>
                      <Badge variant="secondary">{selectedJob.experience_level}</Badge>
                      <Badge className="bg-blue-600">{selectedJob.roles?.[0] || "Position"}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Meta */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-lg border border-gray-200">
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase">Salary</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {selectedJob.salary_range || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase">Posted</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {new Date(selectedJob.date_posted).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">About this role</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedJob.description || "No description provided."}
                </p>
              </div>

              {/* Certifications */}
              {selectedJob.certifications?.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.certifications.map((cert: string, idx: number) => (
                      <Badge key={idx} className="bg-green-100 text-green-800 text-sm">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-gray-50">
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
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
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Select a job to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

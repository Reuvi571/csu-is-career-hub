import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Bookmark, Briefcase, Clock, DollarSign, ExternalLink, FileText, MapPin, Shield, Upload, X } from "lucide-react";
import { SavedItems, User } from "../types/user";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

interface FilterState {
  location: string;
  experience: string;
  role: string;
}

export interface JobRecord {
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
  application_type: string;
  apply_url: string;
  min_hourly_rate: number | null;
  max_hourly_rate: number | null;
  salary_range: string;
  certifications: string[];
  roles: string[];
  date_posted: string;
}

interface JobsBoardProps {
  jobs: JobRecord[];
  loading?: boolean;
  title: string;
  subtitle: string;
  emptyListMessage: string;
  user: User | null;
  savedItems: SavedItems;
  toggleSavedItem: (itemType: "job", itemId: string) => Promise<boolean>;
  openAuthModal: () => void;
  refreshCurrentUser: () => Promise<void> | void;
  savedOnly?: boolean;
}

const ALLOWED_DOCUMENT_EXTENSIONS = [".pdf", ".doc", ".docx"];

function isAcceptedDocument(file: File | null) {
  if (!file) {
    return false;
  }

  const fileName = file.name.toLowerCase();
  return ALLOWED_DOCUMENT_EXTENSIONS.some((extension) => fileName.endsWith(extension));
}

export function JobsBoard({
  jobs,
  loading = false,
  title,
  subtitle,
  emptyListMessage,
  user,
  savedItems,
  toggleSavedItem,
  openAuthModal,
  refreshCurrentUser,
  savedOnly = false,
}: JobsBoardProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [boardJobs, setBoardJobs] = useState<JobRecord[]>(jobs);
  const [selectedJob, setSelectedJob] = useState<JobRecord | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    location: "",
    experience: "",
    role: "",
  });
  const [submittingApplication, setSubmittingApplication] = useState(false);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [useDefaultResume, setUseDefaultResume] = useState(Boolean(user?.defaultResume));
  const [resumeOverride, setResumeOverride] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const resumeInputRef = useRef<HTMLInputElement | null>(null);
  const coverLetterInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setBoardJobs(jobs);
  }, [jobs]);

  useEffect(() => {
    setUseDefaultResume(Boolean(user?.defaultResume));
  }, [user?.defaultResume]);

  const locations = useMemo(() => Array.from(new Set(boardJobs.map((job) => job.location))).sort(), [boardJobs]);
  const experiences = useMemo(() => Array.from(new Set(boardJobs.map((job) => job.experience_level))).sort(), [boardJobs]);
  const roles = useMemo(() => Array.from(new Set(boardJobs.flatMap((job) => job.roles))).sort(), [boardJobs]);

  const filteredJobs = useMemo(() => {
    let result = boardJobs;

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

    return result;
  }, [boardJobs, filters]);

  useEffect(() => {
    if (selectedJob && !filteredJobs.find((job) => job.id === selectedJob.id)) {
      setSelectedJob(null);
    }
  }, [filteredJobs, selectedJob]);

  useEffect(() => {
    const selectedFromQuery = searchParams.get("job");
    if (!selectedFromQuery) {
      return;
    }

    const matchedJob = boardJobs.find((job) => job.id === selectedFromQuery);
    if (matchedJob && matchedJob.id !== selectedJob?.id) {
      setSelectedJob(matchedJob);
    }
  }, [boardJobs, searchParams, selectedJob]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ location: "", experience: "", role: "" });
  };

  const handleSelectJob = (job: JobRecord) => {
    setSelectedJob(job);
    setSearchParams({ job: job.id });
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

    setBoardJobs((prev) => prev.filter((job) => job.id !== selectedJob.id));
    setSelectedJob(null);
    setSearchParams({});
    toast.success("Job posting removed from the live board and returned to the employer portal.");
  };

  const handleSaveJob = async () => {
    if (!selectedJob) {
      return;
    }

    if (!user) {
      openAuthModal();
      return;
    }

    try {
      const saved = await toggleSavedItem("job", selectedJob.id);
      if (savedOnly && !saved) {
        setBoardJobs((prev) => prev.filter((job) => job.id !== selectedJob.id));
        setSelectedJob(null);
        setSearchParams({});
      }
      toast.success(saved ? "Job saved." : "Job removed from saved items.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update saved jobs");
    }
  };

  const resetApplicationDialog = () => {
    setApplyDialogOpen(false);
    setUseDefaultResume(Boolean(user?.defaultResume));
    setResumeOverride(null);
    setCoverLetterFile(null);
    if (resumeInputRef.current) {
      resumeInputRef.current.value = "";
    }
    if (coverLetterInputRef.current) {
      coverLetterInputRef.current.value = "";
    }
  };

  const handleResumeOverride = (file: File | null) => {
    if (!file) {
      return;
    }

    if (!isAcceptedDocument(file)) {
      toast.error("Resume files must be PDF, DOC, or DOCX.");
      return;
    }

    setResumeOverride(file);
    setUseDefaultResume(false);
  };

  const handleCoverLetterUpload = (file: File | null) => {
    if (!file) {
      return;
    }

    if (!isAcceptedDocument(file)) {
      toast.error("Cover letters must be PDF, DOC, or DOCX.");
      return;
    }

    setCoverLetterFile(file);
  };

  const submitInternalApplication = async () => {
    if (!selectedJob) {
      return;
    }

    if (!user) {
      openAuthModal();
      return;
    }

    if (!useDefaultResume && !resumeOverride) {
      toast.error("Attach a resume or use the default resume on your account.");
      return;
    }

    setSubmittingApplication(true);
    try {
      const formData = new FormData();
      formData.append("use_default_resume", String(useDefaultResume && !resumeOverride));
      if (resumeOverride) {
        formData.append("resume_file", resumeOverride);
      }
      if (coverLetterFile) {
        formData.append("cover_letter_file", coverLetterFile);
      }

      const response = await fetch(`http://127.0.0.1:8000/api/jobs/${selectedJob.id}/apply/`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to submit application");
      }

      await refreshCurrentUser();
      toast.success(data.created ? "Application submitted through CSU Careers." : "You already applied to this posting.");
      resetApplicationDialog();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit application");
    } finally {
      setSubmittingApplication(false);
    }
  };

  const handleApply = async () => {
    if (!selectedJob) {
      return;
    }

    if (selectedJob.application_type === "company_site") {
      if (!selectedJob.apply_url) {
        toast.error("Application link is not available for this posting yet.");
        return;
      }
      window.open(selectedJob.apply_url, "_blank", "noopener,noreferrer");
      return;
    }

    if (!user) {
      openAuthModal();
      return;
    }

    setApplyDialogOpen(true);
  };

  const hasApplied = selectedJob ? savedItems.appliedJobIds.includes(selectedJob.id) : false;

  return (
    <div className="min-h-screen bg-gray-50">
      <Dialog open={applyDialogOpen} onOpenChange={(open) => (open ? setApplyDialogOpen(true) : resetApplicationDialog())}>
        <DialogContent className="max-w-2xl rounded-none">
          <DialogHeader>
            <DialogTitle>Apply Through CSU</DialogTitle>
            <DialogDescription>
              Submit your application using your account resume, upload a different resume, and optionally attach a cover letter.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="border border-[#d5d8db] bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-[#2d694f]">Default resume on account</p>
                  <p className="mt-1 text-sm text-[#5f6368]">
                    {user?.defaultResume ? user.defaultResume.name : "No default resume saved yet."}
                  </p>
                </div>
                {user?.defaultResume && (
                  <button
                    type="button"
                    onClick={() => setUseDefaultResume((prev) => !prev)}
                    className={`border px-3 py-2 text-sm font-semibold ${
                      useDefaultResume ? "border-[#2d694f] bg-[#2d694f] text-white" : "border-[#d5d8db] bg-white text-[#2d694f]"
                    }`}
                  >
                    {useDefaultResume ? "Using Default Resume" : "Use Default Resume"}
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-3">
                <div
                  className="border border-dashed border-[#d5d8db] p-5 text-center"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    handleResumeOverride(event.dataTransfer.files?.[0] ?? null);
                  }}
                >
                  <Upload className="mx-auto h-7 w-7 text-[#2d694f]" />
                  <p className="mt-3 font-semibold text-[#2d694f]">Use a different resume</p>
                  <p className="mt-1 text-sm text-[#5f6368]">Upload a replacement PDF, DOC, or DOCX resume for this application only.</p>
                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(event) => handleResumeOverride(event.target.files?.[0] ?? null)}
                  />
                  <Button
                    variant="outline"
                    className="mt-4 rounded-none border-[#2d694f] text-[#2d694f] hover:bg-white hover:text-[#274c37]"
                    onClick={() => resumeInputRef.current?.click()}
                  >
                    Choose Resume File
                  </Button>
                </div>
                {resumeOverride && (
                  <div className="flex items-center justify-between border border-[#d5d8db] bg-white p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-[#2d694f]" />
                      <span className="text-sm font-medium text-[#3d4348]">{resumeOverride.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setResumeOverride(null);
                        if (resumeInputRef.current) {
                          resumeInputRef.current.value = "";
                        }
                      }}
                      className="text-[#5f6368] hover:text-[#274c37]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div
                  className="border border-dashed border-[#d5d8db] p-5 text-center"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    handleCoverLetterUpload(event.dataTransfer.files?.[0] ?? null);
                  }}
                >
                  <Upload className="mx-auto h-7 w-7 text-[#2d694f]" />
                  <p className="mt-3 font-semibold text-[#2d694f]">Attach a cover letter</p>
                  <p className="mt-1 text-sm text-[#5f6368]">Optional PDF, DOC, or DOCX file for CSU-hosted applications.</p>
                  <input
                    ref={coverLetterInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(event) => handleCoverLetterUpload(event.target.files?.[0] ?? null)}
                  />
                  <Button
                    variant="outline"
                    className="mt-4 rounded-none border-[#2d694f] text-[#2d694f] hover:bg-white hover:text-[#274c37]"
                    onClick={() => coverLetterInputRef.current?.click()}
                  >
                    Choose Cover Letter
                  </Button>
                </div>
                {coverLetterFile && (
                  <div className="flex items-center justify-between border border-[#d5d8db] bg-white p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-[#2d694f]" />
                      <span className="text-sm font-medium text-[#3d4348]">{coverLetterFile.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCoverLetterFile(null);
                        if (coverLetterInputRef.current) {
                          coverLetterInputRef.current.value = "";
                        }
                      }}
                      className="text-[#5f6368] hover:text-[#274c37]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-none border-[#2d694f] text-[#2d694f] hover:bg-white hover:text-[#274c37]"
                onClick={resetApplicationDialog}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 rounded-none bg-[#2d694f] hover:bg-[#274c37]"
                onClick={submitInternalApplication}
                disabled={submittingApplication}
              >
                {submittingApplication ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="max-w-full px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#2d694f]">{title}</h1>
              <p className="mt-1 text-sm text-gray-600">{subtitle.replace("{count}", String(filteredJobs.length))}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-100px)]">
        <div className="sticky top-16 w-72 overflow-y-auto border-r border-gray-200 bg-white p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#2d694f]">Filters</h3>
              {(filters.location || filters.experience || filters.role) && (
                <button onClick={clearFilters} className="text-xs font-medium text-[#2d694f] hover:text-[#274c37]">
                  Clear
                </button>
              )}
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-[#2d694f]">Location</label>
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
              <label className="mb-3 block text-sm font-semibold text-[#2d694f]">Experience Level</label>
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
              <label className="mb-3 block text-sm font-semibold text-[#2d694f]">Role</label>
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
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#2d694f]" />
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex h-full items-center justify-center px-8 text-center">
              <p className="text-gray-500">{emptyListMessage}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => handleSelectJob(job)}
                  className={`cursor-pointer border-l-4 p-4 transition-all hover:bg-gray-50 ${
                    selectedJob?.id === job.id ? "border-l-[#2d694f] bg-white" : "border-l-transparent"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-200">
                      <Briefcase className="h-6 w-6 text-gray-600" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-semibold text-[#2d694f]">{job.title}</h4>
                      <p className="text-xs font-medium text-[#3d4348]">{job.company.name}</p>

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
                    <h2 className="text-2xl font-bold text-[#2d694f]">{selectedJob.title}</h2>
                    <p className="mt-1 text-lg font-semibold text-[#3d4348]">{selectedJob.company.name}</p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {selectedJob.location}
                      </Badge>
                      <Badge variant="secondary">{selectedJob.experience_level}</Badge>
                      <Badge className="bg-[#2d694f] text-white">{selectedJob.roles?.[0] || "Position"}</Badge>
                      <Badge
                        variant="outline"
                        className="border-[#7ebc45] bg-white text-[#2d694f]"
                      >
                        {selectedJob.application_type === "csu_internal" ? "Apply through CSU" : "External company site"}
                      </Badge>
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
                  <p className="text-xs font-semibold uppercase text-[#2d694f]">Salary</p>
                  <p className="mt-1 text-sm font-bold text-[#3d4348]">{selectedJob.salary_range || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-[#2d694f]">Posted</p>
                  <p className="mt-1 text-sm font-bold text-[#3d4348]">
                    {new Date(selectedJob.date_posted).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-bold text-[#2d694f]">About this role</h3>
                <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
                  {selectedJob.description || "No description provided."}
                </p>
              </div>

              {selectedJob.certifications?.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-bold text-[#2d694f]">Certifications</h3>
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
                  onClick={handleApply}
                  disabled={submittingApplication || (selectedJob.application_type === "csu_internal" && hasApplied)}
                >
                  {selectedJob.application_type === "company_site" ? (
                    <>
                      Apply on Company Site
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </>
                  ) : hasApplied ? (
                    "Applied Through CSU"
                  ) : submittingApplication ? (
                    "Submitting..."
                  ) : (
                    "Apply Through CSU"
                  )}
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleSaveJob}>
                  <Bookmark className="mr-2 h-4 w-4" />
                  {savedItems.jobIds.includes(selectedJob.id) ? "Saved" : "Save Job"}
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

import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useSearchParams } from "react-router";
import { ArrowLeft, Briefcase, Clock, FileText, MapPin } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { User } from "../types/user";

interface ApplicationRecord {
  id: number;
  job: {
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
    salary_range: string;
    certifications: string[];
    roles: string[];
    date_posted: string;
    status: string;
    rejection_note: string;
  };
  status: string;
  notes: string;
  followUpDate: string | null;
  stageUpdatedAt: string;
  createdAt: string;
  resumeFile: { name: string; url: string } | null;
  coverLetterFile: { name: string; url: string } | null;
}

interface RootContext {
  user: User | null;
  loadingUser: boolean;
  openAuthModal: () => void;
}

export function ApplicationsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loadingUser, openAuthModal } = useOutletContext<RootContext>();
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [selected, setSelected] = useState<ApplicationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingStage, setSavingStage] = useState(false);

  useEffect(() => {
    if (!user) {
      setApplications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch("http://127.0.0.1:8000/api/applications/", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unable to load applications");
        }
        return res.json();
      })
      .then((data: ApplicationRecord[]) => {
        setApplications(data);
      })
      .catch(() => {
        setApplications([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    const id = searchParams.get("application");
    if (!id) {
      return;
    }
    const matched = applications.find((item) => String(item.id) === id);
    if (matched && matched.id !== selected?.id) {
      setSelected(matched);
    }
  }, [applications, searchParams, selected]);

  if (loadingUser) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#2d694f]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="border border-[#d5d8db] bg-white p-10 text-center">
          <h1 className="text-3xl font-bold text-[#2d694f]">My Applications</h1>
          <p className="mt-4 text-[#5f6368]">Sign in to view and manage CSU-hosted applications.</p>
          <Button onClick={openAuthModal} className="mt-6 rounded-none bg-[#2d694f] hover:bg-[#274c37]">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const handleStageUpdate = async (updates: Partial<Pick<ApplicationRecord, "status" | "notes" | "followUpDate">>) => {
    if (!selected) {
      return;
    }

    setSavingStage(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/applications/${selected.id}/stage/`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to update application");
      }

      setApplications((prev) => prev.map((item) => item.id === selected.id ? data.application : item));
      setSelected(data.application);
    } catch (error) {
      console.error(error);
    } finally {
      setSavingStage(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="max-w-full px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-2 rounded-none px-0 text-[#2d694f] hover:bg-transparent hover:text-[#274c37]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-[#2d694f]">My Applications</h1>
          <p className="mt-1 text-sm text-gray-600">{applications.length} CSU-hosted application{applications.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        <div className="max-w-md flex-1 overflow-y-auto border-r border-gray-200 bg-white">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#2d694f]" />
            </div>
          ) : applications.length === 0 ? (
            <div className="flex h-full items-center justify-center px-8 text-center">
              <p className="text-gray-500">You have not submitted any CSU-hosted applications yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {applications.map((application) => (
                <div
                  key={application.id}
                  onClick={() => {
                    setSelected(application);
                    setSearchParams({ application: String(application.id) });
                  }}
                  className={`cursor-pointer border-l-4 p-4 transition-all hover:bg-gray-50 ${
                    selected?.id === application.id ? "border-l-[#2d694f] bg-white" : "border-l-transparent"
                  }`}
                >
                  <h3 className="text-sm font-semibold text-[#2d694f]">{application.job.title}</h3>
                  <p className="mt-1 text-xs font-medium text-[#3d4348]">{application.job.company.name}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span>{application.job.location}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge className="bg-[#2d694f] text-white">{application.status}</Badge>
                    <span className="text-xs text-gray-400">{new Date(application.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50">
          {selected ? (
            <div className="space-y-8 p-8">
              <div>
                <h2 className="text-2xl font-bold text-[#2d694f]">{selected.job.title}</h2>
                <p className="mt-1 text-lg font-semibold text-[#3d4348]">{selected.job.company.name}</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <Badge className="bg-[#2d694f] text-white">{selected.status}</Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {selected.job.location}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Submitted {new Date(selected.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
              </div>

              <div className="rounded-none border border-[#d5d8db] bg-white p-6">
                <h3 className="mb-4 text-lg font-bold text-[#2d694f]">Pipeline tracking</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#2d694f]">Application stage</label>
                    <select
                      value={selected.status}
                      onChange={(event) => handleStageUpdate({ status: event.target.value })}
                      className="h-11 w-full rounded-none border border-[#d5d8db] bg-white px-3 py-2 text-sm"
                      disabled={savingStage}
                    >
                      <option value="preparing">Preparing</option>
                      <option value="submitted">Submitted</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="interviewing">Interviewing</option>
                      <option value="offer">Offer</option>
                      <option value="rejected">Rejected</option>
                      <option value="withdrawn">Withdrawn</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#2d694f]">Follow-up date</label>
                    <input
                      type="date"
                      value={selected.followUpDate ?? ""}
                      onChange={(event) => handleStageUpdate({ followUpDate: event.target.value || null })}
                      className="h-11 w-full rounded-none border border-[#d5d8db] bg-white px-3 py-2 text-sm"
                      disabled={savingStage}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-sm font-semibold text-[#2d694f]">Notes</label>
                  <textarea
                    value={selected.notes}
                    onChange={(event) => setSelected({ ...selected, notes: event.target.value })}
                    onBlur={() => handleStageUpdate({ notes: selected.notes })}
                    className="min-h-[120px] w-full rounded-none border border-[#d5d8db] bg-white px-3 py-2 text-sm"
                    placeholder="Add interview details, reminders, or follow-up notes."
                    disabled={savingStage}
                  />
                  <p className="mt-2 text-xs text-[#5f6368]">
                    Last updated {new Date(selected.stageUpdatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="rounded-none border border-[#d5d8db] bg-white p-6">
                <h3 className="mb-4 text-lg font-bold text-[#2d694f]">Submitted documents</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border border-[#d5d8db] p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-[#2d694f]" />
                      <div>
                        <p className="font-semibold text-[#3d4348]">{selected.resumeFile?.name || "Resume unavailable"}</p>
                        <p className="text-sm text-[#5f6368]">Resume attached to this application</p>
                      </div>
                    </div>
                    {selected.resumeFile && (
                      <a
                        href={`http://127.0.0.1:8000${selected.resumeFile.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-[#2d694f] hover:underline"
                      >
                        Open
                      </a>
                    )}
                  </div>

                  <div className="flex items-center justify-between border border-[#d5d8db] p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-[#2d694f]" />
                      <div>
                        <p className="font-semibold text-[#3d4348]">{selected.coverLetterFile?.name || "No cover letter attached"}</p>
                        <p className="text-sm text-[#5f6368]">Optional cover letter for this application</p>
                      </div>
                    </div>
                    {selected.coverLetterFile && (
                      <a
                        href={`http://127.0.0.1:8000${selected.coverLetterFile.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-[#2d694f] hover:underline"
                      >
                        Open
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-bold text-[#2d694f]">Role details</h3>
                <p className="whitespace-pre-wrap leading-relaxed text-gray-700">{selected.job.description}</p>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Briefcase className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                <p className="font-medium text-gray-500">Select an application to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

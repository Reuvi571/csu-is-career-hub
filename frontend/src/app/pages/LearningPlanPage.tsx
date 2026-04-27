import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { ArrowLeft, Award, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { PageIntro } from "../components/PageIntro";
import { User } from "../types/user";
import { toast } from "sonner";

interface ProgressRecord {
  certificationId: number;
  name: string;
  organization: string;
  status: string;
  targetCompletionDate?: string | null;
  notes?: string;
  updatedAt: string;
}

export function LearningPlanPage() {
  const navigate = useNavigate();
  const { user, loadingUser, openAuthModal, refreshSavedItems } = useOutletContext<{
    user: User | null;
    loadingUser: boolean;
    openAuthModal: () => void;
    refreshSavedItems: () => Promise<void> | void;
  }>();
  const [records, setRecords] = useState<ProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  const loadRecords = async () => {
    if (!user) {
      setRecords([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/certification-progress/", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Unable to load learning plan");
      }
      const data = await response.json();
      setRecords(data);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [user]);

  const updateStatus = async (certificationId: number, nextStatus: string) => {
    setSavingId(certificationId);
    try {
      const current = records.find((record) => record.certificationId === certificationId);
      const isClearing = current?.status === nextStatus;
      const response = await fetch("http://127.0.0.1:8000/api/certification-progress/", {
        method: isClearing ? "DELETE" : "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          certificationId,
          ...(isClearing ? {} : { status: nextStatus }),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to update learning plan");
      }

      await refreshSavedItems();
      await loadRecords();
      toast.success(isClearing ? "Certification status cleared." : "Learning plan updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update learning plan");
    } finally {
      setSavingId(null);
    }
  };

  const clearRecord = async (certificationId: number) => {
    setSavingId(certificationId);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/certification-progress/", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ certificationId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to remove certification from learning plan");
      }

      await refreshSavedItems();
      await loadRecords();
      toast.success("Certification removed from your learning plan.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to remove certification from learning plan");
    } finally {
      setSavingId(null);
    }
  };

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
          <h1 className="text-3xl font-bold text-[#2d694f]">Learning Plan</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#5f6368]">
            Sign in to manage certifications you marked as interested, planned, in progress, or completed.
          </p>
          <Button onClick={openAuthModal} className="mt-6 rounded-none bg-[#2d694f] hover:bg-[#274c37]">
            Sign In to View Learning Plan
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 rounded-none px-0 text-[#2d694f] hover:bg-transparent hover:text-[#274c37]"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <PageIntro
        badge="Manage certification progress"
        title="Learning Plan"
        description="Keep track of certifications you are interested in, planning, actively working on, or have already completed."
      />

      {loading ? (
        <div className="mx-auto flex min-h-[30vh] max-w-7xl items-center justify-center px-4 py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#2d694f]" />
        </div>
      ) : records.length === 0 ? (
        <div className="border border-[#d5d8db] bg-white px-6 py-14 text-center">
          <Award className="mx-auto mb-4 h-12 w-12 text-[#7ebc45]" />
          <h2 className="text-2xl font-bold text-[#2d694f]">No certifications in your plan yet</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[#5f6368]">
            Open any certification and mark it as interested, planned, in progress, or completed to manage it here.
          </p>
          <Button onClick={() => navigate("/certifications")} className="mt-6 rounded-none bg-[#2d694f] hover:bg-[#274c37]">
            Browse Certifications
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {records.map((record) => (
            <div key={record.certificationId} className="border border-[#d5d8db] bg-white p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#2d694f]">{record.name}</h2>
                  <p className="mt-1 text-sm text-[#5f6368]">{record.organization}</p>
                  <p className="mt-2 text-xs text-[#5f6368]">
                    Last updated {new Date(record.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => clearRecord(record.certificationId)}
                  disabled={savingId === record.certificationId}
                  className="rounded-none border-[#274c37] text-[#274c37] hover:bg-white"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>

              <div className="mt-5 grid gap-2 md:grid-cols-4">
                {[
                  ["interested", "Interested"],
                  ["planned", "Planned"],
                  ["in_progress", "In Progress"],
                  ["completed", "Completed"],
                ].map(([value, label]) => (
                  <Button
                    key={value}
                    variant="outline"
                    onClick={() => updateStatus(record.certificationId, value)}
                    disabled={savingId === record.certificationId}
                    className={`rounded-none ${record.status === value ? "border-[#2d694f] bg-[#2d694f] text-white hover:bg-[#274c37] hover:text-white" : "border-[#2d694f] text-[#2d694f] hover:bg-white hover:text-[#274c37]"}`}
                  >
                    {label}
                  </Button>
                ))}
              </div>

              <p className="mt-3 text-xs text-[#5f6368]">
                Click the current status again to clear it, or use Remove to take this certification out of your plan entirely.
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

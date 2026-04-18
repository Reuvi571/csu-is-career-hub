import { useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { ArrowLeft, FileText, Upload, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { User } from "../types/user";
import { toast } from "sonner";

interface RootContext {
  user: User | null;
  refreshCurrentUser: () => Promise<void> | void;
  openAuthModal: () => void;
}

export function DocumentsPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { user, refreshCurrentUser, openAuthModal } = useOutletContext<RootContext>();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="border border-[#d5d8db] bg-white p-10 text-center">
          <h1 className="text-3xl font-bold text-[#2d694f]">Documents</h1>
          <p className="mt-4 text-[#5f6368]">Sign in to manage the default resume attached to your CSU applications.</p>
          <Button onClick={openAuthModal} className="mt-6 rounded-none bg-[#2d694f] hover:bg-[#274c37]">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const handleUpload = async () => {
    if (!resumeFile) {
      toast.error("Choose a resume file to upload.");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("default_resume", resumeFile);

      const response = await fetch("http://127.0.0.1:8000/api/profile/documents/", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to update resume");
      }

      await refreshCurrentUser();
      setResumeFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      toast.success("Default resume updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update resume");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    setSaving(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/profile/documents/", {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to remove resume");
      }

      await refreshCurrentUser();
      toast.success("Default resume removed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to remove resume");
    } finally {
      setSaving(false);
    }
  };

  const onDropFile = (file: File | null) => {
    if (file) {
      setResumeFile(file);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 rounded-none px-0 text-[#2d694f] hover:bg-transparent hover:text-[#274c37]"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#2d694f]">Documents</h1>
        <p className="mt-3 max-w-3xl text-lg text-[#5f6368]">
          Keep a default resume on your account so CSU-hosted applications can be submitted without reattaching the same file each time.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-none border border-[#d5d8db] shadow-none">
          <CardHeader>
            <CardTitle className="text-[#2d694f]">Default Resume</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {user.defaultResume ? (
              <div className="flex items-center justify-between border border-[#d5d8db] bg-white p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-[#2d694f]" />
                  <div>
                    <p className="font-semibold text-[#3d4348]">{user.defaultResume.name}</p>
                    <a
                      href={`http://127.0.0.1:8000${user.defaultResume.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[#2d694f] hover:underline"
                    >
                      Open current resume
                    </a>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="rounded-none border-[#274c37] text-[#274c37] hover:bg-white"
                  onClick={handleRemove}
                  disabled={saving}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="border border-dashed border-[#d5d8db] p-5 text-sm text-[#5f6368]">
                No default resume is currently saved to your account.
              </div>
            )}

            <div
              className={`border border-dashed p-6 text-center transition-colors ${
                dragActive ? "border-[#2d694f] bg-[#2d694f]/5" : "border-[#d5d8db] bg-white"
              }`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragActive(false);
                onDropFile(event.dataTransfer.files?.[0] ?? null);
              }}
            >
              <Upload className="mx-auto h-8 w-8 text-[#2d694f]" />
              <p className="mt-3 font-semibold text-[#2d694f]">Drag and drop a resume here</p>
              <p className="mt-1 text-sm text-[#5f6368]">or choose a file from your computer</p>
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={(event) => onDropFile(event.target.files?.[0] ?? null)}
              />
              <Button
                variant="outline"
                className="mt-4 rounded-none border-[#2d694f] text-[#2d694f] hover:bg-white hover:text-[#274c37]"
                onClick={() => inputRef.current?.click()}
              >
                Choose Resume File
              </Button>
            </div>

            {resumeFile && (
              <div className="flex items-center justify-between border border-[#d5d8db] bg-white p-4">
                <div>
                  <p className="font-semibold text-[#3d4348]">{resumeFile.name}</p>
                  <p className="text-sm text-[#5f6368]">Ready to upload as your default resume</p>
                </div>
                <button onClick={() => setResumeFile(null)} className="text-[#5f6368] hover:text-[#274c37]">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <Button
              className="rounded-none bg-[#2d694f] hover:bg-[#274c37]"
              onClick={handleUpload}
              disabled={saving || !resumeFile}
            >
              {saving ? "Saving..." : "Save as Default Resume"}
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-none border border-[#d5d8db] shadow-none">
          <CardHeader>
            <CardTitle className="text-[#2d694f]">How it works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-[#5f6368]">
            <p>Your default resume will appear automatically when you apply through CSU-hosted job postings.</p>
            <p>At application time, you can keep the default resume, swap in a different resume, attach an optional cover letter, or remove either file before submitting.</p>
            <p>External company-site postings will still send you directly to the employer's application page.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

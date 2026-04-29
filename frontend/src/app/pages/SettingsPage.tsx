import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { ArrowLeft, Bookmark, Building2, GraduationCap, Award, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { SavedItems, User } from "../types/user";
import { toast } from "sonner";

interface RootContext {
  user: User | null;
  savedItems: SavedItems;
  refreshCurrentUser: () => Promise<void> | void;
}

interface StudentDashboard {
  topSkillGaps: { name: string; jobCount: number }[];
  certificationProgress: {
    certificationId: number;
    name: string;
    organization: string;
    status: string;
  }[];
}

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, savedItems, refreshCurrentUser } = useOutletContext<RootContext>();
  const [formState, setFormState] = useState({
    name: "",
    major: "",
    graduationYear: "",
    targetRoles: "",
    seekingTypes: "",
    preferredLocation: "",
    bio: "",
  });
  const [saving, setSaving] = useState(false);
  const [dashboard, setDashboard] = useState<StudentDashboard | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormState({
      name: user.name,
      major: user.major,
      graduationYear: user.graduationYear ? String(user.graduationYear) : "",
      targetRoles: user.targetRoles.join(", "),
      seekingTypes: user.seekingTypes.join(", "),
      preferredLocation: user.preferredLocation,
      bio: user.bio,
    });
  }, [user]);

  useEffect(() => {
    if (!user) {
      setDashboard(null);
      return;
    }

    fetch("http://127.0.0.1:8000/api/student/dashboard/", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unable to load dashboard");
        }
        return res.json();
      })
      .then((data: StudentDashboard) => setDashboard(data))
      .catch(() => setDashboard(null));
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-[#5f6368]">Sign in to manage your profile and saved items.</p>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/profile/", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formState.name,
          major: formState.major,
          graduationYear: formState.graduationYear ? Number(formState.graduationYear) : null,
          targetRoles: formState.targetRoles.split(",").map((item) => item.trim()).filter(Boolean),
          seekingTypes: formState.seekingTypes.split(",").map((item) => item.trim()).filter(Boolean),
          preferredLocation: formState.preferredLocation,
          bio: formState.bio,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to save profile");
      }

      await refreshCurrentUser();
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save profile");
    } finally {
      setSaving(false);
    }
  };

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

      <div className="mb-8 border-l border-[#d5d8db] pl-0 sm:pl-8 lg:pl-12">
        <div className="mb-4 inline-flex items-center gap-2 border border-[#2d694f] bg-white px-4 py-2 text-sm font-semibold text-[#2d694f]">
          <div className="h-2 w-2 bg-[#7ebc45]" />
          <span>Account and preferences</span>
        </div>
        <h1 className="text-5xl font-bold leading-none text-[#2d694f] md:text-6xl">Profile settings</h1>
        <p className="mt-6 max-w-4xl text-xl leading-relaxed text-[#5f6368]">
          Keep your career interests current, manage saved items, and tailor the platform to the roles you want to pursue next.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.2fr)_380px]">
        <Card className="rounded-none border border-[#d5d8db] shadow-none">
          <CardHeader>
            <CardTitle className="text-[#2d694f]">Your profile</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="settings-name">Full Name</Label>
              <Input id="settings-name" className="mt-2 rounded-none" value={formState.name} onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="settings-major">Major</Label>
              <Input id="settings-major" className="mt-2 rounded-none" value={formState.major} onChange={(e) => setFormState((prev) => ({ ...prev, major: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="settings-grad-year">Graduation Year</Label>
              <Input id="settings-grad-year" type="number" className="mt-2 rounded-none" value={formState.graduationYear} onChange={(e) => setFormState((prev) => ({ ...prev, graduationYear: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="settings-target-roles">Target Roles</Label>
              <Input id="settings-target-roles" className="mt-2 rounded-none" value={formState.targetRoles} onChange={(e) => setFormState((prev) => ({ ...prev, targetRoles: e.target.value }))} placeholder="Data Analyst, Systems Analyst, Front-End Developer" />
            </div>
            <div>
              <Label htmlFor="settings-seeking-types">Opportunity Types</Label>
              <Input id="settings-seeking-types" className="mt-2 rounded-none" value={formState.seekingTypes} onChange={(e) => setFormState((prev) => ({ ...prev, seekingTypes: e.target.value }))} placeholder="Internship, Co-op, Entry-level" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="settings-location">Preferred Location</Label>
              <Input id="settings-location" className="mt-2 rounded-none" value={formState.preferredLocation} onChange={(e) => setFormState((prev) => ({ ...prev, preferredLocation: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="settings-bio">Career Summary</Label>
              <Textarea id="settings-bio" className="mt-2 min-h-28 rounded-none" value={formState.bio} onChange={(e) => setFormState((prev) => ({ ...prev, bio: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <Button onClick={handleSave} disabled={saving} className="rounded-none bg-[#2d694f] hover:bg-[#274c37]">
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-none border border-[#d5d8db] shadow-none">
            <CardHeader>
              <CardTitle className="text-[#2d694f]">Saved items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-[#5f6368]">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2"><Bookmark className="h-4 w-4 text-[#2d694f]" /> Jobs</span>
                <span className="font-semibold text-[#3d4348]">{savedItems.jobs.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2"><Building2 className="h-4 w-4 text-[#2d694f]" /> Companies</span>
                <span className="font-semibold text-[#3d4348]">{savedItems.companies.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2"><Award className="h-4 w-4 text-[#2d694f]" /> Certifications</span>
                <span className="font-semibold text-[#3d4348]">{savedItems.certifications.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-[#2d694f]" /> Alumni</span>
                <span className="font-semibold text-[#3d4348]">{savedItems.alumni.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border border-[#d5d8db] shadow-none">
            <CardHeader>
              <CardTitle className="text-[#2d694f]">Readiness gaps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!dashboard || dashboard.topSkillGaps.length === 0 ? (
                <p className="text-sm text-[#5f6368]">Save jobs or set target roles to highlight your most common gaps.</p>
              ) : (
                dashboard.topSkillGaps.map((gap) => (
                  <div key={gap.name} className="border border-[#d5d8db] p-4">
                    <p className="font-semibold text-[#3d4348]">{gap.name}</p>
                    <p className="mt-1 text-sm text-[#5f6368]">Appears in {gap.jobCount} matching jobs</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="rounded-none border border-[#d5d8db] shadow-none">
            <CardHeader>
              <CardTitle className="text-[#2d694f]">Certification plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!dashboard || dashboard.certificationProgress.length === 0 ? (
                <p className="text-sm text-[#5f6368]">Mark certifications as planned, in progress, or completed to build your learning plan.</p>
              ) : (
                dashboard.certificationProgress.slice(0, 5).map((certification) => (
                  <div key={certification.certificationId} className="border border-[#d5d8db] p-4">
                    <p className="font-semibold text-[#3d4348]">{certification.name}</p>
                    <p className="mt-1 text-sm text-[#5f6368]">{certification.organization}</p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#2d694f]">
                      {certification.status.replace("_", " ")}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router";
import { ArrowLeft, Briefcase, Building2, GraduationCap, Linkedin, Mail, MapPin, MessageSquare, Bookmark } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { SavedItems, User } from "../types/user";
import { toast } from "sonner";

interface AlumniDetail {
  id: number;
  name: string;
  company: {
    id: number;
    name: string;
  };
  role: string;
  headline: string;
  location: string;
  bio: string;
  how_they_got_there: string;
  experience_highlights: string;
  advice_for_students: string;
  internship_history: string[];
  skills: string[];
  is_mentor: boolean;
  open_to_questions: boolean;
  open_to_referrals: boolean;
  email: string;
  linkedin_url: string;
  graduation_year: number;
}

export function AlumniDetailPage() {
  const { user, savedItems, toggleSavedItem, openAuthModal } = useOutletContext<{
    user: User | null;
    savedItems: SavedItems;
    toggleSavedItem: (itemType: "alumni", itemId: number) => Promise<boolean>;
    openAuthModal: () => void;
  }>();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState<AlumniDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleSaveAlumni = async () => {
    if (!alumni) {
      return;
    }

    if (!user) {
      openAuthModal();
      return;
    }

    try {
      const saved = await toggleSavedItem("alumni", alumni.id);
      toast.success(saved ? "Alumni profile saved." : "Alumni profile removed from saved items.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update saved alumni");
    }
  };

  useEffect(() => {
    if (!id) {
      setError("Alumni profile not found");
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/api/alumni/${id}/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unable to load alumni profile");
        }
        return res.json();
      })
      .then((data: AlumniDetail) => {
        setAlumni(data);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#2d694f]" />
      </div>
    );
  }

  if (error || !alumni) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-[#5f6368]">{error || "Alumni profile not found"}</p>
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

      <div className="mb-8 border border-[#d5d8db] bg-white p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 border border-[#2d694f] bg-white px-4 py-2 text-sm font-semibold text-[#2d694f]">
              <div className="h-2 w-2 bg-[#7ebc45]" />
              <span>CSU alumni profile</span>
            </div>
            <h1 className="text-4xl font-bold text-[#2d694f]">{alumni.name}</h1>
            <p className="mt-3 text-xl font-semibold text-[#3d4348]">{alumni.role}</p>
            {alumni.headline && <p className="mt-3 max-w-3xl text-base leading-7 text-[#5f6368]">{alumni.headline}</p>}
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#5f6368]">
              <span className="inline-flex items-center gap-2 border border-[#d5d8db] px-3 py-2">
                <Building2 className="h-4 w-4 text-[#2d694f]" />
                <Link to={`/companies/${alumni.company.id}`} className="text-[#2d694f] hover:underline">
                  {alumni.company.name}
                </Link>
              </span>
              <span className="inline-flex items-center gap-2 border border-[#d5d8db] px-3 py-2">
                <MapPin className="h-4 w-4 text-[#2d694f]" />
                {alumni.location}
              </span>
              <span className="inline-flex items-center gap-2 border border-[#d5d8db] px-3 py-2">
                <GraduationCap className="h-4 w-4 text-[#2d694f]" />
                Class of {alumni.graduation_year}
              </span>
            </div>
          </div>

          <div className="flex w-full max-w-sm flex-col gap-3">
            <Button variant="outline" onClick={handleSaveAlumni} className="w-full rounded-none border-[#2d694f] text-[#2d694f] hover:bg-white hover:text-[#274c37]">
              <Bookmark className="mr-2 h-4 w-4" />
              {savedItems.alumniIds.includes(alumni.id) ? "Saved Alumni" : "Save Alumni"}
            </Button>
            {alumni.email && (
              <a href={`mailto:${alumni.email}`}>
                <Button className="w-full rounded-none bg-[#2d694f] hover:bg-[#274c37]">
                  <Mail className="mr-2 h-4 w-4" />
                  Ask a Question
                </Button>
              </a>
            )}
            {alumni.linkedin_url && (
              <a href={alumni.linkedin_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full rounded-none border-[#2d694f] text-[#2d694f] hover:bg-white hover:text-[#274c37]">
                  <Linkedin className="mr-2 h-4 w-4" />
                  Connect on LinkedIn
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.4fr)_340px]">
        <div className="space-y-8">
          <Card className="rounded-none border border-[#d5d8db] shadow-none">
            <CardHeader>
              <CardTitle className="text-[#2d694f]">Career path</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-[#5f6368]">
              <p className="leading-7">{alumni.bio}</p>
              {alumni.how_they_got_there && (
                <div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#2d694f]">How they got there</p>
                  <p className="leading-7">{alumni.how_they_got_there}</p>
                </div>
              )}
              {alumni.experience_highlights && (
                <div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#2d694f]">Experience highlights</p>
                  <p className="leading-7">{alumni.experience_highlights}</p>
                </div>
              )}
              {alumni.advice_for_students && (
                <div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#2d694f]">Advice for current students</p>
                  <p className="leading-7">{alumni.advice_for_students}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-none border border-[#d5d8db] shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center text-[#2d694f]">
                <MessageSquare className="mr-2 h-5 w-5" />
                Connection options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-[#5f6368]">
              <div className="flex items-center justify-between">
                <span>Available to mentor</span>
                <span className="font-semibold text-[#3d4348]">{alumni.is_mentor ? "Yes" : "No"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Open to questions</span>
                <span className="font-semibold text-[#3d4348]">{alumni.open_to_questions ? "Yes" : "No"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Open to referrals</span>
                <span className="font-semibold text-[#3d4348]">{alumni.open_to_referrals ? "Yes" : "No"}</span>
              </div>
            </CardContent>
          </Card>

          {alumni.internship_history.length > 0 && (
            <Card className="rounded-none border border-[#d5d8db] shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center text-[#2d694f]">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Relevant experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alumni.internship_history.map((item) => (
                  <div key={item} className="border border-[#d5d8db] p-4 text-sm text-[#5f6368]">
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card className="rounded-none border border-[#d5d8db] shadow-none">
            <CardHeader>
              <CardTitle className="text-[#2d694f]">Skills and focus areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {alumni.skills.map((skill) => (
                  <Badge key={skill} className="rounded-none border border-[#7ebc45] bg-white text-[#2d694f]">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

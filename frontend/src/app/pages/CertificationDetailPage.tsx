import { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, Award, Building2, Briefcase, Bookmark, ExternalLink } from "lucide-react";
import { SavedItems, User } from "../types/user";
import { toast } from "sonner";

interface Job {
  id: string;
  title: string;
  company: {
    id: number;
    name: string;
  };
  location: string;
  date_posted: string;
}

interface CertificationDetail {
  id: number;
  name: string;
  description: string;
  organization: string;
  official_url: string;
  roles: string[];
  job_postings: Job[];
}

export function CertificationDetailPage() {
  const { user, savedItems, toggleSavedItem, openAuthModal } = useOutletContext<{
    user: User | null;
    savedItems: SavedItems;
    toggleSavedItem: (itemType: "certification", itemId: number) => Promise<boolean>;
    openAuthModal: () => void;
  }>();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cert, setCert] = useState<CertificationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Certification ID not found");
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/api/certifications/${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Certification not found");
        return res.json();
      })
      .then((data) => {
        console.log("CERTIFICATION DETAIL:", data);
        setCert(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching certification detail:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleSaveCertification = async () => {
    if (!cert) {
      return;
    }

    if (!user) {
      openAuthModal();
      return;
    }

    try {
      const saved = await toggleSavedItem("certification", cert.id);
      toast.success(saved ? "Certification saved." : "Certification removed from saved items.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update saved certifications");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d694f]"></div>
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-muted-foreground mb-4">
          {error || "Certification not found"}
        </p>
        <Button onClick={() => navigate("/certifications")}>
          Back to Certifications
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Certification Header */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
        <div className="flex items-start gap-4">
          <div className="text-5xl">
            <Award className="h-12 w-12 text-[#7ebc45]" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {cert.name}
            </h1>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-4 w-4 text-gray-600" />
              <p className="text-lg font-semibold text-gray-700">
                {cert.organization}
              </p>
            </div>
            <p className="text-gray-600 text-base leading-relaxed">
              {cert.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Applicable Roles */}
          {cert.roles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-[#2d694f]" />
                  Applicable Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {cert.roles.map((role) => (
                    <Badge
                      key={role}
                      variant="secondary"
                      className="text-base py-1.5 px-3"
                    >
                      {role}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Related Job Postings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[#2d694f]" />
                Related Job Postings
              </CardTitle>
              <p className="text-sm font-medium text-gray-600 mt-2">
                {cert.job_postings.length} job{cert.job_postings.length !== 1 ? "s" : ""} available
              </p>
            </CardHeader>
            <CardContent>
              {cert.job_postings.length === 0 ? (
                <p className="text-gray-500">
                  No active job postings requiring this certification at this time.
                </p>
              ) : (
                <div className="space-y-4">
                  {cert.job_postings.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 border rounded-lg hover:border-[#2d694f] transition-colors cursor-pointer"
                      onClick={() => navigate(`/jobs?job=${job.id}`)}
                    >
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {job.title}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{job.company.name}</span>
                        <span>{job.location}</span>
                        <span>Posted: {new Date(job.date_posted).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Issuing Organization
                </p>
                <p className="text-gray-900 font-semibold">
                  {cert.organization}
                </p>
              </div>
              {cert.official_url && (
                <Button
                  asChild
                  className="w-full bg-[#2d694f] hover:bg-[#274c37]"
                >
                  <a href={cert.official_url} target="_blank" rel="noopener noreferrer">
                    Official Certification Page
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Number of Roles
                </p>
                <p className="text-gray-900 font-semibold">
                  {cert.roles.length}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Active Job Postings
                </p>
                <p className="text-gray-900 font-semibold">
                  {cert.job_postings.length}
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full rounded-none border-[#2d694f] text-[#2d694f] hover:bg-white hover:text-[#274c37]"
                onClick={handleSaveCertification}
              >
                <Bookmark className="mr-2 h-4 w-4" />
                {savedItems.certificationIds.includes(cert.id) ? "Saved Certification" : "Save Certification"}
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-none border-[#2d694f] text-[#2d694f] hover:bg-white hover:text-[#274c37]"
                onClick={() => navigate("/certifications")}
              >
                View All Certifications
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

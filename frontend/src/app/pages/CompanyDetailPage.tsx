import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Star, MapPin, Users, ExternalLink, Briefcase, DollarSign, ArrowLeft, Award, Building2, Bookmark } from "lucide-react";
import { ReviewSubmitModal } from "../components/ReviewSubmitModal";
import { SavedItems } from "../types/user";
import { toast } from "sonner";

interface UserContext {
  user: {
    id?: string;
    name?: string;
  } | null;
  savedItems: SavedItems;
  toggleSavedItem: (itemType: "company", itemId: number) => Promise<boolean>;
  openAuthModal: () => void;
}

interface CompanyReview {
  id: number;
  role: string;
  rating: number;
  pros: string;
  cons: string;
  interview_process: string;
  recommendation: string;
  skills_used: string[];
  date_posted: string;
}

interface CompanyJob {
  id: string;
  title: string;
  location: string;
  experience_level: string;
  position_type: string;
  salary_range: string;
  date_posted: string;
  roles: string[];
  certifications: string[];
}

interface CompanyDetail {
  id: number;
  name: string;
  location: string;
  industry: string;
  size: string;
  website: string;
  description: string;
  avg_rating: number;
  review_count: number;
  job_count: number;
  open_roles: string[];
  certifications: string[];
  salary_summary: {
    avg_midpoint: number;
    min_rate: number;
    max_rate: number;
  };
  jobs: CompanyJob[];
  reviews: CompanyReview[];
  alumni: {
    id: number;
    name: string;
    role: string;
    graduation_year: number;
    headline: string;
    is_mentor: boolean;
    open_to_questions: boolean;
    linkedin_url: string;
  }[];
}

export function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, savedItems, toggleSavedItem, openAuthModal } = useOutletContext<UserContext>();
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("Company not found");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    fetch(`http://127.0.0.1:8000/api/companies/${id}/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load company");
        }
        return res.json();
      })
      .then((data: CompanyDetail) => {
        setCompany(data);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const ratingDistribution = useMemo(() => {
    if (!company) {
      return [];
    }

    return [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: company.reviews.filter((review) => Math.round(review.rating) === rating).length,
    }));
  }, [company]);

  const reviewCompany = useMemo(() => {
    if (!company) {
      return null;
    }

    const internshipRoles = company.jobs.map((job) => job.title);
    return {
      id: company.id,
      name: company.name,
      internshipRoles: internshipRoles.length ? internshipRoles : company.open_roles,
    };
  }, [company]);

  const alumniPreview = useMemo(() => company?.alumni.slice(0, 3) ?? [], [company]);

  const handleSaveCompany = async () => {
    if (!company) {
      return;
    }

    if (!user) {
      openAuthModal();
      return;
    }

    try {
      const saved = await toggleSavedItem("company", company.id);
      toast.success(saved ? "Company saved." : "Company removed from saved items.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update saved companies");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#2d694f]" />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-[#5f6368]">{error || "Company not found"}</p>
        <Link to="/companies">
          <Button className="mt-4 rounded-none bg-[#2d694f] hover:bg-[#274c37]">Back to Companies</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 rounded-none px-0 text-[#2d694f] hover:bg-white hover:text-[#274c37]"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="mb-8 border border-[#d5d8db] bg-white p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center border border-[#2d694f] bg-white">
              <Building2 className="h-8 w-8 text-[#2d694f]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#2d694f]">{company.name}</h1>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-[#5f6368]">
                <span className="inline-flex items-center gap-2 border border-[#d5d8db] px-3 py-2">
                  <MapPin className="h-4 w-4 text-[#2d694f]" />
                  {company.location}
                </span>
                {company.size && (
                  <span className="inline-flex items-center gap-2 border border-[#d5d8db] px-3 py-2">
                    <Users className="h-4 w-4 text-[#2d694f]" />
                    {company.size}
                  </span>
                )}
                {company.industry && <span className="border border-[#d5d8db] px-3 py-2">{company.industry}</span>}
              </div>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[#5f6368]">{company.description}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {company.website && (
              <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full rounded-none border-[#2d694f] text-[#2d694f] hover:bg-white hover:text-[#274c37]">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Website
                </Button>
              </a>
            )}
            <Button variant="outline" onClick={handleSaveCompany} className="w-full rounded-none border-[#2d694f] text-[#2d694f] hover:bg-white hover:text-[#274c37]">
              <Bookmark className="mr-2 h-4 w-4" />
              {savedItems.companyIds.includes(company.id) ? "Saved Company" : "Save Company"}
            </Button>
            {user && reviewCompany && (
              <Button onClick={() => setReviewModalOpen(true)} className="rounded-none bg-[#2d694f] hover:bg-[#274c37]">
                Write a Review
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="rounded-none border border-[#d5d8db] shadow-none">
          <CardContent className="pt-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#2d694f]">Average Rating</p>
            <p className="mt-2 text-4xl font-bold text-[#2d694f]">{company.avg_rating.toFixed(1)}</p>
          </CardContent>
        </Card>
        <Card className="rounded-none border border-[#d5d8db] shadow-none">
          <CardContent className="pt-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#2d694f]">Published Reviews</p>
            <p className="mt-2 text-4xl font-bold text-[#2d694f]">{company.review_count}</p>
          </CardContent>
        </Card>
        <Card className="rounded-none border border-[#d5d8db] shadow-none">
          <CardContent className="pt-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#2d694f]">Open Roles</p>
            <p className="mt-2 text-4xl font-bold text-[#2d694f]">{company.job_count}</p>
          </CardContent>
        </Card>
        <Card className="rounded-none border border-[#d5d8db] shadow-none">
          <CardContent className="pt-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#2d694f]">Average Pay Midpoint</p>
            <p className="mt-2 text-4xl font-bold text-[#2d694f]">
              {company.salary_summary.avg_midpoint ? `$${company.salary_summary.avg_midpoint}` : "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.4fr)_360px]">
        <div className="space-y-8">
          <Card className="rounded-none border border-[#d5d8db] shadow-none">
            <CardHeader>
              <CardTitle className="text-[#2d694f]">Ratings and Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="border border-[#d5d8db] p-6 text-center">
                  <div className="text-5xl font-bold text-[#2d694f]">{company.avg_rating.toFixed(1)}</div>
                  <div className="mt-3 flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`h-5 w-5 ${index < Math.round(company.avg_rating) ? "fill-[#7ebc45] text-[#7ebc45]" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-[#5f6368]">{company.review_count} published reviews</p>
                </div>
                <div className="space-y-3">
                  {ratingDistribution.map((distribution) => (
                    <div key={distribution.rating} className="grid grid-cols-[48px_minmax(0,1fr)_32px] items-center gap-3">
                      <span className="text-sm text-[#3d4348]">{distribution.rating} star</span>
                      <div className="h-3 bg-[#edf1ee]">
                        <div
                          className="h-full bg-[#2d694f]"
                          style={{
                            width: company.review_count ? `${(distribution.count / company.review_count) * 100}%` : "0%",
                          }}
                        />
                      </div>
                      <span className="text-sm text-[#5f6368]">{distribution.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="mb-4 text-2xl font-bold text-[#2d694f]">Student Reviews</h2>
            {company.reviews.length === 0 ? (
              <Card className="rounded-none border border-[#d5d8db] shadow-none">
                <CardContent className="py-12 text-center text-[#5f6368]">
                  No reviews are published for this employer yet.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {company.reviews.map((review) => (
                  <Card key={review.id} className="rounded-none border border-[#d5d8db] shadow-none">
                    <CardHeader>
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <CardTitle className="text-lg text-[#2d694f]">{review.role}</CardTitle>
                          <p className="mt-2 text-sm text-[#5f6368]">
                            Posted {new Date(review.date_posted).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-[#2d694f]">
                          <Star className="h-5 w-5 fill-[#7ebc45] text-[#7ebc45]" />
                          <span className="text-lg font-semibold">{review.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-[#5f6368]">
                      <div>
                        <p className="mb-1 font-semibold text-[#3d4348]">Pros</p>
                        <p>{review.pros}</p>
                      </div>
                      <div>
                        <p className="mb-1 font-semibold text-[#3d4348]">Cons</p>
                        <p>{review.cons}</p>
                      </div>
                      <div>
                        <p className="mb-1 font-semibold text-[#3d4348]">Interview Process</p>
                        <p>{review.interview_process}</p>
                      </div>
                      <div>
                        <p className="mb-1 font-semibold text-[#3d4348]">Recommendation</p>
                        <p>{review.recommendation}</p>
                      </div>
                      {review.skills_used.length > 0 && (
                        <div>
                          <p className="mb-2 font-semibold text-[#3d4348]">Skills Used</p>
                          <div className="flex flex-wrap gap-2">
                            {review.skills_used.map((skill) => (
                              <Badge key={skill} className="rounded-none border border-[#7ebc45] bg-white text-[#2d694f]">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="rounded-none border border-[#d5d8db] shadow-none">
            <CardHeader>
              <CardTitle className="text-[#2d694f]">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-[#5f6368]">
              <div className="flex items-center justify-between">
                <span>Current roles</span>
                <span className="font-semibold text-[#3d4348]">{company.job_count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Lowest current rate</span>
                <span className="font-semibold text-[#3d4348]">
                  {company.salary_summary.min_rate ? `$${company.salary_summary.min_rate}/hr` : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Highest current rate</span>
                <span className="font-semibold text-[#3d4348]">
                  {company.salary_summary.max_rate ? `$${company.salary_summary.max_rate}/hr` : "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border border-[#d5d8db] shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center text-[#2d694f]">
                <Briefcase className="mr-2 h-5 w-5" />
                Current Roles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {company.jobs.map((job) => (
                <div key={job.id} className="border border-[#d5d8db] p-4">
                  <p className="font-semibold text-[#3d4348]">{job.title}</p>
                  <p className="mt-1 text-sm text-[#5f6368]">{job.salary_range || "Pay not listed"}</p>
                  <p className="mt-1 text-sm text-[#5f6368]">{job.location}</p>
                </div>
              ))}
              <Link to="/jobs">
                <Button variant="outline" className="mt-2 w-full rounded-none border-[#2d694f] text-[#2d694f] hover:bg-white hover:text-[#274c37]">
                  View Job Board
                </Button>
              </Link>
            </CardContent>
          </Card>

          {company.certifications.length > 0 && (
            <Card className="rounded-none border border-[#d5d8db] shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center text-[#2d694f]">
                  <Award className="mr-2 h-5 w-5" />
                  Certifications Seen In Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {company.certifications.map((certification) => (
                    <Badge key={certification} className="rounded-none border border-[#7ebc45] bg-white text-[#2d694f]">
                      {certification}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {company.alumni.length > 0 && (
            <Card className="rounded-none border border-[#d5d8db] shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center text-[#2d694f]">
                  <Users className="mr-2 h-5 w-5" />
                  CSU Alumni At This Employer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alumniPreview.map((alumni) => (
                  <div key={alumni.id} className="border border-[#d5d8db] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#3d4348]">{alumni.name}</p>
                        <p className="mt-1 text-sm text-[#5f6368]">{alumni.role}</p>
                        <p className="mt-1 text-sm text-[#5f6368]">Class of {alumni.graduation_year}</p>
                        {alumni.headline && <p className="mt-2 text-sm text-[#5f6368]">{alumni.headline}</p>}
                      </div>
                      <div className="flex shrink-0 flex-col gap-2">
                        {alumni.is_mentor && (
                          <Badge className="rounded-none border border-[#7ebc45] bg-white text-[#2d694f]">
                            Mentor
                          </Badge>
                        )}
                        {alumni.open_to_questions && (
                          <Badge className="rounded-none border border-[#7ebc45] bg-white text-[#2d694f]">
                            Open to questions
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                      <Link to={`/alumni/${alumni.id}`}>
                        <Button variant="outline" className="w-full rounded-none border-[#2d694f] text-[#2d694f] hover:bg-white hover:text-[#274c37]">
                          View Alumni Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                {company.alumni.length > 3 && (
                  <Link to={`/alumni?company=${company.id}`}>
                    <Button className="w-full rounded-none bg-[#2d694f] hover:bg-[#274c37]">
                      View More Alumni
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {user && reviewCompany && (
        <ReviewSubmitModal
          open={reviewModalOpen}
          onOpenChange={setReviewModalOpen}
          company={reviewCompany}
          user={user}
        />
      )}
    </div>
  );
}

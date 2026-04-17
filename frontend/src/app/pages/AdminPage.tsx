import { useEffect, useState } from "react";
import { useOutletContext, Navigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Star, CheckCircle, XCircle, Clock, Building2, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { User } from "../types/user";

interface ReviewRecord {
  id: number;
  company: {
    id: number;
    name: string;
  };
  role: string;
  rating: number;
  pros: string;
  cons: string;
  interview_process: string;
  recommendation: string;
  skills_used: string[];
  date_posted: string;
  reviewer: {
    name: string;
    role: string;
    graduationYear?: number | null;
  };
}

interface JobRecord {
  id: string;
  title: string;
  company: {
    id: number;
    name: string;
  };
  location: string;
  experience_level: string;
  position_type: string;
  salary_range: string;
  date_posted: string;
  roles: string[];
  certifications: string[];
  status: string;
  rejection_note: string;
}

interface AdminReviewsResponse {
  pending: ReviewRecord[];
  approved: ReviewRecord[];
  stats: {
    pending_reviews: number;
    approved_reviews: number;
    total_companies: number;
  };
}

interface AdminJobsResponse {
  published: JobRecord[];
  rejected: JobRecord[];
}

export function AdminPage() {
  const { user, loadingUser } = useOutletContext<{ user: User | null; loadingUser: boolean }>();
  const [pendingReviews, setPendingReviews] = useState<ReviewRecord[]>([]);
  const [approvedReviews, setApprovedReviews] = useState<ReviewRecord[]>([]);
  const [publishedJobs, setPublishedJobs] = useState<JobRecord[]>([]);
  const [rejectedJobs, setRejectedJobs] = useState<JobRecord[]>([]);
  const [stats, setStats] = useState<AdminReviewsResponse["stats"] | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const [reviewsResponse, jobsResponse] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/admin/reviews/", {
          credentials: "include",
        }),
        fetch("http://127.0.0.1:8000/api/admin/jobs/", {
          credentials: "include",
        }),
      ]);

      const reviewsData: AdminReviewsResponse = await reviewsResponse.json();
      const jobsData: AdminJobsResponse = await jobsResponse.json();

      setPendingReviews(reviewsData.pending);
      setApprovedReviews(reviewsData.approved);
      setStats(reviewsData.stats);
      setPublishedJobs(jobsData.published);
      setRejectedJobs(jobsData.rejected);
    } catch {
      setPendingReviews([]);
      setApprovedReviews([]);
      setPublishedJobs([]);
      setRejectedJobs([]);
      setStats({
        pending_reviews: 0,
        approved_reviews: 0,
        total_companies: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      loadDashboard();
    } else {
      setLoading(false);
    }
  }, [user?.role]);

  if (loadingUser) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#2d694f]" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const handleReviewModeration = async (reviewId: number, action: "approve" | "reject") => {
    const response = await fetch(`http://127.0.0.1:8000/api/admin/reviews/${reviewId}/moderate/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action }),
    });

    if (!response.ok) {
      toast.error("Unable to update review");
      return;
    }

    toast.success(action === "approve" ? "Review approved and published" : "Review rejected");
    loadDashboard();
  };

  const handleJobModeration = async (jobId: string, action: "reject" | "restore") => {
    const response = await fetch(`http://127.0.0.1:8000/api/admin/jobs/${jobId}/moderate/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action,
        note: action === "reject" ? "Returned to employer portal by admin review." : "",
      }),
    });

    if (!response.ok) {
      toast.error("Unable to update job posting");
      return;
    }

    toast.success(
      action === "reject"
        ? "Job posting removed from the public board and returned to the employer portal."
        : "Job posting restored to the public board."
    );
    loadDashboard();
  };

  const dashboardStats = [
    {
      label: "Pending Reviews",
      value: stats?.pending_reviews ?? 0,
      icon: Clock,
      color: "text-[#274c37]",
    },
    {
      label: "Approved Reviews",
      value: stats?.approved_reviews ?? 0,
      icon: CheckCircle,
      color: "text-[#2d694f]",
    },
    {
      label: "Live Job Postings",
      value: publishedJobs.length,
      icon: Briefcase,
      color: "text-[#7ebc45]",
    },
    {
      label: "Total Companies",
      value: stats?.total_companies ?? 0,
      icon: Building2,
      color: "text-[#2d694f]",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#2d694f]">Admin Dashboard</h1>
        <p className="mt-2 text-lg text-[#5f6368]">Manage review submissions and current job postings.</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="rounded-none border border-[#d5d8db] shadow-none">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#5f6368]">{stat.label}</p>
                    <p className="mt-1 text-3xl font-bold text-[#2d694f]">{stat.value}</p>
                  </div>
                  <Icon className={`h-12 w-12 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="reviews">
        <TabsList className="grid w-full grid-cols-2 rounded-none">
          <TabsTrigger value="reviews">Review Moderation</TabsTrigger>
          <TabsTrigger value="jobs">Job Posting Moderation</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="mt-6">
          <Card className="rounded-none border border-[#d5d8db] shadow-none">
            <CardHeader>
              <CardTitle className="text-[#2d694f]">Review Moderation</CardTitle>
              <CardDescription>Review and approve student internship, co-op, and early-career reviews.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pending">
                <TabsList className="grid w-full grid-cols-2 rounded-none">
                  <TabsTrigger value="pending">Pending ({pendingReviews.length})</TabsTrigger>
                  <TabsTrigger value="approved">Approved ({approvedReviews.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="pending" className="mt-6 space-y-4">
                  {loading ? (
                    <p className="text-sm text-[#5f6368]">Loading reviews...</p>
                  ) : pendingReviews.length === 0 ? (
                    <div className="py-12 text-center">
                      <CheckCircle className="mx-auto mb-4 h-12 w-12 text-[#2d694f]" />
                      <p className="text-[#5f6368]">No pending reviews.</p>
                    </div>
                  ) : (
                    pendingReviews.map((review) => (
                      <Card key={review.id} className="rounded-none border border-[#274c37] bg-white shadow-none">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <CardTitle className="text-lg text-[#2d694f]">{review.company.name}</CardTitle>
                              <CardDescription>{review.role}</CardDescription>
                              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[#5f6368]">
                                <span>{review.reviewer.name}</span>
                                <span>{review.reviewer.role}</span>
                                {review.reviewer.graduationYear && <span>Class of {review.reviewer.graduationYear}</span>}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-[#2d694f]">
                              <Star className="h-5 w-5 fill-[#7ebc45] text-[#7ebc45]" />
                              <span className="text-xl font-semibold">{review.rating.toFixed(1)}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <p className="mb-1 text-sm font-semibold text-[#3d4348]">Pros</p>
                            <p className="text-sm text-[#5f6368]">{review.pros}</p>
                          </div>
                          <div>
                            <p className="mb-1 text-sm font-semibold text-[#3d4348]">Cons</p>
                            <p className="text-sm text-[#5f6368]">{review.cons}</p>
                          </div>
                          <div>
                            <p className="mb-1 text-sm font-semibold text-[#3d4348]">Interview</p>
                            <p className="text-sm text-[#5f6368]">{review.interview_process}</p>
                          </div>
                          <div className="flex gap-3 pt-4">
                            <Button onClick={() => handleReviewModeration(review.id, "approve")} className="flex-1 rounded-none bg-[#2d694f] hover:bg-[#274c37]">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button variant="outline" onClick={() => handleReviewModeration(review.id, "reject")} className="flex-1 rounded-none border-[#274c37] text-[#274c37] hover:bg-white">
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
                <TabsContent value="approved" className="mt-6 space-y-4">
                  {approvedReviews.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-[#5f6368]">No approved reviews yet.</p>
                    </div>
                  ) : (
                    approvedReviews.slice(0, 10).map((review) => (
                      <Card key={review.id} className="rounded-none border border-[#2d694f] bg-white shadow-none">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <CardTitle className="text-lg text-[#2d694f]">{review.company.name}</CardTitle>
                              <CardDescription>{review.role}</CardDescription>
                            </div>
                            <div className="flex items-center gap-1 text-[#2d694f]">
                              <Star className="h-5 w-5 fill-[#7ebc45] text-[#7ebc45]" />
                              <span className="text-xl font-semibold">{review.rating.toFixed(1)}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-[#5f6368] line-clamp-2">{review.pros}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="mt-6">
          <Card className="rounded-none border border-[#d5d8db] shadow-none">
            <CardHeader>
              <CardTitle className="text-[#2d694f]">Job Posting Moderation</CardTitle>
              <CardDescription>Reject a live posting to remove it from the public board and return it to the employer portal queue.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="live">
                <TabsList className="grid w-full grid-cols-2 rounded-none">
                  <TabsTrigger value="live">Live ({publishedJobs.length})</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected ({rejectedJobs.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="live" className="mt-6 space-y-4">
                  {publishedJobs.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-[#5f6368]">No live job postings.</p>
                    </div>
                  ) : (
                    publishedJobs.map((job) => (
                      <Card key={job.id} className="rounded-none border border-[#d5d8db] bg-white shadow-none">
                        <CardHeader>
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                              <CardTitle className="text-lg text-[#2d694f]">{job.title}</CardTitle>
                              <CardDescription>{job.company.name}</CardDescription>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <Badge className="rounded-none border border-[#2d694f] bg-white text-[#2d694f]">{job.experience_level}</Badge>
                                <Badge className="rounded-none border border-[#7ebc45] bg-white text-[#2d694f]">{job.salary_range || "Pay not listed"}</Badge>
                              </div>
                            </div>
                            <Button variant="outline" onClick={() => handleJobModeration(job.id, "reject")} className="rounded-none border-[#274c37] text-[#274c37] hover:bg-white">
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject Posting
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="text-sm text-[#5f6368]">
                          <p>{job.location}</p>
                          {job.roles.length > 0 && <p className="mt-2">Roles: {job.roles.join(", ")}</p>}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
                <TabsContent value="rejected" className="mt-6 space-y-4">
                  {rejectedJobs.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-[#5f6368]">No rejected postings.</p>
                    </div>
                  ) : (
                    rejectedJobs.map((job) => (
                      <Card key={job.id} className="rounded-none border border-[#274c37] bg-white shadow-none">
                        <CardHeader>
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                              <CardTitle className="text-lg text-[#2d694f]">{job.title}</CardTitle>
                              <CardDescription>{job.company.name}</CardDescription>
                              <p className="mt-2 text-sm text-[#5f6368]">
                                {job.rejection_note || "Returned to employer portal."}
                              </p>
                            </div>
                            <Button onClick={() => handleJobModeration(job.id, "restore")} className="rounded-none bg-[#2d694f] hover:bg-[#274c37]">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Restore Posting
                            </Button>
                          </div>
                        </CardHeader>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

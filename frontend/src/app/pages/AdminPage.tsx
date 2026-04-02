import { useState } from "react";
import { useOutletContext, Navigate } from "react-router";
import { mockReviews, mockCompanies, User } from "../data/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Star, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function AdminPage() {
  const { user } = useOutletContext<{ user: User | null }>();
  const [pendingReviews, setPendingReviews] = useState(
    mockReviews.filter((r) => !r.isApproved)
  );
  const [approvedReviews, setApprovedReviews] = useState(
    mockReviews.filter((r) => r.isApproved)
  );

  // If not admin, redirect to home
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const handleApprove = (reviewId: string) => {
    setPendingReviews(pendingReviews.filter((r) => r.id !== reviewId));
    const review = mockReviews.find((r) => r.id === reviewId);
    if (review) {
      review.isApproved = true;
      setApprovedReviews([...approvedReviews, review]);
    }
    toast.success("Review approved and published");
  };

  const handleReject = (reviewId: string) => {
    setPendingReviews(pendingReviews.filter((r) => r.id !== reviewId));
    toast.success("Review rejected");
  };

  const stats = [
    {
      label: "Pending Reviews",
      value: pendingReviews.length,
      icon: Clock,
      color: "text-orange-600",
    },
    {
      label: "Approved Reviews",
      value: approvedReviews.length,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Total Companies",
      value: mockCompanies.length,
      icon: AlertCircle,
      color: "text-blue-600",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Manage reviews and moderate content
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl mt-1">{stat.value}</p>
                  </div>
                  <Icon className={`h-12 w-12 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Review Management */}
      <Card>
        <CardHeader>
          <CardTitle>Review Moderation</CardTitle>
          <CardDescription>
            Review and approve student internship reviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pending">
                Pending ({pendingReviews.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedReviews.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="space-y-4 mt-6">
              {pendingReviews.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-4" />
                  <p className="text-muted-foreground">
                    No pending reviews. Great job keeping up!
                  </p>
                </div>
              ) : (
                pendingReviews.map((review) => {
                  const company = mockCompanies.find((c) => c.id === review.companyId);
                  return (
                    <Card key={review.id} className="border-orange-200 bg-orange-50/30">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="text-3xl">{company?.logo}</div>
                            <div>
                              <CardTitle className="text-lg">
                                {company?.name}
                              </CardTitle>
                              <CardDescription>
                                {review.internshipRole}
                              </CardDescription>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                <span>{review.userName}</span>
                                <span>•</span>
                                <span>{review.userRole}</span>
                                <span>•</span>
                                <span>
                                  {review.semester} {review.year}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-xl">
                              {review.rating}.0
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold mb-1">Pros</p>
                          <p className="text-sm text-muted-foreground">{review.pros}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-1">Cons</p>
                          <p className="text-sm text-muted-foreground">{review.cons}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-1">Interview</p>
                          <p className="text-sm text-muted-foreground">
                            {review.interview}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-1">Recommendation</p>
                          <p className="text-sm text-muted-foreground">
                            {review.recommendation}
                          </p>
                        </div>
                        {review.skills.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold mb-2">Skills</p>
                            <div className="flex flex-wrap gap-2">
                              {review.skills.map((skill) => (
                                <Badge key={skill} variant="outline">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex space-x-3 pt-4">
                          <Button
                            onClick={() => handleApprove(review.id)}
                            className="flex-1"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleReject(review.id)}
                            className="flex-1"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>
            <TabsContent value="approved" className="space-y-4 mt-6">
              {approvedReviews.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No approved reviews yet.</p>
                </div>
              ) : (
                approvedReviews
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                  )
                  .slice(0, 10)
                  .map((review) => {
                    const company = mockCompanies.find(
                      (c) => c.id === review.companyId
                    );
                    return (
                      <Card key={review.id} className="border-green-200 bg-green-50/30">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <div className="text-3xl">{company?.logo}</div>
                              <div>
                                <CardTitle className="text-lg">
                                  {company?.name}
                                </CardTitle>
                                <CardDescription>
                                  {review.internshipRole}
                                </CardDescription>
                                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                  <span>{review.userName}</span>
                                  <span>•</span>
                                  <span>
                                    {review.semester} {review.year}
                                  </span>
                                  <Badge variant="outline" className="ml-2">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Approved
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold text-xl">
                                {review.rating}.0
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {review.pros}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })
              )}
              {approvedReviews.length > 10 && (
                <p className="text-center text-sm text-muted-foreground">
                  Showing 10 most recent approved reviews
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

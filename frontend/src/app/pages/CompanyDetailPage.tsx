import { useParams, Link, useOutletContext, useNavigate } from "react-router";
import { mockCompanies, mockReviews, mockSalaryData, User } from "../data/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Progress } from "../components/ui/progress";
import { Star, MapPin, Users, ExternalLink, Briefcase, DollarSign, TrendingUp, ArrowLeft, Award, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import { ReviewSubmitModal } from "../components/ReviewSubmitModal";

export function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useOutletContext<{ user: User | null }>();
  const navigate = useNavigate();
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const company = mockCompanies.find((c) => c.id === id);
  const companyReviews = mockReviews.filter((r) => r.companyId === id && r.isApproved);
  const companySalaries = mockSalaryData.filter((s) => s.companyId === id && s.isVerified);

  if (!company) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-muted-foreground">Company not found</p>
        <Link to="/companies">
          <Button className="mt-4">Back to Companies</Button>
        </Link>
      </div>
    );
  }

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: companyReviews.filter((r) => r.rating === rating).length,
    percentage:
      companyReviews.length > 0
        ? (companyReviews.filter((r) => r.rating === rating).length / companyReviews.length) * 100
        : 0,
  }));

  // Calculate average salary
  const avgSalary =
    companySalaries.length > 0
      ? companySalaries.reduce((sum, s) => sum + s.hourlyRate, 0) / companySalaries.length
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Company Header */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="text-6xl">{company.logo}</div>
            <div>
              <h1 className="text-3xl mb-2">{company.name}</h1>
              <div className="flex flex-wrap gap-3 mb-3">
                <Badge variant="secondary" className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {company.location}
                </Badge>
                <Badge variant="secondary" className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {company.size}
                </Badge>
                <Badge variant="secondary">{company.industry}</Badge>
              </div>
              <p className="text-muted-foreground">{company.description}</p>
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <a
              href={`https://${company.website}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Website
              </Button>
            </a>
            {user && (
              <Button onClick={() => setReviewModalOpen(true)}>
                Write a Review
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Ratings Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Ratings & Reviews</CardTitle>
              <CardDescription>
                Based on {companyReviews.length} verified CSU IS student reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-5xl mb-2">{company.avgRating.toFixed(1)}</div>
                  <div className="flex items-center justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(company.avgRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {companyReviews.length} reviews
                  </p>
                </div>
                <div className="space-y-2">
                  {ratingDistribution.map((dist) => (
                    <div key={dist.rating} className="flex items-center space-x-3">
                      <span className="text-sm w-8">{dist.rating} ★</span>
                      <Progress value={dist.percentage} className="flex-1" />
                      <span className="text-sm text-muted-foreground w-8">
                        {dist.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <div>
            <h2 className="text-2xl mb-4">Student Reviews</h2>
            {companyReviews.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No reviews yet. Be the first to share your experience!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {companyReviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {review.internshipRole}
                          </CardTitle>
                          <CardDescription>
                            {review.userName} • {review.userRole}
                          </CardDescription>
                          <p className="text-sm text-muted-foreground mt-1">
                            {review.semester} {review.year}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-lg">{review.rating}.0</span>
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
                        <p className="text-sm font-semibold mb-1">Interview Process</p>
                        <p className="text-sm text-muted-foreground">{review.interview}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-1">Recommendation</p>
                        <p className="text-sm text-muted-foreground">
                          {review.recommendation}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-2">Skills Used</p>
                        <div className="flex flex-wrap gap-2">
                          {review.skills.map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">CSU Hires</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-semibold">{company.csuHires}</span>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Reviews</span>
                <span className="font-semibold">{companyReviews.length}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg. Salary</span>
                <span className="font-semibold">
                  {avgSalary > 0 ? `$${avgSalary.toFixed(0)}/hr` : "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Internship Roles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Internship Roles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {company.internshipRoles.map((role) => (
                  <div
                    key={role}
                    className="flex items-center p-2 rounded-md hover:bg-gray-50"
                  >
                    <span className="text-sm">{role}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Certifications & Training */}
          {company.preferredCertifications && (
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <Award className="h-5 w-5 mr-2" />
                  Certifications & Training
                </CardTitle>
                <CardDescription>
                  📚 Boost your chances with these credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Required */}
                {company.preferredCertifications.required.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <CheckCircle2 className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-bold text-red-700 uppercase tracking-wide">
                        Required
                      </span>
                    </div>
                    <div className="space-y-2 ml-6">
                      {company.preferredCertifications.required.map((cert) => (
                        <div
                          key={cert}
                          className="flex items-start space-x-2 bg-white p-3 rounded-lg border-2 border-red-200 shadow-sm"
                        >
                          <CheckCircle2 className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-900">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preferred */}
                {company.preferredCertifications.preferred.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Award className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-bold text-green-700 uppercase tracking-wide">
                        Preferred
                      </span>
                    </div>
                    <div className="space-y-2 ml-6">
                      {company.preferredCertifications.preferred.map((cert) => (
                        <div
                          key={cert}
                          className="flex items-start space-x-2 bg-white p-3 rounded-lg border-2 border-green-200 shadow-sm"
                        >
                          <Award className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-800">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Helpful */}
                {company.preferredCertifications.helpful.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Circle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-bold text-blue-700 uppercase tracking-wide">
                        Helpful
                      </span>
                    </div>
                    <div className="space-y-2 ml-6">
                      {company.preferredCertifications.helpful.map((cert) => (
                        <div
                          key={cert}
                          className="flex items-start space-x-2 bg-white p-3 rounded-lg border border-blue-200 shadow-sm"
                        >
                          <Circle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-900 leading-relaxed">
                    💡 <strong>Pro Tip:</strong> Many of these certifications can be obtained through LinkedIn Learning, Coursera, or free resources. Check CSU library for access!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Salary Data */}
          {companySalaries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Salary Data
                </CardTitle>
                <CardDescription>Reported by CSU students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {companySalaries.slice(0, 5).map((salary) => (
                    <div key={salary.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{salary.role}</span>
                        <span className="font-semibold">${salary.hourlyRate}/hr</span>
                      </div>
                      <p className="text-xs text-muted-foreground capitalize">
                        {salary.internshipType} • {salary.year}
                      </p>
                      {salary.id !== companySalaries[Math.min(4, companySalaries.length - 1)].id && (
                        <Separator className="mt-2" />
                      )}
                    </div>
                  ))}
                  {companySalaries.length > 5 && (
                    <Link to="/salaries">
                      <Button variant="ghost" size="sm" className="w-full mt-2">
                        View All Salaries
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {user && (
        <ReviewSubmitModal
          open={reviewModalOpen}
          onOpenChange={setReviewModalOpen}
          company={company}
          user={user}
        />
      )}
    </div>
  );
}
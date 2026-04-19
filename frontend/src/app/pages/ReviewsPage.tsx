import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { PageIntro } from "../components/PageIntro";
import { Search, MessageSquare, Star, Building2, ArrowRight } from "lucide-react";

interface Review {
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
}

interface CompanySummary {
  id: number;
  name: string;
  location: string;
  avg_rating: number;
  review_count: number;
  job_count: number;
  open_roles: string[];
  job_titles: string[];
}

export function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    Promise.all([
      fetch("http://127.0.0.1:8000/api/reviews/").then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load reviews");
        }
        return res.json();
      }),
      fetch("http://127.0.0.1:8000/api/companies/").then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load company ratings");
        }
        return res.json();
      }),
    ])
      .then(([reviewsData, companiesData]: [Review[], CompanySummary[]]) => {
        setReviews(reviewsData);
        setCompanies(companiesData);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredReviews = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return [...reviews]
      .filter((review) => {
        const matchesSearch =
          !query ||
          review.company.name.toLowerCase().includes(query) ||
          review.role.toLowerCase().includes(query) ||
          review.pros.toLowerCase().includes(query) ||
          review.cons.toLowerCase().includes(query) ||
          review.recommendation.toLowerCase().includes(query) ||
          review.skills_used.some((skill) => skill.toLowerCase().includes(query));

        const matchesRating =
          ratingFilter === "all" || review.rating >= Number(ratingFilter);

        return matchesSearch && matchesRating;
      })
      .sort(
        (a, b) =>
          new Date(b.date_posted).getTime() - new Date(a.date_posted).getTime()
      );
  }, [reviews, searchQuery, ratingFilter]);

  const topRatedCompanies = useMemo(() => {
    return [...companies]
      .filter((company) => company.review_count > 0)
      .sort((a, b) => {
        if (b.avg_rating !== a.avg_rating) {
          return b.avg_rating - a.avg_rating;
        }
        return b.review_count - a.review_count;
      })
      .slice(0, 3);
  }, [companies]);

  const averageRating = useMemo(() => {
    if (!reviews.length) {
      return 0;
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  }, [reviews]);

  const clearFilters = () => {
    setSearchQuery("");
    setRatingFilter("all");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageIntro
        badge="Student experience feedback"
        title="Student Reviews"
        description="Read recent feedback from CSU students about internships, co-ops, and entry-level roles, and compare which employers are rated most highly."
      />

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#2d694f]" />
        </div>
      ) : error ? (
        <Card className="border border-red-200">
          <CardContent className="py-10 text-center text-red-700">{error}</CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#2d694f]">Total reviews</p>
                <p className="mt-2 text-4xl font-bold text-[#2d694f]">{reviews.length}</p>
              </CardContent>
            </Card>
            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#2d694f]">Average rating</p>
                <p className="mt-2 text-4xl font-bold text-[#2d694f]">
                  {averageRating ? averageRating.toFixed(1) : "--"}
                </p>
              </CardContent>
            </Card>
            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#2d694f]">Reviewed companies</p>
                <p className="mt-2 text-4xl font-bold text-[#2d694f]">
                  {companies.filter((company) => company.review_count > 0).length}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">Minimum rating</label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#2d694f] focus:outline-none focus:ring-2 focus:ring-[#2d694f]/20"
                  >
                    <option value="all">All ratings</option>
                    <option value="4">4.0 and up</option>
                    <option value="3">3.0 and up</option>
                    <option value="2">2.0 and up</option>
                    <option value="1">1.0 and up</option>
                  </select>
                </div>

                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full border-[#2d694f] text-[#2d694f] hover:bg-white hover:text-[#274c37]"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#2d694f]">Top-rated companies</h2>
                  <Link to="/companies">
                    <Button variant="outline" className="border-[#2d694f] text-[#2d694f] hover:bg-white hover:text-[#274c37]">
                      Company Directory
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {topRatedCompanies.map((company) => (
                    <Card key={company.id} className="border border-gray-200">
                      <CardContent className="pt-6">
                        <div className="mb-3 flex items-center justify-between">
                          <Building2 className="h-6 w-6 text-[#2d694f]" />
                          <div className="flex items-center gap-1 text-[#2d694f]">
                            <Star className="h-4 w-4 fill-[#7ebc45] text-[#7ebc45]" />
                            <span className="font-semibold">{company.avg_rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{company.name}</h3>
                        <p className="mt-1 text-sm text-gray-600">{company.location}</p>
                        <p className="mt-3 text-sm text-gray-600">
                          {company.review_count} review{company.review_count !== 1 ? "s" : ""} • {company.job_count} active role{company.job_count !== 1 ? "s" : ""}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#2d694f]">Most recent reviews</h2>
                  <p className="text-sm text-gray-600">{filteredReviews.length} matching reviews</p>
                </div>

                {filteredReviews.length === 0 ? (
                  <Card className="border border-dashed border-gray-300">
                    <CardContent className="py-12 text-center">
                      <p className="text-lg font-semibold text-gray-900">No reviews match the current filters</p>
                      <p className="mt-2 text-sm text-gray-600">Try broadening the company, rating, or search criteria.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredReviews.map((review) => (
                      <Card key={review.id} className="border border-gray-200">
                        <CardContent className="p-5 md:p-6">
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-3">
                                <h3 className="text-lg font-bold text-gray-900 md:text-xl">{review.company.name}</h3>
                                <Badge className="bg-[#2d694f] text-white">{review.role}</Badge>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">
                                Posted {new Date(review.date_posted).toLocaleDateString()}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 rounded-lg border border-[#7ebc45] px-3 py-2 text-[#2d694f]">
                              <Star className="h-5 w-5 fill-[#7ebc45] text-[#7ebc45]" />
                              <span className="text-lg font-bold">{review.rating.toFixed(1)}</span>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-x-8 gap-y-4 md:grid-cols-2">
                            <div>
                              <p className="mb-1 text-sm font-semibold text-[#2d694f]">Pros</p>
                              <p className="text-sm text-gray-600">{review.pros}</p>
                            </div>
                            <div>
                              <p className="mb-1 text-sm font-semibold text-[#274c37]">Cons</p>
                              <p className="text-sm text-gray-600">{review.cons}</p>
                            </div>
                            <div>
                              <p className="mb-1 text-sm font-semibold text-[#2d694f]">Interview Process</p>
                              <p className="text-sm text-gray-600">{review.interview_process}</p>
                            </div>
                            <div>
                              <p className="mb-1 text-sm font-semibold text-[#2d694f]">Recommendation</p>
                              <p className="text-sm text-gray-600">{review.recommendation}</p>
                            </div>
                          </div>

                          {review.skills_used.length > 0 && (
                            <div className="mt-4 border-t border-gray-100 pt-4">
                              <p className="mb-2 text-sm font-semibold text-[#2d694f]">Skills Used</p>
                              <div className="flex flex-wrap gap-2">
                                {review.skills_used.map((skill) => (
                                  <Badge key={skill} variant="outline" className="border-[#2d694f] bg-white text-[#2d694f]">
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
          </div>
        </>
      )}
    </div>
  );
}

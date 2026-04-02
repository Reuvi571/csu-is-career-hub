import { useState } from "react";
import { mockReviews, mockCompanies } from "../data/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Star, Search, MessageSquare, ThumbsUp, AlertCircle } from "lucide-react";

export function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Filter and sort reviews
  let filteredReviews = mockReviews.filter((review) => {
    if (!review.isApproved) return false;

    const company = mockCompanies.find((c) => c.id === review.companyId);
    const matchesSearch =
      review.internshipRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.pros.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.cons.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCompany =
      companyFilter === "all" || review.companyId === companyFilter;

    const matchesRating =
      ratingFilter === "all" || review.rating === parseInt(ratingFilter);

    return matchesSearch && matchesCompany && matchesRating;
  });

  // Sort reviews
  filteredReviews = filteredReviews.sort((a, b) => {
    if (sortBy === "recent")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "oldest")
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
            <MessageSquare className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-4xl">Internship Reviews</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          💬 {mockReviews.filter((r) => r.isApproved).length} verified reviews from CSU IS students
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8 border-2 border-purple-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Search className="h-5 w-5" />
            <span>Filter & Search Reviews</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="🔍 Search reviews by company, role, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="All Companies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">🏢 All Companies</SelectItem>
                  {mockCompanies
                    .filter((c) => mockReviews.some((r) => r.companyId === c.id && r.isApproved))
                    .map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">⭐ All Ratings</SelectItem>
                  <SelectItem value="5">⭐⭐⭐⭐⭐ 5 Stars</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐ 4 Stars</SelectItem>
                  <SelectItem value="3">⭐⭐⭐ 3 Stars</SelectItem>
                  <SelectItem value="2">⭐⭐ 2 Stars</SelectItem>
                  <SelectItem value="1">⭐ 1 Star</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">📅 Most Recent</SelectItem>
                  <SelectItem value="rating">⭐ Highest Rated</SelectItem>
                  <SelectItem value="oldest">🕐 Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(searchQuery || companyFilter !== "all" || ratingFilter !== "all") && (
              <div className="flex items-center space-x-2 bg-purple-50 p-3 rounded-lg">
                <span className="text-sm font-medium text-purple-700">
                  ✨ {filteredReviews.length} reviews found
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setCompanyFilter("all");
                    setRatingFilter("all");
                  }}
                  className="text-purple-700 hover:text-purple-800"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reviews */}
      {filteredReviews.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-lg font-semibold mb-2">No reviews found</p>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredReviews.map((review) => {
            const company = mockCompanies.find((c) => c.id === review.companyId);
            return (
              <Card key={review.id} className="border-2 hover:border-purple-300 transition-colors hover:shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="text-5xl">{company?.logo}</div>
                      <div>
                        <CardTitle className="text-xl flex items-center space-x-2">
                          <span>{company?.name}</span>
                        </CardTitle>
                        <CardDescription className="text-base mt-1">
                          💼 {review.internshipRole}
                        </CardDescription>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <span>👤 {review.userName}</span>
                          <span>•</span>
                          <span>{review.userRole}</span>
                          <span>•</span>
                          <span>
                            📅 {review.semester} {review.year}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2 rounded-xl">
                      <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-2xl">{review.rating}.0</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <p className="text-sm font-semibold mb-2 text-green-700 flex items-center space-x-2">
                      <ThumbsUp className="h-4 w-4" />
                      <span>Pros</span>
                    </p>
                    <p className="text-sm text-muted-foreground">{review.pros}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                    <p className="text-sm font-semibold mb-2 text-orange-700 flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>Cons</span>
                    </p>
                    <p className="text-sm text-muted-foreground">{review.cons}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm font-semibold mb-2 text-blue-700">🎯 Interview Process</p>
                    <p className="text-sm text-muted-foreground">{review.interview}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                    <p className="text-sm font-semibold mb-2 text-purple-700">💡 Recommendation</p>
                    <p className="text-sm text-muted-foreground">
                      {review.recommendation}
                    </p>
                  </div>
                  {review.skills.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2 flex items-center space-x-2">
                        <span>🛠️</span>
                        <span>Skills Used</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {review.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="bg-blue-50 border-blue-300 text-blue-700">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
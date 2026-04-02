import { useState } from "react";
import { Link } from "react-router";
import { mockCompanies } from "../data/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Star, Search, TrendingUp, MapPin, Filter, Building2 } from "lucide-react";

export function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  // Get unique industries
  const industries = Array.from(new Set(mockCompanies.map((c) => c.industry)));

  // Filter and sort companies
  let filteredCompanies = mockCompanies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.internshipRoles.some((role) =>
        role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesIndustry =
      industryFilter === "all" || company.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  // Sort companies
  filteredCompanies = filteredCompanies.sort((a, b) => {
    if (sortBy === "rating") return b.avgRating - a.avgRating;
    if (sortBy === "reviews") return b.reviewCount - a.reviewCount;
    if (sortBy === "hires") return b.csuHires - a.csuHires;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-4xl">Companies</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          🏢 Explore {mockCompanies.length}+ Cleveland-based employers hiring CSU IS students
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8 border-2 border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Filter className="h-5 w-5" />
            <span>Filter & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="🔍 Search companies, roles, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">🏭 All Industries</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">⭐ Highest Rated</SelectItem>
                  <SelectItem value="reviews">💬 Most Reviews</SelectItem>
                  <SelectItem value="hires">📈 Most CSU Hires</SelectItem>
                  <SelectItem value="name">🔤 Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(searchQuery || industryFilter !== "all") && (
              <div className="flex items-center space-x-2 bg-green-50 p-3 rounded-lg">
                <span className="text-sm font-medium text-green-700">
                  ✨ {filteredCompanies.length} companies found
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setIndustryFilter("all");
                  }}
                  className="text-green-700 hover:text-green-800"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Companies Grid */}
      {filteredCompanies.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg font-semibold mb-2">No companies found</p>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Link key={company.id} to={`/companies/${company.id}`}>
              <Card className="h-full hover:shadow-xl transition-all cursor-pointer group border-2 hover:border-blue-500">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="text-5xl group-hover:scale-110 transition-transform">{company.logo}</div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{company.name}</CardTitle>
                        <CardDescription className="text-sm flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {company.location}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="w-fit bg-blue-100 text-blue-700">
                    {company.industry}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-lg">{company.avgRating.toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground">
                          ({company.reviewCount})
                        </span>
                      </div>
                      <Badge variant="outline" className="border-green-500 text-green-700">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {company.csuHires} hires
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {company.description}
                    </p>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">💼 Internship Roles:</p>
                      <div className="flex flex-wrap gap-2">
                        {company.internshipRoles.slice(0, 3).map((role) => (
                          <Badge key={role} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                        {company.internshipRoles.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-gray-100">
                            +{company.internshipRoles.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
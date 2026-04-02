import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Search, Filter, Building2, ArrowUpDown } from "lucide-react";

export function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/companies/")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((c: any) => ({
          id: c.id,
          name: c.name,
          location: c.location,
          // Added safe fallbacks for the missing API data
          avgRating: c.avg_rating || 0,
          reviewCount: c.review_count || 0,
          csuHires: c.job_count || 0,
          industry: "Technology", 
          description: "",
          internshipRoles: [],
          logo: "🏢"
        }));
        setCompanies(formatted);
      })
      .catch(err => console.error(err));
  }, []);

  const industries = Array.from(
    new Set(companies.map((c) => c.industry || "Unknown"))
  );

  let filteredCompanies = companies.filter((company) => {
    const name = company.name || "";
    const description = company.description || "";
    const roles = company.internshipRoles || [];

    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roles.some((role: string) =>
        role.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesIndustry =
      industryFilter === "all" ||
      (company.industry || "Unknown") === industryFilter;

    return matchesSearch && matchesIndustry;
  });

  filteredCompanies = filteredCompanies.sort((a, b) => {
    if (sortBy === "rating") return (b.avgRating || 0) - (a.avgRating || 0);
    if (sortBy === "reviews") return (b.reviewCount || 0) - (a.reviewCount || 0);
    if (sortBy === "hires") return (b.csuHires || 0) - (a.csuHires || 0);
    if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          {/* Removed text-gray-900 so it respects your dark mode */}
          <h1 className="text-4xl font-bold">Companies</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          🏢 Explore {companies.length}+ companies actively hiring CSU students
        </p>
      </div>

      <Card className="mb-8 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Filter className="h-5 w-5 text-primary" />
            <span>Filter & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search companies..."
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
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <ArrowUpDown className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="hires">Most Open Roles</SelectItem>
                  <SelectItem value="name">Alphabetical (A-Z)</SelectItem>
                </SelectContent>
              </Select>

            </div>
          </div>
        </CardContent>
      </Card>

      {filteredCompanies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No companies found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company, i) => (
            <Card key={company.id || i} className="hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-primary">
                  {company.name || "Unknown"}
                </CardTitle>
                <CardDescription className="font-medium">
                  {company.location || "Location not specified"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 border-t mt-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Company Rating</p>
                    <p className="font-semibold text-lg">{company.avgRating > 0 ? `⭐ ${company.avgRating}` : "New"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Total Reviews</p>
                    <p className="font-semibold text-lg">{company.reviewCount} Reviews</p>
                  </div>
                  <div className="col-span-2 bg-secondary/50 p-3 rounded-md mt-2">
                    <p className="text-secondary-foreground font-medium flex items-center gap-2">
                      <span>🚀</span>
                      {company.csuHires > 0 ? `${company.csuHires} Open Roles Available` : "Accepting General Applications"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

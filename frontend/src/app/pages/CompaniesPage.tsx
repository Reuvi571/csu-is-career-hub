import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Search, Filter, Building2 } from "lucide-react";

export function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/companies/")
      .then(res => res.json())
      .then(data => {
        console.log("API DATA:", data);

        const formatted = data.map((c: any) => ({
          id: c.id,
          name: c.name,
          location: c.location,

          // REAL DATA FROM BACKEND
          avgRating: c.avg_rating,
          reviewCount: c.review_count,
          csuHires: c.job_count,

          // still placeholders (fine for now)
          industry: "Unknown",
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
          <h1 className="text-4xl">Companies</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          🏢 Explore {companies.length}+ companies
        </p>
      </div>

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
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredCompanies.length === 0 ? (
        <p>No companies found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company, i) => (
            <Card key={company.id || i}>
              <CardHeader>
                <CardTitle>
                  {company.name || "Unknown"}
                </CardTitle>
                <CardDescription>
                  {company.location || "No location"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Rating: {company.avgRating ?? "N/A"}
                </p>
                <p>
                  Reviews: {company.reviewCount}
                </p>
                <p>
                  Open Roles: {company.csuHires}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
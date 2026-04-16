import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Building2, MapPin, Search, Star, Briefcase, ArrowRight, Filter, X } from "lucide-react";

interface Company {
  id: number;
  name: string;
  location: string;
  avg_rating: number;
  review_count: number;
  job_count: number;
  open_roles: string[];
  job_titles: string[];
}

export function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    fetch("http://127.0.0.1:8000/api/companies/")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load companies");
        }
        return res.json();
      })
      .then((data: Company[]) => {
        setCompanies(data);
        setSelectedCompanyId(data[0]?.id ?? null);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const locations = useMemo(
    () => Array.from(new Set(companies.map((company) => company.location))).sort(),
    [companies]
  );

  const roles = useMemo(
    () => Array.from(new Set(companies.flatMap((company) => company.open_roles))).sort(),
    [companies]
  );

  const filteredCompanies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return companies.filter((company) => {
      const matchesSearch =
        !query ||
        company.name.toLowerCase().includes(query) ||
        company.location.toLowerCase().includes(query) ||
        company.job_titles.some((title) => title.toLowerCase().includes(query)) ||
        company.open_roles.some((role) => role.toLowerCase().includes(query));

      const matchesLocation = !locationFilter || company.location === locationFilter;
      const matchesRole = !roleFilter || company.open_roles.includes(roleFilter);

      return matchesSearch && matchesLocation && matchesRole;
    });
  }, [companies, searchQuery, locationFilter, roleFilter]);

  useEffect(() => {
    if (!filteredCompanies.length) {
      setSelectedCompanyId(null);
      return;
    }

    const selectedStillVisible = filteredCompanies.some((company) => company.id === selectedCompanyId);
    if (!selectedStillVisible) {
      setSelectedCompanyId(filteredCompanies[0].id);
    }
  }, [filteredCompanies, selectedCompanyId]);

  const selectedCompany =
    filteredCompanies.find((company) => company.id === selectedCompanyId) ?? filteredCompanies[0] ?? null;

  const clearFilters = () => {
    setSearchQuery("");
    setLocationFilter("");
    setRoleFilter("");
  };

  const hasActiveFilters = Boolean(searchQuery || locationFilter || roleFilter);

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden bg-teal-700 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-700 via-teal-800 to-teal-900 opacity-95" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center space-x-2 border border-white/20 bg-white/10 px-4 py-2">
              <div className="block h-2 w-2 bg-lime-400" />
              <span className="text-sm font-semibold">Companies With Active Openings</span>
            </div>

            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              Explore the companies
              <br />
              <span className="text-lime-400">actively hiring CSU students</span>
            </h1>

            <p className="mt-5 max-w-2xl text-lg text-teal-50">
              Browse employer profiles backed by the backend seed data and jump straight into the roles that are open now.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-teal-100">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-lime-400" aria-hidden="true" />
                <span>{companies.length} hiring companies</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-lime-400" aria-hidden="true" />
                <span>{companies.reduce((sum, company) => sum + company.job_count, 0)} live openings</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-white px-6 py-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-700">
                  <Filter className="h-4 w-4" aria-hidden="true" />
                  Company Directory
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Browse by company, location, or role</h2>
                <p className="mt-2 text-sm text-gray-600">
                  The list below is pulled from the backend and only includes companies with active seeded job postings.
                </p>
              </div>
              <Link to="/jobs" className="shrink-0">
                <Button className="bg-teal-700 font-semibold text-white hover:bg-teal-800">
                  View All Jobs
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid min-h-[780px] grid-cols-1 xl:grid-cols-[280px_minmax(320px,420px)_minmax(0,1fr)]">
            <aside className="border-b border-gray-200 bg-gray-50 p-6 xl:border-b-0 xl:border-r">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-sm font-medium text-teal-700 hover:text-teal-800"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div>
                  <label className="mb-3 block text-sm font-semibold text-gray-900">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Company, role, or title"
                      className="border-gray-300 bg-white pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-semibold text-gray-900">Location</label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="">All locations</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-semibold text-gray-900">Role focus</label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="">All roles</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                {hasActiveFilters && (
                  <div className="space-y-2 border-t border-gray-200 pt-4">
                    {searchQuery && (
                      <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm text-gray-700">
                        <span>{searchQuery}</span>
                        <button type="button" onClick={() => setSearchQuery("")}>
                          <X className="h-4 w-4 text-gray-400" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                    {locationFilter && (
                      <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm text-gray-700">
                        <span>{locationFilter}</span>
                        <button type="button" onClick={() => setLocationFilter("")}>
                          <X className="h-4 w-4 text-gray-400" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                    {roleFilter && (
                      <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm text-gray-700">
                        <span>{roleFilter}</span>
                        <button type="button" onClick={() => setRoleFilter("")}>
                          <X className="h-4 w-4 text-gray-400" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </aside>

            <section className="border-b border-gray-200 bg-white xl:border-b-0 xl:border-r">
              <div className="border-b border-gray-200 px-6 py-4">
                <h3 className="text-lg font-bold text-gray-900">Hiring Companies</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {loading ? "Loading companies..." : `${filteredCompanies.length} companies match your filters`}
                </p>
              </div>

              <div className="max-h-[780px] overflow-y-auto">
                {loading ? (
                  <div className="space-y-4 p-6">
                    {[0, 1, 2].map((item) => (
                      <Card key={item} className="border border-gray-200">
                        <CardContent className="p-5">
                          <div className="animate-pulse space-y-3">
                            <div className="h-4 w-2/3 rounded bg-gray-200" />
                            <div className="h-3 w-1/2 rounded bg-gray-100" />
                            <div className="h-3 w-full rounded bg-gray-100" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : error ? (
                  <div className="p-6 text-sm text-red-600">{error}</div>
                ) : filteredCompanies.length === 0 ? (
                  <div className="p-6 text-sm text-gray-600">No companies match the current filters.</div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredCompanies.map((company) => {
                      const isSelected = company.id === selectedCompany?.id;

                      return (
                        <button
                          key={company.id}
                          type="button"
                          onClick={() => setSelectedCompanyId(company.id)}
                          className={`w-full border-l-4 px-6 py-5 text-left transition ${
                            isSelected
                              ? "border-l-teal-700 bg-teal-50"
                              : "border-l-transparent hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-teal-100">
                              <Building2 className="h-6 w-6 text-teal-700" aria-hidden="true" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <h4 className="text-base font-bold text-gray-900">{company.name}</h4>
                                  <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                    <span>{company.location}</span>
                                  </p>
                                </div>
                                <Badge className="bg-lime-100 text-lime-700 hover:bg-lime-100">
                                  {company.job_count} openings
                                </Badge>
                              </div>

                              <div className="mt-4 flex flex-wrap gap-2">
                                {company.open_roles.slice(0, 2).map((role) => (
                                  <Badge key={role} variant="secondary" className="bg-gray-100 text-gray-700">
                                    {role}
                                  </Badge>
                                ))}
                                {company.open_roles.length > 2 && (
                                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                    +{company.open_roles.length - 2} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            <section className="bg-gray-50">
              <div className="h-full p-6 md:p-8">
                {selectedCompany ? (
                  <div className="space-y-8">
                    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-teal-100">
                            <Building2 className="h-8 w-8 text-teal-700" aria-hidden="true" />
                          </div>
                          <div>
                            <h3 className="text-3xl font-bold text-gray-900">{selectedCompany.name}</h3>
                            <div className="mt-3 flex flex-wrap gap-3">
                              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                <MapPin className="mr-1 h-3 w-3" aria-hidden="true" />
                                {selectedCompany.location}
                              </Badge>
                              <Badge variant="secondary" className="bg-lime-100 text-lime-700">
                                <Briefcase className="mr-1 h-3 w-3" aria-hidden="true" />
                                {selectedCompany.job_count} active roles
                              </Badge>
                              <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                                <Star className="mr-1 h-3 w-3" aria-hidden="true" />
                                {selectedCompany.review_count > 0
                                  ? `${selectedCompany.avg_rating}/5 from ${selectedCompany.review_count} reviews`
                                  : "No student reviews yet"}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <Link to="/jobs" className="shrink-0">
                          <Button className="bg-teal-700 font-semibold text-white hover:bg-teal-800">
                            Explore Jobs
                            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                      <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Open Positions</p>
                        <p className="mt-3 text-4xl font-bold text-gray-900">{selectedCompany.job_count}</p>
                        <p className="mt-2 text-sm text-gray-600">Seeded backend roles currently visible in the jobs feed.</p>
                      </div>
                      <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Student Rating</p>
                        <p className="mt-3 text-4xl font-bold text-gray-900">
                          {selectedCompany.review_count > 0 ? selectedCompany.avg_rating.toFixed(1) : "--"}
                        </p>
                        <p className="mt-2 text-sm text-gray-600">
                          {selectedCompany.review_count > 0
                            ? `Based on ${selectedCompany.review_count} submitted reviews.`
                            : "This company has openings, but no reviews yet."}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Role Coverage</p>
                        <p className="mt-3 text-4xl font-bold text-gray-900">{selectedCompany.open_roles.length}</p>
                        <p className="mt-2 text-sm text-gray-600">Distinct role tracks represented across current postings.</p>
                      </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
                      <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <div className="mb-5">
                          <h4 className="text-xl font-bold text-gray-900">Active job titles</h4>
                          <p className="mt-1 text-sm text-gray-600">Titles pulled directly from the backend job seed data.</p>
                        </div>
                        <div className="space-y-3">
                          {selectedCompany.job_titles.map((title) => (
                            <div
                              key={title}
                              className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center bg-teal-100">
                                  <Briefcase className="h-5 w-5 text-teal-700" aria-hidden="true" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">{title}</p>
                                  <p className="text-sm text-gray-600">{selectedCompany.name}</p>
                                </div>
                              </div>
                              <Link to="/jobs">
                                <Button variant="outline" className="border-teal-300 text-teal-700 hover:bg-teal-50">
                                  View
                                </Button>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <div className="mb-5">
                          <h4 className="text-xl font-bold text-gray-900">Hiring focus</h4>
                          <p className="mt-1 text-sm text-gray-600">Role areas currently represented for this company.</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {selectedCompany.open_roles.map((role) => (
                            <Badge key={role} className="bg-teal-100 px-3 py-2 text-sm font-medium text-teal-700 hover:bg-teal-100">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
                    <div>
                      <Building2 className="mx-auto h-10 w-10 text-gray-300" aria-hidden="true" />
                      <h3 className="mt-4 text-lg font-semibold text-gray-900">No company selected</h3>
                      <p className="mt-2 text-sm text-gray-600">
                        Adjust the filters or choose a company from the list to inspect its active roles.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

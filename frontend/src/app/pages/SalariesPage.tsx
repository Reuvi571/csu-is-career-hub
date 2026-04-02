import { useState } from "react";
import { mockSalaryData, mockCompanies } from "../data/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { DollarSign, TrendingUp, Award, Clock, Filter, Sparkles } from "lucide-react";

export function SalariesPage() {
  const [companyFilter, setCompanyFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  // Filter salary data
  let filteredSalaries = mockSalaryData.filter((salary) => {
    if (!salary.isVerified) return false;

    const matchesCompany = companyFilter === "all" || salary.companyId === companyFilter;
    const matchesType = typeFilter === "all" || salary.internshipType === typeFilter;
    const matchesYear = yearFilter === "all" || salary.year === parseInt(yearFilter);

    return matchesCompany && matchesType && matchesYear;
  });

  // Calculate statistics
  const avgSalary =
    filteredSalaries.length > 0
      ? filteredSalaries.reduce((sum, s) => sum + s.hourlyRate, 0) / filteredSalaries.length
      : 0;

  const minSalary =
    filteredSalaries.length > 0
      ? Math.min(...filteredSalaries.map((s) => s.hourlyRate))
      : 0;

  const maxSalary =
    filteredSalaries.length > 0
      ? Math.max(...filteredSalaries.map((s) => s.hourlyRate))
      : 0;

  const medianSalary =
    filteredSalaries.length > 0
      ? [...filteredSalaries].sort((a, b) => a.hourlyRate - b.hourlyRate)[
          Math.floor(filteredSalaries.length / 2)
        ].hourlyRate
      : 0;

  // Chart data: Average salary by company
  const companySalaryData = mockCompanies
    .map((company) => {
      const companyData = filteredSalaries.filter((s) => s.companyId === company.id);
      const avg =
        companyData.length > 0
          ? companyData.reduce((sum, s) => sum + s.hourlyRate, 0) / companyData.length
          : 0;
      return {
        name: company.name.split(" ")[0], // Shortened name
        salary: Math.round(avg),
      };
    })
    .filter((d) => d.salary > 0)
    .sort((a, b) => b.salary - a.salary)
    .slice(0, 10);

  // Chart data: Distribution by internship type
  const typeDistribution = [
    {
      name: "Summer",
      value: filteredSalaries.filter((s) => s.internshipType === "summer").length,
    },
    {
      name: "Co-op",
      value: filteredSalaries.filter((s) => s.internshipType === "co-op").length,
    },
    {
      name: "Part-time",
      value: filteredSalaries.filter((s) => s.internshipType === "part-time").length,
    },
  ].filter((d) => d.value > 0);

  const COLORS = ["#22c55e", "#3b82f6", "#f59e0b"];

  // Get available years
  const years = Array.from(new Set(mockSalaryData.map((s) => s.year))).sort((a, b) => b - a);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-3">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
            <DollarSign className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-4xl">Salary Data</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          💰 Anonymous, verified compensation data from CSU IS students
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8 border-2 border-green-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Filter className="h-5 w-5" />
            <span>Filter Salary Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Companies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">🏢 All Companies</SelectItem>
                {mockCompanies
                  .filter((c) => mockSalaryData.some((s) => s.companyId === c.id && s.isVerified))
                  .map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">📋 All Types</SelectItem>
                <SelectItem value="summer">☀️ Summer</SelectItem>
                <SelectItem value="co-op">🔄 Co-op</SelectItem>
                <SelectItem value="part-time">⏰ Part-time</SelectItem>
              </SelectContent>
            </Select>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">📅 All Years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(companyFilter !== "all" || typeFilter !== "all" || yearFilter !== "all") && (
              <Button
                variant="ghost"
                onClick={() => {
                  setCompanyFilter("all");
                  setTypeFilter("all");
                  setYearFilter("all");
                }}
                className="text-green-700 hover:text-green-800"
              >
                Clear filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-t-4 border-t-green-500 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide font-semibold">Average</p>
                <p className="text-4xl mt-2 font-bold text-green-600">${avgSalary.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">per hour</p>
              </div>
              <div className="bg-green-100 p-4 rounded-2xl">
                <DollarSign className="h-10 w-10 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-t-blue-500 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide font-semibold">Median</p>
                <p className="text-4xl mt-2 font-bold text-blue-600">${medianSalary}</p>
                <p className="text-xs text-muted-foreground">per hour</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-2xl">
                <TrendingUp className="h-10 w-10 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-t-orange-500 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide font-semibold">Minimum</p>
                <p className="text-4xl mt-2 font-bold text-orange-600">${minSalary}</p>
                <p className="text-xs text-muted-foreground">per hour</p>
              </div>
              <div className="bg-orange-100 p-4 rounded-2xl">
                <Clock className="h-10 w-10 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-t-purple-500 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide font-semibold">Maximum</p>
                <p className="text-4xl mt-2 font-bold text-purple-600">${maxSalary}</p>
                <p className="text-xs text-muted-foreground">per hour</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-2xl">
                <Award className="h-10 w-10 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Average Salary by Company */}
        <Card className="border-2 hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-green-600" />
              <span>Average Salary by Company</span>
            </CardTitle>
            <CardDescription>📊 Top 10 companies by average hourly rate</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={companySalaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}/hr`} />
                <Bar dataKey="salary" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribution by Type */}
        <Card className="border-2 hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <span>Internship Type Distribution</span>
            </CardTitle>
            <CardDescription>📈 Breakdown of reported salaries by type</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name} (${entry.value})`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Salary Table */}
      <Card className="border-2">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Detailed Salary Data</span>
          </CardTitle>
          <CardDescription>
            💼 Showing {filteredSalaries.length} verified salary reports
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {filteredSalaries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💸</div>
              <p className="text-lg font-semibold mb-2">No salary data found</p>
              <p className="text-muted-foreground">
                Try adjusting your filters to see more results
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSalaries
                .sort((a, b) => b.hourlyRate - a.hourlyRate)
                .map((salary) => {
                  const company = mockCompanies.find((c) => c.id === salary.companyId);
                  return (
                    <div
                      key={salary.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-5 border-2 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:border-green-300 transition-all"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="text-4xl">{company?.logo}</div>
                        <div>
                          <p className="font-semibold text-lg">{company?.name}</p>
                          <p className="text-sm text-muted-foreground flex items-center space-x-1">
                            <span>💼</span>
                            <span>{salary.role}</span>
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline" className="capitalize bg-blue-50 border-blue-300 text-blue-700">
                              {salary.internshipType === 'summer' ? '☀️' : salary.internshipType === 'co-op' ? '🔄' : '⏰'} {salary.internshipType}
                            </Badge>
                            <Badge variant="outline" className="bg-purple-50 border-purple-300 text-purple-700">📅 {salary.year}</Badge>
                            {salary.benefits.slice(0, 2).map((benefit) => (
                              <Badge key={benefit} variant="secondary" className="text-xs bg-green-100 text-green-700">
                                ✓ {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 text-right">
                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-5 py-3 rounded-xl border-2 border-green-300">
                          <p className="text-3xl font-bold text-green-700">
                            ${salary.hourlyRate}/hr
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ≈ ${(salary.hourlyRate * 40 * 12).toLocaleString()}/year
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
        <div className="flex items-start space-x-3">
          <div className="text-3xl">ℹ️</div>
          <div>
            <p className="font-semibold text-blue-900 mb-1">Important Note</p>
            <p className="text-sm text-blue-800">
              All salary data is self-reported and anonymized. Actual compensation may vary based on experience, qualifications, and negotiation. Data is provided for informational purposes only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
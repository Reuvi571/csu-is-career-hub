import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, TrendingUp, Clock, Filter, Briefcase } from "lucide-react";

interface CurrentSalaryPosting {
  id: string;
  title: string;
  company: {
    id: number;
    name: string;
  };
  position_type: "internship" | "co_op" | "part_time" | "entry_level";
  experience_level: string;
  min_hourly_rate: number;
  max_hourly_rate: number;
  midpoint_hourly_rate: number;
  salary_range: string;
  date_posted: string;
}

interface HistoricalSalarySnapshot {
  id: number;
  company: {
    id: number;
    name: string;
  } | null;
  role: string;
  position_type: "internship" | "co_op" | "part_time" | "entry_level";
  year: number;
  avg_hourly_rate: number;
  min_hourly_rate: number;
  max_hourly_rate: number;
  posting_count: number;
}

interface SalaryApiResponse {
  current_postings: CurrentSalaryPosting[];
  historical_snapshots: HistoricalSalarySnapshot[];
}

const POSITION_LABELS: Record<CurrentSalaryPosting["position_type"], string> = {
  internship: "Internship",
  co_op: "Co-op",
  part_time: "Part-time",
  entry_level: "Entry-level",
};

export function SalariesPage() {
  const [currentPostings, setCurrentPostings] = useState<CurrentSalaryPosting[]>([]);
  const [historicalSnapshots, setHistoricalSnapshots] = useState<HistoricalSalarySnapshot[]>([]);
  const [companyFilter, setCompanyFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    fetch("http://127.0.0.1:8000/api/salaries/")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load salary data");
        }
        return res.json();
      })
      .then((data: SalaryApiResponse) => {
        setCurrentPostings(data.current_postings);
        setHistoricalSnapshots(data.historical_snapshots);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const companies = useMemo(() => {
    const uniqueCompanies = new Map<number, string>();
    currentPostings.forEach((posting) => uniqueCompanies.set(posting.company.id, posting.company.name));
    return [...uniqueCompanies.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [currentPostings]);

  const filteredCurrentPostings = useMemo(() => {
    return currentPostings.filter((posting) => {
      const matchesCompany = companyFilter === "all" || String(posting.company.id) === companyFilter;
      const matchesType = typeFilter === "all" || posting.position_type === typeFilter;
      return matchesCompany && matchesType;
    });
  }, [currentPostings, companyFilter, typeFilter]);

  const filteredHistoricalSnapshots = useMemo(() => {
    if (typeFilter === "all") {
      return historicalSnapshots;
    }

    return historicalSnapshots.filter((snapshot) => snapshot.position_type === typeFilter);
  }, [historicalSnapshots, typeFilter]);

  const averageMidpoint = filteredCurrentPostings.length
    ? filteredCurrentPostings.reduce((sum, posting) => sum + posting.midpoint_hourly_rate, 0) / filteredCurrentPostings.length
    : 0;

  const minimumRate = filteredCurrentPostings.length
    ? Math.min(...filteredCurrentPostings.map((posting) => posting.min_hourly_rate))
    : 0;

  const maximumRate = filteredCurrentPostings.length
    ? Math.max(...filteredCurrentPostings.map((posting) => posting.max_hourly_rate))
    : 0;

  const companyChartData = useMemo(() => {
    const grouped = new Map<string, number[]>();

    filteredCurrentPostings.forEach((posting) => {
      const current = grouped.get(posting.company.name) ?? [];
      current.push(posting.midpoint_hourly_rate);
      grouped.set(posting.company.name, current);
    });

    return [...grouped.entries()]
      .map(([name, values]) => ({
        name,
        average_pay: Math.round(values.reduce((sum, value) => sum + value, 0) / values.length),
      }))
      .sort((a, b) => b.average_pay - a.average_pay);
  }, [filteredCurrentPostings]);

  const historicalTrendData = useMemo(() => {
    const grouped = new Map<number, { weightedTotal: number; postingCount: number }>();

    filteredHistoricalSnapshots.forEach((snapshot) => {
      const current = grouped.get(snapshot.year) ?? { weightedTotal: 0, postingCount: 0 };
      current.weightedTotal += snapshot.avg_hourly_rate * snapshot.posting_count;
      current.postingCount += snapshot.posting_count;
      grouped.set(snapshot.year, current);
    });

    return [...grouped.entries()]
      .map(([year, values]) => ({
        year: String(year),
        average_pay: values.postingCount ? +(values.weightedTotal / values.postingCount).toFixed(1) : 0,
      }))
      .sort((a, b) => Number(a.year) - Number(b.year));
  }, [filteredHistoricalSnapshots]);

  const clearFilters = () => {
    setCompanyFilter("all");
    setTypeFilter("all");
  };

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#2d694f]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="rounded-none border border-red-200">
          <CardContent className="py-10 text-center text-red-700">{error}</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <div className="bg-[#2d694f] p-3">
            <DollarSign className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Salary Data</h1>
        </div>
        <p className="max-w-4xl text-lg text-gray-600">
          Current salary statistics are calculated from active CSU job postings with structured pay ranges. Historical
          trend data is stored separately so archived pay benchmarks can be compared year over year.
        </p>
      </div>

      <Card className="mb-8 rounded-none border border-[#2d694f] shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5 text-[#2d694f]" />
            <span>Current Posting Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-full rounded-none md:w-[240px]">
                <SelectValue placeholder="All companies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All companies</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={String(company.id)}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full rounded-none md:w-[220px]">
                <SelectValue placeholder="All role types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All role types</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="co_op">Co-op</SelectItem>
                <SelectItem value="part_time">Part-time</SelectItem>
                <SelectItem value="entry_level">Entry-level</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={clearFilters}
              className="rounded-none border-[#2d694f] text-[#2d694f] hover:bg-white hover:text-[#274c37]"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="rounded-none border border-[#d9e1da] border-t-4 border-t-[#2d694f] shadow-none">
          <CardContent className="pt-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#2d694f]">Current Openings</p>
            <p className="mt-2 text-4xl font-bold text-[#2d694f]">{filteredCurrentPostings.length}</p>
            <p className="mt-2 text-sm text-gray-600">Active postings with pay ranges</p>
          </CardContent>
        </Card>
        <Card className="rounded-none border border-[#d9e1da] border-t-4 border-t-[#7ebc45] shadow-none">
          <CardContent className="pt-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#2d694f]">Average Midpoint</p>
            <p className="mt-2 text-4xl font-bold text-[#2d694f]">${averageMidpoint.toFixed(0)}</p>
            <p className="mt-2 text-sm text-gray-600">Across current postings</p>
          </CardContent>
        </Card>
        <Card className="rounded-none border border-[#d9e1da] border-t-4 border-t-[#274c37] shadow-none">
          <CardContent className="pt-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#2d694f]">Lowest Posted Rate</p>
            <p className="mt-2 text-4xl font-bold text-[#2d694f]">${minimumRate.toFixed(0)}</p>
            <p className="mt-2 text-sm text-gray-600">Current minimum hourly pay</p>
          </CardContent>
        </Card>
        <Card className="rounded-none border border-[#d9e1da] border-t-4 border-t-[#2d694f] shadow-none">
          <CardContent className="pt-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#2d694f]">Highest Posted Rate</p>
            <p className="mt-2 text-4xl font-bold text-[#2d694f]">${maximumRate.toFixed(0)}</p>
            <p className="mt-2 text-sm text-gray-600">Current maximum hourly pay</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="rounded-none border border-[#d9e1da] shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#2d694f]">
              <Briefcase className="h-5 w-5" />
              <span>Current average pay by company</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={companyChartData}>
                <CartesianGrid stroke="#d9e1da" strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-35} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip
                  contentStyle={{ borderRadius: 0, borderColor: "#2d694f" }}
                  formatter={(value) => `$${value}/hr`}
                />
                <Bar dataKey="average_pay" fill="#2d694f" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-none border border-[#d9e1da] shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#2d694f]">
              <TrendingUp className="h-5 w-5" />
              <span>Archived average pay by year</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={historicalTrendData}>
                <CartesianGrid stroke="#d9e1da" strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip
                  contentStyle={{ borderRadius: 0, borderColor: "#2d694f" }}
                  formatter={(value) => `$${value}/hr`}
                />
                <Bar dataKey="average_pay" fill="#7ebc45" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_0.9fr]">
        <Card className="rounded-none border border-[#d9e1da] shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#2d694f]">
              <Clock className="h-5 w-5" />
              <span>Current posting salary ranges</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCurrentPostings.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-lg font-semibold text-gray-900">No current salary data found</p>
                <p className="mt-2 text-sm text-gray-600">Try adjusting the current posting filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCurrentPostings.map((posting) => (
                  <div
                    key={posting.id}
                    className="flex flex-col justify-between gap-4 border border-[#d9e1da] p-5 md:flex-row md:items-center"
                  >
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{posting.title}</p>
                      <p className="mt-1 text-sm text-gray-600">{posting.company.name}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="border border-[#2d694f] px-3 py-1 text-sm text-[#2d694f]">
                          {POSITION_LABELS[posting.position_type]}
                        </span>
                        <span className="border border-[#274c37] px-3 py-1 text-sm text-[#274c37]">
                          Posted {new Date(posting.date_posted).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="border border-[#2d694f] px-5 py-3 text-right">
                      <p className="text-2xl font-bold text-[#2d694f]">{posting.salary_range}</p>
                      <p className="mt-1 text-sm text-gray-600">Midpoint ${posting.midpoint_hourly_rate.toFixed(1)}/hr</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-none border border-[#d9e1da] shadow-none">
          <CardHeader>
            <CardTitle className="text-[#2d694f]">Archived Snapshot Records</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredHistoricalSnapshots.map((snapshot) => (
              <div key={snapshot.id} className="border border-[#d9e1da] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{snapshot.year}</p>
                    <p className="mt-1 text-sm text-gray-600">{POSITION_LABELS[snapshot.position_type]}</p>
                  </div>
                  <p className="text-lg font-bold text-[#2d694f]">${snapshot.avg_hourly_rate}/hr</p>
                </div>
                <p className="mt-3 text-sm text-gray-600">
                  Range ${snapshot.min_hourly_rate} to ${snapshot.max_hourly_rate} across {snapshot.posting_count} archived
                  postings.
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

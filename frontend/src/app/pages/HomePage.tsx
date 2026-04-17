import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Building2, Star, DollarSign, MapPin, Calendar, ArrowRight, Briefcase, Award } from "lucide-react";

interface UserContext {
  user: {
    id?: string;
    name?: string;
  } | null;
}

interface Job {
  id: string;
  title: string;
  company: {
    id: number;
    name: string;
  };
  location: string;
  experience_level: string;
  min_hourly_rate: number | null;
  max_hourly_rate: number | null;
  salary_range: string;
  date_posted: string;
}

interface Company {
  id: number;
  name: string;
}

interface Review {
  id: number;
}

export function HomePage() {
  const { user } = useOutletContext<UserContext>();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:8000/api/jobs/").then((res) => res.json()),
      fetch("http://127.0.0.1:8000/api/companies/").then((res) => res.json()),
      fetch("http://127.0.0.1:8000/api/reviews/").then((res) => res.json()),
    ])
      .then(([jobsData, companiesData, reviewsData]) => {
        setJobs(jobsData);
        setCompanies(companiesData);
        setReviews(reviewsData);
      })
      .catch(() => {
        setJobs([]);
        setCompanies([]);
        setReviews([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const averageHourlyRate = useMemo(() => {
    const midpoints = jobs
      .filter((job) => job.min_hourly_rate !== null && job.max_hourly_rate !== null)
      .map((job) => ((job.min_hourly_rate ?? 0) + (job.max_hourly_rate ?? 0)) / 2);

    if (!midpoints.length) {
      return 0;
    }

    return Math.round(midpoints.reduce((sum, value) => sum + value, 0) / midpoints.length);
  }, [jobs]);

  const recentJobs = jobs.slice(0, 9);

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#2d694f]" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#5f6368]">
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 px-4 py-12 sm:px-6 lg:grid-cols-[290px_minmax(0,1fr)] lg:px-8 lg:py-16">
          <aside className="border-b border-[#d5d8db] pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-10">
            <div className="max-w-[240px]">
              <p className="mb-6 text-4xl font-bold leading-tight text-[#2d694f]">CSU IS Career Hub</p>
              <div className="space-y-5 text-[#2d694f]">
                <div className="border-b border-[#d5d8db] pb-5">
                  <p className="mb-2 text-2xl font-bold">Internships and jobs</p>
                  <p className="text-base font-normal text-[#5f6368]">
                    Browse active roles in software, analytics, systems, and support.
                  </p>
                </div>
                <div className="border-b border-[#d5d8db] pb-5">
                  <p className="mb-2 text-2xl font-bold">Employer information</p>
                  <p className="text-base font-normal text-[#5f6368]">
                    Review company locations, hiring patterns, and student feedback in one place.
                  </p>
                </div>
                <div className="border-b border-[#d5d8db] pb-5">
                  <p className="mb-2 text-2xl font-bold">Certification pathways</p>
                  <p className="text-base font-normal text-[#5f6368]">
                    See which certifications show up across roles, then jump into current jobs asking for them.
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-2xl font-bold">Compensation data</p>
                  <p className="text-base font-normal text-[#5f6368]">
                    Compare current posted pay ranges and archived salary benchmarks before applying or evaluating offers.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <div className="pt-8 lg:pt-0 lg:pl-14">
            <div className="max-w-4xl">
              <div className="mb-5 inline-flex items-center gap-2 border border-[#2d694f] bg-white px-4 py-2 text-sm font-semibold text-[#2d694f]">
                <div className="h-2 w-2 bg-[#7ebc45]" />
                <span>Career services for CSU Information Systems students</span>
              </div>

              <h1 className="mb-6 text-5xl font-bold leading-none text-[#2d694f] md:text-6xl">
                Internship and
                <br />
                early-career opportunities
              </h1>

              <div className="space-y-6 text-xl leading-relaxed text-[#5f6368]">
                <p>
                  The Career Hub helps CSU students focus on the employers, roles, and application details that matter most during an internship or first-job search.
                </p>
                <p>
                  Use the job board to review openings, compare posted pay ranges, read student-submitted reviews, and identify certifications employers are actively looking for by role.
                </p>
                <p>
                  The certifications directory connects that research back to open roles, so you can explore a cert and immediately see the kinds of opportunities it supports.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-1 border border-[#d5d8db] md:grid-cols-3">
                <div className="border-b border-[#d5d8db] bg-white p-6 md:border-b-0 md:border-r">
                  <p className="text-sm font-semibold uppercase tracking-wide text-[#2d694f]">Hiring companies</p>
                  <p className="mt-2 text-4xl font-bold text-[#2d694f]">{companies.length}</p>
                  <p className="mt-2 text-base text-[#5f6368]">Regional employers with active roles and profile details.</p>
                </div>
                <div className="border-b border-[#d5d8db] bg-white p-6 md:border-b-0 md:border-r">
                  <p className="text-sm font-semibold uppercase tracking-wide text-[#2d694f]">Student reviews</p>
                  <p className="mt-2 text-4xl font-bold text-[#2d694f]">{reviews.length}</p>
                  <p className="mt-2 text-base text-[#5f6368]">Published feedback on interview process, workload, and culture.</p>
                </div>
                <div className="bg-white p-6">
                  <p className="text-sm font-semibold uppercase tracking-wide text-[#2d694f]">Average hourly pay</p>
                  <p className="mt-2 text-4xl font-bold text-[#2d694f]">${averageHourlyRate}</p>
                  <p className="mt-2 text-base text-[#5f6368]">Calculated from current job postings with structured pay ranges.</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:flex-wrap">
                <Button asChild size="lg" className="rounded-none bg-[#2d694f] px-8 font-bold text-white hover:bg-[#274c37]">
                  <Link to="/jobs">
                    <Briefcase className="mr-2 h-5 w-5" aria-hidden="true" />
                    View Open Roles
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-none border-[#2d694f] px-8 font-semibold text-[#2d694f] hover:bg-white hover:text-[#274c37]">
                  <Link to="/companies">
                    <Building2 className="mr-2 h-5 w-5" aria-hidden="true" />
                    Employer Directory
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-none border-[#2d694f] px-8 font-semibold text-[#2d694f] hover:bg-white hover:text-[#274c37]">
                  <Link to="/certifications">
                    <Award className="mr-2 h-5 w-5" aria-hidden="true" />
                    Explore Certifications
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#d5d8db] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-block border border-[#7ebc45] bg-white px-3 py-1 text-sm font-semibold text-[#2d694f]">
                Recently Posted
              </div>
              <h2 className="text-4xl font-bold text-[#2d694f]">Current opportunities</h2>
              <p className="mt-2 max-w-3xl text-lg text-[#5f6368]">
                A focused list of active roles aligned to the kinds of positions CSU Information Systems students typically pursue.
              </p>
            </div>
            <Link to="/jobs" className="hidden shrink-0 md:block">
              <Button variant="outline" size="lg" className="rounded-none border-[#2d694f] font-semibold text-[#2d694f] hover:bg-white hover:text-[#274c37]">
                View All Jobs <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentJobs.map((job) => (
              <Link key={job.id} to={`/jobs?job=${job.id}`} className="group">
                <Card className="h-full rounded-none border border-[#d5d8db] bg-white shadow-none transition-colors hover:border-[#2d694f]">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center border border-[#2d694f] bg-white">
                        <Building2 className="h-6 w-6 text-[#2d694f]" aria-hidden="true" />
                      </div>
                      <Badge className="rounded-none border border-[#7ebc45] bg-white text-[#2d694f]">
                        {job.experience_level}
                      </Badge>
                    </div>

                    <h3 className="mb-2 text-xl font-bold text-[#2d694f] transition-colors group-hover:text-[#274c37]">
                      {job.title}
                    </h3>
                    <p className="mb-4 font-semibold text-[#3d4348]">{job.company.name}</p>

                    <div className="mb-6 space-y-3 text-sm text-[#5f6368]">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-[#2d694f]" aria-hidden="true" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-[#2d694f]" aria-hidden="true" />
                        <span>{job.salary_range || "Pay not listed"}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-[#2d694f]" aria-hidden="true" />
                        <span>{new Date(job.date_posted).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <Button className="w-full rounded-none bg-[#2d694f] font-semibold text-white hover:bg-[#274c37]">
                      Open Role
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center md:hidden">
            <Button asChild size="lg" className="w-full rounded-none bg-[#2d694f] font-semibold text-white hover:bg-[#274c37]">
              <Link to="/jobs">
                View All Jobs <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <h2 className="mb-4 text-4xl font-bold text-[#2d694f]">What students usually need before applying</h2>
            <p className="text-lg text-[#5f6368]">
              The hub is most useful when you need concrete details on employers, roles, certifications, and compensation without digging through multiple sites.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-0 border border-[#d5d8db] md:grid-cols-3">
            <div className="border-b border-[#d5d8db] bg-white p-8 md:border-b-0 md:border-r">
              <div className="mb-6 flex h-12 w-12 items-center justify-center border border-[#2d694f] bg-white">
                <MapPin className="h-6 w-6 text-[#2d694f]" aria-hidden="true" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-[#2d694f]">Employer snapshots</h3>
              <p className="text-[#5f6368]">
                See which Cleveland-area employers hire CSU students, where they are located, and what kinds of roles they tend to open.
              </p>
            </div>

            <div className="border-b border-[#d5d8db] bg-white p-8 md:border-b-0 md:border-r">
              <div className="mb-6 flex h-12 w-12 items-center justify-center border border-[#2d694f] bg-white">
                <Star className="h-6 w-6 text-[#2d694f]" aria-hidden="true" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-[#2d694f]">Student reviews</h3>
              <p className="text-[#5f6368]">
                Read how past interns described the interview process, day-to-day work, and whether they would recommend the experience.
              </p>
            </div>

            <div className="bg-white p-8">
              <div className="mb-6 flex h-12 w-12 items-center justify-center border border-[#2d694f] bg-white">
                <DollarSign className="h-6 w-6 text-[#2d694f]" aria-hidden="true" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-[#2d694f]">Pay benchmarks</h3>
              <p className="text-[#5f6368]">
                Compare current pay ranges and archived benchmarks so you have a realistic sense of what similar offers look like.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#d5d8db] bg-[#2d694f] py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="mb-4 text-4xl font-bold">Start with the roles that fit your path</h2>
              <p className="text-xl text-white/90">
                {user
                  ? "Use the hub to narrow in on the employers, reviews, and compensation data that matter most to your search."
                  : "Browse opportunities the way CSU students actually search: by employer, role type, and real peer feedback."}
              </p>
            </div>
            <Button asChild size="lg" className="bg-[#7ebc45] font-bold text-[#2d694f] hover:bg-[#274c37] hover:text-white">
              <Link to="/jobs">
                <Briefcase className="mr-2 h-5 w-5" aria-hidden="true" />
                Browse Opportunities
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

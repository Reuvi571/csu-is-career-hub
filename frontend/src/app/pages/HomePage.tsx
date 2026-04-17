import { Link, useOutletContext } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { mockCompanies, mockReviews, mockSalaryData, User } from "../data/mockData";
import { Building2, Star, DollarSign, Users, MapPin, Calendar, ArrowRight, Briefcase, Award } from "lucide-react";

export function HomePage() {
  const { user } = useOutletContext<{ user: User | null }>();
  const approvedReviewCount = mockReviews.filter((review) => review.isApproved).length;
  const averageHourlyRate =
    Math.round(
      mockSalaryData.reduce((sum, salary) => sum + salary.hourlyRate, 0) / mockSalaryData.length
    ) || 0;
  
  // Create job postings from companies and salary data
  const getRecentJobs = () => {
    return mockCompanies.slice(0, 9).map((company, idx) => {
      const salary = mockSalaryData.find(s => s.companyId === company.id);
      return {
        id: idx,
        title: company.internshipRoles[idx % company.internshipRoles.length] || "Internship Position",
        company: company.name,
        location: company.location,
        salary: salary ? `$${salary.hourlyRate}/hr` : "$18-25/hr",
        postedDate: new Date().toLocaleDateString(),
      };
    });
  };

  const recentJobs = getRecentJobs();

  return (
    <main className="min-h-screen bg-white text-[#5f6368]">
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 px-4 py-12 sm:px-6 lg:grid-cols-[290px_minmax(0,1fr)] lg:px-8 lg:py-16">
          <aside className="border-b border-[#d5d8db] pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-10">
            <div className="max-w-[240px]">
              <p className="mb-6 text-4xl font-bold leading-tight text-[#00795f]">
                CSU IS Career Hub
              </p>
              <div className="space-y-5 text-[#00795f]">
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
                    Compare reported hourly rates before applying or evaluating offers.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <div className="pt-8 lg:pt-0 lg:pl-14">
            <div className="max-w-4xl">
              <div className="mb-5 inline-flex items-center gap-2 border border-[#d5d8db] bg-[#f5f7f5] px-4 py-2 text-sm font-semibold text-[#00795f]">
                <div className="h-2 w-2 bg-[#8dc63f]" />
                <span>Career services for CSU Information Systems students</span>
              </div>

              <h1 className="mb-6 text-5xl font-bold leading-none text-[#00795f] md:text-6xl">
                Internship and
                <br />
                early-career opportunities
              </h1>

              <div className="space-y-6 text-xl leading-relaxed text-[#5f6368]">
                <p>
                  The Career Hub helps CSU students focus on the employers, roles, and application details that matter most during an internship or first-job search.
                </p>
                <p>
                  Use the job board to review openings, compare reported pay, read student-submitted reviews, and identify certifications employers are actively looking for by role.
                </p>
                <p>
                  The certifications directory connects that research back to open roles, so you can explore a cert and immediately see the kinds of opportunities it supports.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-1 border border-[#d5d8db] md:grid-cols-3">
                <div className="border-b border-[#d5d8db] bg-white p-6 md:border-b-0 md:border-r">
                  <p className="text-sm font-semibold uppercase tracking-wide text-[#00795f]">Hiring companies</p>
                  <p className="mt-2 text-4xl font-bold text-[#00795f]">{mockCompanies.length}</p>
                  <p className="mt-2 text-base text-[#5f6368]">Regional employers with IS-relevant roles and company details.</p>
                </div>
                <div className="border-b border-[#d5d8db] bg-white p-6 md:border-b-0 md:border-r">
                  <p className="text-sm font-semibold uppercase tracking-wide text-[#00795f]">Verified reviews</p>
                  <p className="mt-2 text-4xl font-bold text-[#00795f]">{approvedReviewCount}</p>
                  <p className="mt-2 text-base text-[#5f6368]">Student feedback on interview process, workload, and culture.</p>
                </div>
                <div className="bg-white p-6">
                  <p className="text-sm font-semibold uppercase tracking-wide text-[#00795f]">Average hourly pay</p>
                  <p className="mt-2 text-4xl font-bold text-[#00795f]">${averageHourlyRate}</p>
                  <p className="mt-2 text-base text-[#5f6368]">Reported internship compensation across the current salary dataset.</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:flex-wrap">
                <Button asChild size="lg" className="rounded-none bg-[#00795f] px-8 font-bold text-white hover:bg-[#00684f]">
                  <Link to="/jobs">
                    <Briefcase className="mr-2 h-5 w-5" aria-hidden="true" />
                    View Open Roles
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-none border-[#00795f] px-8 font-semibold text-[#00795f] hover:bg-[#f2f7f3]">
                  <Link to="/companies">
                    <Building2 className="mr-2 h-5 w-5" aria-hidden="true" />
                    Employer Directory
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-none border-[#00795f] px-8 font-semibold text-[#00795f] hover:bg-[#f2f7f3]">
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

      {/* Recent Jobs Section */}
      <section className="border-t border-[#d5d8db] bg-[#f5f7f5]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-block bg-[#dff0dc] px-3 py-1 text-sm font-semibold text-[#00795f]">
              Recently Posted
            </div>
            <h2 className="text-4xl font-bold text-[#00795f]">Current opportunities</h2>
            <p className="mt-2 max-w-3xl text-lg text-[#5f6368]">
              A focused list of positions aligned to the kinds of roles CSU Information Systems students typically pursue.
            </p>
          </div>
          <Link to="/jobs" className="hidden md:block flex-shrink-0">
            <Button variant="outline" size="lg" className="rounded-none border-[#00795f] font-semibold text-[#00795f] hover:bg-[#eef6f0]">
              View All Jobs <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
            </Button>
          </Link>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {recentJobs.map((job, idx) => (
            <Link key={job.id} to="/jobs" className="group">
              <Card className="h-full rounded-none border border-[#d5d8db] bg-white shadow-none transition-colors hover:border-[#00795f]">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center bg-[#eef6f0]">
                      <Building2 className="h-6 w-6 text-[#00795f]" aria-hidden="true" />
                    </div>
                    <Badge className="rounded-none border-0 bg-[#dff0dc] text-[#00795f]">
                      {idx % 3 === 0 ? "Internship" : idx % 3 === 1 ? "Co-op" : "Entry Level"}
                    </Badge>
                  </div>
                  
                  <h3 className="mb-2 text-xl font-bold text-[#00795f] transition-colors group-hover:text-[#00684f]">
                    {job.title}
                  </h3>
                  <p className="mb-4 font-semibold text-[#3d4348]">{job.company}</p>

                  <div className="mb-6 space-y-3 text-sm text-[#5f6368]">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-[#00795f]" aria-hidden="true" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-[#00795f]" aria-hidden="true" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-[#00795f]" aria-hidden="true" />
                      <span>{job.postedDate}</span>
                    </div>
                  </div>

                  <Button className="w-full rounded-none bg-[#00795f] font-semibold text-white hover:bg-[#00684f]">
                    Open Role
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center md:hidden">
          <Button asChild size="lg" className="w-full rounded-none bg-[#00795f] font-semibold text-white hover:bg-[#00684f]">
            <Link to="/jobs">
              View All Jobs <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
            </Link>
          </Button>
        </div>
        </div>
      </section>

      {/* Why Choose CSU Careers Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <h2 className="mb-4 text-4xl font-bold text-[#00795f]">What students usually need before applying</h2>
            <p className="text-lg text-[#5f6368]">
              The hub is most useful when you need concrete details on employers, roles, certifications, and compensation without digging through multiple sites.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-0 border border-[#d5d8db] md:grid-cols-3">
            {/* Card 1 */}
            <div className="border-b border-[#d5d8db] bg-white p-8 md:border-b-0 md:border-r">
              <div className="mb-6 flex h-12 w-12 items-center justify-center bg-[#eef6f0]">
                <MapPin className="h-6 w-6 text-[#00795f]" aria-hidden="true" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-[#00795f]">Employer snapshots</h3>
              <p className="text-[#5f6368]">
                See which Cleveland-area employers hire CSU students, where they are located, and what kinds of roles they tend to open.
              </p>
            </div>

            {/* Card 2 */}
            <div className="border-b border-[#d5d8db] bg-white p-8 md:border-b-0 md:border-r">
              <div className="mb-6 flex h-12 w-12 items-center justify-center bg-[#eef6f0]">
                <Star className="h-6 w-6 text-[#00795f]" aria-hidden="true" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-[#00795f]">Student reviews</h3>
              <p className="text-[#5f6368]">
                Read how past interns described the interview process, day-to-day work, and whether they would recommend the experience.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8">
              <div className="mb-6 flex h-12 w-12 items-center justify-center bg-[#eef6f0]">
                <DollarSign className="h-6 w-6 text-[#00795f]" aria-hidden="true" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-[#00795f]">Pay benchmarks</h3>
              <p className="text-[#5f6368]">
                Compare reported hourly rates so you have a realistic sense of what similar internship and co-op offers look like.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="border-t border-[#d5d8db] bg-[#00795f] py-14 text-white">
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
          <Button asChild size="lg" className="bg-lime-400 hover:bg-lime-500 text-teal-900 font-bold">
            <Link to="/jobs">
              <Briefcase className="h-5 w-5 mr-2" aria-hidden="true" />
              Browse Opportunities
            </Link>
          </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

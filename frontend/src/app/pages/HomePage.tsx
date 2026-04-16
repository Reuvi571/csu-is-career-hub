import { Link, useOutletContext } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { mockCompanies, mockReviews, mockSalaryData, mockUsers, User } from "../data/mockData";
import { Building2, Star, DollarSign, Users, MapPin, Calendar, ArrowRight, Briefcase } from "lucide-react";

export function HomePage() {
  const { user } = useOutletContext<{ user: User | null }>();
  
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
    <main className="min-h-screen bg-white">
      {/* Hero Section - Clean & Simple */}
      <div className="relative bg-teal-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-700 via-teal-800 to-teal-900 opacity-95"></div>
        
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px'
        }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Official Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 mb-8 border border-white/20">
              <div className="h-2 w-2 bg-lime-400 block"></div>
              <span className="text-sm font-semibold">Official CSU Career Portal</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Your Internship
              <br />
              <span className="text-lime-400">Starts Here</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-teal-50 mb-10 leading-relaxed">
              Find internships at Cleveland's leading companies and advance your IS career
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-lime-400 hover:bg-lime-500 text-teal-900 font-bold text-base px-8 py-3">
                <Link to="/jobs">
                  <Briefcase className="h-5 w-5 mr-2" aria-hidden="true" />
                  Browse All Jobs
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-white/20 hover:bg-white/30 text-white font-semibold text-base px-8 py-3 border border-white/40">
                <Link to="/companies">
                  <Building2 className="h-5 w-5 mr-2" aria-hidden="true" />
                  Companies
                </Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center items-center gap-8 mt-12 text-sm text-teal-100">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-lime-400" aria-hidden="true" />
                <span>22+ Companies</span>
              </div>
              <div className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-lime-400" aria-hidden="true" />
                <span>100+ Positions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-lime-400" aria-hidden="true" />
                <span>500+ Reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Jobs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-12 flex-col md:flex-row gap-6">
          <div>
            <div className="inline-block bg-teal-100 text-teal-700 px-3 py-1 text-sm font-semibold mb-3">
              Recently Posted
            </div>
            <h2 className="text-4xl font-bold text-gray-900">Open Positions</h2>
            <p className="text-lg text-gray-600 mt-2">
              Browse the latest internship opportunities at Cleveland companies
            </p>
          </div>
          <Link to="/jobs" className="hidden md:block flex-shrink-0">
            <Button variant="outline" size="lg" className="font-semibold border-teal-300 text-teal-700 hover:bg-teal-50">
              View All Jobs <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
            </Button>
          </Link>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {recentJobs.map((job) => (
            <Link key={job.id} to="/jobs" className="group">
              <Card className="h-full border border-gray-200 hover:shadow-lg transition-shadow bg-white hover:border-teal-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-teal-100 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-teal-700" aria-hidden="true" />
                    </div>
                    <Badge className="bg-lime-100 text-lime-700 border-0">New</Badge>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-teal-700 font-semibold mb-4">{job.company}</p>

                  <div className="space-y-3 mb-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" aria-hidden="true" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" aria-hidden="true" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" aria-hidden="true" />
                      <span>{job.postedDate}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center md:hidden">
          <Button asChild size="lg" className="bg-teal-700 hover:bg-teal-800 text-white font-semibold w-full">
            <Link to="/jobs">
              View All Jobs <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Why Choose CSU Careers Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Use CSU Careers Hub</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Designed for Cleveland State University IS students to connect with local opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 border border-gray-200">
              <div className="w-12 h-12 bg-teal-100 flex items-center justify-center mb-6">
                <MapPin className="h-6 w-6 text-teal-700" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Local Opportunities</h3>
              <p className="text-gray-600">
                Find internships with companies actually hiring CSU IS students in the Cleveland area
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 border border-gray-200">
              <div className="w-12 h-12 bg-lime-100 flex items-center justify-center mb-6">
                <Star className="h-6 w-6 text-lime-700" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real Reviews</h3>
              <p className="text-gray-600">
                Read honest feedback from your peers about internships and company culture
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 border border-gray-200">
              <div className="w-12 h-12 bg-teal-100 flex items-center justify-center mb-6">
                <DollarSign className="h-6 w-6 text-teal-700" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Salary Data</h3>
              <p className="text-gray-600">
                Know your worth with transparent salary information from CSU alumni
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Footer Section */}
      <div className="bg-teal-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-xl text-teal-50 mb-8 max-w-2xl mx-auto">
            {user 
              ? "Check out the latest opportunities and begin your career journey today" 
              : "Join CSU students in finding their perfect internship"}
          </p>
          <Button asChild size="lg" className="bg-lime-400 hover:bg-lime-500 text-teal-900 font-bold">
            <Link to="/jobs">
              <Briefcase className="h-5 w-5 mr-2" aria-hidden="true" />
              Explore Opportunities
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

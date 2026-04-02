import { Link, useOutletContext } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { mockCompanies, mockReviews, mockUsers, User } from "../data/mockData";
import { Building2, Star, DollarSign, Users, TrendingUp, Award, Sparkles, Rocket, Target, CheckCircle, MessageSquare, ArrowRight, Zap, Globe, Heart, Shield, BookOpen, Briefcase } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function HomePage() {
  const { user } = useOutletContext<{ user: User | null }>();
  
  const topCompanies = mockCompanies
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 6);

  const recentReviews = mockReviews
    .filter((r) => r.isApproved)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const stats = [
    { label: "Companies", value: mockCompanies.length, icon: Building2, color: "text-blue-600", bgColor: "bg-blue-100" },
    { label: "Reviews", value: mockReviews.filter((r) => r.isApproved).length, icon: Star, color: "text-yellow-600", bgColor: "bg-yellow-100" },
    { label: "Students", value: mockUsers.length, icon: Users, color: "text-green-600", bgColor: "bg-green-100" },
    { label: "Avg. Salary", value: "$24/hr", icon: DollarSign, color: "text-purple-600", bgColor: "bg-purple-100" },
  ];

  return (
    // Wrap in <main> to resolve landmark issues and improve semantic structure
    <main className="min-h-screen">
      {/* Hero Section - Modern Design */}
      <div className="relative bg-gradient-to-br from-green-800 via-green-900 to-gray-900 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-green-700/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
          
          {/* Viking Graphics */}
          <div className="absolute top-10 left-10 opacity-20 w-64 h-64 transform -rotate-12">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1581337204818-5f755d7916dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWtpbmclMjB3YXJyaW9yJTIwaWxsdXN0cmF0aW9ufGVufDF8fHx8MTc3NDgxNjg5MXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="" // Decorative image
              className="w-full h-full object-contain opacity-70"
            />
          </div>
          <div className="absolute bottom-20 right-20 opacity-20 w-72 h-72 transform rotate-12">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1772920908850-75f9c051fc2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWtpbmclMjBoZWxtZXQlMjBzaGllbGR8ZW58MXx8fHwxNzc0ODE2ODkxfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="" // Decorative image
              className="w-full h-full object-contain opacity-70"
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div>
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
                <Zap className="h-4 w-4 text-yellow-300" />
                <span className="text-sm font-semibold">The #1 Platform for CSU IS Students</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight font-bold">
                Your Career Journey
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Starts Here
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-green-50 leading-relaxed">
                Discover Cleveland's best internships, compare salaries, and learn from peers—all in one place.
              </p>

              {/* Resolved nested button/link and touch target size issues */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {!user ? (
                  <>
                    <Button asChild size="lg" className="w-full sm:w-auto bg-white text-green-800 hover:bg-green-50 font-bold text-lg px-8 py-6 rounded-xl shadow-xl">
                      <Link to="/companies">
                        <Rocket className="h-5 w-5 mr-2" aria-hidden="true" />
                        Explore Companies
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-800 font-semibold text-lg px-8 py-6 rounded-xl">
                      <Link to="/salaries">
                        <DollarSign className="h-5 w-5 mr-2" aria-hidden="true" />
                        View Salaries
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild size="lg" className="w-full sm:w-auto bg-white text-green-800 hover:bg-green-50 font-bold text-lg px-8 py-6 rounded-xl shadow-xl">
                      <Link to="/companies">
                        <Building2 className="h-5 w-5 mr-2" aria-hidden="true" />
                        Browse Companies
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-800 font-semibold text-lg px-8 py-6 rounded-xl">
                      <Link to="/reviews">
                        <Star className="h-5 w-5 mr-2" aria-hidden="true" />
                        Read Reviews
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-6 text-green-100">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" aria-hidden="true" />
                  <span className="text-sm">100% Free</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" aria-hidden="true" />
                  <span className="text-sm">CSU Vikings Exclusive</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" aria-hidden="true" />
                  <span className="text-sm">50+ Active Students</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-300 border-4 border-green-800">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="text-6xl" aria-hidden="true">⚔️</div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Cleveland State Vikings</h2>
                      <p className="text-green-800 font-semibold">Information Systems</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl border-2 border-green-200">
                        <div className="flex items-center space-x-2 mb-1">
                          <Building2 className="h-5 w-5 text-green-700" aria-hidden="true" />
                          <span className="text-3xl font-bold text-green-900">22</span>
                        </div>
                        <p className="text-sm text-green-700 font-medium">Companies</p>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl border-2 border-gray-200">
                        <div className="flex items-center space-x-2 mb-1">
                          <Star className="h-5 w-5 text-gray-700 fill-gray-700" aria-hidden="true" />
                          <span className="text-3xl font-bold text-gray-900">32</span>
                        </div>
                        <p className="text-sm text-gray-700 font-medium">Reviews</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-5 rounded-2xl border-2 border-green-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl" aria-hidden="true">🏢</span>
                          <div>
                            <p className="font-bold text-gray-900">Top Companies</p>
                            <p className="text-sm text-green-700">Ready to hire Vikings</p>
                          </div>
                        </div>
                        <Badge className="bg-green-700 text-white border-0">New</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                        <span className="font-semibold text-gray-900">4.8 Average Rating</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" aria-hidden="true">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 -mt-16 mb-20 relative z-20">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="border-0 shadow-xl bg-white">
                <CardContent className="pt-6 pb-6 text-center">
                  <div className={`${stat.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`h-8 w-8 ${stat.color}`} aria-hidden="true" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 text-base mb-4">
              Why Students Love Us
            </Badge>
            <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent font-bold">
              Everything You Need to Land Your Dream Internship
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built by CSU students, for CSU students. No fluff, just real data and real experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="relative border-2 h-full">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Target className="h-10 w-10 text-white" aria-hidden="true" />
                </div>
                {/* Fixed heading level to maintain semantic order */}
                <CardTitle as="h3" className="text-2xl mb-3">Cleveland-Focused</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Only companies actively hiring CSU IS students in the Cleveland area.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-600" aria-hidden="true" />
                    <span>22+ Local Employers</span>
                  </li>
                  <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-600" aria-hidden="true" />
                    <span>Cleveland Metro Area</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative border-2 h-full">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Heart className="h-10 w-10 text-white" aria-hidden="true" />
                </div>
                <CardTitle as="h3" className="text-2xl mb-3">Real Student Reviews</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Honest feedback from your peers. Learn about interview processes and culture.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-purple-600" aria-hidden="true" />
                    <span>32+ Verified Reviews</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative border-2 h-full">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <DollarSign className="h-10 w-10 text-white" aria-hidden="true" />
                </div>
                <CardTitle as="h3" className="text-2xl mb-3">Transparent Salaries</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Know your worth before you apply. Anonymous salary data helps you negotiate.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-blue-600" aria-hidden="true" />
                    <span>Real Compensation Data</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Badge className="bg-blue-100 text-blue-700 px-4 py-1 text-sm mb-3">
                Featured Opportunities
              </Badge>
              <h2 className="text-4xl mb-2 font-bold">🏆 Top Rated Companies</h2>
              <p className="text-lg text-muted-foreground">
                Highest rated by CSU IS students based on real internship experiences
              </p>
            </div>
            {/* Added aria-label to resolve identical link issues */}
            <Link to="/companies" className="hidden md:block" aria-label="View all top-rated companies">
              <Button variant="outline" size="lg" className="font-semibold">
                View All <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCompanies.map((company, index) => (
              <Link key={company.id} to={`/companies/${company.id}`} className="group">
                <Card className="h-full hover:shadow-2xl transition-all border-2 relative overflow-hidden">
                  {index < 3 && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className={`${
                        index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                        index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                        'bg-gradient-to-r from-orange-400 to-red-500'
                      } text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg`}>
                        #{index + 1}
                      </div>
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="text-6xl group-hover:scale-110 transition-transform" aria-hidden="true">{company.logo}</div>
                      <div className="flex-1">
                        <CardTitle as="h3" className="text-xl group-hover:text-blue-600 transition-colors mb-1 font-bold">
                          {company.name}
                        </CardTitle>
                        <CardDescription className="flex items-center text-sm">
                          <Globe className="h-3 w-3 mr-1" aria-hidden="true" />
                          {company.location}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between bg-yellow-50 p-4 rounded-xl mb-3">
                      <div className="flex items-center space-x-2">
                        <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                        <span className="font-bold text-2xl">{company.avgRating.toFixed(1)}</span>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-0">{company.csuHires} hires</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Badge className="bg-purple-100 text-purple-700 px-4 py-1 text-sm mb-3">
                Student Experiences
              </Badge>
              <h2 className="text-4xl mb-2 font-bold">💬 What Students Are Saying</h2>
            </div>
            {/* Added aria-label to resolve identical link issues */}
            <Link to="/reviews" className="hidden md:block" aria-label="View all student internship reviews">
              <Button variant="outline" size="lg" className="font-semibold">
                View All <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentReviews.map((review) => {
              const company = mockCompanies.find((c) => c.id === review.companyId);
              return (
                <Card key={review.id} className="h-full flex flex-col border-2">
                  <CardHeader className="bg-purple-50">
                    <div className="flex items-center space-x-3">
                      <div className="text-4xl" aria-hidden="true">{company?.logo}</div>
                      <div>
                        <CardTitle as="h3" className="text-lg font-bold">{company?.name}</CardTitle>
                        <CardDescription className="text-xs">{review.internshipRole}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 flex-1">
                    <p className="text-sm italic">"{review.pros}"</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

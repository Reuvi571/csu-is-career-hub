import { useState } from "react";
import { Link } from "react-router";
import { mockAlumniProfiles, mockCompanies } from "../data/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { GraduationCap, MapPin, Briefcase, Search, Linkedin, Mail, Users, Award, ExternalLink } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export function AlumniPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [mentorsOnly, setMentorsOnly] = useState(false);

  // Filter alumni based on search and filters
  const filteredAlumni = mockAlumniProfiles.filter((alumni) => {
    const matchesSearch =
      alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.currentRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.currentCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCompany = selectedCompany === "all" || alumni.companyId === selectedCompany;
    const matchesMentor = !mentorsOnly || alumni.willingToMentor;

    return matchesSearch && matchesCompany && matchesMentor;
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getCompanyEmoji = (companyId: string) => {
    const company = mockCompanies.find((c) => c.id === companyId);
    return company?.logo || "🏢";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl mb-3 flex items-center">
          <GraduationCap className="h-10 w-10 mr-3 text-[#2d694f]" />
          CSU Alumni Network
        </h1>
        <p className="text-lg text-muted-foreground">
          Connect with CSU IS/IST alumni working at top Cleveland companies. Get career advice, interview tips, and mentorship from Vikings who've been where you are! 🎓⚔️
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-[#2d694f] bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Alumni</p>
                <p className="text-3xl font-bold text-[#2d694f]">{mockAlumniProfiles.length}</p>
              </div>
              <Users className="h-12 w-12 text-[#2d694f] opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#7ebc45] bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available Mentors</p>
                <p className="text-3xl font-bold text-[#2d694f]">
                  {mockAlumniProfiles.filter((a) => a.willingToMentor).length}
                </p>
              </div>
              <Award className="h-12 w-12 text-[#7ebc45] opacity-60" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#274c37] bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Companies</p>
                <p className="text-3xl font-bold text-[#274c37]">
                  {new Set(mockAlumniProfiles.map((a) => a.companyId)).size}
                </p>
              </div>
              <Briefcase className="h-12 w-12 text-[#274c37] opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Find Alumni</CardTitle>
          <CardDescription>Search by name, role, company, or skills</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alumni..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger>
                <SelectValue placeholder="All Companies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {mockCompanies
                  .filter((company) =>
                    mockAlumniProfiles.some((alumni) => alumni.companyId === company.id)
                  )
                  .map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.logo} {company.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button
              variant={mentorsOnly ? "default" : "outline"}
              onClick={() => setMentorsOnly(!mentorsOnly)}
              className="w-full"
            >
              <Award className="h-4 w-4 mr-2" />
              {mentorsOnly ? "Showing Mentors Only" : "Show Mentors Only"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredAlumni.length} of {mockAlumniProfiles.length} alumni
        </p>
      </div>

      {/* Alumni Grid */}
      {filteredAlumni.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No alumni found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setSelectedCompany("all");
                setMentorsOnly(false);
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((alumni) => (
            <Card key={alumni.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg bg-[#2d694f] text-white">
                      {getInitials(alumni.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{alumni.name}</CardTitle>
                    <CardDescription className="text-sm">
                      Class of {alumni.graduationYear}
                    </CardDescription>
                    {alumni.willingToMentor && (
                      <Badge variant="default" className="mt-2 bg-[#2d694f]">
                        <Award className="h-3 w-3 mr-1" />
                        Available to Mentor
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Position */}
                <div>
                  <div className="flex items-start space-x-2 mb-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate">{alumni.currentRole}</p>
                      <Link to={`/companies/${alumni.companyId}`}>
                        <p className="text-sm text-[#2d694f] hover:underline flex items-center">
                          {getCompanyEmoji(alumni.companyId)} {alumni.currentCompany}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </p>
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{alumni.location}</span>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{alumni.bio}</p>
                </div>

                {/* Skills */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">KEY SKILLS</p>
                  <div className="flex flex-wrap gap-1">
                    {alumni.skills.slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {alumni.skills.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{alumni.skills.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Internship History */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">
                    INTERNSHIP HISTORY
                  </p>
                  <div className="space-y-1">
                    {alumni.internshipHistory.slice(0, 2).map((internship, idx) => (
                      <p key={idx} className="text-xs text-muted-foreground truncate">
                        • {internship}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="flex space-x-2 pt-2">
                  <a
                    href={`mailto:${alumni.email}`}
                    className="flex-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </a>
                  {alumni.linkedIn && (
                    <a
                      href={alumni.linkedIn}
                      className="flex-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="default" size="sm" className="w-full bg-[#2d694f] hover:bg-[#274c37]">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* CTA Section */}
      <Card className="mt-12 bg-[#2d694f] text-white border-0">
        <CardContent className="py-12 text-center">
          <h2 className="text-3xl mb-4">Want to Join the Alumni Network?</h2>
          <p className="text-lg mb-6 text-white/85">
            Graduate, land your dream job, and come back to help the next generation of Vikings! 🎓
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/companies">
              <Button variant="secondary" size="lg">
                <Briefcase className="h-5 w-5 mr-2" />
                Explore Companies
              </Button>
            </Link>
            <Link to="/reviews">
              <Button variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white/10">
                <Award className="h-5 w-5 mr-2" />
                Read Reviews
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

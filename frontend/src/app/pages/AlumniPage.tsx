import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { PageIntro } from "../components/PageIntro";
import { GraduationCap, MapPin, Briefcase, Search, Linkedin, Mail, Users, Building2, MessageSquare, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

interface AlumniRecord {
  id: number;
  name: string;
  company: {
    id: number;
    name: string;
  };
  role: string;
  headline: string;
  location: string;
  bio: string;
  how_they_got_there: string;
  advice_for_students: string;
  internship_history: string[];
  skills: string[];
  is_mentor: boolean;
  open_to_questions: boolean;
  open_to_referrals: boolean;
  email: string;
  linkedin_url: string;
  graduation_year: number;
}

export function AlumniPage() {
  const [searchParams] = useSearchParams();
  const [alumni, setAlumni] = useState<AlumniRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(searchParams.get("company") ?? "all");
  const [mentorFilter, setMentorFilter] = useState("all");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/alumni/")
      .then((res) => res.json())
      .then((data: AlumniRecord[]) => {
        setAlumni(data);
      })
      .catch(() => {
        setAlumni([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const companyOptions = useMemo(() => {
    return Array.from(new Map(alumni.map((record) => [record.company.id, record.company])).values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [alumni]);

  const filteredAlumni = useMemo(() => {
    return alumni.filter((record) => {
      const matchesSearch =
        !searchQuery ||
        record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCompany = selectedCompany === "all" || String(record.company.id) === selectedCompany;
      const matchesMentor =
        mentorFilter === "all" ||
        (mentorFilter === "mentors" && record.is_mentor) ||
        (mentorFilter === "questions" && record.open_to_questions);

      return matchesSearch && matchesCompany && matchesMentor;
    });
  }, [alumni, mentorFilter, searchQuery, selectedCompany]);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((segment) => segment[0])
      .join("")
      .toUpperCase();

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#2d694f]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageIntro
        badge="CSU Information Systems alumni network"
        title="Alumni connections and career paths"
        description="Explore how CSU alumni reached internships, co-ops, and full-time roles, then use their profiles to ask questions, learn from their path, and build warmer connections with employers."
        secondaryDescription="Each profile is tied back to a real employer page so current students can move from company research to alumni outreach without leaving the hub."
      />

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="rounded-none border border-[#d5d8db] bg-white shadow-none">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[#2d694f]">CSU alumni</p>
                <p className="mt-2 text-4xl font-bold text-[#2d694f]">{alumni.length}</p>
              </div>
              <Users className="h-10 w-10 text-[#2d694f]" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-none border border-[#d5d8db] bg-white shadow-none">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[#2d694f]">Available mentors</p>
                <p className="mt-2 text-4xl font-bold text-[#2d694f]">{alumni.filter((record) => record.is_mentor).length}</p>
              </div>
              <MessageSquare className="h-10 w-10 text-[#7ebc45]" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-none border border-[#d5d8db] bg-white shadow-none">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[#2d694f]">Employer connections</p>
                <p className="mt-2 text-4xl font-bold text-[#2d694f]">{companyOptions.length}</p>
              </div>
              <Building2 className="h-10 w-10 text-[#2d694f]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8 rounded-none border border-[#d5d8db] bg-white shadow-none">
        <CardHeader>
          <CardTitle className="text-[#2d694f]">Find alumni by company, role, or mentoring availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1.6fr)_220px_220px]">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-[#5f6368]" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="rounded-none border-[#d5d8db] bg-white pl-9"
                placeholder="Search by alumni name, company, role, or skill"
              />
            </div>
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="rounded-none border-[#d5d8db] bg-white">
                <SelectValue placeholder="All employers" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectItem value="all">All employers</SelectItem>
                {companyOptions.map((company) => (
                  <SelectItem key={company.id} value={String(company.id)}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={mentorFilter} onValueChange={setMentorFilter}>
              <SelectTrigger className="rounded-none border-[#d5d8db] bg-white">
                <SelectValue placeholder="All alumni" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectItem value="all">All alumni</SelectItem>
                <SelectItem value="mentors">Mentors only</SelectItem>
                <SelectItem value="questions">Open to questions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 flex items-center justify-between text-sm text-[#5f6368]">
        <p>
          Showing {filteredAlumni.length} of {alumni.length} alumni profiles
        </p>
        <Link to="/companies" className="hidden md:block">
          <Button variant="outline" className="rounded-none border-[#2d694f] text-[#2d694f] hover:bg-white hover:text-[#274c37]">
            Browse Companies <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {filteredAlumni.length === 0 ? (
        <Card className="rounded-none border border-[#d5d8db] bg-white shadow-none">
          <CardContent className="py-12 text-center text-[#5f6368]">
            No alumni profiles match the current filters.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredAlumni.map((record) => (
            <Card key={record.id} className="rounded-none border border-[#d5d8db] bg-white shadow-none">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 rounded-none">
                    <AvatarFallback className="rounded-none bg-[#2d694f] text-lg font-semibold text-white">
                      {getInitials(record.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-bold text-[#2d694f]">{record.name}</h2>
                      {record.is_mentor && (
                        <Badge className="rounded-none border border-[#7ebc45] bg-white text-[#2d694f]">
                          Mentor
                        </Badge>
                      )}
                      {record.open_to_referrals && (
                        <Badge className="rounded-none border border-[#7ebc45] bg-white text-[#2d694f]">
                          Open to referrals
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-base font-semibold text-[#3d4348]">{record.role}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-[#5f6368]">
                      <span className="inline-flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-[#2d694f]" />
                        <Link to={`/companies/${record.company.id}`} className="text-[#2d694f] hover:underline">
                          {record.company.name}
                        </Link>
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#2d694f]" />
                        {record.location}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-[#2d694f]" />
                        Class of {record.graduation_year}
                      </span>
                    </div>
                    {record.headline && <p className="mt-3 text-sm text-[#5f6368]">{record.headline}</p>}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5 border-t border-[#d5d8db] pt-6">
                  <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#2d694f]">How they got there</p>
                    <p className="text-sm leading-7 text-[#5f6368]">{record.how_they_got_there || record.bio}</p>
                  </div>

                  {record.internship_history.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#2d694f]">Relevant experience</p>
                      <div className="flex flex-wrap gap-2">
                        {record.internship_history.map((item) => (
                          <Badge key={item} className="rounded-none border border-[#d5d8db] bg-white text-[#3d4348]">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#2d694f]">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {record.skills.map((skill) => (
                        <Badge key={skill} className="rounded-none border border-[#7ebc45] bg-white text-[#2d694f]">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-[#d5d8db] pt-6 sm:flex-row">
                  <Link to={`/alumni/${record.id}`} className="flex-1">
                    <Button className="w-full rounded-none bg-[#2d694f] hover:bg-[#274c37]">View Profile</Button>
                  </Link>
                  {record.email && (
                    <a href={`mailto:${record.email}`} className="flex-1">
                      <Button variant="outline" className="w-full rounded-none border-[#2d694f] text-[#2d694f] hover:bg-white hover:text-[#274c37]">
                        <Mail className="mr-2 h-4 w-4" />
                        Ask a Question
                      </Button>
                    </a>
                  )}
                  {record.linkedin_url && (
                    <a href={record.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button variant="outline" className="w-full rounded-none border-[#2d694f] text-[#2d694f] hover:bg-white hover:text-[#274c37]">
                        <Linkedin className="mr-2 h-4 w-4" />
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
    </div>
  );
}

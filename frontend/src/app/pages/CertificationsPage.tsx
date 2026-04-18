import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { PageIntro } from "../components/PageIntro";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Award } from "lucide-react";

interface Certification {
  id: number;
  name: string;
  description: string;
  organization: string;
  roles: string[];
  job_count: number;
}

export function CertificationsPage() {
  const navigate = useNavigate();
  const [certifications, setcertifications] = useState<Certification[]>([]);
  const [filteredCertifications, setFilteredCertifications] =
    useState<Certification[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // Fetch all certifications
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/certifications/")
      .then((res) => res.json())
      .then((data) => {
        console.log("CERTIFICATIONS:", data);
        setcertifications(data);
        setFilteredCertifications(data);

        // Extract unique roles from all certifications
        const allRoles = new Set<string>();
        data.forEach((cert: Certification) => {
          cert.roles.forEach((role) => allRoles.add(role));
        });
        setRoles(Array.from(allRoles).sort());
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching certifications:", err);
        setLoading(false);
      });
  }, []);

  // Filter certifications by selected role
  useEffect(() => {
    if (selectedRole && selectedRole !== "all") {
      const filtered = certifications.filter((cert) =>
        cert.roles.some(
          (role) => role.toLowerCase() === selectedRole.toLowerCase()
        )
      );
      setFilteredCertifications(filtered);
    } else {
      setFilteredCertifications(certifications);
    }
  }, [selectedRole, certifications]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d694f]"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-8 py-12">
      <PageIntro
        badge="Professional development and role alignment"
        title="Professional Certifications"
        description="Review certifications connected to current role tracks and see which credentials show up most often across CSU-relevant opportunities."
      />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <label htmlFor="role-filter" className="text-sm font-medium text-gray-700">
            Filter by Role:
          </label>
          <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value)}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredCertifications.length === 0 ? (
        <div className="text-center py-12">
          <Award className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">
            No certifications found for the selected role.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertifications.map((cert) => (
            <div
              key={cert.id}
              className="border rounded-lg p-6 hover:shadow-lg hover:border-[#2d694f] transition-all cursor-pointer bg-white"
              onClick={() => navigate(`/certifications/${cert.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#2d694f] mb-1">
                    {cert.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">
                    {cert.organization}
                  </p>
                </div>
                <Award className="h-5 w-5 text-[#7ebc45] flex-shrink-0" />
              </div>

              <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                {cert.description}
              </p>

              {cert.roles.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    Roles:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cert.roles.slice(0, 2).map((role) => (
                      <Badge key={role} variant="secondary" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                    {cert.roles.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{cert.roles.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 pt-4 border-t">
                <span>
                  {cert.job_count} job{cert.job_count !== 1 ? "s" : ""} available
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

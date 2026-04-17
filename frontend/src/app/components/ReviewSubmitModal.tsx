import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface ReviewCompany {
  id?: number;
  name: string;
  internshipRoles: string[];
}

interface ReviewUser {
  id?: string;
  name?: string;
}

interface ReviewSubmitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: ReviewCompany;
  user?: ReviewUser;
}

export function ReviewSubmitModal({
  open,
  onOpenChange,
  company,
}: ReviewSubmitModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [internshipRole, setInternshipRole] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [interview, setInterview] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [skills, setSkills] = useState("");

  const handleSubmit = async () => {
    if (!rating || !internshipRole || !semester || !year || !pros || !cons || !interview || !recommendation) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/reviews/submit/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_id: company.id,
          role: internshipRole === "other" ? "Other" : internshipRole,
          rating,
          pros,
          cons,
          interview_process: interview,
          recommendation,
          skills_used: skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
          semester,
          year,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to submit review");
      }

      toast.success("Review submitted. It will appear after admin approval.");

      setRating(0);
      setInternshipRole("");
      setSemester("");
      setYear("");
      setPros("");
      setCons("");
      setInterview("");
      setRecommendation("");
      setSkills("");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit review");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Write a Review for {company.name}</DialogTitle>
          <DialogDescription>
            Share your internship experience to help fellow CSU IS students
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Overall Rating *</Label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <Star
                  key={value}
                  className={`h-8 w-8 cursor-pointer transition-colors ${
                    value <= (hoveredRating || rating)
                      ? "fill-[#7ebc45] text-[#7ebc45]"
                      : "text-gray-300"
                  }`}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(value)}
                />
              ))}
              {rating > 0 && (
                <span className="text-sm text-muted-foreground ml-2">
                  {rating} out of 5 stars
                </span>
              )}
            </div>
          </div>

          {/* Internship Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Internship Role *</Label>
            <Select value={internshipRole} onValueChange={setInternshipRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {company.internshipRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Period */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semester">Semester *</Label>
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Summer">Summer</SelectItem>
                  <SelectItem value="Fall">Fall</SelectItem>
                  <SelectItem value="Spring">Spring</SelectItem>
                  <SelectItem value="Co-op">Co-op (Multiple)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                placeholder="2025"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
          </div>

          {/* Pros */}
          <div className="space-y-2">
            <Label htmlFor="pros">What did you like? *</Label>
            <Textarea
              id="pros"
              placeholder="Describe the positive aspects of your internship..."
              value={pros}
              onChange={(e) => setPros(e.target.value)}
              rows={3}
            />
          </div>

          {/* Cons */}
          <div className="space-y-2">
            <Label htmlFor="cons">What could be improved? *</Label>
            <Textarea
              id="cons"
              placeholder="Describe any challenges or areas for improvement..."
              value={cons}
              onChange={(e) => setCons(e.target.value)}
              rows={3}
            />
          </div>

          {/* Interview */}
          <div className="space-y-2">
            <Label htmlFor="interview">Interview Process *</Label>
            <Textarea
              id="interview"
              placeholder="Describe the interview process, questions asked, and any tips..."
              value={interview}
              onChange={(e) => setInterview(e.target.value)}
              rows={3}
            />
          </div>

          {/* Recommendation */}
          <div className="space-y-2">
            <Label htmlFor="recommendation">Would you recommend this internship? *</Label>
            <Textarea
              id="recommendation"
              placeholder="Share your overall recommendation and advice for future applicants..."
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              rows={2}
            />
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skills">Skills Used (Optional)</Label>
            <Input
              id="skills"
              placeholder="React, SQL, Java (comma separated)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              List the technical skills you used during your internship
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button onClick={handleSubmit} className="flex-1">
              Submit Review
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Your review will be visible after admin approval. Reviews help future students make informed decisions.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

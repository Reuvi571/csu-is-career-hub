import { useNavigate, useOutletContext } from "react-router";
import { Award, Bookmark, ExternalLink } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { PageIntro } from "../components/PageIntro";
import { SavedItems, User } from "../types/user";

export function SavedCertificationsPage() {
  const navigate = useNavigate();
  const { user, loadingUser, savedItems, toggleSavedItem, openAuthModal } = useOutletContext<{
    user: User | null;
    loadingUser: boolean;
    savedItems: SavedItems;
    toggleSavedItem: (itemType: "certification", itemId: number) => Promise<boolean>;
    openAuthModal: () => void;
  }>();

  if (loadingUser) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#2d694f]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="border border-[#d5d8db] bg-white p-10 text-center">
          <h1 className="text-3xl font-bold text-[#2d694f]">Saved Certifications</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#5f6368]">
            Sign in to view the certifications you have bookmarked and revisit them in one place.
          </p>
          <Button
            onClick={openAuthModal}
            className="mt-6 rounded-none bg-[#2d694f] hover:bg-[#274c37]"
          >
            Sign In to View Saved Certifications
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-8 py-12">
      <PageIntro
        badge="Your saved learning plan"
        title="Saved Certifications"
        description="Keep track of certifications you bookmarked while exploring jobs and role pathways."
      />

      {savedItems.certifications.length === 0 ? (
        <div className="border border-[#d5d8db] bg-white px-6 py-14 text-center">
          <Award className="mx-auto mb-4 h-12 w-12 text-[#7ebc45]" />
          <h2 className="text-2xl font-bold text-[#2d694f]">No saved certifications yet</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[#5f6368]">
            Save certifications from their detail pages and they will show up here just like your saved jobs.
          </p>
          <Button
            onClick={() => navigate("/certifications")}
            className="mt-6 rounded-none bg-[#2d694f] hover:bg-[#274c37]"
          >
            Browse Certifications
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-none border border-[#d5d8db] bg-white px-6 py-4 text-sm font-medium text-[#5f6368]">
            {savedItems.certifications.length} saved certification{savedItems.certifications.length === 1 ? "" : "s"}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedItems.certifications.map((certification) => (
              <div
                key={certification.id}
                className="flex h-full flex-col border border-[#d5d8db] bg-white p-6 transition-all hover:border-[#2d694f] hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-[#2d694f]">{certification.name}</h2>
                    <p className="mt-1 text-sm font-medium text-[#5f6368]">{certification.organization}</p>
                  </div>
                  <Award className="h-5 w-5 flex-shrink-0 text-[#7ebc45]" />
                </div>

                <div className="mb-6">
                  <Badge className="border border-[#7ebc45] bg-white text-[#2d694f]">
                    Saved
                  </Badge>
                </div>

                <div className="mt-auto space-y-3">
                  <Button
                    onClick={() => navigate(`/certifications/${certification.id}`)}
                    className="w-full rounded-none bg-[#2d694f] hover:bg-[#274c37]"
                  >
                    View Details
                  </Button>

                  {certification.officialUrl && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-none border-[#2d694f] text-[#2d694f] hover:bg-white hover:text-[#274c37]"
                    >
                      <a href={certification.officialUrl} target="_blank" rel="noopener noreferrer">
                        Official Page
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => toggleSavedItem("certification", certification.id)}
                    className="w-full rounded-none border-[#2d694f] text-[#2d694f] hover:bg-white hover:text-[#274c37]"
                  >
                    <Bookmark className="mr-2 h-4 w-4" />
                    Remove from Saved
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

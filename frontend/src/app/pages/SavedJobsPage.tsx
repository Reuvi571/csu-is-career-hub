import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import { Button } from "../components/ui/button";
import { JobsBoard, JobRecord } from "../components/JobsBoard";
import { SavedItems, User } from "../types/user";

export function SavedJobsPage() {
  const { user, loadingUser, savedItems, toggleSavedItem, openAuthModal, refreshCurrentUser } = useOutletContext<{
    user: User | null;
    loadingUser: boolean;
    savedItems: SavedItems;
    toggleSavedItem: (itemType: "job", itemId: string) => Promise<boolean>;
    openAuthModal: () => void;
    refreshCurrentUser: () => Promise<void> | void;
  }>();
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setJobs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch("http://127.0.0.1:8000/api/jobs/saved/", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unable to load saved jobs");
        }
        return res.json();
      })
      .then((data: JobRecord[]) => {
        setJobs(data);
      })
      .catch(() => {
        setJobs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

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
          <h1 className="text-3xl font-bold text-[#2d694f]">Saved Jobs</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#5f6368]">
            Sign in to view the job postings you have saved and revisit them in one place.
          </p>
          <Button
            onClick={openAuthModal}
            className="mt-6 rounded-none bg-[#2d694f] hover:bg-[#274c37]"
          >
            Sign In to View Saved Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <JobsBoard
      jobs={jobs}
      loading={loading}
      title="Saved Jobs"
      subtitle="{count} saved postings"
      emptyListMessage="You have not saved any jobs yet."
      user={user}
      savedItems={savedItems}
      toggleSavedItem={toggleSavedItem}
      openAuthModal={openAuthModal}
      refreshCurrentUser={refreshCurrentUser}
      savedOnly
    />
  );
}

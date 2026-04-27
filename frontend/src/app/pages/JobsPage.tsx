import { useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router";
import { JobsBoard, JobRecord } from "../components/JobsBoard";
import { SavedItems, User } from "../types/user";

export function JobsPage() {
  const location = useLocation();
  const { user, savedItems, toggleSavedItem, openAuthModal, refreshCurrentUser } = useOutletContext<{
    user: User | null;
    savedItems: SavedItems;
    toggleSavedItem: (itemType: "job", itemId: string) => Promise<boolean>;
    openAuthModal: () => void;
    refreshCurrentUser: () => Promise<void> | void;
  }>();
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/jobs/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data: JobRecord[]) => {
        setJobs(data);
      })
      .catch(() => {
        setJobs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <JobsBoard
      jobs={jobs}
      loading={loading}
      title="Job Opportunities"
      subtitle="{count} positions available"
      emptyListMessage="No jobs found matching your filters"
      user={user}
      savedItems={savedItems}
      toggleSavedItem={toggleSavedItem}
      openAuthModal={openAuthModal}
      refreshCurrentUser={refreshCurrentUser}
      initialSelectedJobId={location.state?.selectedJobId}
    />
  );
}

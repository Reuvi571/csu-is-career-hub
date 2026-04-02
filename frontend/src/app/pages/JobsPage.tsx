import { useEffect, useState } from "react";

export function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/jobs/")
      .then(res => res.json())
      .then(data => {
        console.log("JOBS:", data);
        setJobs(data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl mb-6">Jobs</h1>

      {jobs.length === 0 ? (
        <p>No jobs found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map(job => (
            <div key={job.id} className="border rounded p-4">
              <h3 className="text-lg">{job.title}</h3>
              <p>{job.company.name}</p>
              <p>{job.location}</p>
              <p className="text-sm text-gray-500">
                Posted: {job.date_posted}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
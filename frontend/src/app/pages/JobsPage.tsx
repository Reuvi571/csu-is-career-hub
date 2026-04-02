import { useEffect, useState } from "react";

export function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  // New state to track which job is currently clicked
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

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
    <div className="max-w-7xl mx-auto p-8 relative">
      <h1 className="text-3xl mb-6 font-bold text-gray-900">Jobs</h1>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <div 
              key={job.id} 
              // Added hover effects and cursor-pointer to show it's clickable
              className="border rounded-lg p-5 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer bg-white"
              onClick={() => setSelectedJob(job)}
            >
              <h3 className="text-xl font-semibold text-blue-600 mb-1">{job.title}</h3>
              {/* Handling the nested company object William set up */}
              <p className="font-medium text-gray-800">{job.company?.name || job.company}</p>
              <p className="text-gray-600 mb-4">{job.location}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{job.experience_level}</span>
                <span>Posted: {new Date(job.date_posted).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* The Detail Modal Overlay */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl">
            {/* Close Button (X) */}
            <button 
              className="absolute top-4 right-5 text-gray-400 hover:text-gray-800 text-3xl font-bold transition-colors"
              onClick={() => setSelectedJob(null)}
            >
              &times;
            </button>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedJob.title}</h2>
            <p className="text-xl font-semibold text-blue-600 mb-1">{selectedJob.company?.name || selectedJob.company}</p>
            <p className="text-gray-600 mb-8">{selectedJob.location}</p>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-900 border-b pb-2 mb-3 text-lg">Job Description</h4>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedJob.description || "No description provided."}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Experience Level</h4>
                  <p className="text-gray-700">{selectedJob.experience_level || "Not specified"}</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Required Skills</h4>
                  <p className="text-gray-700">{selectedJob.skills_required || "Not specified"}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 border-b pb-2 mb-3 text-lg">Recommended Certifications</h4>
                {/* Fallback to "None" if the database field is empty */}
                <p className="text-gray-700">{selectedJob.certs_recommended || "None"}</p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t flex justify-end gap-3">
              <button 
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                onClick={() => setSelectedJob(null)}
              >
                Close
              </button>
              <button 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                onClick={() => alert("Application feature coming next sprint!")}
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

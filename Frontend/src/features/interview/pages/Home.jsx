import React, { useEffect, useRef, useState } from "react";
import "./home.style.css";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";

const Home = () => {
  const { loading, generateReport, getReports, reports } = useInterview();
  const { user, handleLogout } = useAuth();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const navigate = useNavigate();

  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleGenerateReport = async () => {
    if (!resumeFile) {
      alert("Please upload a PDF resume first");
      return;
    }

    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });
    const interviewId = data?.interviewReport?._id ?? data?._id;

    if (interviewId) {
      navigate(`/interview/${interviewId}`);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleGenerate = () => {
    // TODO: wire up to API call
    console.log("Generating interview report", { resumeFile });
  };

  useEffect(() => {
    getReports();
  }, []);

  return (
    <>
      <header className="navbar">
        <div>
          <h1>ResumeDarzi</h1>
          <p>AI Resume & Interview Report Generator</p>
        </div>

        <button onClick={()=>{handleLogout()}} className="logout-btn">Logout</button>
      </header>

      <main className="home">
        <div className="left">
          <label htmlFor="jobDescription">Job Description</label>
          <textarea
            onChange={(e) => {
              setJobDescription(e.target.value);
            }}
            name="jobDescription"
            id="jobDescription"
            placeholder="Enter job Description here.."
          ></textarea>
        </div>

        <div className="right">
          <div className="inputGroup">
            <label htmlFor="resume">Upload Resume</label>

            <div
              className={`dropzone${isDragging ? " dropzone--active" : ""}${
                resumeFile ? " dropzone--filled" : ""
              }`}
              onClick={handleDropzoneClick}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <svg
                className="dropzone-icon"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M12 18v-6" />
                <path d="M9.5 14.5 12 12l2.5 2.5" />
              </svg>

              <p className="dropzone-text">
                {resumeFile ? (
                  resumeFile.name
                ) : (
                  <>
                    Drag and drop your PDF here, or{" "}
                    <span className="dropzone-browse">browse</span>
                  </>
                )}
              </p>
              <p className="dropzone-hint">
                {resumeFile ? "Click to replace" : "PDF only, up to 3MB"}
              </p>

              <input
                ref={fileInputRef}
                type="file"
                name="resume"
                id="resume"
                accept=".pdf"
                onChange={handleFileChange}
                hidden
              />
            </div>
          </div>

          <div className="inputGroup">
            <label htmlFor="selfDescription">Self Description</label>
            <textarea
              onChange={(e) => {
                setSelfDescription(e.target.value);
              }}
              name="selfDescription"
              id="selfDescription"
              placeholder="Describe your self in few Sentences..."
            ></textarea>
          </div>

          <button className="generate-Btn" onClick={handleGenerateReport}>
            Generate Interview Report
          </button>
        </div>
        <div>
        <div className="report-history">My Recent interview Plans</div>
        {reports.length > 0 && (
            <section className="reports-list">
            {reports.map((report) => (
                <li
                key={report._id}
                className="report-item"
                onClick={() => navigate(`/interview/${report._id}`)}
                >
                <h3>{report.title || "Untitled Position"}</h3>

                <p className="report-meta">
                  Generated on {new Date(report.createdAt).toLocaleDateString()}
                </p>
                <p className="report-meta">
                  Match Score: <span>{report.matchScore}%</span>
                </p>
              </li>
            ))}
          </section>
        )}
        </div>
      </main>
    </>
  );
};

export default Home;

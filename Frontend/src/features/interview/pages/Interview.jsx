import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "./interview.style.css";
import { useInterview } from "../hooks/useInterview";

const NAV_ITEMS = [
  {
    id: "technical",
    label: "Technical Questions",
    icon: <path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13 5l-2 14" />,
  },
  {
    id: "behavioral",
    label: "Behavioral Questions",
    icon: (
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    ),
  },
  {
    id: "roadmap",
    label: "Road Map",
    icon: <path d="M3 11l19-9-9 19-2-8-8-2z" />,
  },
];

const QuestionCard = ({ item, isOpen, onToggle }) => (
  <li className="qa-card">
    <button className="qa-question" onClick={onToggle}>
      <span>{item.question}</span>
      <svg
        className={`qa-chevron${isOpen ? " qa-chevron--open" : ""}`}
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>

    {isOpen && (
      <div className="qa-body">
        <p className="qa-intention">
          <span className="qa-tag">Why they ask this</span>
          {item.intention}
        </p>
        <p className="qa-answer">
          <span className="qa-tag qa-tag--answer">Suggested answer</span>
          {item.answer}
        </p>
      </div>
    )}
  </li>
);

const QuestionList = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <ul className="content-list">
      {items.map((item, i) => (
        <QuestionCard
          key={i}
          item={item}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
        />
      ))}
    </ul>
  );
};

const Roadmap = ({ plan }) => (
  <ol className="roadmap">
    {plan.map((entry) => (
      <li key={entry.day} className="roadmap-item">
        <span className="roadmap-dot" aria-hidden="true" />
        <div className="roadmap-content">
          <h3 className="roadmap-heading">
            <span className="roadmap-day">Day {entry.day}</span>
            {entry.focus}
          </h3>
          <ul className="roadmap-tasks">
            {entry.tasks.map((task, i) => (
              <li key={i}>{task}</li>
            ))}
          </ul>
        </div>
      </li>
    ))}
  </ol>
);

// Real documents use `skillGap` (plain strings, sometimes empty) in some
// places and `skillGaps` ({ skill, severity }) in others - normalize both
// into the { skill, severity } shape the UI renders.
const normalizeSkillGaps = (report = {}) => {
  const raw = report?.skillGaps ?? report?.skillGap ?? [];
  return raw.map((entry) =>
    typeof entry === "string" ? { skill: entry, severity: "medium" } : entry,
  );
};

const scoreTier = (score) =>
  score >= 80 ? "high" : score >= 50 ? "medium" : "low";
const scoreMessage = (tier) =>
  tier === "high"
    ? "Strong match for this role"
    : tier === "medium"
      ? "Decent match, some gaps to close"
      : "Significant gaps for this role";

const MatchScoreRing = ({ score }) => {
  if (score == null) return null;
  const tier = scoreTier(score);
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="match-score">
      <p className="sidebar-label">Match Score</p>
      <div className="match-ring-wrap">
        <svg
          className={`match-ring match-ring--${tier}`}
          width="120"
          height="120"
          viewBox="0 0 120 120"
        >
          <circle
            className="match-ring-track"
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            strokeWidth="8"
          />
          <circle
            className="match-ring-value"
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="match-ring-label">
          <span className="match-ring-value-text">{score}</span>
          <span className="match-ring-percent">%</span>
        </div>
      </div>
      <p className="match-score-caption">{scoreMessage(tier)}</p>
    </div>
  );
};

const Interview = () => {
  const { interviewId } = useParams();
  const { loading, report, getReportById, getResumePdf } = useInterview();
  const [activeSection, setActiveSection] = useState("roadmap");
  const mainRef = useRef(null);

  useEffect(() => {
    if (!interviewId) return;
    getReportById(interviewId);
  }, [interviewId]);

  // The scroll container keeps its scrollTop across tab switches by
  // default, which made switching to a new section (e.g. Road Map)
  // land wherever the previous section happened to be scrolled to.
  // Reset to the top every time the active section changes.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [activeSection]);

  const data = report ?? {};
  const skillGaps = normalizeSkillGaps(data);

  const sectionCounts = {
    technical: data.technicalQuestions?.length ?? 0,
    behavioral: data.behavioralQuestions?.length ?? 0,
    roadmap: data.preparationPlan?.length ?? 0,
  };

  const renderMain = () => {
    const hasData = Boolean(
      data.technicalQuestions?.length ||
      data.behavioralQuestions?.length ||
      data.preparationPlan?.length,
    );

    if (!hasData) {
      return <p className="skill-empty">No report data available yet.</p>;
    }

    if (activeSection === "technical") {
      return <QuestionList items={data.technicalQuestions ?? []} />;
    }
    if (activeSection === "behavioral") {
      return <QuestionList items={data.behavioralQuestions ?? []} />;
    }
    return <Roadmap plan={data.preparationPlan ?? []} />;
  };

  const activeItem = NAV_ITEMS.find((item) => item.id === activeSection);
  const headerBadge =
    activeSection === "roadmap"
      ? `${sectionCounts.roadmap}-day plan`
      : `${sectionCounts[activeSection]} question${
          sectionCounts[activeSection] === 1 ? "" : "s"
        }`;

  if (loading && !report) {
    return (
      <div className="interview">
        <main className="interview-main">
          <p className="skill-empty">Loading interview report...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="interview">
      <aside className="interview-nav">
        <div>
          <p className="interview-nav-label">Sections</p>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-item${
                activeSection === item.id ? " nav-item--active" : ""
              }`}
              onClick={() => setActiveSection(item.id)}
            >
              <svg
                className="nav-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {item.icon}
              </svg>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <div>
          <button
            onClick={()=> {getResumePdf(interviewId)}}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >
            <svg
              width="18"
              height="18"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
              >
                <path d="M19 11.003V10c0-3.771 0-5.657-1.172-6.828S14.771 2 11 2h-.992L3 8.986v5.02c0 3.765 0 5.648 1.168 6.819l.007.007C5.346 22 7.229 22 10.994 22" />
                <path d="M3 9.002h1c2.828 0 4.243 0 5.121-.879C10 7.245 10 5.83 10 3.002v-1m6.407 19.596a.638.638 0 0 0 1.186 0l.037-.093a5.1 5.1 0 0 1 2.873-2.873l.093-.037a.638.638 0 0 0 0-1.186l-.093-.037A5.1 5.1 0 0 1 17.63 14.5l-.037-.093a.638.638 0 0 0-1.186 0l-.037.093a5.1 5.1 0 0 1-2.873 2.873l-.093.037a.638.638 0 0 0 0 1.186l.093.037a5.1 5.1 0 0 1 2.873 2.873z" />
              </g>
            </svg>

            <span>Download Resume</span>
          </button>
        </div>
      </aside>

      <main className="interview-main" ref={mainRef}>
        <header className="interview-main-header">
          <h2>{activeItem?.label}</h2>
          <span className="header-badge">{headerBadge}</span>
        </header>
        <div className="interview-main-body">{renderMain()}</div>
      </main>

      <aside className="interview-sidebar">
        <MatchScoreRing score={data.matchScore} />

        <p className="sidebar-label sidebar-label--gaps">Skill Gaps</p>
        <div className="skill-tags">
          {skillGaps.length === 0 ? (
            <p className="skill-empty">No skill gaps identified.</p>
          ) : (
            skillGaps.map(({ skill, severity }) => (
              <span key={skill} className={`skill-tag skill-tag--${severity}`}>
                {skill}
              </span>
            ))
          )}
        </div>
      </aside>
    </div>
  );
};

export default Interview;

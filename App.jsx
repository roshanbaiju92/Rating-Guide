import { useState, useRef, useEffect } from "react";

// ─── Data ─────────────────────────────────

const RATING_SCALE = [
  { value: 0.5, label: "Unwatchable" },
  { value: 1, label: "Barely Tolerable" },
  { value: 1.5, label: "Bad" },
  { value: 2, label: "Forgettable" },
  { value: 2.5, label: "Mediocre" },
  { value: 3, label: "Decent" },
  { value: 3.5, label: "Impactful" },
  { value: 4, label: "Very Good" },
  { value: 4.5, label: "Excellent" },
  { value: 5, label: "Masterpiece" },
];

const QUESTIONS = [
  { id: "narrative", weight: 0.2, question: "Did the story feel complete?" },
  { id: "ideas", weight: 0.3, question: "Did it have meaningful ideas?" },
  { id: "characters", weight: 0.2, question: "Were characters well written?" },
  { id: "impact", weight: 0.3, question: "Did it leave an impact?" },
];

function snap(v) {
  return Math.min(5, Math.max(0.5, Math.round(v * 2) / 2));
}

export default function App() {
  const [title, setTitle] = useState("");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const answered = QUESTIONS.filter(q => answers[q.id] != null);

  const score =
    answered.length > 0
      ? snap(
          answered.reduce((s, q) => s + answers[q.id] * q.weight, 0) /
            answered.reduce((s, q) => s + q.weight, 0)
        )
      : null;

  if (step === 0) {
    return (
      <div style={{ padding: 40, color: "white", background: "#111", minHeight: "100vh" }}>
        <h1>Rating Guide</h1>
        <input
          ref={inputRef}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter movie"
          style={{ padding: 10, marginTop: 20 }}
        />
        <br />
        <button onClick={() => setStep(1)} disabled={!title}>
          Start
        </button>
      </div>
    );
  }

  if (step <= QUESTIONS.length) {
    const q = QUESTIONS[step - 1];

    return (
      <div style={{ padding: 40, color: "white", background: "#111", minHeight: "100vh" }}>
        <h2>{title}</h2>
        <p>{q.question}</p>

        {[0.5,1,1.5,2,2.5,3,3.5,4,4.5,5].map(v => (
          <button
            key={v}
            onClick={() => {
              setAnswers(a => ({ ...a, [q.id]: v }));
              setStep(s => s + 1);
            }}
            style={{ margin: 5 }}
          >
            {v}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={{ padding: 40, color: "white", background: "#111", minHeight: "100vh" }}>
      <h1>{title}</h1>
      <h2>{score} ★</h2>
      <p>{RATING_SCALE.find(r => r.value === score)?.label}</p>

      <button onClick={() => window.location.reload()}>
        Restart
      </button>
    </div>
  );
}

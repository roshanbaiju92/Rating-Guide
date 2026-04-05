import { useState, useRef, useEffect } from "react";

/* DATA */

const RATING_SCALE = [
  { value: 0.5, label: "Unwatchable", desc: "Terrible filmmaking and irresponsible storytelling. A walk-out movie." },
  { value: 1, label: "Barely Tolerable", desc: "Horrible in ideas or execution. Only positive: I didn't quit." },
  { value: 1.5, label: "Bad", desc: "A few moments here and there, but overall badly made. No real impact." },
  { value: 2, label: "Forgettable", desc: "Weak writing, clichés, or shallow ideas." },
  { value: 2.5, label: "Mediocre", desc: "Has heart but weak storytelling." },
  { value: 3, label: "Decent", desc: "Worth watching. Flawed but conveys message." },
  { value: 3.5, label: "Impactful", desc: "One strong point stands out." },
  { value: 4, label: "Very Good", desc: "Strong themes, rewatchable." },
  { value: 4.5, label: "Excellent", desc: "Deeply moving, memorable." },
  { value: 5, label: "Life-Changing Art", desc: "Near flawless, unforgettable." },
];

const QUESTIONS = [
  { id: "narrative", question: "Did the story have a clear shape?", weight: 0.1 },
  { id: "pacing", question: "Did pacing serve the story?", weight: 0.08 },
  { id: "dialogue", question: "Was the writing authentic?", weight: 0.08 },
  { id: "ideas", question: "Are the ideas meaningful?", weight: 0.14 },
  { id: "theme_execution", question: "Did it commit to its themes?", weight: 0.1 },
  { id: "characters", question: "Were characters layered?", weight: 0.11 },
  { id: "performances", question: "Were performances strong?", weight: 0.08 },
  { id: "emotional_impact", question: "Did it move you?", weight: 0.1 },
  { id: "lasting_impact", question: "Will it stay with you?", weight: 0.11 },
  { id: "craft", question: "Did craft serve story?", weight: 0.1 },
];

const PENALTY_QUESTIONS = [
  { id: "ideology", question: "Does it promote a worldview you reject?" },
  { id: "concept", question: "Do you reject the premise itself?" },
];

function snap(v) {
  return Math.min(5, Math.max(0.5, Math.round(v * 2) / 2));
}

function getRatingInfo(v) {
  return RATING_SCALE.find(r => r.value === v);
}

/* APP */

export default function RatingGuide() {
  const [phase, setPhase] = useState("landing");
  const [movie, setMovie] = useState("");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [penalties, setPenalties] = useState({ ideology: 0, concept: 0 });

  const inputRef = useRef();

  useEffect(() => {
    if (phase === "landing") inputRef.current?.focus();
  }, [phase]);

  const answered = QUESTIONS.filter(q => answers[q.id] != null);

  const weighted =
    answered.reduce((sum, q) => sum + answers[q.id] * q.weight, 0) /
    (answered.reduce((sum, q) => sum + q.weight, 0) || 1);

  const totalPenalty = penalties.ideology + penalties.concept;

  const final = snap(weighted - totalPenalty);

  const info = getRatingInfo(final);

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "auto", fontFamily: "sans-serif" }}>
      
      {phase === "landing" && (
        <>
          <h1>Rating Guide</h1>
          <input
            ref={inputRef}
            placeholder="Movie name"
            value={movie}
            onChange={e => setMovie(e.target.value)}
            style={{ width: "100%", padding: 10 }}
          />
          <button onClick={() => setPhase("questions")} disabled={!movie}>
            Start
          </button>
        </>
      )}

      {phase === "questions" && (
        <>
          <h3>{movie}</h3>
          <p>{QUESTIONS[current].question}</p>

          <input
            type="range"
            min="0.5"
            max="5"
            step="0.5"
            value={answers[QUESTIONS[current].id] || 0.5}
            onChange={e =>
              setAnswers({
                ...answers,
                [QUESTIONS[current].id]: parseFloat(e.target.value),
              })
            }
          />

          <button onClick={() => setCurrent(c => c + 1)}>
            {current === QUESTIONS.length - 1 ? "Finish" : "Next"}
          </button>

          {current === QUESTIONS.length - 1 && (
            <button onClick={() => setPhase("penalties")}>
              Go to Penalties
            </button>
          )}
        </>
      )}

      {phase === "penalties" && (
        <>
          <h3>Penalties</h3>

          {PENALTY_QUESTIONS.map(p => (
            <div key={p.id}>
              <p>{p.question}</p>
              <input
                type="range"
                min="0"
                max="2"
                step="0.5"
                value={penalties[p.id]}
                onChange={e =>
                  setPenalties({
                    ...penalties,
                    [p.id]: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          ))}

          <button onClick={() => setPhase("result")}>
            See Result
          </button>
        </>
      )}

      {phase === "result" && (
        <>
          <h1>{final}★</h1>
          <h3>{info.label}</h3>
          <p>{info.desc}</p>

          <button onClick={() => window.location.reload()}>
            Restart
          </button>
        </>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../config";

function Quizzes() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const [numQuestions, setNumQuestions] = useState(1);
  const [questions, setQuestions] = useState([{ question: "", options: ["", "", ""], answer: "" }]);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/quiz/`)
      .then((res) => res.json())
      .then((data) => setQuizzes(data));

    if (user?.token) {
      fetch(`${API_BASE}/api/progress/`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then((res) => res.json())
        .then((data) => setProgress(data));
    }
  }, [user]);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx, optIdx, value) => {
    const updated = [...questions];
    updated[qIdx].options[optIdx] = value;
    setQuestions(updated);
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    const method = editingQuizId ? "PUT" : "POST";
    const url = editingQuizId
      ? `${API_BASE}/api/quiz/${editingQuizId}`
      : `${API_BASE}/api/quiz/`;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({ title: formTitle, questions }),
    });

    if (res.ok) {
      const updatedQuiz = await res.json();
      if (editingQuizId) {
        setQuizzes(quizzes.map((q) => (q.id === editingQuizId ? updatedQuiz : q)));
      } else {
        setQuizzes([...quizzes, updatedQuiz]);
      }
      setFormTitle("");
      setNumQuestions(1);
      setQuestions([{ question: "", options: ["", "", ""], answer: "" }]);
      setEditingQuizId(null);
    }
  };

  const handleEdit = (quiz) => {
    setEditingQuizId(quiz.id);
    setFormTitle(quiz.title);
    setNumQuestions(quiz.questions.length);
    setQuestions(quiz.questions);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this quiz?")) return;
    const res = await fetch(`${API_BASE}/api/quiz/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user?.token}` },
    });
    if (res.ok) setQuizzes(quizzes.filter((q) => q.id !== id));
  };

  const startQuiz = (quiz) => {
    const shuffled = [...quiz.questions].sort(() => 0.5 - Math.random());
    setSelectedQuiz({ ...quiz, questions: shuffled });
    setUserAnswers([]);
    setCurrentQ(0);
    setScore(0);
    setShowResults(false);
  };

  const getProgressForQuiz = (quizId) => {
    return progress.find((p) => p.quiz_id === quizId);
  };

  const ProgressRing = ({ score, total }) => {
    const radius = 30;
    const stroke = 6;
    const normalizedRadius = radius - stroke * 0.5;
    const circumference = normalizedRadius * 2 * Math.PI;
    const progress = score / total;
    const strokeDashoffset = circumference - progress * circumference;

    return (
      <svg height={radius * 2} width={radius * 2} className="ms-3">
        <circle stroke="#dee2e6" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
        <circle stroke="#0d6efd" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference + ' ' + circumference} style={{ strokeDashoffset, transition: "stroke-dashoffset 0.35s" }} strokeLinecap="round" r={normalizedRadius} cx={radius} cy={radius} />
        <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="12">{score}/{total}</text>
      </svg>
    );
  };

  const totalFromProgress = progress.reduce((sum, p) => sum + p.score, 0);

  return (
    <div className="container-fluid py-5" style={{ background: "linear-gradient(to right, #f9f9f9, #e0f7fa)", minHeight: "100vh" }}>
      <div className="container bg-white shadow p-5 rounded">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary mb-0">📘 Quizzes</h2>
          {showResults && selectedQuiz && (
            <ProgressRing score={score} total={selectedQuiz.questions.length} />
          )}
        </div>

        {/* ✅ Admin-only Create/Edit Form */}
        {user?.role === "admin" && (
          <div className="mb-5">
            <h4>{editingQuizId ? "✏️ Edit Quiz" : "➕ Create New Quiz"}</h4>
            <form onSubmit={handleCreateQuiz}>
              <input className="form-control mb-2" placeholder="Quiz Title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required />
              {questions.map((q, idx) => (
                <div key={idx} className="border p-3 mb-3 rounded">
                  <label>Question {idx + 1}</label>
                  <input className="form-control mb-2" value={q.question} onChange={(e) => handleQuestionChange(idx, "question", e.target.value)} placeholder="Enter question" />
                  {q.options.map((opt, i) => (
                    <input key={i} className="form-control mb-1" placeholder={`Option ${i + 1}`} value={opt} onChange={(e) => handleOptionChange(idx, i, e.target.value)} />
                  ))}
                  <input className="form-control mt-2" placeholder="Correct Answer" value={q.answer} onChange={(e) => handleQuestionChange(idx, "answer", e.target.value)} />
                </div>
              ))}
              <button className="btn btn-success">Save Quiz</button>
            </form>
          </div>
        )}

        {/* ✅ List of Quizzes */}
        <h4 className="mb-3">Available Quizzes</h4>
        <div className="list-group mb-5">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{quiz.title}</strong>
                {getProgressForQuiz(quiz.id) && (
                  <span className="badge bg-success ms-2">
                    {getProgressForQuiz(quiz.id).score}/{getProgressForQuiz(quiz.id).total}
                  </span>
                )}
              </div>
              <div>
                <button className="btn btn-sm btn-primary me-2" onClick={() => startQuiz(quiz)}>Start</button>
                {user?.role === "admin" && (
                  <>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(quiz)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(quiz.id)}>Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Quiz Taking & Results */}
        {selectedQuiz && (
          <div className="card shadow-lg">
            <div className="card-header text-white bg-primary">
              <strong>{selectedQuiz.title}</strong>
            </div>
            <div className="card-body">
              {!showResults ? (
                <>
                  <p><strong>Q{currentQ + 1}:</strong> {selectedQuiz.questions[currentQ].question}</p>
                  {selectedQuiz.questions[currentQ].options.map((opt, i) => (
                    <div key={i} className="form-check mb-2">
                      <input type="radio" name="option" value={opt} id={`opt-${i}`} className="form-check-input" checked={userAnswers[currentQ]?.answer === opt} onChange={() => {
                        const updated = [...userAnswers];
                        updated[currentQ] = { answer: opt, correct: false };
                        setUserAnswers(updated);
                      }} />
                      <label htmlFor={`opt-${i}`} className="form-check-label">{opt}</label>
                    </div>
                  ))}
                  <button className="btn btn-primary mt-3" disabled={!userAnswers[currentQ]?.answer} onClick={() => {
                    const selected = userAnswers[currentQ]?.answer;
                    const correct = selectedQuiz.questions[currentQ].answer === selected;
                    const updated = [...userAnswers];
                    updated[currentQ] = { answer: selected, correct };
                    setUserAnswers(updated);
                    if (correct) setScore(score + 1);
                    if (currentQ + 1 < selectedQuiz.questions.length) {
                      setCurrentQ(currentQ + 1);
                    } else {
                      setShowResults(true);
                      setCompleted([...completed, selectedQuiz.id]);

                      if (user?.token) {
                        fetch(`${API_BASE}/api/progress/`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user.token}`,
                          },
                          body: JSON.stringify({
                            quiz_id: selectedQuiz.id,
                            score: score + (correct ? 1 : 0),
                            total: selectedQuiz.questions.length,
                            quiz_title: selectedQuiz.title,
                          }),
                        });
                      }
                    }
                  }}>{currentQ + 1 === selectedQuiz.questions.length ? "Submit Quiz" : "Next"}</button>
                </>
              ) : (
                <>
                  <h5 className="text-success">Results</h5>
                  <p>Score: {score} / {selectedQuiz.questions.length}</p>
                  {selectedQuiz.questions.map((q, i) => (
                    <div key={i} className="mb-2">
                      <strong>{q.question}</strong><br />
                      Your Answer: {userAnswers[i]?.answer} — {userAnswers[i]?.correct ? <span className="text-success">Correct</span> : <span className="text-danger">Incorrect</span>}<br />
                      Correct Answer: {q.answer}
                    </div>
                  ))}
                  <button className="btn btn-secondary mt-3" onClick={() => setSelectedQuiz(null)}>Back to Quizzes</button>
                </>
              )}
            </div>
          </div>
        )}

        <div className="alert alert-info mt-4 text-center">
          🧠 Saved Total Points: <strong>{totalFromProgress}</strong>
        </div>
      </div>
    </div>
  );
}

export default Quizzes;

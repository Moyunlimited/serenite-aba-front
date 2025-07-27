import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../index.css";
import API_BASE from "../config";

function StudyGuide() {
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [form, setForm] = useState({ title: "", slides: [{ subtitle: "", content: "" }] });
  const [modalIndex, setModalIndex] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", slides: [{ subtitle: "", content: "" }] });
  const [openedTopics, setOpenedTopics] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("openedTopics");
    if (saved) setOpenedTopics(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("openedTopics", JSON.stringify(openedTopics));
  }, [openedTopics]);

  useEffect(() => {
    fetch(`${API_BASE}/api/guide/`)
      .then((res) => res.json())
      .then((data) =>
        setTopics(
          data.map((t) => ({
            ...t,
            slides: t.content.split("\n\n").map((block) => {
              const [subtitle, ...content] = block.split("\n");
              return { subtitle, content: content.join(" ") };
            }),
          }))
        )
      )
      .catch((err) => console.error("Failed to fetch topics:", err));
  }, []);

  const openModal = (index) => {
    setModalIndex(index);
    setSlideIndex(0);
    setEditingId(null);
  };

  const closeModal = () => {
    setModalIndex(null);
    setSlideIndex(0);
    setEditingId(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (modalIndex === null) return;
      const slides = topics[modalIndex]?.slides;
      if (e.key === "ArrowRight" && slideIndex < slides.length - 1) {
        setSlideIndex((prev) => prev + 1);
      } else if (e.key === "ArrowLeft" && slideIndex > 0) {
        setSlideIndex((prev) => prev - 1);
      } else if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalIndex, slideIndex, topics]);

  const handleFormChange = (e, index, field) => {
    const newSlides = [...form.slides];
    newSlides[index][field] = e.target.value;
    setForm({ ...form, slides: newSlides });
  };

  const addSlideField = () => {
    setForm({ ...form, slides: [...form.slides, { subtitle: "", content: "" }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = form.slides.map((s) => `${s.subtitle}\n${s.content}`).join("\n\n");
    const res = await fetch(`${API_BASE}/api/guide/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({ title: form.title, content }),
    });

    if (res.ok) {
      const newTopic = await res.json();
      newTopic.slides = newTopic.content.split("\n\n").map((block) => {
        const [subtitle, ...content] = block.split("\n");
        return { subtitle, content: content.join(" ") };
      });
      setTopics([...topics, newTopic]);
      setForm({ title: "", slides: [{ subtitle: "", content: "" }] });
    } else {
      alert("Failed to add topic");
    }
  };

  const startEdit = () => {
    const topic = topics[modalIndex];
    setEditingId(topic.id);
    setEditForm({
      title: topic.title,
      slides: topic.slides.map((s) => ({ ...s })),
    });
  };

  const handleEditChange = (e, index, field) => {
    const updatedSlides = [...editForm.slides];
    updatedSlides[index][field] = e.target.value;
    setEditForm({ ...editForm, slides: updatedSlides });
  };

  const saveEdit = async () => {
    const content = editForm.slides.map((s) => `${s.subtitle}\n${s.content}`).join("\n\n");
    const res = await fetch(`${API_BASE}/api/guide/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({ title: editForm.title, content }),
    });

    if (res.ok) {
      const updated = await res.json();
      updated.slides = updated.content.split("\n\n").map((block) => {
        const [subtitle, ...content] = block.split("\n");
        return { subtitle, content: content.join(" ") };
      });
      setTopics(topics.map((t) => (t.id === editingId ? updated : t)));
      setEditingId(null);
    } else {
      alert("Failed to update topic");
    }
  };

  const deleteTopic = async () => {
    const topic = topics[modalIndex];
    if (!window.confirm("Are you sure you want to delete this topic?")) return;
    const res = await fetch(`${API_BASE}/api/guide/${topic.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    });

    if (res.ok) {
      setTopics(topics.filter((t) => t.id !== topic.id));
      closeModal();
    } else {
      alert("Failed to delete topic");
    }
  };

  return (
    <div className="container my-5 p-3 p-md-4 rounded" style={{ background: "linear-gradient(to right, #eef2f3, #8e9eab)" }}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
        <h2 className="fw-bold mb-3 mb-md-0">
          <span role="img" aria-label="book">📘</span> Study Guide
        </h2>
        <div className="text-end mt-2 mt-md-0">
          <div className="position-relative d-inline-block mx-auto d-block d-md-inline-block">
            <svg width="60" height="60">
              <circle cx="30" cy="30" r="26" fill="none" stroke="#dee2e6" strokeWidth="6" />
              <circle
                cx="30"
                cy="30"
                r="26"
                fill="none"
                stroke="#0d6efd"
                strokeWidth="6"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={(1 - openedTopics.length / topics.length) * 2 * Math.PI * 26}
                transform="rotate(-90 30 30)"
                strokeLinecap="round"
              />
            </svg>
            <div className="position-absolute top-50 start-50 translate-middle text-primary fw-semibold">
              {openedTopics.length}/{topics.length}
            </div>
          </div>
        </div>
      </div>

      {user?.role === "admin" && (
        <form className="mb-5" onSubmit={handleSubmit}>
          <h5 className="fw-semibold">Add New Topic</h5>
          <div className="mb-3">
            <input
              name="title"
              placeholder="Topic Title"
              className="form-control"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          {form.slides.map((slide, index) => (
            <div className="mb-3" key={index}>
              <input
                className="form-control mb-2"
                placeholder={`Subtitle ${index + 1}`}
                value={slide.subtitle}
                onChange={(e) => handleFormChange(e, index, "subtitle")}
                required
              />
              <textarea
                className="form-control"
                rows={3}
                placeholder={`Slide ${index + 1} Content`}
                value={slide.content}
                onChange={(e) => handleFormChange(e, index, "content")}
                required
              />
            </div>
          ))}
          <button type="button" className="btn btn-outline-secondary mb-3" onClick={addSlideField}>
            ➕ Add Slide
          </button>
          <br />
          <button className="btn btn-primary" type="submit">
            ✅ Add Topic
          </button>
        </form>
      )}

      <div className="row">
        {topics.map((topic, index) => (
          <div className="col-12 col-md-6 col-lg-4 mb-4" key={topic.id}>
            <div className="card shadow slide-card h-100" onClick={() => openModal(index)}>
              <div className="card-body d-flex justify-content-center align-items-center">
                <h5 className="card-title text-center fw-semibold m-0">
                  {index + 1}. {topic.title} {openedTopics.includes(topic.id) && <span className="text-success">✅</span>}
                </h5>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalIndex !== null && (
        <div className="slide-modal d-flex justify-content-center align-items-center">
          <div
            className="slide-content bg-white shadow-lg p-4 rounded"
            style={{
              maxWidth: "100%",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              margin: "20px",
            }}
          >
            <button className="btn-close float-end" onClick={closeModal}></button>
            {editingId ? (
              <>
                <input
                  className="form-control mb-2"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
                {editForm.slides.map((slide, idx) => (
                  <div key={idx} className="mb-2">
                    <input
                      className="form-control mb-1"
                      placeholder="Subtitle"
                      value={slide.subtitle}
                      onChange={(e) => handleEditChange(e, idx, "subtitle")}
                    />
                    <textarea
                      className="form-control"
                      rows={3}
                      value={slide.content}
                      onChange={(e) => handleEditChange(e, idx, "content")}
                    />
                  </div>
                ))}
                <div className="d-flex justify-content-between flex-wrap gap-2">
                  <button className="btn btn-success" onClick={saveEdit}>💾 Save</button>
                  <button className="btn btn-secondary" onClick={() => setEditingId(null)}>❌ Cancel</button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <h2 className="fw-bold text-dark">{topics[modalIndex].title}</h2>
                <h5 className="text-primary fst-italic">{topics[modalIndex].slides[slideIndex].subtitle}</h5>
                <p className="lead lh-lg text-muted">{topics[modalIndex].slides[slideIndex].content}</p>
                <div className="d-flex flex-column flex-md-row justify-content-between gap-2 mt-4">
                  <button
                    className="btn btn-outline-dark"
                    onClick={() => setSlideIndex((prev) => Math.max(0, prev - 1))}
                    disabled={slideIndex === 0}
                  >⬅ Previous</button>
                  <button
                    className="btn btn-outline-dark"
                    onClick={() => setSlideIndex((prev) => Math.min(topics[modalIndex].slides.length - 1, prev + 1))}
                    disabled={slideIndex === topics[modalIndex].slides.length - 1}
                  >Next ➡</button>
                </div>
                {!openedTopics.includes(topics[modalIndex].id) && (
                  <div className="mt-3">
                    <button
                      className="btn btn-outline-success"
                      onClick={() => setOpenedTopics((prev) => [...prev, topics[modalIndex].id])}
                    >✅ Mark as Done</button>
                  </div>
                )}
                {user?.role === "admin" && (
                  <div className="d-flex justify-content-center gap-3 flex-wrap mt-4">
                    <button className="btn btn-sm btn-warning" onClick={startEdit}>✏️ Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={deleteTopic}>🗑️ Delete</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudyGuide;

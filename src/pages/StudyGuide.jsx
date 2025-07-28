import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../index.css";
import API_BASE from "../config";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

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

  return (
    <div
      style={{
        background: "linear-gradient(to right, #f9f9f9, #e0f7fa)",
        paddingTop: "80px",
        paddingBottom: "60px",
        minHeight: "100vh"
      }}
    >
      <div className="container">
        {user?.role === "admin" && (
          <form onSubmit={handleSubmit}>
            <h3 className="text-primary fw-bold mb-4">Add New Topic</h3>
            <input
              className="form-control mb-3"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            {form.slides.map((slide, index) => (
              <div key={index} className="mb-3 border p-3 bg-white rounded shadow-sm">
                <input
                  className="form-control mb-2"
                  placeholder={`Subtitle ${index + 1}`}
                  value={slide.subtitle}
                  onChange={(e) => handleFormChange(e, index, "subtitle")}
                  required
                />
                <ReactQuill
                  theme="snow"
                  value={slide.content}
                  onChange={(value) => {
                    const newSlides = [...form.slides];
                    newSlides[index].content = value;
                    setForm({ ...form, slides: newSlides });
                  }}
                />
                {form.slides.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-danger mt-2"
                    onClick={() => {
                      const updatedSlides = form.slides.filter((_, i) => i !== index);
                      setForm({ ...form, slides: updatedSlides });
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSlideField}
              className="btn btn-outline-secondary mb-3"
            >
              Add Slide
            </button>
            <br />
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </form>
        )}

        <hr className="my-5" />

        <div className="row">
          {topics.map((topic, index) => (
            <div key={topic.id} className="col-md-4 mb-3">
              <div className="card h-100 shadow-sm" onClick={() => openModal(index)}>
                <div className="card-body">
                  <h5 className="card-title text-primary">{topic.title}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudyGuide;

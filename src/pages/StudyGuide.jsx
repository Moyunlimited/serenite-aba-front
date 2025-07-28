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

  const handleFormChange = (value, index, field) => {
    const newSlides = [...form.slides];
    newSlides[index][field] = value;
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

  const handleEditChange = (index, value) => {
    const updatedSlides = [...editForm.slides];
    updatedSlides[index].content = value;
    setEditForm({ ...editForm, slides: updatedSlides });
  };

  const addEditSlide = () => {
    setEditForm({ ...editForm, slides: [...editForm.slides, { subtitle: "", content: "" }] });
  };

  const deleteEditSlide = (index) => {
    const updatedSlides = editForm.slides.filter((_, i) => i !== index);
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

  const handleDeleteTopic = async () => {
    const id = topics[modalIndex].id;
    const res = await fetch(`${API_BASE}/api/guide/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    });

    if (res.ok) {
      setTopics(topics.filter((t) => t.id !== id));
      closeModal();
    } else {
      alert("Failed to delete topic");
    }
  };

  return (
    <div
      style={{
        marginTop: "80px",
        background: "linear-gradient(to right, #f9f9f9, #e0f7fa)",
        paddingBottom: "60px",
        minHeight: "100vh",
      }}
    >
      <div className="container">
        {user?.role === "admin" && (
          <form onSubmit={handleSubmit}>
            <h3 className="text-primary mb-4">Add New Topic</h3>
            <ReactQuill
              theme="snow"
              value={form.title}
              onChange={(value) => setForm({ ...form, title: value })}
            />
            {form.slides.map((slide, index) => (
              <div key={index} className="mb-3 border p-3 bg-white rounded">
                <ReactQuill
                  theme="snow"
                  value={slide.subtitle}
                  onChange={(value) => handleFormChange(value, index, "subtitle")}
                />
                <ReactQuill
                  theme="snow"
                  value={slide.content}
                  onChange={(value) => handleFormChange(value, index, "content")}
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
            <button type="button" onClick={addSlideField} className="btn btn-outline-secondary mb-3">
              Add Slide
            </button>
            <br />
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </form>
        )}

        <hr />

        <div className="row">
          {topics.map((topic, index) => (
            <div key={topic.id} className="col-md-4 mb-3">
              <div className="card" onClick={() => openModal(index)}>
                <div className="card-body">
                  <h5 className="card-title" dangerouslySetInnerHTML={{ __html: topic.title }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {modalIndex !== null && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="modal-title" dangerouslySetInnerHTML={{ __html: topics[modalIndex].title }} />
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  <div dangerouslySetInnerHTML={{ __html: topics[modalIndex].slides[slideIndex].subtitle }} />
                  <div dangerouslySetInnerHTML={{ __html: topics[modalIndex].slides[slideIndex].content }} />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setSlideIndex(Math.max(0, slideIndex - 1))}
                    disabled={slideIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setSlideIndex(Math.min(topics[modalIndex].slides.length - 1, slideIndex + 1))}
                    disabled={slideIndex === topics[modalIndex].slides.length - 1}
                  >
                    Next
                  </button>
                  {user?.role === "admin" && (
                    <>
                      <button className="btn btn-warning me-2" onClick={startEdit}>Edit</button>
                      <button className="btn btn-danger" onClick={handleDeleteTopic}>Delete Topic</button>
                    </>
                  )}
                </div>
                {editingId && (
                  <div className="p-3">
                    <ReactQuill
                      theme="snow"
                      value={editForm.title}
                      onChange={(value) => setEditForm({ ...editForm, title: value })}
                    />
                    {editForm.slides.map((slide, idx) => (
                      <div key={idx} className="mb-3 border p-3 bg-white rounded">
                        <ReactQuill
                          theme="snow"
                          value={slide.subtitle}
                          onChange={(value) => {
                            const updated = [...editForm.slides];
                            updated[idx].subtitle = value;
                            setEditForm({ ...editForm, slides: updated });
                          }}
                        />
                        <ReactQuill
                          theme="snow"
                          value={slide.content}
                          onChange={(value) => handleEditChange(idx, value)}
                        />
                        {editForm.slides.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-danger mt-2"
                            onClick={() => deleteEditSlide(idx)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    ))}
                    <button className="btn btn-secondary me-2" type="button" onClick={addEditSlide}>Add Subtitle</button>
                    <button className="btn btn-success" onClick={saveEdit}>
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudyGuide;
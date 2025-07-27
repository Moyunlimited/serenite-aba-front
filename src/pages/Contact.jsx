import { useState } from "react";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form); // Later: send to backend
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div
      style={{
        background: "linear-gradient(to right, #f2f6f9, #dbeaf1)",
        paddingTop: "60px",
        paddingBottom: "60px",
        minHeight: "100vh",
      }}
    >
      <div className="container bg-white shadow p-5 rounded">
        <h2 className="text-center text-primary mb-4">📩 Contact Us</h2>

        {submitted && (
          <div className="alert alert-success text-center">Message sent!</div>
        )}

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Message</label>
            <textarea
              name="message"
              className="form-control"
              rows="4"
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;

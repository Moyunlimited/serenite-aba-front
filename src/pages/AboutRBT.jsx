function AboutRBT() {
  return (
    <div
      style={{
        background: "linear-gradient(to bottom right, #e3f2fd, #f1f8ff)",
        paddingTop: "80px",
        paddingBottom: "80px",
        minHeight: "100vh",
      }}
    >
      <div className="container">
        <div
          className="bg-white shadow-lg p-4 p-md-5 rounded-4"
          style={{
            backgroundImage: "url('/pattern-light.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "top right",
          }}
        >
          <h2 className="text-center text-primary fw-bold mb-4">
            <span role="img" aria-label="book">📘</span> About Registered Behavior Technicians (RBT)
          </h2>

          <p className="fs-5 text-muted">
            A <strong>Registered Behavior Technician (RBT)</strong> is a certified paraprofessional
            in behavior analysis. RBTs work under the supervision of a Board Certified Behavior Analyst
            (BCBA) to implement behavior intervention plans, support individuals with autism and other
            developmental disorders, and collect data on progress.
          </p>

          <hr className="my-4" />

          <h4 className="text-secondary fw-semibold mb-3">
            ✅ What Are the Requirements?
          </h4>
          <ul className="fs-5 text-muted">
            <li>🔞 Must be 18 years or older</li>
            <li>🎓 Hold a high school diploma or equivalent</li>
            <li>🕒 Complete a 40-hour RBT training (can be online)</li>
            <li>🛡️ Pass a criminal background check</li>
            <li>📝 Successfully complete the RBT Competency Assessment & Exam</li>
          </ul>

          <hr className="my-4" />

          <h4 className="text-secondary fw-semibold mb-3">
            🎓 How Serenité ABA Supports You
          </h4>
          <p className="fs-5 text-muted">
            Serenité ABA offers a step-by-step support system including:
          </p>
          <ul className="fs-5 text-muted">
            <li>📚 Full study guide access</li>
            <li>📝 Practice quizzes and exam prep</li>
            <li>💻 Live Zoom Q&A sessions</li>
            <li>💼 Job placement assistance</li>
            <li>✅ Competency assessment preparation</li>
          </ul>

          <p className="mt-4 fs-5 text-muted">
            Whether you're just starting or preparing for your exam, we’re here to guide you
            every step of the way!
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutRBT;

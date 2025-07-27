function Footer() {
  return (
    <footer style={{ backgroundColor: "#f7f4f0ff", color: "white" }} className="py-4 mt-auto text-dark">
      <div className="container text-center">
        <p className="mb-1">© {new Date().getFullYear()} Serenité ABA</p>
        <small>Empowering the future of behavior therapy.</small>
      </div>
    </footer>
  );
}

export default Footer;


function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav className="navbar">
      <h2>EduDashboard</h2>
      <div className="nav-links">
        <a href="#home">Home</a>
        <a href="#courses">Courses</a>
        <a href="#tasks">Tasks</a>
        <button className="profile-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light Theme" : "Dark Theme"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/students";
const EMPTY_FORM = {
  regNo: "",
  name: "",
  department: "",
  email: "",
  cgpa: ""
};

const styles = {
  page: {
    minHeight: "100vh",
    boxSizing: "border-box",
    padding: "40px 20px",
    background: "#f4f7fb",
    color: "#182230",
    fontFamily: "Arial, sans-serif"
  },
  container: { maxWidth: "1100px", margin: "0 auto" },
  heading: { margin: "0 0 8px", fontSize: "30px" },
  subtitle: { margin: "0 0 28px", color: "#667085" },
  card: {
    padding: "24px",
    marginBottom: "24px",
    border: "1px solid #e4e7ec",
    borderRadius: "12px",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(16, 24, 40, 0.04)"
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
    alignItems: "end"
  },
  label: { display: "grid", gap: "7px", fontSize: "14px", fontWeight: 600 },
  input: {
    boxSizing: "border-box",
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d0d5dd",
    borderRadius: "7px",
    fontSize: "14px"
  },
  actions: { display: "flex", gap: "8px", flexWrap: "wrap" },
  button: {
    padding: "10px 14px",
    border: 0,
    borderRadius: "7px",
    background: "#175cd3",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600
  },
  secondaryButton: {
    padding: "10px 14px",
    border: "1px solid #d0d5dd",
    borderRadius: "7px",
    background: "#fff",
    color: "#344054",
    cursor: "pointer",
    fontWeight: 600
  },
  deleteButton: {
    padding: "7px 10px",
    border: "1px solid #fecdca",
    borderRadius: "6px",
    background: "#fff",
    color: "#b42318",
    cursor: "pointer",
    fontWeight: 600
  },
  editButton: {
    padding: "7px 10px",
    border: "1px solid #b2ccff",
    borderRadius: "6px",
    background: "#eff4ff",
    color: "#175cd3",
    cursor: "pointer",
    fontWeight: 600
  },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  th: {
    padding: "12px 10px",
    borderBottom: "1px solid #e4e7ec",
    color: "#667085",
    fontSize: "12px",
    textTransform: "uppercase"
  },
  td: { padding: "13px 10px", borderBottom: "1px solid #f0f2f5", fontSize: "14px" },
  error: { margin: "0 0 16px", color: "#b42318" },
  muted: { color: "#667085" }
};

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadStudents() {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load students. Check that the backend and MongoDB are running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const student = {
      ...form,
      cgpa: form.cgpa === "" ? null : Number(form.cgpa)
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, student);
      } else {
        await axios.post(API_URL, student);
      }
      resetForm();
      await loadStudents();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not save the student.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(student) {
    setEditingId(student._id);
    setForm({
      regNo: student.regNo,
      name: student.name,
      department: student.department,
      email: student.email || "",
      cgpa: student.cgpa ?? ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    setError("");
    try {
      await axios.delete(`${API_URL}/${id}`);
      if (editingId === id) resetForm();
      await loadStudents();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not delete the student.");
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Student Management System</h1>
        <p style={styles.subtitle}>Create, update, and manage student records.</p>

        <section style={styles.card}>
          <h2 style={{ margin: "0 0 20px", fontSize: "20px" }}>
            {editingId ? "Edit student" : "Add a student"}
          </h2>
          {error && <p role="alert" style={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>
              Registration number *
              <input
                required
                name="regNo"
                value={form.regNo}
                onChange={handleChange}
                style={styles.input}
                placeholder="e.g. STU-1001"
              />
            </label>
            <label style={styles.label}>
              Name *
              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                style={styles.input}
                placeholder="Student name"
              />
            </label>
            <label style={styles.label}>
              Department *
              <input
                required
                name="department"
                value={form.department}
                onChange={handleChange}
                style={styles.input}
                placeholder="e.g. Computer Science"
              />
            </label>
            <label style={styles.label}>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                style={styles.input}
                placeholder="student@example.com"
              />
            </label>
            <label style={styles.label}>
              CGPA (0-10)
              <input
                type="number"
                name="cgpa"
                min="0"
                max="10"
                step="0.01"
                value={form.cgpa}
                onChange={handleChange}
                style={styles.input}
                placeholder="e.g. 8.5"
              />
            </label>
            <div style={styles.actions}>
              <button type="submit" disabled={saving} style={styles.button}>
                {saving ? "Saving..." : editingId ? "Update student" : "Add student"}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} style={styles.secondaryButton}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section style={styles.card}>
          <h2 style={{ margin: "0 0 18px", fontSize: "20px" }}>Student records</h2>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {["Reg. No.", "Name", "Department", "Email", "CGPA", "Actions"].map((heading) => (
                    <th key={heading} style={styles.th}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={styles.td}>Loading students...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan="6" style={{ ...styles.td, ...styles.muted }}>No student records yet.</td></tr>
                ) : (
                  students.map((student) => (
                    <tr key={student._id}>
                      <td style={styles.td}>{student.regNo}</td>
                      <td style={styles.td}>{student.name}</td>
                      <td style={styles.td}>{student.department}</td>
                      <td style={styles.td}>{student.email || "—"}</td>
                      <td style={styles.td}>{student.cgpa ?? "—"}</td>
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <button type="button" onClick={() => handleEdit(student)} style={styles.editButton}>
                            Edit
                          </button>
                          <button type="button" onClick={() => handleDelete(student._id)} style={styles.deleteButton}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;

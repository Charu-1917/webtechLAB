import cors from "cors";
import express from "express";
import mongoose from "mongoose";

const app = express();
const PORT = 5000;
const MONGODB_URI = "mongodb://127.0.0.1:27017/studentdb";

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const studentSchema = new mongoose.Schema(
  {
    regNo: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: "" },
    cgpa: { type: Number, min: 0, max: 10, default: null }
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

app.post("/students", async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
});

app.get("/students", async (_req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    next(error);
  }
});

app.get("/students/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID." });
    }

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    res.json(student);
  } catch (error) {
    next(error);
  }
});

app.put("/students/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID." });
    }

    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    res.json(student);
  } catch (error) {
    next(error);
  }
});

app.delete("/students/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID." });
    }

    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    res.json({ message: "Student deleted successfully." });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);

  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: error.message });
  }

  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ message: "Request body must be valid JSON." });
  }

  res.status(500).json({ message: "An unexpected server error occurred." });
});

async function startServer() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB at", MONGODB_URI);

  app.listen(PORT, () => {
    console.log(`Student API listening at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start the server:", error);
  process.exitCode = 1;
});

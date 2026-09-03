const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;


// ===============================
// KẾT NỐI MONGODB
// ===============================

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("MongoDB error:", error);
    });


// ===============================
// API HELLO - CODE CŨ
// ===============================

app.get("/api/hello", (req, res) => {
    res.json({
        message: "Backend đang hoạt động!"
    });
});


// ===============================
// CÂU 35: TẠO STUDENT SCHEMA
// ===============================

const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    }
});

const Student = mongoose.model("Student", studentSchema);


// ===============================
// CÂU 36: GET /api/students
// Lấy danh sách sinh viên
// ===============================

app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();

        res.json(students);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// ===============================
// CÂU 37: POST /api/students
// Thêm sinh viên
// ===============================

app.post("/api/students", async (req, res) => {
    try {
        const student = await Student.create(req.body);

        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});


// ===============================
// CÂU 38: PUT /api/students/:id
// Cập nhật sinh viên
// ===============================

app.put("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Không tìm thấy sinh viên"
            });
        }

        res.json(student);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});


// ===============================
// CÂU 39: DELETE /api/students/:id
// Xóa sinh viên
// ===============================

app.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!student) {
            return res.status(404).json({
                message: "Không tìm thấy sinh viên"
            });
        }

        res.json({
            message: "Xóa sinh viên thành công",
            student: student
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});


// ===============================
// CHẠY SERVER
// ===============================

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 3000;

// ===============================
// Middleware
// ===============================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

// ===============================
// Create folders if not exists
// ===============================

if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
}

const DATA_FILE = path.join(__dirname, "data", "data.txt");

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]");
}

// ===============================
// Multer
// ===============================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, "uploads/");

    },

    filename: function (req, file, cb) {

        const unique =
            Date.now() +
            "-" +
            Math.round(Math.random() * 100000);

        cb(
            null,
            unique + path.extname(file.originalname)
        );

    }

});

const upload = multer({

    storage,

    limits: {

        fileSize: 2 * 1024 * 1024

    },

    fileFilter(req, file, cb) {

        const allowed = /jpg|jpeg|png/;

        const ext = allowed.test(
            path.extname(file.originalname).toLowerCase()
        );

        const mime = allowed.test(file.mimetype);

        if (ext && mime) {

            cb(null, true);

        } else {

            cb(new Error("Only JPG PNG JPEG"));

        }

    }

});

// ===============================
// Helper Functions
// ===============================

function readStudents() {

    return JSON.parse(
        fs.readFileSync(DATA_FILE, "utf8")
    );

}

function saveStudents(data) {

    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(data, null, 4)
    );

}

// ===============================
// GET Students
// ===============================

app.get("/students", (req, res) => {

    const students = readStudents();

    res.json(students);

});

// ===============================
// GET Student by ID
// ===============================

app.get("/students/:id", (req, res) => {

    const students = readStudents();

    const student = students.find(

        s => s.id == req.params.id

    );

    if (!student) {

        return res.status(404).json({

            message: "Student not found"

        });

    }

    res.json(student);

});

// ===============================
// POST Student
// ===============================

app.post(
    "/students",
    upload.single("image"),
    (req, res) => {

        const students = readStudents();

        const student = {

            id: Date.now(),

            name: req.body.name,

            email: req.body.email,

            phone: req.body.phone,

            dob: req.body.dob,

            age: req.body.age,

            gender: req.body.gender,

            department: req.body.department,

            skills: JSON.parse(req.body.skills),

            address: req.body.address,

            country: req.body.country,

            state: req.body.state,

            city: req.body.city,

            zip: req.body.zip,

            image: req.file
                ? req.file.filename
                : ""

        };

        students.push(student);

        saveStudents(students);

        res.json({

            success: true,

            message: "Student Saved",

            student

        });

    }
);

// ===============================
// PUT Student
// ===============================

app.put(
    "/students/:id",
    upload.single("image"),
    (req, res) => {

        let students = readStudents();

        const index = students.findIndex(

            s => s.id == req.params.id

        );

        if (index === -1) {

            return res.status(404).json({

                message: "Student not found"

            });

        }

        students[index] = {

            ...students[index],

            ...req.body,

            skills: JSON.parse(req.body.skills),

            image: req.file
                ? req.file.filename
                : students[index].image

        };

        saveStudents(students);

        res.json({

            success: true,

            student: students[index]

        });

    }
);

// ===============================
// DELETE Student
// ===============================

app.delete("/students/:id", (req, res) => {

    let students = readStudents();

    const student = students.find(

        s => s.id == req.params.id

    );

    if (!student) {

        return res.status(404).json({

            message: "Student not found"

        });

    }

    if (student.image) {

        const img = path.join(
            __dirname,
            "uploads",
            student.image
        );

        if (fs.existsSync(img)) {

            fs.unlinkSync(img);

        }

    }

    students = students.filter(

        s => s.id != req.params.id

    );

    saveStudents(students);

    res.json({

        success: true,

        message: "Deleted"

    });

});

// ===============================
// Home
// ===============================

app.get("/", (req, res) => {

    res.send("Student Registration API Running");

});

// ===============================
// Start Server
// ===============================

app.listen(PORT, () => {

    console.log(

        `Server running at http://localhost:${PORT}`

    );

});
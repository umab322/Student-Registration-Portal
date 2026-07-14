// ==========================================
// Student Registration Portal
// Part 1
// ==========================================

// ----------------------------
// DOM Elements
// ----------------------------

const form = document.getElementById("studentForm");

const tableBody = document.getElementById("studentTable");

const imageInput = document.getElementById("image");

const previewImage = document.getElementById("previewImage");

const removeImageBtn = document.getElementById("removeImage");

const searchInput = document.getElementById("search");

const departmentFilter = document.getElementById("filterDepartment");

const genderFilter = document.getElementById("filterGender");

const sortSelect = document.getElementById("sortStudents");

const darkModeBtn = document.getElementById("darkModeBtn");

const exportBtn = document.getElementById("exportBtn");

const importFile = document.getElementById("importFile");

// ----------------------------
// Statistics
// ----------------------------

const totalStudents = document.getElementById("totalStudents");

const maleStudents = document.getElementById("maleStudents");

const femaleStudents = document.getElementById("femaleStudents");

const departmentCount = document.getElementById("departmentCount");

const averageAge = document.getElementById("averageAge");

// ----------------------------
// Data
// ----------------------------

let students =
    JSON.parse(localStorage.getItem("students")) || [];

let editIndex = -1;

// ----------------------------
// Save LocalStorage
// ----------------------------

function saveStudents() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

}

// ----------------------------
// Image Preview
// ----------------------------

imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const allowed = ["image/jpeg", "image/png"];

    if (!allowed.includes(file.type)) {

        alert("Only JPG and PNG allowed.");

        this.value = "";

        return;

    }

    if (file.size > 2 * 1024 * 1024) {

        alert("Image should be below 2MB");

        this.value = "";

        return;

    }

    const reader = new FileReader();

    reader.onload = function (e) {

        previewImage.src = e.target.result;

        previewImage.style.display = "block";

        removeImageBtn.style.display = "inline-block";

    };

    reader.readAsDataURL(file);

});

// ----------------------------
// Remove Image
// ----------------------------

removeImageBtn.addEventListener("click", () => {

    imageInput.value = "";

    previewImage.src = "";

    previewImage.style.display = "none";

    removeImageBtn.style.display = "none";

});

// ----------------------------
// Validation
// ----------------------------

function validateForm() {

    document
        .querySelectorAll(".invalid")
        .forEach(el => el.classList.remove("invalid"));

    let valid = true;

    const name =
        document.getElementById("name");

    const email =
        document.getElementById("email");

    const phone =
        document.getElementById("phone");

    const age =
        document.getElementById("age");

    const password =
        document.getElementById("password");

    const confirmPassword =
        document.getElementById("confirmPassword");

    const terms =
        document.getElementById("terms");

    if (name.value.trim().length < 3) {

        name.classList.add("invalid");

        valid = false;

    }

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.value)) {

        email.classList.add("invalid");

        valid = false;

    }

    const phoneRegex =
        /^[0-9]{10}$/;

    if (!phoneRegex.test(phone.value)) {

        phone.classList.add("invalid");

        valid = false;

    }

    if (+age.value < 18) {

        age.classList.add("invalid");

        valid = false;

    }

    const passRegex =
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W]).{8,}$/;

    if (!passRegex.test(password.value)) {

        password.classList.add("invalid");

        valid = false;

    }

    if (password.value !== confirmPassword.value) {

        confirmPassword.classList.add("invalid");

        valid = false;

    }

    if (!imageInput.files.length && previewImage.src === "") {

        imageInput.classList.add("invalid");

        valid = false;

    }

    if (!terms.checked) {

        terms.classList.add("invalid");

        valid = false;

    }

    return valid;

}

// ----------------------------
// Form Submit
// ----------------------------

form.addEventListener("submit", function (e) {

    e.preventDefault();

    if (!validateForm()) {

        alert("Please fix the highlighted fields.");

        return;

    }

    const skills = [];

    document
        .querySelectorAll(".skills:checked")
        .forEach(skill => {

            skills.push(skill.value);

        });

    const gender =
        document.querySelector(
            "input[name='gender']:checked"
        )?.value || "";

    const student = {

        id:
            editIndex === -1
                ? Date.now()
                : students[editIndex].id,

        name:
            document.getElementById("name").value,

        email:
            document.getElementById("email").value,

        phone:
            document.getElementById("phone").value,

        dob:
            document.getElementById("dob").value,

        age:
            document.getElementById("age").value,

        gender,

        department:
            document.getElementById("department").value,

        skills,

        address:
            document.getElementById("address").value,

        country:
            document.getElementById("country").value,

        state:
            document.getElementById("state").value,

        city:
            document.getElementById("city").value,

        zip:
            document.getElementById("zip").value,

        image:
            previewImage.src,

        createdAt:
            new Date().toISOString()

    };

    if (editIndex === -1) {

        students.push(student);

    } else {

        students[editIndex] = student;

        editIndex = -1;

    }

    saveStudents();

    form.reset();

    previewImage.src = "";

    previewImage.style.display = "none";

    removeImageBtn.style.display = "none";

    renderStudents();

});

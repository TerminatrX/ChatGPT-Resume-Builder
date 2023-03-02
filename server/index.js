//index.js
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;

//import Multer anbd Node.js path packages
const multer = require("multer");
const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/api", (req, res) => {
    res.json({
        message: "Hello world",
    });
});

// Configure Multer for Storage and Uploads of images

// enables Node.js to serve contents of uploads folder
app.use("/uploads", express.static("uploads"));

// Control for storing images, renames image to upload time
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// set size limit for upload file 5MB limit
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5},
});

// route for form imput from React App
app.post("/resume/create", upload.single("headshotImage"), async (req, res) => {
    const {
        fullName,
        currentPosition,
        currentLength,
        currentTechnologies,
        workHistory,
    } = req.body;

    console.log(req.body);

    res.json({
        message: "Request successful!",
        data: {},
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
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

// API key Open AI
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: "<YOUR_API_KEY>",
}); 

const openai = new OpenAIApi(configuration);

// Take user input to use as prompt, and reply with GPT response
const ChatGPTFunction = async (text) => {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: text,
        temperature: 0.6,
        max_tokens: 250,
        top_p: 1,
        frequency_penalty: 1,
        presence_penalty: 1,
    });
    return response.data.choices[0].text;
}

// route for form imput from React App
app.post("/resume/create", upload.single("headshotImage"), async (req, res) => {
    const {
        fullName,
        currentPosition,
        currentLength,
        currentTechnologies,
        workHistory, //JSON format
    } = req.body;

    const workArray = JSON.parse(workHistory); //an array

    // group the values into an object
    const newEntry = {
        id: generateID(),
        fullName,
        image_url: `http://localhost:4000/uploads/${req.file.filename}`,
        currentPosition,
        currentLength,
        currentTechnologies,
        workHistory: workArray,
    };
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log(error));

// Evaluation schema
const evaluationSchema = new mongoose.Schema({
    prompt: String,
    response: String,
    accuracy: Number,
    relevance: Number,
    coherence: Number,
    label: String,
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Evaluation = mongoose.model("Evaluation", evaluationSchema);

// Sample AI evaluation tasks
const tasks = [{
        id: 1,
        prompt: "Explain what an API is in simple words.",
        response: "An API allows two software applications to communicate with each other. It helps one system request or send data to another system. A simple example is a weather app fetching weather data from a server.",
    },
    {
        id: 2,
        prompt: "What is a database?",
        response: "A database stores data in an organized way so it can be easily accessed and managed. It is used in websites, apps, banking systems, and many other software applications.",
    },
    {
        id: 3,
        prompt: "Explain cloud computing.",
        response: "Cloud computing means storing files online. It is only used for saving photos and documents.",
    },
    {
        id: 4,
        prompt: "What is HTTP?",
        response: "HTTP is a protocol used by browsers and servers to exchange information. When a user opens a website, the browser sends an HTTP request and the server returns a response.",
    },
    {
        id: 5,
        prompt: "Explain Artificial Intelligence.",
        response: "Artificial Intelligence means machines that can think exactly like humans and never make mistakes.",
    },
    {
        id: 6,
        prompt: "What is version control?",
        response: "Version control helps developers track changes in code over time. Git is a common version control tool used to manage project history and collaborate with other developers.",
    },
];

// Home route
app.get("/", (req, res) => {
    res.send("AI Response Quality Review API is running");
});

// Get tasks
app.get("/tasks", (req, res) => {
    res.json(tasks);
});

// Submit evaluation
app.post("/evaluate", async(req, res) => {
    try {
        const {
            prompt,
            response,
            accuracy,
            relevance,
            coherence,
            label,
            comment,
        } = req.body;

        // validation (important)
        if (!prompt || !response) {
            return res.status(400).json({ message: "Missing data" });
        }

        const newEvaluation = {
            prompt,
            response,
            accuracy,
            relevance,
            coherence,
            label,
            comment,
        };

        evaluations.push(newEvaluation); // if using array
        // OR if using Mongo → save to DB

        res.status(201).json({ message: "Saved successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get submitted evaluations
app.get("/evaluations", async(req, res) => {
    try {
        const evaluations = await Evaluation.find().sort({ createdAt: -1 });
        res.json(evaluations);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching evaluations",
            error: error.message,
        });
    }
});

// Server listen
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
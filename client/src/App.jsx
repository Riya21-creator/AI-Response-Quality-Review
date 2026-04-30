import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://ai-response-quality-review.onrender.com";

function App() {
  const [login, setLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const [isSignup, setIsSignup] = useState(false);
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
  });

  const [form, setForm] = useState({
    accuracy: 5,
    relevance: 5,
    coherence: 5,
    label: "Good",
    comment: "",
  });

  // Fetch tasks
  const fetchTasks = async () => {
    const res = await axios.get(`${API_URL}/tasks`);
    setTasks(res.data);

    const randomTask =
      res.data[Math.floor(Math.random() * res.data.length)];
    setSelectedTask(randomTask);
  };

  // Fetch evaluations
  const fetchEvaluations = async () => {
    const res = await axios.get(`${API_URL}/evaluations`);
    setEvaluations(res.data);
  };

  useEffect(() => {
    if (showDashboard) {
      fetchTasks();
      fetchEvaluations();
    }
  }, [showDashboard]);

  // Login
  const handleLogin = (e) => {
    e.preventDefault();

    const savedEmail = localStorage.getItem("userEmail");
    const savedPassword = localStorage.getItem("userPassword");

    if (
      (authData.email === savedEmail &&
        authData.password === savedPassword) ||
      (authData.email === "reviewer@test.com" &&
        authData.password === "123456")
    ) {
      setLogin(true);
      setShowDashboard(false);
    } else {
      alert("Invalid credentials");
    }
  };

  // Signup
  const handleSignup = (e) => {
    e.preventDefault();

    localStorage.setItem("userEmail", authData.email);
    localStorage.setItem("userPassword", authData.password);

    alert("Signup successful. Please login.");
    setIsSignup(false);
  };

  // Submit evaluation
  const submitEvaluation = async (e) => {
    e.preventDefault();

    const data = {
      prompt: selectedTask.prompt,
      response: selectedTask.response,
      accuracy: Number(form.accuracy),
      relevance: Number(form.relevance),
      coherence: Number(form.coherence),
      label: form.label,
      comment: form.comment,
    };

    await axios.post(`${API_URL}/evaluate`, data);
    alert("Evaluation submitted!");

    setForm({
      accuracy: 5,
      relevance: 5,
      coherence: 5,
      label: "Good",
      comment: "",
    });

    fetchEvaluations();
  };

  // ================= LOGIN PAGE =================
  if (!login) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>AI Response Review System</h1>

          <form onSubmit={isSignup ? handleSignup : handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={authData.email}
              onChange={(e) =>
                setAuthData({ ...authData, email: e.target.value })
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={authData.password}
              onChange={(e) =>
                setAuthData({ ...authData, password: e.target.value })
              }
              required
            />

            <button type="submit">
              {isSignup ? "Signup" : "Login"}
            </button>
          </form>

          <p onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Already have account? Login" : "New user? Signup"}
          </p>

          <div className="demo-box">
            Demo: reviewer@test.com / 123456
          </div>
        </div>
      </div>
    );
  }

  // ================= WELCOME PAGE =================
  if (login && !showDashboard) {
  return (
    <div className="welcome-page">
      <div className="welcome-card large-welcome">
        <h1>Welcome to AI Response Review</h1>
        <p className="welcome-subtitle">
          This platform helps reviewers evaluate AI-generated responses using structured quality metrics.
        </p>

        <div className="instruction-grid">
          <div>
            <h3>Accuracy</h3>
            <p>Check whether the response is factually correct.</p>
          </div>

          <div>
            <h3>Relevance</h3>
            <p>Check whether the response answers the given prompt.</p>
          </div>

          <div>
            <h3>Coherence</h3>
            <p>Check whether the response is clear and understandable.</p>
          </div>
        </div>

        <button onClick={() => setShowDashboard(true)}>
          Start Reviewing
        </button>
      </div>
    </div>
  );
}
  // ================= DASHBOARD =================
  return (
    <div className="container">
      <div className="header">
        <h1>AI Response Quality Dashboard</h1>
        <p>Evaluate AI responses using quality metrics</p>
      </div>

      <div className="stats">
        <div>Total Tasks: {tasks.length}</div>
        <div>Completed: {evaluations.length}</div>
        <div>Pending: {tasks.length - evaluations.length}</div>
      </div>

      <div className="main">
        <div className="tasks">
          <h2>Tasks</h2>
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => setSelectedTask(task)}
            >
              Task {task.id}
            </button>
          ))}
        </div>

        {selectedTask && (
          <div className="review">
            <h2>Review</h2>

            <div className="prompt-box">
              <b>Prompt</b>
              <p>{selectedTask.prompt}</p>
            </div>

            <div className="response-box">
              <b>AI Response</b>
              <p>{selectedTask.response}</p>
            </div>

            <button onClick={fetchTasks} className="next-btn">
              Next Task
            </button>

            <p className="review-note">
              Please evaluate the response based on accuracy, relevance, and coherence.
            </p>

            <form onSubmit={submitEvaluation}>
              <div className="rating-grid">
                <div>
                  <label>Accuracy</label>
                  <select
                    value={form.accuracy}
                    onChange={(e) =>
                      setForm({ ...form, accuracy: e.target.value })
                    }
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Relevance</label>
                  <select
                    value={form.relevance}
                    onChange={(e) =>
                      setForm({ ...form, relevance: e.target.value })
                    }
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Coherence</label>
                  <select
                    value={form.coherence}
                    onChange={(e) =>
                      setForm({ ...form, coherence: e.target.value })
                    }
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Label</label>
                  <select
                    value={form.label}
                    onChange={(e) =>
                      setForm({ ...form, label: e.target.value })
                    }
                  >
                    <option>Good</option>
                    <option>Average</option>
                    <option>Poor</option>
                  </select>
                </div>
              </div>

              <textarea
                placeholder="Comment"
                value={form.comment}
                onChange={(e) =>
                  setForm({ ...form, comment: e.target.value })
                }
              />

              <button type="submit">Submit</button>
            </form>
          </div>
        )}
      </div>

      <h2>History</h2>
      <table>
        <thead>
          <tr>
            <th>Prompt</th>
            <th>Accuracy</th>
            <th>Relevance</th>
            <th>Coherence</th>
            <th>Label</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.map((e) => (
            <tr key={e._id}>
              <td>{e.prompt}</td>
              <td>{e.accuracy}</td>
              <td>{e.relevance}</td>
              <td>{e.coherence}</td>
              <td>{e.label}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
 
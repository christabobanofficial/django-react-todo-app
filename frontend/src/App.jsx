import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useNavigate
} from "react-router-dom";

import Login from "./Login";
import Register from "./Register";

const API_URL = "http://127.0.0.1:8000/api/tasks/";

// =====================================================
// PROTECTED ROUTE
// =====================================================

function ProtectedRoute({ children }) {

    const token = localStorage.getItem("access_token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}


// =====================================================
// DASHBOARD
// =====================================================

function Dashboard() {

    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [darkMode, setDarkMode] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [editingTitle, setEditingTitle] = useState("");

    const username = localStorage.getItem("username");


    // =================================================
    // GET AUTH HEADERS
    // =================================================

    const getHeaders = () => {

        const token = localStorage.getItem("access_token");

        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    };


    // =================================================
    // LOGOUT
    // =================================================

    const logout = () => {

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("username");

        navigate("/login");
    };


    // =================================================
    // GET TASKS
    // =================================================

    const fetchTasks = async () => {

        try {

            const response = await axios.get(
                API_URL,
                getHeaders()
            );

            setTasks(response.data);

        } catch (error) {

            console.error(
                "Error fetching tasks:",
                error
            );

            if (error.response?.status === 401) {

                logout();
            }
        }
    };


    useEffect(() => {

        fetchTasks();

    }, []);


    // =================================================
    // ADD TASK
    // =================================================

    const addTask = async (e) => {

        e.preventDefault();

        if (!title.trim()) return;

        try {

            const response = await axios.post(
                API_URL,
                {
                    title: title
                },
                getHeaders()
            );

            setTasks((previousTasks) => [
                response.data,
                ...previousTasks
            ]);

            setTitle("");

        } catch (error) {

            console.error(
                "Error adding task:",
                error
            );

            if (error.response?.status === 401) {
                logout();
            }
        }
    };


    // =================================================
    // TOGGLE TASK
    // =================================================

    const toggleTask = async (task) => {

        try {

            const response = await axios.patch(

                `${API_URL}${task.id}/`,

                {
                    is_completed: !task.is_completed
                },

                getHeaders()
            );

            setTasks((previousTasks) =>

                previousTasks.map((item) =>

                    item.id === task.id
                        ? response.data
                        : item

                )
            );

        } catch (error) {

            console.error(
                "Error updating task:",
                error
            );

            if (error.response?.status === 401) {
                logout();
            }
        }
    };


    // =================================================
    // DELETE TASK
    // =================================================

    const deleteTask = async (id) => {

        try {

            await axios.delete(

                `${API_URL}${id}/`,

                getHeaders()
            );

            setTasks((previousTasks) =>

                previousTasks.filter(
                    (task) => task.id !== id
                )

            );

        } catch (error) {

            console.error(
                "Error deleting task:",
                error
            );

            if (error.response?.status === 401) {
                logout();
            }
        }
    };


    // =================================================
    // START EDITING
    // =================================================

    const startEditing = (task) => {

        setEditingId(task.id);
        setEditingTitle(task.title);

    };


    // =================================================
    // SAVE EDIT
    // =================================================

    const saveEdit = async (id) => {

        if (!editingTitle.trim()) return;

        try {

            const response = await axios.patch(

                `${API_URL}${id}/`,

                {
                    title: editingTitle
                },

                getHeaders()
            );

            setTasks((previousTasks) =>

                previousTasks.map((task) =>

                    task.id === id
                        ? response.data
                        : task

                )
            );

            setEditingId(null);
            setEditingTitle("");

        } catch (error) {

            console.error(
                "Error editing task:",
                error
            );

            if (error.response?.status === 401) {
                logout();
            }
        }
    };


    // =================================================
    // CANCEL EDIT
    // =================================================

    const cancelEdit = () => {

        setEditingId(null);
        setEditingTitle("");

    };


    // =================================================
    // FILTER TASKS
    // =================================================

    const filteredTasks = tasks.filter((task) => {

        const matchesSearch = task.title
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesFilter =

            filter === "all"
                ? true

                : filter === "pending"
                ? !task.is_completed

                : task.is_completed;

        return matchesSearch && matchesFilter;
    });


    // =================================================
    // COUNTERS
    // =================================================

    const totalTasks = tasks.length;

    const pendingTasks = tasks.filter(
        (task) => !task.is_completed
    ).length;

    const completedTasks = tasks.filter(
        (task) => task.is_completed
    ).length;


    // =================================================
    // DASHBOARD UI
    // =================================================

    return (

        <div className={darkMode ? "app dark" : "app"}>

            {/* =========================================
                HEADER
            ========================================= */}

            <header className="header">

                <div>

                    <h1>My Tasks</h1>

                    <p>
                        Stay organized. Get things done.
                    </p>

                    {username && (
                        <small>
                            Welcome, <strong>{username}</strong> 👋
                        </small>
                    )}

                </div>


                <div className="header-actions">

                    <button
                        className="theme-button"
                        onClick={() =>
                            setDarkMode(!darkMode)
                        }
                    >
                        {darkMode ? "☀️" : "🌙"}
                    </button>


                    <button
                        className="logout-button"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* =========================================
                STATISTICS
            ========================================= */}

            <div className="stats">

                <div className="stat-card">

                    <strong>
                        {totalTasks}
                    </strong>

                    <span>
                        Total
                    </span>

                </div>


                <div className="stat-card">

                    <strong>
                        {pendingTasks}
                    </strong>

                    <span>
                        Pending
                    </span>

                </div>


                <div className="stat-card">

                    <strong>
                        {completedTasks}
                    </strong>

                    <span>
                        Completed
                    </span>

                </div>

            </div>


            {/* =========================================
                ADD TASK
            ========================================= */}

            <form
                className="task-form"
                onSubmit={addTask}
            >

                <input
                    type="text"
                    placeholder="What needs to be done?"
                    value={title}
                    onChange={(e) =>
                        setTitle(e.target.value)
                    }
                />


                <button type="submit">
                    + Add Task
                </button>

            </form>


            {/* =========================================
                SEARCH
            ========================================= */}

            <div className="search-box">

                <input
                    type="text"
                    placeholder="🔍 Search tasks..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>


            {/* =========================================
                FILTERS
            ========================================= */}

            <div className="filters">

                <button
                    className={
                        filter === "all"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setFilter("all")
                    }
                >
                    All
                </button>


                <button
                    className={
                        filter === "pending"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setFilter("pending")
                    }
                >
                    Pending
                </button>


                <button
                    className={
                        filter === "completed"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setFilter("completed")
                    }
                >
                    Completed
                </button>

            </div>


            {/* =========================================
                TASK LIST
            ========================================= */}

            <section className="task-section">

                <div className="section-title">

                    <h2>

                        {filter === "completed"

                            ? "Completed Tasks"

                            : filter === "pending"

                            ? "Pending Tasks"

                            : "Tasks"

                        }

                    </h2>


                    <span>
                        {filteredTasks.length}
                    </span>

                </div>


                {filteredTasks.length === 0 ? (

                    <div className="empty">

                        <div className="empty-icon">
                            ✓
                        </div>

                        <h3>
                            No tasks found
                        </h3>

                        <p>
                            Add a task to get started.
                        </p>

                    </div>

                ) : (

                    filteredTasks.map((task) => (

                        <div
                            className="task"
                            key={task.id}
                        >

                            {/* CHECKBOX */}

                            <button
                                className={
                                    task.is_completed
                                        ? "checkbox checked"
                                        : "checkbox"
                                }

                                onClick={() =>
                                    toggleTask(task)
                                }
                            >

                                {task.is_completed
                                    ? "✓"
                                    : ""
                                }

                            </button>


                            {/* TASK CONTENT */}

                            <div className="task-content">

                                {editingId === task.id ? (

                                    <input
                                        className="edit-input"

                                        value={
                                            editingTitle
                                        }

                                        onChange={(e) =>
                                            setEditingTitle(
                                                e.target.value
                                            )
                                        }

                                        autoFocus
                                    />

                                ) : (

                                    <span
                                        className={
                                            task.is_completed

                                                ? "task-title completed-title"

                                                : "task-title"
                                        }
                                    >
                                        {task.title}
                                    </span>

                                )}


                                <small>

                                    {task.created_at

                                        ? new Date(
                                            task.created_at
                                        ).toLocaleDateString()

                                        : ""

                                    }

                                </small>

                            </div>


                            {/* ACTIONS */}

                            <div className="actions">

                                {editingId === task.id ? (

                                    <>

                                        <button
                                            className="save"

                                            onClick={() =>
                                                saveEdit(
                                                    task.id
                                                )
                                            }
                                        >
                                            ✓
                                        </button>


                                        <button
                                            className="cancel"

                                            onClick={
                                                cancelEdit
                                            }
                                        >
                                            ✕
                                        </button>

                                    </>

                                ) : (

                                    <>

                                        <button
                                            className="edit"

                                            onClick={() =>
                                                startEditing(
                                                    task
                                                )
                                            }
                                        >
                                            ✎
                                        </button>


                                        <button
                                            className="delete"

                                            onClick={() =>
                                                deleteTask(
                                                    task.id
                                                )
                                            }
                                        >
                                            🗑
                                        </button>

                                    </>

                                )}

                            </div>

                        </div>

                    ))

                )}

            </section>


            {/* =========================================
                FOOTER
            ========================================= */}

            <footer>
                Built with React + Django REST Framework
            </footer>

        </div>
    );
}


// =====================================================
// MAIN APP / ROUTING
// =====================================================

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* LOGIN */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* REGISTER */}

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* PROTECTED DASHBOARD */}

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                {/* ANY UNKNOWN URL */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;
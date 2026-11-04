import { useEffect, useState } from "react";
import API from "../api/axios";

function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [editId, setEditId] = useState(null);
    const [editTitle, setEditTitle] = useState("");

    const [search, setSearch] = useState("");

    // 1. Fetch Tasks
    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await API.get("/tasks", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = response.data;

            const taskList = Array.isArray(data)
                ? data
                : data.tasks || [];

            setTasks(taskList);
            setError("");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to fetch tasks"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // 2. Create Task
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            await API.post(
                "/tasks/create",
                {
                    title,
                    description
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setTitle("");
            setDescription("");

            await fetchTasks();

        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    // 3. Delete Task
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await API.delete(`/tasks/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setTasks((prevTasks) =>
                prevTasks.filter((task) => task._id !== id)
            );

        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    // 4. Start Editing
    const handleEdit = (task) => {
        setEditId(task._id);
        setEditTitle(task.title);
    };

    // 5. Update Task
    const handleUpdate = async (id) => {
        if (!editTitle.trim()) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            await API.put(
                `/tasks/update/${id}`,
                {
                    title: editTitle
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === id
                        ? { ...task, title: editTitle }
                        : task
                )
            );

            setEditId(null);
            setEditTitle("");

        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    // 6. Change Task Status
    const handleStatusChange = async (task) => {
        try {
            const token = localStorage.getItem("token");

            const newStatus =
                task.status === "Pending"
                    ? "Completed"
                    : "Pending";

            await API.put(
                `/tasks/update/${task._id}`,
                {
                    status: newStatus
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setTasks((prevTasks) =>
                prevTasks.map((item) =>
                    item._id === task._id
                        ? { ...item, status: newStatus }
                        : item
                )
            );

        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    // 7. Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
    };

    // 8. Statistics
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        (task) => task.status === "Completed"
    ).length;

    const pendingTasks = tasks.filter(
        (task) => task.status === "Pending"
    ).length;

    // 9. Search Filter
    const filteredTasks = tasks.filter((task) =>
        String(task.title || "")
            .toLowerCase()
            .includes(search.trim().toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white">
                        Task Manager Dashboard
                    </h1>

                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                    >
                        Logout
                    </button>
                </div>

                <p className="text-gray-400 mt-3">
                    Welcome, {user?.name}!
                </p>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

                    <div className="bg-blue-900 p-6 rounded-xl">
                        <h2 className="text-blue-200">
                            Total Tasks
                        </h2>

                        <p className="text-3xl font-bold text-white mt-2">
                            {totalTasks}
                        </p>
                    </div>

                    <div className="bg-yellow-900 p-6 rounded-xl">
                        <h2 className="text-yellow-200">
                            Pending Tasks
                        </h2>

                        <p className="text-3xl font-bold text-white mt-2">
                            {pendingTasks}
                        </p>
                    </div>

                    <div className="bg-green-900 p-6 rounded-xl">
                        <h2 className="text-green-200">
                            Completed Tasks
                        </h2>

                        <p className="text-3xl font-bold text-white mt-2">
                            {completedTasks}
                        </p>
                    </div>

                </div>

                {/* My Tasks */}
                <div className="mt-8 bg-slate-900 p-6 rounded-xl border border-slate-800">

                    <h2 className="text-xl font-semibold text-white">
                        My Tasks
                    </h2>

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full mt-4 p-3 rounded-lg bg-slate-800 text-white outline-none"
                    />

                    {/* Create Task Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="mt-5 space-y-3"
                    >

                        <input
                            type="text"
                            placeholder="Enter task title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none"
                        />

                        <textarea
                            placeholder="Enter task description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none"
                        />

                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                        >
                            Add Task
                        </button>

                    </form>

                    {/* Task List */}
                    <div className="mt-6 space-y-3">

                        {loading && (
                            <p className="text-gray-400">
                                Loading tasks...
                            </p>
                        )}

                        {error && (
                            <p className="text-red-400">
                                {error}
                            </p>
                        )}

                        {!loading && !error && filteredTasks.length === 0 && (
                            <p className="text-gray-400">
                                {search.trim()
                                    ? "No matching tasks found!"
                                    : "No tasks found. Create your first task!"
                                }
                            </p>
                        )}

                        {!loading && !error && filteredTasks.map((task) => (

                            <div
                                key={task._id}
                                className="bg-slate-800 p-4 rounded-lg"
                            >

                                {/* Task Title */}
                                <h3 className="text-white font-semibold">
                                    {task.title}
                                </h3>

                                {/* Edit Input */}
                                {editId === task._id && (
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="w-full mt-3 p-2 rounded bg-slate-700 text-white"
                                    />
                                )}

                                {/* Save Button */}
                                {editId === task._id && (
                                    <button
                                        onClick={() => handleUpdate(task._id)}
                                        className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg"
                                    >
                                        Save
                                    </button>
                                )}

                                {/* Task Description */}
                                <p className="text-gray-400 mt-1">
                                    {task.description}
                                </p>

                                {/* Task Status */}
                                <p className="text-blue-400 mt-2">
                                    {task.status}
                                </p>

                                {/* Edit Button */}
                                <button
                                    type="button"
                                    onClick={() => handleEdit(task)}
                                    className="mt-3 mr-3 bg-yellow-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Edit
                                </button>

                                {/* Delete Button */}
                                <button
                                    type="button"
                                    onClick={() => handleDelete(task._id)}
                                    className="mt-3 mr-3 bg-red-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Delete
                                </button>

                                {/* Status Button */}
                                <button
                                    type="button"
                                    onClick={() => handleStatusChange(task)}
                                    className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Mark as {
                                        task.status === "Pending"
                                            ? "Completed"
                                            : "Pending"
                                    }
                                </button>

                            </div>

                        ))}

                    </div>

                </div>

            </div>
        </div>
    );
}

export default Dashboard;
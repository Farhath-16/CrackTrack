import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import "./DSAVault.css";


export default function DSAVault() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [platform, setPlatform] = useState("");
    const [topic, setTopic] = useState("");
    const [difficulty, setDifficulty] = useState("Easy");


    const [difficultyFilter, setDifficultyFilter] = useState("All");
    const [topicFilter, setTopicFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    const [showNotesModal, setShowNotesModal] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [notes, setNotes] = useState("");


    const topics = [
        "All",
        ...new Set(
            problems.map(
                problem => problem.topic
            )
        )
    ];

    const filteredProblems =
        problems.filter((problem) => {
            const difficultyMatch = difficultyFilter === "All" || problem.difficulty === difficultyFilter;
            const topicMatch = topicFilter === "All" || problem.topic === topicFilter;
            const statusMatch = statusFilter === "All" || problem.status === statusFilter;

            return (
                difficultyMatch &&
                topicMatch &&
                statusMatch
            );

        });


    useEffect(() => {

        fetchProblems();

    }, []);

    const fetchProblems = async () => {

        try {

            const response =
                await api.get(
                    "/dsa/getDSAProblems"
                );

            setProblems(
                response.data
            );

        }

        catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to fetch problems"
            );

        }

        finally {

            setLoading(false);

        }

    };

    const handleAddProblem = async () => {

        try {

            await api.post(
                "/dsa/addDSAProblem",
                {
                    title,
                    platform,
                    topic,
                    difficulty
                }
            );

            fetchProblems();
            setShowModal(false);
            setTitle("");
            setPlatform("");
            setTopic("");
            setDifficulty("Easy");

        }

        catch (error) {
            alert(
                error.response?.data?.message || "Failed to add problem"
            );
        }
    };

    const updateProblemStatus = async (
        id,
        status
    ) => {

        try {

            await api.patch(

                `/dsa/updateDSAProblem/${id}`,

                {
                    status
                }

            );

            setProblems(

                problems.map(

                    (problem) =>

                        problem.id === id

                            ? {
                                ...problem,
                                status
                            }

                            : problem

                )

            );

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Failed to update status"

            );

        }

    };

    const deleteProblem = async (id) => {

        try {

            await api.delete(
                `/dsa/deleteDSAProblem/${id}`
            );

            setProblems(
                problems.filter(
                    problem => problem.id !== id
                )
            );

        }

        catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to delete problem"
            );

        }

    };


    const saveNotes = async () => {
        try {

            await api.patch(

                `/dsa/updateDSAProblem/${selectedProblem.id}`,
                {
                    notes
                }
            );
            setProblems(
                problems.map(
                    (problem) =>
                        problem.id ===
                            selectedProblem.id
                            ? {
                                ...problem,
                                notes
                            }
                            : problem
                )
            );
            setShowNotesModal(
                false
            );
        }
        catch (error) {
            alert(
                error.response?.data?.message || "Failed to save notes"
            );
        }
    };





    return (

        <Layout>

            <div className="dsa-header">

                <h1>
                    DSA Vault
                </h1>

                <button onClick={() =>
                    setShowModal(true)
                }>

                    + Add Problem

                </button>

            </div>

            <div className="filters">

                <select
                    value={difficultyFilter}
                    onChange={(e) =>
                        setDifficultyFilter(
                            e.target.value
                        )
                    }
                >
                    <option value="All">All Difficulties</option>
                    <option value="Easy">Easy </option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>

                <select
                    value={topicFilter}
                    onChange={(e) =>
                        setTopicFilter(
                            e.target.value
                        )
                    }
                >
                    {
                        topics.map(topic => (
                            <option
                                key={topic}
                                value={topic}
                            >
                                {topic}
                            </option>

                        ))
                    }
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(
                            e.target.value
                        )
                    }
                >
                    <option value="All">
                        All Status
                    </option>

                    <option value="Saved">
                        Saved
                    </option>

                    <option value="Attempted">
                        Attempted
                    </option>

                    <option value="Solved">
                        Solved
                    </option>

                    <option value="Need Revision">
                        Need Revision
                    </option>

                    <option value="Mastered">
                        Mastered
                    </option>

                </select>

            </div>

            {
                loading &&
                <p>Loading...</p>
            }

            {
                error &&
                <p>{error}</p>
            }

            <div className="problem-list">

                {
                    filteredProblems.map((problem) => (

                        <div key={problem.id} 
                        className="problem-item">

                            <div className="problem-info">

                                <h3>{problem.title}</h3>

                                <p className="platform">
                                    {problem.platform}
                                </p>

                            </div>

                            <div className="problem-right">

                                <span className="topic-badge">
                                    {problem.topic}
                                </span>

                                <span className="difficulty-badge">
                                    {problem.difficulty}
                                </span>

                                <select
                                    className="status-dropdown"
                                    value={problem.status}
                                    onChange={(e) =>
                                        updateProblemStatus(
                                            problem.id,
                                            e.target.value
                                        )
                                    }
                                >
                                    <option>Saved</option>
                                    <option>Attempted</option>
                                    <option>Solved</option>
                                    <option>Need Revision</option>
                                    <option>Mastered</option>
                                </select>

                                <div className="problem-actions">

                                    <button
                                        onClick={() => {
                                            setSelectedProblem(problem);
                                            setNotes(problem.notes || "");
                                            setShowNotesModal(true);
                                        }}
                                    >
                                        Notes
                                    </button>

                                    <button onClick={() =>
                                        deleteProblem(problem.id)
                                    }>Delete</button>

                                </div>

                            </div>

                        </div>

                    ))
                }

            </div>

          {/*modal for PROBLEM*/}
            {
                showModal && (
                    <div className="modal-overlay">

                        <div className="modal">

                            <h2>
                                Add Problem
                            </h2>
                            <input
                                type="text"
                                placeholder="Problem Title"
                                value={title}
                                onChange={(e) =>
                                    setTitle(
                                        e.target.value
                                    )
                                }
                            />
                            <input
                                type="text"
                                placeholder="Platform"
                                value={platform}
                                onChange={(e) =>
                                    setPlatform(
                                        e.target.value
                                    )
                                }
                            />
                            <input
                                type="text"
                                placeholder="Topic"
                                value={topic}
                                onChange={(e) =>
                                    setTopic(
                                        e.target.value
                                    )
                                }
                            />
                            <select
                                value={difficulty}
                                onChange={(e) =>
                                    setDifficulty(
                                        e.target.value
                                    )
                                }
                            >
                                <option> Easy </option>
                                <option> Medium </option>
                                <option> Hard </option>
                            </select>

                            <div className="modal-actions">
                                <button
                                    className="cancel-btn"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    className="save-btn"
                                    onClick={
                                        handleAddProblem
                                    }
                                >
                                    Save Problem
                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

            {/*modal for notes*/}
            {
                showNotesModal && (

                    <div className="modal-overlay">

                        <div className="modal">

                            <h2>

                                Notes

                            </h2>

                            <textarea

                                rows="8"

                                value={notes}

                                onChange={(e) =>

                                    setNotes(
                                        e.target.value
                                    )

                                }

                                placeholder=
                                "Write your notes..."

                                className=
                                "notes-textarea"

                            />

                            <div className="modal-actions">

                                <button

                                    className="cancel-btn"

                                    onClick={() =>

                                        setShowNotesModal(
                                            false
                                        )

                                    }

                                >

                                    Cancel

                                </button>

                                <button

                                    className="save-btn"

                                    onClick={
                                        saveNotes
                                    }

                                >

                                    Save Notes

                                </button>

                            </div>

                        </div>

                    </div>

                )
            }




        </Layout>

    );
}
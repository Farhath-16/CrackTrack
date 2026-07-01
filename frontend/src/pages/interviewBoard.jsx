import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import "./interviewBoard.css";

export default function InterviewBoard() {

    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] =useState(true);
    const [error, setError] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);


    const [selectedExperience, setSelectedExperience] =        useState(null);
    const [company, setCompany] =useState("");
    const [role, setRole] = useState("");
    const [rounds, setRounds] = useState(1);
    const [result, setResult] =useState("Pending");
    const [experience, setExperience] =useState("");

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {

            const response =
                await api.get(
                    "/interviews/getExperiences"
                );

            setExperiences(
                response.data
            );

        }

        catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to fetch experiences"
            );
        }
        finally {
            setLoading(false);
        }
    };

    const handleAddExperience =
        async () => {
            try {
                await api.post(
                    "/interviews/addExperience",
                    {
                        company,
                        role,
                        rounds: Number(rounds),
                        result,
                        experience
                    }
                );
                fetchExperiences();
                setShowAddModal(false);

                setCompany("");
                setRole("");
                setRounds(1);
                setResult("Pending");
                setExperience("");

            }
            catch (error) {
                alert(
                    error.response?.data?.message ||
                    "Failed to add experience"
                );
            }
        };

    const deleteExperience =
        async (id) => {
            if (
                !window.confirm(
                    "Delete this experience?"
                )
            ) return;
            try {

                await api.delete(
                    `/interviews/deleteExperience/${id}`
                );
                setExperiences(
                    experiences.filter(
                        (exp) => exp.id !== id

                    )
                );
            }
            catch (error) {
                alert(
                    error.response?.data?.message ||
                    "Failed to delete experience"
                );
            }

        };

    return (

        <Layout>

            <div className="interview-header">

                <h1>
                    Interview Board
                </h1>

                <button
                    onClick={() =>
                        setShowAddModal(true)
                    }
                >
                    + Add Experience
                </button>

            </div>

            {
                loading &&
                <p>Loading...</p>
            }

            {
                error &&<p>{error}</p>
            }

            <div className="experience-list">

                {
                    experiences.map((exp) => (

                        <div
                            key={exp.id}
                            className="experience-card"
                        >

                            <div>

                                <h3>
                                    {exp.company}
                                </h3>

                                <p>
                                    {exp.role}
                                </p>

                            </div>

                            <div className="experience-right">

                                <span
                                    className={`result-badge ${exp.result.toLowerCase()}`}
                                >
                                    {exp.result}
                                </span>

                                <span className="round-badge">

                                    {exp.rounds} Rounds

                                </span>

                                <button
                                    onClick={() => {

                                        setSelectedExperience(exp);

                                        setShowViewModal(true);

                                    }}
                                >
                                    View Experience
                                </button>

                                <button
                                    onClick={() =>
                                        deleteExperience(exp.id)
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))
                }

            </div>

            {/* ADD MODAL */}

            {
                showAddModal && (

                    <div className="modal-overlay">

                        <div className="modal">

                            <h2>
                                Add Experience
                            </h2>

                            <input
                                placeholder="Company"
                                value={company}
                                onChange={(e) =>
                                    setCompany(
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                placeholder="Role"
                                value={role}
                                onChange={(e) =>
                                    setRole(
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                type="number"
                                min="1"
                                placeholder="Rounds"
                                value={rounds}
                                onChange={(e) =>
                                    setRounds(
                                        e.target.value
                                    )
                                }
                            />

                            <select
                                value={result}
                                onChange={(e) =>
                                    setResult(
                                        e.target.value
                                    )
                                }
                            >
                                <option>
                                    Pending
                                </option>

                                <option>
                                    Selected
                                </option>

                                <option>
                                    Rejected
                                </option>

                            </select>

                            <textarea
                                rows="8"
                                placeholder="Interview Experience"
                                value={experience}
                                onChange={(e) =>
                                    setExperience(
                                        e.target.value
                                    )
                                }
                            />

                            <div className="modal-actions">

                                <button
                                    className="cancel-btn"
                                    onClick={() =>
                                        setShowAddModal(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    className="save-btn"
                                    onClick={
                                        handleAddExperience
                                    }
                                >
                                    Save Experience
                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

            {/* VIEW MODAL */}

            {
                showViewModal &&
                selectedExperience && (

                    <div className="modal-overlay">

                        <div className="modal">

                            <h2>

                                {
                                    selectedExperience.company
                                }

                            </h2>

                            <p>

                                {
                                    selectedExperience.role
                                }

                            </p>

                            <p>

                                Rounds:
                                {" "}
                                {
                                    selectedExperience.rounds
                                }

                            </p>

                            <p>

                                Result:
                                {" "}
                                {
                                    selectedExperience.result
                                }

                            </p>

                            <textarea
                                readOnly
                                rows="10"
                                value={
                                    selectedExperience.experience
                                }
                            />

                            <div className="modal-actions">

                                <button
                                    className="save-btn"
                                    onClick={() =>
                                        setShowViewModal(false)
                                    }
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

        </Layout>

    );

}
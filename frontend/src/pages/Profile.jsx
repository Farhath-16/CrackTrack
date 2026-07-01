import { useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

import "./Profile.css";

export default function Profile() {

    const navigate = useNavigate();

    const email =
        localStorage.getItem("email") ||
        "user@example.com";

    const firstLetter =
        email.charAt(0).toUpperCase();


    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("email");

        navigate("/");

    };

    const handleChangePassword =
        async () => {

            if (
                newPassword !== confirmPassword
            ) {

                alert(
                    "Passwords do not match"
                );

                return;

            }

            try {

                const response =
                    await api.patch(
                        "/auth/changePassword",
                        {
                            currentPassword,
                            newPassword
                        }
                    );

                alert(
                    response.data.message
                );

                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");

            }

            catch (error) {

                console.log(error);

                console.log(error.response);

                console.log(error.response?.data);

                alert(
                    JSON.stringify(
                        error.response?.data
                    )
                );

            }

        };

    return (

        <Layout>

            <h1 className="profile-title">
                Profile
            </h1>

            <div className="profile-container">

                {/* USER CARD */}

                <div className="profile-card">

                    <div className="profile-avatar">

                        {firstLetter}

                    </div>

                    <h2>
                        {email.split("@")[0]}
                    </h2>

                    <p>
                        {email}
                    </p>

                    <span className="member-badge">
                        Member Since 2025
                    </span>

                </div>

                {/* ACCOUNT CARD */}

                <div className="profile-card">

                    <h3>
                        Account Information
                    </h3>

                    <div className="info-row">

                        <span>Email</span>

                        <span>{email}</span>

                    </div>

                    <div className="info-row">

                        <span>Account Type</span>

                        <span>User</span>

                    </div>

                    <div className="info-row">

                        <span>Authentication</span>

                        <span>JWT Enabled</span>

                    </div>

                </div>

                {/* SECURITY CARD */}

                <div className="profile-card">

                    <h3>
                        Security
                    </h3>

                    <button
                        className="change-password-btn"
                        onClick={() =>
                            setShowPasswordModal(true)
                        }
                    >
                        Change Password
                    </button>

                </div>

                {/* LOGOUT CARD */}

                <div className="logout-card">

                    <div>

                        <h3>
                            Logout
                        </h3>

                        <p>
                            Logout from your account
                        </p>

                    </div>

                    <button
                        onClick={handleLogout}
                        className="logout-btn"
                    >
                        Logout
                    </button>

                </div>

            </div>

            {
                showPasswordModal && (

                    <div className="modal-overlay">

                        <div className="modal">

                            <h2>
                                Change Password
                            </h2>

                            <input
                                type="password"
                                placeholder="Current Password"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                            />

                            <div className="modal-actions">

                                <button
                                    className="cancel-btn"
                                    onClick={() =>
                                        setShowPasswordModal(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    className="save-btn"
                                    onClick={
                                        handleChangePassword
                                    }
                                >
                                    Update Password
                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

        </Layout>

    );

}
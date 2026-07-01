import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import "./Dashboard.css";

export default function Dashboard() {

    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        drives: 0,
        problems: 0,
        interviews: 0
    });

    const [upcomingDrives, setUpcomingDrives] = useState([]);

    const [dsaStats, setDsaStats] = useState({
        solved: 0,
        attempted: 0,
        saved: 0,
        mastered: 0
    });

    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {

            const [
                drivesResponse,
                problemsResponse,
                experiencesResponse
            ] = await Promise.all([
                api.get("/drives/getDrives"),
                api.get("/dsa/getDSAProblems"),
                api.get("/interviews/getExperiences")
            ]);

            const drives = drivesResponse.data;
            const problems = problemsResponse.data;
            const experiences = experiencesResponse.data;

            // =========================
            // MAIN STATS
            // =========================
            setStats({
                drives: drives.length,
                problems: problems.length,
                interviews: experiences.length
            });

            // =========================
            // UPCOMING DRIVES (top 5)
            // =========================
            setUpcomingDrives(drives.slice(0, 5));

            // =========================
            // DSA PROGRESS
            // =========================
            const solved = problems.filter(p => p.status === "Solved").length;
            const attempted = problems.filter(p => p.status === "Attempted").length;
            const saved = problems.filter(p => p.status === "Saved").length;
            const mastered = problems.filter(p => p.status === "Mastered").length;

            setDsaStats({
                solved,
                attempted,
                saved,
                mastered
            });

            // =========================
            // RECENT ACTIVITY
            // =========================
            const activity = [];

            drives.slice(0, 2).forEach(d =>
                activity.push(`Added ${d.company} Drive`)
            );

            problems.slice(0, 2).forEach(p =>
                activity.push(`Solved/Added ${p.title}`)
            );

            experiences.slice(0, 1).forEach(e =>
                activity.push(`Added ${e.company} Interview`)
            );

            setRecentActivity(activity.slice(0, 5));

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getDaysLeft = (deadline) => {
        const today = new Date();
        const driveDate = new Date(deadline);

        const diff = Math.ceil(
            (driveDate - today) / (1000 * 60 * 60 * 24)
        );

        if (diff === 0) return "Today";
        if (diff === 1) return "Tomorrow";
        if (diff < 0) return "Expired";
        return `${diff} Days Left`;
    };

    if (loading) {
        return (
            <Layout>
                <p className="loading">Loading Dashboard...</p>
            </Layout>
        );
    }

    return (
        <Layout>

            <h1 className="dashboard-title">
                Welcome Back 👋
            </h1>

            {/* =========================
                TOP STATS
            ========================= */}
            <div className="stats-grid">

                <div className="stat-card">
                    <h3>Total Drives</h3>
                    <p>{stats.drives}</p>
                </div>

                <div className="stat-card">
                    <h3>DSA Problems</h3>
                    <p>{stats.problems}</p>
                </div>

                <div className="stat-card">
                    <h3>Interview Records</h3>
                    <p>{stats.interviews}</p>
                </div>

            </div>

            {/* =========================
                MIDDLE SECTION
            ========================= */}

            <div className="dashboard-row">

                <div className="dashboard-section">

                    <h2>
                        Upcoming Deadlines
                    </h2>

                    {
                        upcomingDrives.length === 0
                            ?
                            <p>No upcoming drives</p>
                            :
                            upcomingDrives.map((drive) => (

                                <div
                                    key={drive.id}
                                    className="list-item"
                                >

                                    <span>
                                        {drive.company}
                                    </span>

                                    <span>
                                        {
                                            getDaysLeft(
                                                drive.deadline
                                            )
                                        }
                                    </span>

                                </div>

                            ))
                    }

                </div>

                <div className="dashboard-section">

                    <h2>
                        DSA Progress
                    </h2>

                    <div className="list-item">
                        <span>Solved</span>
                        <span>{dsaStats.solved}</span>
                    </div>

                    <div className="list-item">
                        <span>Attempted</span>
                        <span>{dsaStats.attempted}</span>
                    </div>

                    <div className="list-item">
                        <span>Saved</span>
                        <span>{dsaStats.saved}</span>
                    </div>

                    <div className="list-item">
                        <span>Mastered</span>
                        <span>{dsaStats.mastered}</span>
                    </div>

                </div>

            </div>

            <div className="dashboard-section recent-section">

                <h2>
                    Recent Activity
                </h2>

                {
                    recentActivity.length === 0
                        ?
                        <p>No activity yet</p>
                        :
                        recentActivity.map((item, idx) => (

                            <div
                                key={idx}
                                className="activity-item"
                            >

                                ✓ {item}

                            </div>

                        ))
                }

            </div>




        </Layout>
    );
}
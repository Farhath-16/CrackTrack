import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import "./PlacementTracker.css";

export default function PlacementTracker() {

    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [deadline, setDeadline] = useState("");

    const [saving, setSaving] = useState(false);

    useEffect(() => {

        fetchDrives();

    }, []);

    const fetchDrives = async () => {


        try {

            const response =
                await api.get(
                    "/drives/getDrives"
                );

            const cleanedDrives =
                response.data.map(
                    (drive) => ({

                        ...drive,

                        stage:
                            drive.stage?.trim() ||
                            "Saved",

                        result:
                            drive.result?.trim() ||
                            "Not Started"

                    })
                );

            console.log(
                cleanedDrives.map(
                    drive => ({
                        company: drive.company,
                        id: drive.id
                    })
                )
            );

            setDrives(
                cleanedDrives
            );

        }

        catch (error) {

            setError(

                error.response?.data?.message ||

                "Failed to fetch drives"

            );

        }

        finally {

            setLoading(false);

        }

    };

    const handleAddDrive = async () => {

        try {

            setSaving(true);

            await api.post(

                "/drives/addDrive",

                {
                    company,
                    role,
                    deadline
                }

            );

            setCompany("");
            setRole("");
            setDeadline("");

            setShowModal(false);

            fetchDrives();

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Failed to add drive"

            );

        }

        finally {

            setSaving(false);

        }

    };

    const updateDrive = async (
        id,
        field,
        value
    ) => {

        try {

            await api.patch(

                `/drives/updateDriveStatus/${id}`,

                {
                    [field]: value
                }

            );

            setDrives((prev) =>

                prev.map((drive) =>

                    drive.id === id

                        ? {
                            ...drive,
                            [field]: value
                        }

                        : drive

                )

            );

        }

        catch (error) {
              console.log(error.response);

            alert(

                error.response?.data?.message ||

                "Update failed"

            );

        }

    };

    const deleteDrive = async (
        id
    ) => {

        const confirmDelete =
            window.confirm(
                "Delete this drive?"
            );

        if (!confirmDelete)
            return;

        try {

            await api.delete(

                `/drives/deleteDrive/${id}`

            );

            setDrives((prev) =>

                prev.filter(

                    (drive) =>

                        drive.id !== id

                )

            );

        }

        catch (error) {
              console.log(error.response);

            alert(

                error.response?.data?.message ||

                "Delete failed"

            );

        }

    };

    return (

        <Layout>

            <div className="tracker-header">

                <h1>
                    Placement Tracker
                </h1>

                <button
                    className="add-drive-btn"
                    onClick={() =>
                        setShowModal(true)
                    }
                >

                    + Add Drive

                </button>

            </div>

            {
                loading &&
                <p>
                    Loading...
                </p>
            }

            {
                error &&
                <p>
                    {error}
                </p>
            }

            {
                !loading &&
                !error && (

                    <table className="drive-table">

                        <thead>

                            <tr>

                                <th>
                                    Company
                                </th>

                                <th>
                                    Role
                                </th>

                                <th>
                                    Deadline
                                </th>

                                <th>
                                    Stage
                                </th>

                                <th>
                                    Result
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                drives.map((drive) => (

                                    <tr key={drive.id}>

                                        <td>
                                            {drive.company}
                                        </td>

                                        <td>
                                            {drive.role}
                                        </td>

                                        <td>
                                            {drive.deadline}
                                        </td>

                                        {/* STAGE */}

                                        <td>

                                            <select

                                                value={
                                                    drive.stage ||
                                                    "Saved"
                                                }

                                                onChange={(e) =>

                                                    updateDrive(

                                                        drive.id,

                                                        "stage",

                                                        e.target.value

                                                    )

                                                }

                                            >

                                                <option value="Saved">

                                                    Saved

                                                </option>

                                                <option value="Applied">

                                                    Applied

                                                </option>

                                                <option value="OA">

                                                    OA

                                                </option>

                                                <option value="Interview">

                                                    Interview

                                                </option>

                                                <option value="Offer">

                                                    Offer

                                                </option>

                                            </select>

                                        </td>

                                        {/* RESULT */}

                                        <td>

                                            <select

                                                value={
                                                    drive.result ||
                                                    "Not Started"
                                                }

                                                onChange={(e) =>

                                                    updateDrive(

                                                        drive.id,

                                                        "result",

                                                        e.target.value

                                                    )

                                                }

                                            >

                                                <option value="Not Started">

                                                    Not Started

                                                </option>

                                                <option value="Pending">

                                                    Pending

                                                </option>

                                                <option value="Selected">

                                                    Selected

                                                </option>

                                                <option value="Rejected">

                                                    Rejected

                                                </option>

                                            </select>

                                        </td>

                                        <td>

                                            <button

                                                className="delete-btn"

                                                onClick={() =>

                                                    deleteDrive(
                                                        drive.id
                                                    )

                                                }

                                            >

                                                Delete

                                            </button>

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                )
            }

            {
                showModal && (

                    <div className="modal-overlay">

                        <div className="modal">

                            <h2>

                                Add Drive

                            </h2>

                            <input

                                type="text"

                                placeholder="Company"

                                value={company}

                                onChange={(e) =>

                                    setCompany(
                                        e.target.value
                                    )

                                }

                            />

                            <input

                                type="text"

                                placeholder="Role"

                                value={role}

                                onChange={(e) =>

                                    setRole(
                                        e.target.value
                                    )

                                }

                            />

                            <input

                                type="datetime-local"

                                value={deadline}

                                onChange={(e) =>

                                    setDeadline(
                                        e.target.value
                                    )

                                }

                            />

                            <div className="modal-actions">

                                <button

                                    onClick={() =>

                                        setShowModal(false)

                                    }

                                >

                                    Cancel

                                </button>

                                <button

                                    onClick={
                                        handleAddDrive
                                    }

                                    disabled={
                                        saving
                                    }

                                >

                                    {
                                        saving

                                            ?

                                            "Saving..."

                                            :

                                            "Save Drive"
                                    }

                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

        </Layout>

    );

}
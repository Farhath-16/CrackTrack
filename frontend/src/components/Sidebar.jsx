import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {

    return (

        <aside className="sidebar">

            <div className="logo">

                Placement Prep

            </div>

            <nav>

                <NavLink to="/dashboard">
                    Dashboard
                </NavLink>

                <NavLink to="/drives">
                    Placement Tracker
                </NavLink>

                <NavLink to="/dsa">
                    DSA Vault
                </NavLink>

                <NavLink to="/interviews">
                    Interview Board
                </NavLink>

                <NavLink to="/profile">
                    Profile
                </NavLink>

            </nav>

        </aside>

    );

}
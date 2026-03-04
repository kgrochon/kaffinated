import { Link } from "react-router-dom";
import { LogoIcon, KaffinatedIcon } from "../assets/images/Library";
import "./styles/navigation.css";

export const Navigation = () => {
    return (
        <nav className="formal-nav">
            <div>
                <Link to="/" className="home-link">
                    <LogoIcon />
                    <KaffinatedIcon />
                </Link>
            </div>
            <div className="nav-links">
                {/* <Link to="/notes">Notes</Link> */}
                {/* <Link to="/life">Life</Link> */}
            </div>
        </nav>
    );
};

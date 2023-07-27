import { Link, Outlet } from "react-router-dom";
const Nav = () => {
    return (
        <>
            <nav className="navigationVar">
                <Link to="/" className="navLink">
                    Home
                </Link>
                <Link to="/tool" className="navLink">
                    Tool
                </Link>
                <Link to="/images" className="navLink">
                    My Images
                </Link>
            </nav>
            <div className="mainContainer">

                <Outlet />
            </div>
        </>

    );
};
export default Nav;
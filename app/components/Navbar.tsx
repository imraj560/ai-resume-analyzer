import React from 'react';
import {Link} from "react-router";
import { FaFileUpload } from "react-icons/fa";


const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/">
               <p className="text-2xl text-black font-bold text-generation">Pareson</p>
            </Link>
            <Link to="/upload" className="primary-button w-fit flex items-center justify-center gap-2">
                <FaFileUpload /> Resume
            </Link>
        </nav>
    );
};

export default Navbar;
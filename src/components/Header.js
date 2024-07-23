import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/image/Netflix_Logo_RGB.png';

function Header(props) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [scrolled, setScrolled] = useState(false);

    const handleScroll = useCallback(() => {
        if (window.scrollY > 100) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        const path = window.location.pathname;
        const indexMap = {
            '/': 0,
            '/tv_shows': 1,
            '/movies': 2,
            '/latest': 3,
            '/my_list': 4,
            '/browse_by_language': 5
        };
        setActiveIndex(indexMap[path]);
    }, []);

    const handleColor = (i) => setActiveIndex(i);

    return (
        <div className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="header_menu">
                <Link to={'/'} style={{ textDecoration: "none" }}>
                    <img src={logo} alt="Logo" width={"125px"} />
                </Link>
                <Link to={'/'} className={`header_link ${activeIndex === 0 ? 'clicked' : ''}`} onClick={() => handleColor(0)}>Home</Link>
                <Link to={'/tv_shows'} className={`header_link ${activeIndex === 1 ? 'clicked' : ''}`} onClick={() => handleColor(1)}>TV Shows</Link>
                <Link to={'/movies'} className={`header_link ${activeIndex === 2 ? 'clicked' : ''}`} onClick={() => handleColor(2)}>Movies</Link>
                <Link to={'/latest'} className={`header_link ${activeIndex === 3 ? 'clicked' : ''}`} onClick={() => handleColor(3)}>Latest</Link>
                <Link to={'/my_list'} className={`header_link ${activeIndex === 4 ? 'clicked' : ''}`} onClick={() => handleColor(4)}>My List</Link>
            </div>
        </div>
    );
}

export default Header;

import React from "react";
import { useState, useEffect } from "react";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Toggle body overflow when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [isOpen]);

  // Close menu when clicking links
  const closeMenu = () => {
    setIsOpen(false);
  };

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div className="navbar-brand">
          <a href="#home">Xiaobin (Jaden) Mei</a>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="https://www.linkedin.com/in/xiaobinmei/" target="_blank" rel="noopener noreferrer">
            My Linkedin
          </a>
          <a href="https://github.com/Jadeni77" target="_blank" rel="noopener noreferrer">
            My Github
          </a>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className={`navbar-toggle ${isOpen ? 'open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Navigation Menu */}
        <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
          <a href="#home" onClick={closeMenu}>Home</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#skills" onClick={closeMenu}>Skills</a>
          <a href="#projects" onClick={closeMenu}>Projects</a>
          <a 
            href="https://www.linkedin.com/in/xiaobinmei/" 
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
          >
            My Linkedin
          </a>
          <a 
            href="https://github.com/Jadeni77" 
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
          >
            My Github
          </a>
        </div>
        
        {/* Overlay when menu is open */}
        <div 
          className={`menu-overlay ${isOpen ? 'visible' : ''}`} 
          onClick={closeMenu}
        />
      </div>
    </nav>
  );
}

export default NavBar;
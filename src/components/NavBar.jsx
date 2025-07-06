import React from "react";
import { useState, useEffect } from "react";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  //tract scroll position to change styling
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
  }, []); //adding [] means only run only onces when component renders

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div className="navbar-brand">
          <a href="#home">Xiaobin (Jaden) Mei</a>
          </div>

          <button 
          className={`navbar-toggle ${isOpen ? 'open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
          <a href="#home" onClick={() => setIsOpen(false)}>Home</a>
          <a href="#about" onClick={() => setIsOpen(false)}>About</a>
          <a href="#skills" onClick={() => setIsOpen(false)}>Skills</a>
          <a href="#projects" onClick={() => setIsOpen(false)}>Projects</a>
         {/* <a href="#contact" onClick={() => setIsOpen(false)}>Contact</a> */}
          <a href="https://www.linkedin.com/in/xiaobinmei/" target="_blank">My Linkedin</a>
          <a href="https://github.com/Jadeni77" target="_blank">My Github</a>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;

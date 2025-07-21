import React, { useEffect } from "react";
import HeroSection from "../components/heroSection";
import Navbar from "../components/NavBar";

const HomePage: React.FC = () => {
  // Hide scrollbar when this page mounts
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; // Restore on unmount
    };
  }, []);

  return (
    <>
      <Navbar />
      <HeroSection />
    </>
  );
};

export default HomePage;

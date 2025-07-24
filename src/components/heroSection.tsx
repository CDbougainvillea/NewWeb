import { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";

interface BallPosition {
  x: number;
  y: number;
}

function HeroSection() {
  const [ballPosition, setBallPosition] = useState<BallPosition>({
    x: 0,
    y: 0,
  });

  const handleMouseMove = (e: { clientX: number; clientY: number }) => {
    setBallPosition({
      x: e.clientX - 5,
      y: e.clientY - 5,
    });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const contentStyle = {
    borderRadius: "10px",
    color: "black",
    padding: "30px 20px",
    textAlign: "left" as const,
  };

  const heroStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');

    .hero-section {
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      background: linear-gradient(rgba(0,0,0,0.0), rgba(0,0,0,0.0)),
        url('https://images.pexels.com/photos/33019583/pexels-photo-33019583.jpeg');
      background-size: cover;
      background-position: center;
      color: white;
      position: relative;
      overflow: hidden;
      padding: 20px 50px;
    }

    .ball {
      pointer-events: none;
      width: 10px;
      height: 10px;
      border-radius: 100%;
      position: absolute;
      top: ${ballPosition.y}px;
      left: ${ballPosition.x}px;
      transition: top 2s ease, left 2s ease;
      background: #ffffff;
      box-shadow:
        0 5px 15px rgba(255, 255, 255, 0.1),
        0 -5px 15px rgba(255, 255, 255, 0.1),
        10px 0 15px rgba(255, 255, 255, 0.1),
        -10px 0 15px rgba(255, 255, 255, 0.1);
    }

    .hero-heading {
      font-family: 'Great Vibes', cursive;
      font-size: 5rem;
      color: white;
      text-align: left;
    }

    .badge-wrapper {
      width: 100%;
      max-width: 330px;
      height: 89px;
      background-color: #3E475A;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
      margin: 0 auto;
    }

    iframe {
      border: none;
      width: 100%;
      height: 100%;
    }

    @media (max-width: 768px) {
      .ball { width: 15px; height: 15px; }

      .hero-heading {
        font-size: 2.5rem;
        text-align: left;
      }

      p {
        font-size: 0.95rem;
      }
    }

    @media (max-width: 576px) {
      .ball { width: 10px; height: 10px; }

      .hero-heading {
        font-size: 2rem;
        text-align: left;
      }

      p {
        font-size: 0.9rem;
      }

      .hero-section {
        padding: 10px;
        align-items: flex-start;
      }
    }
  `;

  return (
    <>
      <style>{heroStyles}</style>
      <section className="hero-section">
        <Container>
          <Row>
            <Col xs={12} md={8} style={contentStyle}>
              <h1 className="hero-heading">CD Bougainvillea</h1>
            </Col>
          </Row>
        </Container>
        <div className="ball" />
      </section>
    </>
  );
}

export default HeroSection;

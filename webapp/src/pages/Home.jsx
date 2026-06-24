import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import bridgeImage from "../assets/bridge.png";
import "./Home.css";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="home">
      <section className="home__hero">
        <div className="home__content">
          <h1>
            Engineering
            <br />
            Calculations.
            <br />
            <span>Simplified.</span>
          </h1>

          <p>
            Fast, accurate, and reliable formulas for engineers, by engineers.
          </p>

          <div className="home__actions">
            {!user ? (
              <button
                className="home__button home__button--primary"
                onClick={() => navigate("/login")}
              >
                Get Started
              </button>
            ) : (
              <button
                className="home__button home__button--primary"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </button>
            )}

            <button className="home__button home__button--secondary">
              View All Formulas
            </button>
          </div>
        </div>

        <div className="home__image-wrap">
          <img
            src={bridgeImage}
            alt="Engineering bridge blueprint with formulas"
            className="home__image"
          />
        </div>
      </section>
    </main>
  );
}
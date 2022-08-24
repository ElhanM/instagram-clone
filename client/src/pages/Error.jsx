import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../components/context";

const Error = () => {
  const { setValue } = useGlobalContext();
  useEffect(() => {
    setValue();
  }, []);
  return (
    <div className="error-page">
      <h1 className="error-page__header">Error</h1>
      <p className="error-page__paragraph">Something went wrong</p>
      <p className="error-page__paragraph">
        Plese navigate back to the{" "}
        <span className="error-page__span">
          <Link
            to="/"
            onClick={() => {
              setValue();
              window.scrollTo(0, 0);
            }}
            className="navbar-link"
          >
            home page
          </Link>
        </span>
      </p>
    </div>
  );
};

export default Error;

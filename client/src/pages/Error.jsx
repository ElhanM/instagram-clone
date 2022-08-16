import { useEffect } from "react";
import { useGlobalContext } from "../components/context";

const Error = () => {
  const { setValue } = useEffect(() => {
    setValue();
  }, []);
  return (
    <div>
      <h1>Error</h1>
      <p>Something went wrong</p>
    </div>
  );
};

export default Error;

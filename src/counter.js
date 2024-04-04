import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CounterApp = () => {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setCount((prevCount) => prevCount + 1);
      }, 100);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning((prevIsRunning) => !prevIsRunning);
  };

  const handleReset = () => {
    setCount(0);
    setIsRunning(false);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Counter</h1>
      <p className="fs-4">Count: {count}</p>
      <div className="btn-group" role="group" aria-label="Basic example">
        <button
          type="button"
          className="btn btn-primary mx-2"
          onClick={handleStartStop}
        >
          {isRunning ? "Stop" : "Start"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default CounterApp;

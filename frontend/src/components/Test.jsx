import React, { useState, useEffect } from "react";
import "../css/Gauge.css";

const Test = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/test", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const responseData = await response.json();
        setData(responseData);
        console.log(responseData);
      } catch (error) {
        console.error("Error fetching gauge data:", error);
      }
    };

    fetchData(); // Fetch data when the component mounts
  }, []); // Empty dependency array ensures it only runs once on mount

  return (
    <>
      {/* Render your component using the fetched data */}
    </>
  );
};

export default Test;

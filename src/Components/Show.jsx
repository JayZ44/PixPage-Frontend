import "./Grid.css"; // Import CSS file for grid styles
import { SketchPicker } from "react-color";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getOneArtworkSquares } from "../API/fetch";
import React, { useState, useEffect } from "react";

const Show = () => {
  const navigate = useNavigate();
  const [allArtworkSquares, setAllArtworkSquares] = useState([]);
  const [currentColor, setCurrentColor] = useState("blue");
  const { id } = useParams();

  // Function to handle click on a grid square
  function handleSquareClick(coordinates) {
    const updatedallArtworkSquares = allArtworkSquares.map((row) =>
      row.coordinates === coordinates
        ? { ...row, color: currentColor } // Change color on click (example)
        : row
    );

    setAllArtworkSquares(updatedallArtworkSquares);
  }

  useEffect(() => {
    getOneArtworkSquares(id)
      .then((result) => {
        setAllArtworkSquares(result);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [id]);

  const repeatTimes =
    allArtworkSquares.length % 2 === 0
      ? allArtworkSquares.length / 2
      : allArtworkSquares.length / 3; // Set the number of times to repeat dynamically
  const root = document.documentElement;
  root.style.setProperty("--repeat-times", repeatTimes); // Update the CSS variable

  // const grid_size = allArtworkSquares.grid_size;
  return (
    <div>
      <button
        onClick={() => {
          console.log(allArtworkSquares);
        }}
      >
        {" "}
        Log
      </button>
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        Home
      </button>
      <h1>Pixel Art Maker</h1>
      {/* <h3>Grid Size: {grid_size}</h3> */}
      <SketchPicker
        color={currentColor}
        onChange={(color) => setCurrentColor(color.hex)}
      />
      <div className="grid-container">
        {!allArtworkSquares ? (
          <div>Loading...</div>
        ) : (
          allArtworkSquares.map((row, rowIndex) => {
            console.log(
              row.color,
              Object.values(row).color,
              allArtworkSquares.length
            );

            return (
              <div key={rowIndex} className="grid-row">
                <div
                  key={`${Object.values(row).id}`}
                  className="grid-square"
                  style={{
                    backgroundColor: row.color,
                  }}
                  onClick={() => handleSquareClick(row.coordinates)}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Show;

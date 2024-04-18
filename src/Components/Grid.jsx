import React, { useState } from "react";
import "./Grid.css"; // Import CSS file for grid styles
import { SketchPicker } from "react-color";
import { Link, useNavigate } from "react-router-dom";

const rows = 4;
const cols = 4;
const grid_size = rows * cols;

const Grid = () => {
  const [gridData, setGridData] = useState(createEmptyGrid());
  const [currentColor, setCurrentColor] = useState("blue");
  const navigate = useNavigate();

  // Function to create an empty 8x8 grid
  function createEmptyGrid() {
    const grid = [];
    const letters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~!@#$%^&*()-_=+;:,<.>/?[]";

    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        const x = letters.charAt(j);
        const y = i + 1;
        const coordinates = x + y;
        row.push({ coordinates, color: "white" });
      }
      grid.push(row);
    }

    return grid;
  }

  // Function to handle click on a grid square
  function handleSquareClick(coordinates) {
    const updatedColor = currentColor;
    const updatedGridData = gridData.map((row) =>
      row.map((square) =>
        square.coordinates === coordinates
          ? { ...square, color: currentColor } // Change color on click (example)
          : square
      )
    );
    console.log(updatedGridData);
    setGridData(updatedGridData);
  }

  // Function to save the grid data to the backend
  function saveImage() {
    // Send gridData to backend server (POST request)
    // Example:
    fetch("/api/saveImage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gridData),
    })
      .then((response) => {
        // Handle response
      })
      .catch((error) => {
        console.error("Error saving image:", error);
      });
  }

  let repeatTimes = 4;

  //   if (gridData.length < 10 && gridData.length % 2 === 0) {
  //     repeatTimes = gridData.length / 2;
  //   } else if (gridData.length > 10 && gridData.length % 2 === 0) {
  //     repeatTimes = gridData.length / 4;
  //   } else if (gridData.length < 10 && gridData.length % 2 !== 0) {
  //     repeatTimes = gridData.length / 3;
  //   } else if (gridData.length > 10 && gridData.length % 2 !== 0) {
  //     repeatTimes = gridData.length / 6;
  //   }

  const root = document.documentElement;
  root.style.setProperty("--repeat-times", repeatTimes); // Update the CSS variable

  return (
    <div>
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        Home
      </button>
      <h1>Pixel Art Maker</h1>
      <h3>Grid Size: {grid_size}</h3>
      <SketchPicker
        color={currentColor}
        onChange={(color) => setCurrentColor(color.hex)}
      />
      <div className="grid-container" style={{ gridTemplateColumns: "4fr" }}>
        {gridData.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((square) => (
              <div
                key={`${square.coordinates}`}
                className="grid-square"
                style={{ backgroundColor: square.color }}
                onClick={() => handleSquareClick(square.coordinates)}
              />
            ))}
          </div>
        ))}
      </div>
      <button onClick={saveImage}>Save Image</button>
    </div>
  );
};

export default Grid;

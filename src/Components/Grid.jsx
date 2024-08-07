import React, { useState, useEffect } from "react";
import "./Grid.css"; // Import CSS file for grid styles
import { SketchPicker } from "react-color";
import { Link, useNavigate } from "react-router-dom";
import NewGrid from "./NewGrid";
// Grid and Show are the beating heart of this app!!
const API = import.meta.env.VITE_BASE_API_URL;
console.log(API);

const Grid = () => {
  const [grid_id, setGridId] = useState(0);
  const [gridWidth, setGridWidth] = useState(30);
  const [gridData, setGridData] = useState(createEmptyGrid());
  const [currentColor, setCurrentColor] = useState("blue");
  const [isDragging, setIsDragging] = useState(false);
  const [clearGrid, setClearGrid] = useState(false);
  const grid_size = gridWidth * gridWidth;
  const navigate = useNavigate();

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   setGridWidth(event.target.value);
  // };

  // Function to create an empty 8x8 grid
  function createEmptyGrid() {
    const grid = [];
    const letters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~!@#$%^&*()-_=+;:,<.>/?[]";

    for (let i = 0; i < gridWidth; i++) {
      const row = [];
      for (let j = 0; j < gridWidth; j++) {
        const x = letters.charAt(j);
        const y = i + 1;
        const coordinates = x + y;
        row.push({ coordinates, color: "white", grid_id });
      }
      grid.push(row);
    }

    return grid;
  }

  useEffect(() => {
    const newGrid = createEmptyGrid();
    setGridData(newGrid);
  }, [gridWidth, clearGrid, grid_id]);

  // Function to handle click on a grid square
  const handleSquareClick = (coordinates) => {
    setGridData((prevGridData) =>
      prevGridData.map((row) =>
        row.map((square) =>
          square.coordinates === coordinates
            ? { ...square, color: currentColor }
            : square
        )
      )
    );
  };

  const handleMouseDown = (coordinates) => {
    setIsDragging(true);
    handleSquareClick(coordinates);
  };

  const handleMouseEnter = (coordinates) => {
    if (isDragging) {
      handleSquareClick(coordinates);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const clear = () => {
    setClearGrid(!clearGrid);
  };

  // Function to save the grid data to the backend
  function saveImage() {
    fetch(`${API}/artworks/squares`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gridData),
    })
      .then((response) => {
        if (response.ok) {
          return response.text(); // Get raw response text
        } else {
          return response.text().then((text) => {
            throw new Error(
              `HTTP error! Status: ${response.status}. Response: ${text}`
            );
          });
        }
      })
      .then((text) => {
        if (text) {
          return JSON.parse(text); // Attempt to parse text as JSON
        } else {
          return {}; // Return empty object if response is empty
        }
      })
      .then((data) => {
        console.log(data, "GRID DATA", JSON.stringify(gridData));
      })
      .catch((error) => {
        console.error("Error saving image:", error);
      });
  }

  let repeatTimes = 6;

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
      <NewGrid
        gridWidth={gridWidth}
        setGridWidth={setGridWidth}
        grid_id={grid_id}
        setGridId={setGridId}
      />
      <SketchPicker
        color={currentColor}
        onChange={(color) => setCurrentColor(color.hex)}
      />
      <div className="grid-container" style={{ gridTemplateColumns: "10fr" }}>
        {gridData.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((square) => (
              <div
                key={`${square.coordinates}`}
                className="grid-square"
                style={{ backgroundColor: square.color }}
                onClick={() => handleSquareClick(square.coordinates)}
                onMouseDown={() => handleMouseDown(square.coordinates)}
                onMouseEnter={() => handleMouseEnter(square.coordinates)}
                onMouseUp={handleMouseUp}
              />
            ))}
          </div>
        ))}
      </div>
      <button onClick={clear}>Clear Grid</button>

      <button onClick={saveImage}>Save Image</button>
    </div>
  );
};

export default Grid;

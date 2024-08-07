import "./Show.css"; // Import CSS file for grid styles
import { SketchPicker } from "react-color";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getOneArtworkSquares } from "../API/fetch";
import React, { useState, useEffect } from "react";
const API = import.meta.env.VITE_BASE_API_URL;

const Show = () => {
  const navigate = useNavigate();
  const [allArtworkSquares, setAllArtworkSquares] = useState([]);
  const [currentColor, setCurrentColor] = useState("blue");
  const { id } = useParams();
  const [gridInfo, setGridInfo] = useState({});
  const [isDragging, setIsDragging] = useState(false);

  // Function to handle click on a grid square
  function handleSquareClick(coordinates) {
    const updatedallArtworkSquares = allArtworkSquares.map((row) =>
      row.coordinates === coordinates
        ? { ...row, color: currentColor } // Change color on click (example)
        : row
    );

    setAllArtworkSquares(updatedallArtworkSquares);
  }

  async function getGridInfo() {
    try {
      const response = await fetch(`${API}/artworks/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const data = await response.json();
      setGridInfo(data[0]);
      console.log(gridInfo);
      return data;
    } catch (error) {
      console.error("There was a problem with the fetch operation.", error);
    }
  }

  async function deleteGrid() {
    try {
      const response = await fetch(`${API}/artworks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      navigate("/");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("There was a problem with the fetch operation.", error);
    }
  }

  useEffect(() => {
    getOneArtworkSquares(id)
      .then((result) => {
        console.log(result);
        setAllArtworkSquares(result);
      })
      .then(() => {
        getGridInfo();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [id]);

  const transformData = (all) => {
    // Extract unique rows and columns from coordinates
    const rows = Array.from(new Set(all.map((item) => item.coordinates[0])));
    const cols = Array.from(
      new Set(all.map((item) => item.coordinates.slice(1)))
    );

    // Initialize grid
    const grid = rows.map((row) =>
      cols.map((col) => {
        const cell = all.find((item) => item.coordinates === `${row}${col}`);
        return cell || { coordinates: `${row}${col}`, color: "white" }; // Default if not found
      })
    );

    return grid;
  };

  const gridData = transformData(allArtworkSquares);
  // const repeatTimes =
  //   allArtworkSquares.length % 2 === 0
  //     ? allArtworkSquares.length / 2
  //     : allArtworkSquares.length / 3; // Set the number of times to repeat dynamically
  // const root = document.documentElement;
  // root.style.setProperty("--repeat-times", repeatTimes); // Update the CSS variable

  // const grid_size = allArtworkSquares.grid_size;

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

  function handleUpdate() {
    fetch(`${API}/artworks/squares/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(allArtworkSquares),
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
        console.log(data, "GRID DATA", JSON.stringify(allArtworkSquares));
      })
      .catch((error) => {
        console.error("Error updating image:", error);
      });
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Pixel Art Maker</h1>
        <div className="buttons-container">
          <button onClick={() => console.log(allArtworkSquares)}>Log</button>
          <button onClick={() => navigate("/")}>Home</button>
        </div>
      </div>

      <div className="main-content">
        <div className="info-panel">
          <h3>Artwork Title: {gridInfo.title}</h3>
          <h3>Artwork Creator: {gridInfo.creator}</h3>
          <h3>Creator ID: {gridInfo.creator_id}</h3>
          <h3>Grid Size: {gridInfo.grid_size}</h3>
          <h3>Grid Id: {gridInfo.id}</h3>
          <SketchPicker
            color={currentColor}
            onChange={(color) => setCurrentColor(color.hex)}
          />
          <button onClick={handleUpdate}>Update Artwork</button>
          <button className="delete-button" onClick={deleteGrid}>
            Delete Artwork
          </button>
        </div>

        <div className="grid-container">
          {!allArtworkSquares ? (
            <div>Loading...</div>
          ) : (
            allArtworkSquares.map((square) => (
              <div
                key={square.id}
                className="grid-square"
                style={{ backgroundColor: square.color }}
                onClick={() => handleSquareClick(square.coordinates)}
                onMouseDown={() => handleMouseDown(square.coordinates)}
                onMouseEnter={() => handleMouseEnter(square.coordinates)}
                onMouseUp={handleMouseUp}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Show;

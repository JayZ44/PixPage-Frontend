import { Link, useNavigate } from "react-router-dom";

import { getAllArtworkGrids, getOneArtworkSquares } from "../API/fetch";

import React, { useState, useEffect } from "react";

import "./Grid.css";

const Index = () => {
  const [indexSquares, setIndexSquares] = useState([]);

  const navigate = useNavigate();
  const [allArtworkGrids, setAllArtworkGrids] = useState(null);

  useEffect(() => {
    getAllArtworkGrids()
      .then((result) => {
        setAllArtworkGrids(result);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div>
      <h1>Welcom To PixPage!</h1>
      <button
        onClick={() => {
          navigate("/grid");
        }}
      >
        New Artwork
      </button>
      {allArtworkGrids ? (
        allArtworkGrids.map((artwork) => (
          <Link key={artwork.id} to={`/${artwork.id}`}>
            <div>
              {" "}
              This is a artwork! {artwork.title}, {artwork.creator}{" "}
              <div className="grid-container">
                {!indexSquares ? (
                  <div>Loading...</div>
                ) : (
                  (console.log(indexSquares),
                  indexSquares.map((row, rowIndex) => {
                    console.log(
                      row.color,
                      Object.values(row).color,
                      indexSquares.length
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
                  }))
                )}
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Index;

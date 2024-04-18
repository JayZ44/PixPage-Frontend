import { Link, useNavigate } from "react-router-dom";

import { getAllArtworkGrids } from "../API/fetch";

import React, { useState, useEffect } from "react";

const Index = () => {
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
      <div>Index</div>
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

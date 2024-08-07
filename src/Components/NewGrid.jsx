import React from "react";
import { useState, useEffect } from "react";
const API = import.meta.env.VITE_BASE_API_URL;

const NewGrid = ({ gridWidth, setGridWidth, grid_id, setGridId }) => {
  const [creatorId, setCreatorId] = useState(0);

  const [creatorData, setCreatorData] = useState({ name: "", bio: "" });

  const [gridBody, setGridBody] = useState({
    title: "",
    grid_size: "",
    creator: "",
    creator_id: "",
  });

  useEffect(() => {
    setGridBody((prevGridBody) => ({
      ...prevGridBody,
      creator: creatorData.name,
      grid_size: gridWidth,
      creator_id: creatorId,
    }));
  }, [creatorData.name, creatorId, gridWidth]);

  const handleTextChange = (event) => {
    console.log(event.target);
    setGridBody({ ...gridBody, [event.target.id]: event.target.value });
  };

  const handleCreatorChange = (event) => {
    setCreatorData({ ...creatorData, [event.target.id]: event.target.value });
  };

  const handleGridWidthChange = (event) => {
    setGridWidth(event.target.value);
    // setGridBody({ ...gridBody, [event.target.id]: event.target.value });
  };

  const handleCreatorSubmit = (event) => {
    event.preventDefault();
    fetch(`${API}/artworks/creators`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(creatorData),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("THIS IS RES.ID", data.id);
        setCreatorId(data.id);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleArtworkSubmit = (event) => {
    event.preventDefault();
    fetch(`${API}/artworks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gridBody),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setGridId(data.id);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <h4>Make Creator:</h4>
      <form onSubmit={handleCreatorSubmit}>
        <label htmlFor="name">Creator Name:</label>
        <input
          id="name"
          value={creatorData.name}
          type="text"
          onChange={handleCreatorChange}
          placeholder="Creator Name..."
          required
        />
        <label htmlFor="bio">Creator Bio:</label>
        <input
          id="bio"
          value={creatorData.bio}
          type="text"
          onChange={handleCreatorChange}
          placeholder="Creator Bio..."
          required
        />
        <button type="submit">Submit Creator</button>
      </form>
      <h4>Make Artwork:</h4>
      <form onSubmit={handleArtworkSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          value={gridBody.title}
          type="text"
          onChange={handleTextChange}
          placeholder="Write name of title..."
          required
        />
        {/* <label htmlFor="width">Grid Width</label>
        <input
          id="width"
          value={gridWidth}
          type="numeric"
          onChange={handleGridWidthChange}
          placeholder="Max Width: 59"
          required
        /> */}
        <label htmlFor="creator">Creator Name:</label>
        <input
          id="creator"
          value={creatorData.name}
          type="text"
          onChange={handleTextChange}
          placeholder="Write name of creator..."
          required
        />
        <label htmlFor="creator_id">Creator ID:</label>
        <input
          id="creator_id"
          value={gridBody.creator_id}
          type="numeric"
          onChange={handleTextChange}
          placeholder="Write ID of creator..."
          required
        />
        <button type="submit">Submit Artwork</button>
      </form>
    </div>
  );
};

export default NewGrid;

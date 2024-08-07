const URL = import.meta.env.VITE_BASE_API_URL;

// GET ALL GRIDS
export async function getAllArtworkGrids() {
  try {
    const response = await fetch(`${URL}/artworks/all`);
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation.", error);
  }
}

// GET ONE ARTWORK (SQUARES)
export async function getOneArtworkSquares(id) {
  try {
    const response = await fetch(`${URL}/artworks/squares/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

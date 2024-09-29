import axios from "axios";

async function PlaceDescription(placeName, address) {
  const response = await axios.get(
    `https://breeze-theta.vercel.app/get-description?placeName=${placeName}&address=${address}`
  );
  console.log(response.data);
  return response.data;
}

export default PlaceDescription;

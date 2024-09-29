import axios from 'axios';

async function PlaceDescription(placeName) {
    const response = await axios.get(`https://breeze-theta.vercel.app/get-description?placeName=${placeName}`);
    console.log(response.data);
    return (response.data);
}

export default PlaceDescription;
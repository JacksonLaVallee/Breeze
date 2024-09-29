import axios from 'axios';

async function PlaceDescription(placeName) {
    const response = await axios.get(`http://localhost:8080/get-description?placeName=${placeName}`);
    console.log(response.data);
    return (response.data);
}

export default PlaceDescription;
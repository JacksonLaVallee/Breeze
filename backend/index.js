const express = require("express");
const hostname = "localhost";
const port = 8080;
const axios = require("axios");
const bodyParser = require("body-parser");
const compression = require("compression");
const { OpenAI } = require("openai");
const app = express();
app.use(express.json());
const cors = require("cors");
require('dotenv').config();

app.use(compression());
app.use(bodyParser.json());
app.use(cors());

// Initialize OpenAI Client
const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY });

// Global State Variables
let weatherData = [];
let zipCode = "60612";
let ACTIVITIES_LIST = [];

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// Set Zip Code Endpoint
app.post("/set-zip", (req, res) => {
  weatherData = [];
  zipCode = req.query.zipCode;
  return res.status(200).json({
    success: true,
    data: zipCode,
  });
});

// Fetch Weather Data Endpoint
app.get("/find-weather", async (req, res) => {
  if (weatherData.length !== 0) return res.status(200).send(weatherData);
  try {
    const messages = await grabWeather();
    const initialPrompt = {
      role: "system",
      content: `You are to respond in JSON format. Give a one word description of the average weather for each of the next seven days. 
            YOU MAY ONLY RESPONSE WITH ONE OF FIVE WORDS, ALL LOWERCASE: sunny, cloudy, rainy, stormy, snowy
            DO NOT RETURN ANY OTHER WORD. I REPEAT ONLY RETURN sunny, cloudy, rainy, stormy, snowy. NOTHING ELSE IS ALLOWED.
            Return the response in the following parsable JSON format:
            {
            weather: [
            "weatherDay1ONEWORD",
            "weatherDay2ONEWORD",
            "weatherDay3ONEWORD",
            "weatherDay4ONEWORD",
            "weatherDay5ONEWORD",
            "weatherDay6ONEWORD",
            "weatherDay7ONEWORD"
            ]
        }
            
        Your provided data is as follows: ${JSON.stringify(messages)}`,
    };
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [initialPrompt],
      stream: false,
    });

    const parsableResponse = response.choices[0].message.content;
    weatherData = JSON.parse(parsableResponse).weather;
    return res.status(200).send(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(400).json({ error: "Failed to fetch weather data" });
  }
});

// Fetch Initial Activities Based on Zip Code and Radius
app.get("/find-activities", async (req, res) => {
  try {
    const activities = await grabActivities();
    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

// Helper Function: Fetch Weather Data
async function grabWeather() {
  if (zipCode.length !== 5) return { error: "Invalid zip code" };

  try {
    const response = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json?q=${zipCode}&days=7&key=${process.env.REACT_APP_WEATHER_API_KEY}`
    );
    return response.data;
  } catch (error) {
    return { error };
  }
}

// Helper Function: Fetch Activities from Google Places API
async function grabActivities() {
  try {
    // Step 1: Convert the zip code to coordinates using Google Geocoding API
    const geoResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${GOOGLE_API_KEY}`
    );
    if (geoResponse.data.status !== "OK") throw new Error("Failed to get coordinates from zip code");

    const location = geoResponse.data.results[0].geometry.location;
    const { lat, lng } = location;

    // Step 2: Use Google Places API to find activities within a radius
    const placesResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=16093&type=tourist_attraction|park|gym|restaurant|museum|amusement_park|zoo|aquarium|library|shopping_mall&key=${GOOGLE_API_KEY}`
    );
    if (placesResponse.data.status !== "OK") throw new Error("Failed to get activities from Google Places API");

    // Step 3: Extract and format activities
    const activities = placesResponse.data.results.map((place) => ({
      id: place.place_id,
      name: place.name,
      location: place.geometry.location,
      types: place.types,
      rating: place.rating || 'N/A',
      price_level: place.price_level || 'N/A',
      photoUrl: place.photos ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}` : '',
    }));

    ACTIVITIES_LIST = activities; // Store activities globally if needed

    // Return only necessary data for frontend
    return activities.map((activity) => ({ id: activity.id, name: activity.name }));
  } catch (error) {
    console.error("Error fetching activities from Google Places API:", error);
    return { error: "Failed to fetch activities" };
  }
}

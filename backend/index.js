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

// Configuration and API Keys
const OPENAI_API_KEY = "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";
const WEATHER_API_KEY = "19144fe0b9f5430387e232205242809";
const GOOGLE_API_KEY = "AIzaSyCocc-1XF4aJSLYk3mMSyoQqhipLpf9NLo";

// Initialize OpenAI Client
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Global State Variables
let weatherData = [];
let zipCode = "60612";
let ACTIVITIES_LIST = [];

app.use(compression());
app.use(bodyParser.json());
app.use(cors());

// Start Server
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
        const messages = await grabTempActivities();
        const initialPrompt = {
          role: "system",
          content: `You are to respond in JSON format. Give a list of FIVE (5) activities by ID that can be done in the weather conditions provided.
                Return the response in the following parsable JSON format:
                {
                activities: [
                "activityID1",
                "activityID2",
                "activityID3",
                "activityID4",
                "activityID5"
                ]}
                
                Your provided data is as follows: Activities ${JSON.stringify(
                  messages
                )}
                Weather = Very sunny and amazing out`,
        };
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [initialPrompt],
          stream: false,
        });
        const parsableResponse = response.choices[0].message.content;
        return res.status(200).send(JSON.parse(parsableResponse).activities);
      } catch (error) {
        console.log(error);
        res.status(400).json({});
      }
});

// Helper Function: Fetch Weather Data
async function grabWeather() {
  if (zipCode.length !== 5) return { error: "Invalid zip code" };

  try {
    const response = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json?q=${zipCode}&days=7&key=${WEATHER_API_KEY}`
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

async function grabTempActivities() {
    return {
        activites: [
        { id: "1", name: "Board Games" },
        { id: "2", name: "Indoor Sports" },
        { id: "3", name: "Bowling" },
        { id: "4", name: "Movie" },
        { id: "5", name: "Gym" },
        { id: "6", name: "Hike" },
        { id: "7", name: "Swim" },
        { id: "8", name: "Beach" },
        { id: "9", name: "Run" },
        { id: "10", name: "Picnic" },
      ]};
}


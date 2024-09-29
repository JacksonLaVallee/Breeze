const express = require("express");
const hostname = "localhost";
const port = 8080;
const axios = require("axios");
const bodyParser = require("body-parser");
const compression = require("compression");
const { OpenAI } = require("openai");
require('dotenv').config();
const app = express();
app.use(express.json());
const cors = require("cors");

// Initialize OpenAI Client
const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY });

// Global State Variables
let weatherData = [];
let zipCode = "60612";
let ACTIVITIES_LIST = [];

app.use(compression());
app.use(bodyParser.json());
app.use(cors(
    {
        origin: ["https://www.breeze-select.co", "https://breeze-theta.vercel.app"],
        methods: ["POST", "GET"],
        credentials: true
    }
));

// Start Server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.get("/", (req, res) => { return res.status(200).send("Hello, World!"); });
// Get Description Endpoint
app.get("/get-description", async (req, res) => {
  console.log("debug point: ", req.query.address);
  const initialPrompt = {
    role: "system",
    content: `I want to go to this place. Give a 1 sentence description of: ${req.query.placeName} (this is located in ${req.query.address}).`,
  };
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [initialPrompt],
    stream: false,
  });
  console.log(response);
  return res.status(200).send(response.choices[0].message.content);
});

// Grab zip code endpoint
app.get("/get-zip", (req, res) => { return res.status(200).send(zipCode); });

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
    ACTIVITIES_LIST = await grabActivities();
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

app.post("/set-weather", async (req, res) => {
  console.log("TEST");
  const weather = req.query.weather;
  const IDs = await filterActivities(weather);
  const activities = ACTIVITIES_LIST.filter((activity) => IDs.includes(activity.id));

  res.status(200).send(activities);
});

async function filterActivities(weather) {
    try {
        let filtered_messages = ACTIVITIES_LIST.map((activity) => ({ id: activity.id, name: activity.name }));
        const initialPrompt = {
          role: "system",
          content: `You are to respond in JSON format. Give a list of at least THREE (3) activities by ID that can be done in the weather conditions provided.
                X is the actual amount of activities you suggest, try to include 10-15 activities if possible.
                Return the response in the following parsable JSON format:
                {
                activities: [
                "activityID1",
                "activityID2",
                "activityID3",
                .
                .
                .
                "activityIDX"
                ]}
                Your provided data is as follows: Activities ${JSON.stringify(
                  filtered_messages
                )}
                Weather = ${weather}`,
        };
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [initialPrompt],
          stream: false,
        });
        const parsableResponse = response.choices[0].message.content;
        return JSON.parse(parsableResponse).activities;
      } catch (error) {
        console.log(error);
        return { error };
      }
};

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
      `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
    );
    if (geoResponse.data.status !== "OK") throw new Error("Failed to get coordinates from zip code");

    const location = geoResponse.data.results[0].geometry.location;
    const { lat, lng } = location;

    // Step 2: Use Google Places API to find activities within a radius
    const placesResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=16093&type=tourist_attraction|park|gym|restaurant|museum|amusement_park|zoo|aquarium|library|shopping_mall&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
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
      photoUrl: place.photos ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${process.env.REACT_APP_GOOGLE_API_KEY}` : '',
    }));
    console.log("activities: ", activities);
    return activities;
  } catch (error) {
    console.error("Error fetching activities from Google Places API:", error);
    return { error: "Failed to fetch activities" };
  }
}


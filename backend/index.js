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

const OPENAI_API_KEY =
  "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";

app.use(compression());
app.use(bodyParser.json());
app.use(cors());

const WEATHER_API_KEY = "19144fe0b9f5430387e232205242809";

let weatherData = [];
let zipCode = "60612";
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.post("/set-zip", (req, res) => {
  weatherData = [];
  zipCode = req.query.zipCode;
  return res.status(200).json({
    success: true,
    data: zipCode,
  });
});

app.get("/find-weather", async (req, res) => {
  if (weatherData.length != 0) return res.status(200).send(weatherData);
  try {
    const messages = await grabWeather();
    const initialPrompt = {
      role: "system",
      content: `You are to respond in JSON format. Give a one word description of the average weather for each of the next seven days. 
            YOU MAY ONLY RESPONSE WITH ONE OF FIVE WORDS, ALL LOWERCASE: sunny, cloudy, rainy, stormy, snowy
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
    console.log(error);
    res.status(400).json({});
  }
});

app.get("/find-activities", async (req, res) => {
  try {
    const messages = await grabActivites();
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
            Weather = Hurricane`,
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

async function grabWeather() {
  if (zipCode.length != 5) {
    return { error: "Invalid zip code" };
  }

  try {
    const response = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json?q=${zipCode}&days=7&key=${WEATHER_API_KEY}`
    );
    return response.data;
  } catch (error) {
    return { error: error };
  }
}

async function grabActivites() {
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
    ],
  };
}

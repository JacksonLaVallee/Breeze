const express=require('express'); 
const hostname='localhost'; 
const port=8080; 
const axios=require('axios');
const bodyParser=require('body-parser');
const compression=require('compression');
const { OpenAI } = require("openai"); 
const app=express(); 
app.use(express.json()); 
const cors = require('cors');

const OPENAI_API_KEY = "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";

app.use(compression());
app.use(bodyParser.json());
app.use(cors());

const WEATHER_API_KEY = "19144fe0b9f5430387e232205242809";

let weatherData = [];
let zipCode = "60612";
const openai = new OpenAI({ apiKey: OPENAI_API_KEY })

app.listen(port, hostname, ()=> { 
    console.log(`Server running at http://${hostname}:${port}/`);
});

// app.use((req, res)=> { 
//     // console.log(req.headers); 
//     res.statusCode=200; 
//     res.setHeader('Content-Type', 'text/html'); 
//     res.end('<html><body><h1>You shouldnt be here...</h1></body></html>'); 
// }); 

app.post("/set-zip", (req, res) => {
    weatherData = [];
    console.log(req.query.zipCode);
    zipCode = req.query.zipCode;
    return res.status(200).json({
        success: true,
        data: zipCode
    });
});

app.get("/find-weather", async (req, res) => {
    if (weatherData.length != 0) return res.status(200).send(weatherData);
    try {
        const messages = await grabWeather(zipCode);
        // console.log(messages);
        // console.log(JSON.stringify(messages));
        console.log("Finding weather on zip code: " + zipCode);
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
        console.log("HI");
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            response_format: {"type": "json_object"},
            messages: [initialPrompt],
            stream: false,
        });
        
        const parsableResponse = response.choices[0].message.content;
        // console.log(parsableResponse);
        weatherData = JSON.parse(parsableResponse).weather;
        // console.log(weatherData);
        return res.status(200).send(weatherData);
    } catch (error) {
        // console.log(error);
        res.status(400).json({});
    }
});

app.get("/find-activities", async (req, res) => {
    
});

async function grabWeather() {
    if (zipCode.length != 5) {
        return {error: "Invalid zip code"};
    }
    
    try {
        const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json?q=${zipCode}&days=7&key=${WEATHER_API_KEY}`);
        return response.data;
    } catch (error) {
        return {error: error};
    }
    
}

async function grabActivites() {
    return ["golfing", "skiing", "board games", "swimming", "beach", "hiking", "indoor sports", "fishing", "video games", "reading"];
}
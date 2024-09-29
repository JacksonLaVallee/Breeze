const express=require('express'), 
http=require('http'); 
const hostname='localhost'; 
const port=8080; 
const axios=require('axios');
const bodyParser=require('body-parser');
const compression=require('compression');
const { OpenAI } = require("openai"); 
const { OpenAIStream } = require("ai");
const { StreamingTextResponse } = require("ai");
const app=express(); 
app.use(express.json()); 

const OPENAI_API_KEY = "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";

app.use(compression());
app.use(bodyParser.json());

const WEATHER_API_KEY = "19144fe0b9f5430387e232205242809";

let weatherData = [];

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
})

app.post("/find-complexity", async (req, res) => {
    try {
        const initialPrompt = {
            role: "system",
            content: "You are to respond in JSON format. List 10 activities in chicago",
        };
        console.log("HI");
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            // response_format: {"type": "json_object"},
            messages: [initialPrompt],
            stream: false,
        });
        
        console.log("RESPONSE:" + response);
        return res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({});
    }
});

app.use((req, res)=> { 
		console.log(req.headers); 
		res.statusCode=200; 
		res.setHeader('Content-Type', 'text/html'); 
		res.end('<html><body><h1>This is a test server</h1></body></html>'); 
}); 

app.listen(port, hostname, ()=> { 
		console.log(`Server running at http://${hostname}:${port}/`);
});

async function grabWeather(zipCode) {
    if (zipCode.length != 5) {
        return {error: "Invalid zip code"};
    }

    try {
        const reponse = await axios.get(`https://api.weatherapi.com/v1/forecast.json?q=${zipCode}&days=7&key=${WEATHER_API_KEY}`);
        return response.data;
    } catch (error) {
        return {error: error};
    }

}

function setWeatherData() {
    grabWeather("60612").then((data) => {
        const initialPrompt = {
            role: "system",
            content: "You are to respond in JSON format. List 10 activities in chicago",
        }
        const response = openai.chat.completions.create({
            model: "gpt-4o-mini",
            response_format: {"type": "json_object"},
            messages: [initialPrompt],
            stream: true,
        });
        
        console.log(response);
    })
}

setWeatherData();

// export async function POST(req) {
//     const { messages } = await req.json();
  
//     const initialPrompt = {
//       role: "system",
//       content: "You are a helpful mystic who interprets dreams in less than 30 words."
//     }
  
//     const messagesWithInitialPrompt = [initialPrompt, ...messages];
  
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       reponse_format: {"type": "json_object"},
//       messages: messagesWithInitialPrompt,
//       stream: true,
//     });
  
//     const stream = OpenAIStream(response);
  
//     return new StreamingTextResponse(stream);
//   }

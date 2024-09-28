const express=require('express'), 
http=require('http'); 
const hostname='localhost'; 
const port=8080; 
const app=express(); 

app.use((req, res)=> { 
		console.log(req.headers); 
		res.statusCode=200; 
		res.setHeader('Content-Type', 'text/html'); 
		res.end('<html><body><h1>This is a test server</h1></body></html>'); 
}); 
const sample_server=http.createServer(app); 

sample_server.listen(port, hostname, ()=> { 
		console.log(`Server running at http://${hostname}:${port}/`);});

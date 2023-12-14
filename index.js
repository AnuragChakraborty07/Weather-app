const http = require("http");
const fs = require("fs");
var requests = require("requests");



const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) =>{
       let temperature = tempVal.replace("{%tempval%}", (orgVal.main.temp/16));
       temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min/16);
       temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max/16);
       // temperature = temperature.replace("{%location%}", orgVal.main.temp);
       // temperature = temperature.replace("{%country%", orgVal.system.country);
       temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
       return temperature;
};

const server = http.createServer((req, res) => {
       if(req.url =="/"){
              requests("https://api.openweathermap.org/data/2.5/weather?lat=23.745127&lon=91.746826&appid=d5b867bd363aa0bb9817d79c63d9b7ef",)
              
              .on('data',  (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData =[objData];     
              //   console.log(arrData[0].main.temp);   //Array of an object
              const realTimeData = arrData.map(val =>  replaceVal(homeFile, val)).join("");
              res.write(realTimeData);
              console.log(realTimeData);
              })
              .on('end',  (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
                
              });
       }
});

server.listen(80, "127.0.0.1")
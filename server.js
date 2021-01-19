const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

function handlePermission() {
    navigator.permissions.query({name:'geolocation'}).then(function(result) {
      if (result.state == 'granted') {
        report(result.state);
        geoBtn.style.display = 'none';
      } else if (result.state == 'prompt') {
        report(result.state);
        geoBtn.style.display = 'none';
        navigator.geolocation.getCurrentPosition(revealPosition,positionDenied,geoSettings);
      } else if (result.state == 'denied') {
        report(result.state);
        geoBtn.style.display = 'inline';
      }
      result.onchange = function() {
        report(result.state);
      }
    });
  }
  
  function report(state) {
    console.log('Permission ' + state);
  }
  
  handlePermission();


app.use(express.static(__dirname + '/dist/KSBNavigator'));

app.get('/*', (req, res) => res.sendFile(path.join(__dirname)));


const server = http.createServer(app);
server.listen(port, () => console.log(`App running on: http://localhost:${port}`));





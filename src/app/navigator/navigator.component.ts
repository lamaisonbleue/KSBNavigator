import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent implements AfterViewInit {
  
  longitude  = 0;
  latitude   = 0;
  
  // Loading Canvas and Images html elements
  @ViewChild('map') canvasRef: ElementRef;
  

 // Canvas Context
  ctx: CanvasRenderingContext2D;
  answeredClass = 'currentColor';

  event: MouseEvent;
  clickedPoint: {x: number, y: number} = {x: 0, y: 0};
  img;
/*
  minCoord = { lat: 49.20875601351599, lng: 8.120809154107995}; //links unten
  maxCoord = { lat: 49.20930623275571, lng: 8.121560172632165}; // rechts oben
*/
minCoord: GPSPoint = new GPSPoint(49.20875601351599, 8.121560172632165); //upperLeft
maxCoord: GPSPoint = new GPSPoint( 49.20930623275571,  8.120809154107995); // lowerRight

  constructor() {   
  }

  askForPermission() {
    navigator.permissions.query({name:'geolocation'}).then(function(result) {
      if (result.state == 'granted') {
        alert(result.state);
       // geoBtn.style.display = 'none';
      } else if (result.state == 'prompt') {
        alert(result.state);
        //geoBtn.style.display = 'none';
       // navigator.geolocation.getCurrentPosition(revealPosition,positionDenied,geoSettings);
      } else if (result.state == 'denied') {
        alert(result.state);
       // geoBtn.style.display = 'inline';
      }
      result.onchange = function() {
        alert(result.state);
      }
    });
  }

  updateLocation(): void{
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
          this.longitude  = position.coords.longitude;
          this.latitude   = position.coords.latitude;


          const location = new GPSPoint(this.longitude, this.latitude);
          

          const totalDistanceX = this.minCoord.distanceTo(this.maxCoord);
          
          const currentPixelX =  this.latitude / totalDistanceX;
          const currentPixelY =  this.longitude / totalDistanceX;



          const point = {x: currentPixelX, y: 1 - currentPixelY}
          console.log(point)
          this.drawCircle(point);

          setTimeout(() => {
            this.updateLocation();
          }, 500);
        });
    } else {
       console.log("No support for geolocation")
    }
  }

  ngAfterViewInit(): void {
    this.ctx  = this.canvasRef.nativeElement.getContext('2d');


  //this.img = document.getElementById('scream');
    this.img = new Image();
    
    this.img.addEventListener('load', e => {
      //this.ctx.drawImage(this.img, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
      //this.ctx.drawImage(this.img, 0, 0, this.ctx.canvas.clientWidth, this.ctx.canvas.clientHeight)
      
      //this.ctx.drawImage(this.img, 0, 0, 250, 252)
      //this.ctx.drawImage(this.img, 0, 0)

      this.ctx.drawImage(this.img, 0, 0, this.img.width,    this.img.height,     // source rectangle
        0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

      this.updateLocation()      
    });
    this.img.src = "assets/images/thomasnast.png"

    

    
  }


 private clearCanvas() {
  if (this.ctx !== undefined) {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
 }


  onEvent(event: MouseEvent): void {
    
      this.ctx  = this.canvasRef.nativeElement.getContext('2d');
      this.event = event;
      this.clickedPoint = {x: event.offsetX / this.ctx.canvas.clientWidth, y: event.offsetY / this.ctx.canvas.clientHeight};
      this.drawCircle(this.clickedPoint);

      // hier statdessen von enterInput HSSolution zurückgeben lassen
    


    // for debugging touchTolerance
      const point = this.clickedPoint;
      const size = 0.01
      const polygon = [   {x: point.x - size, y: point.y - size},
                                      {x: point.x - size, y: point.y + size},
                                      {x: point.x + size, y: point.y + size},
                                      {x: point.x + size, y: point.y - size}, ];
      //this.draw(polygon, 'red', 0.3);

      this.drawCircle(this.clickedPoint)
    }


    drawPolygon(polygon: {x: number, y: number}[], color: string = '#32CD32', alpha: number = 0.5) {
      // this.gameService.gameController.taskController.didEnter(solution)
      // -> stattdessen array der zu suchenden objecte!!!
      this.ctx.fillStyle = color;
      this.ctx.globalAlpha = alpha;
      this.ctx.beginPath();
      polygon.forEach(point => {
        this.ctx.lineTo(point.x * this.ctx.canvas.width, point.y * this.ctx.canvas.height);
      });
      this.ctx.closePath();
      this.ctx.fill();
    }

    drawCircle(point: {x: number, y: number}) {
      console.log("drwaed");
      // this.gameService.gameController.taskController.didEnter(solution)
      // -> stattdessen array der zu suchenden objecte!!!
      this.ctx.fillStyle = 'red';
      this.ctx.strokeStyle = 'red'
      this.ctx.globalAlpha = 1;
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(point.x * this.ctx.canvas.width, point.y * this.ctx.canvas.height, 4, 0, 2 * Math.PI);
      
      this.ctx.stroke();
    }



    OneEightyDeg = 180.0; //degrees
    
    imageSizeW = 600;
    imageSizeH = 600;

  

}


export class GPSPoint {
  lat: number;
  lng: number;


  constructor(lat: number, lng: number) {
    this.lng = lng;
    this.lat = lat;
  }

    //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
    distanceTo(point: GPSPoint) 
    {
      var lat1 = this.lat;
      var lon1 = this.lng;
      var lat2 = point.lat;
      var lon2 = point.lng;


      var R = 6371000; // m
      var dLat = this.toRad(lat2-lat1);
      var dLon = this.toRad(lon2-lon1);
      lat1 = this.toRad(lat1);
      lat2 = this.toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
    }

    // Converts numeric degrees to radians
    toRad(Value) 
    {
        return Value * Math.PI / 180;
    }
}
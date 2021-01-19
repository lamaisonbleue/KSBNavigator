import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent implements AfterViewInit {
  
  currentPosition = new GPSPoint(0, 0);
  mapImagePath = "assets/images/thomasnast2.png"//"assets/images/KSB_Map.jpg"
  // Loading Canvas and Images html elements
  @ViewChild('map') canvasRef: ElementRef;
  

 // Canvas Context
  ctx: CanvasRenderingContext2D;
  answeredClass = 'currentColor';

  event: MouseEvent;
  clickedPoint: {x: number, y: number} = {x: 0, y: 0};
  img;

//lat = Y
// long = X


//thomasnast2
lowerLeft = new GPSPoint(49.20409330375299, 8.111271076373926); //links unten
upperRight = new GPSPoint(49.219680780031794, 8.142513446979395); // rechts oben
/*
// thomasnas1
lowerLeft = new GPSPoint(49.20786697605239, 8.116150238935024); //links unten
upperRight = new GPSPoint(49.211778026003046, 8.124153950635463); // rechts oben

*/

  /*lowerLeft = new GPSPoint(49.20875601351599, 8.120809154107995); //links unten
  upperRight = new GPSPoint(49.20930623275571, 8.121560172632165); // rechts oben
*/
//minCoord: GPSPoint = new GPSPoint(49.20875601351599, 8.121560172632165); //upperLeft
//maxCoord: GPSPoint = new GPSPoint( 49.20930623275571,  8.120809154107995); // lowerRight


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
          this.currentPosition.lat = position.coords.latitude;
          this.currentPosition.lng = position.coords.longitude;
          
         //this.currentPosition = this.upperRight
          

          let totalDistanceX = new GPSPoint(this.lowerLeft.lat, this.upperRight.lng).distanceTo(this.upperRight);
          let totalDistanceY = new GPSPoint(this.upperRight.lat, this.lowerLeft.lng).distanceTo(this.upperRight);
          
          let dx = this.currentPosition.distanceTo(new GPSPoint(this.lowerLeft.lat, this.currentPosition.lng))
          let dy = this.currentPosition.distanceTo(new GPSPoint(this.currentPosition.lat, this.lowerLeft.lng))

          

          const currentPixelX =  dx / totalDistanceX;
          const currentPixelY =  dy / totalDistanceY;

          

          const point = {x: currentPixelY, y:  1 - currentPixelX}  
          console.log(point)

          this.clearCanvas();
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

      //this.ctx.drawImage(this.img, 0, 0);

      this.updateLocation()      
    });
    this.img.src = this.mapImagePath

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

      // hier statdessen von enterInput HSSolution zurückgeben lassen
    


    // for debugging touchTolerance
      const point = this.clickedPoint;
      const size = 0.01
      const polygon = [   {x: point.x - size, y: point.y - size},
                                      {x: point.x - size, y: point.y + size},
                                      {x: point.x + size, y: point.y + size},
                                      {x: point.x + size, y: point.y - size}, ];
      //this.draw(polygon, 'red', 0.3);
      
      //this.drawCircle(this.clickedPoint)
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
      
      this.ctx  = this.canvasRef.nativeElement.getContext('2d');
      
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



}


export class GPSPoint {
  lat: number;
  lng: number;


  constructor(lat: number, lng: number) {
    this.lng = lng;
    this.lat = lat;
  }

   distanceTo(point: GPSPoint){  // generally used geo measurement function
    var lat1 = this.lat;
    var lat2 = point.lat;
    var lon1 = this.lng;
    var lon2 = point.lng;

    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
}
}
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
  @ViewChild('test') test: ElementRef;

 // Canvas Context
  ctx: CanvasRenderingContext2D;
  answeredClass = 'currentColor';

  event: MouseEvent;
  clickedPoint: {x: number, y: number} = {x: 0, y: 0};
  img;

  bottomLeft = { lat: 49.208766527316804, lng: 8.12080647189898 };
  upperRight = { lat: 49.209285205381384, lng: 8.12155212600512 };

  constructor() {    
  }


  updateLocation(): void{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
          this.longitude  = position.coords.longitude;
          this.latitude   = position.coords.latitude;
          

          const lng =  (this.upperRight.lng  - this.longitude) / (this.upperRight.lng - this.bottomLeft.lng)
          const lat = (this.upperRight.lat  - this.latitude) / (this.upperRight.lat - this.bottomLeft.lat)
          console.log({x: lng, y: lat})
          this.drawCircle({x: lng, y: lat});

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
      
      this.ctx.drawImage(this.img, 0, 0, 230, 222)
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
}

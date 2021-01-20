import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Area } from '../model/area';
import { GPSPoint } from '../model/gpsPoint';

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
  
  
  errorMsg = ''
 // Canvas Context
  ctx: CanvasRenderingContext2D;
  answeredClass = 'currentColor';

  event: MouseEvent;
  clickedPoint: {x: number, y: number} = {x: 0, y: 0};
  img;



  areas: Area[] = [
    { name: 'ksb',
      mapImagePath: "assets/images/ksb.jpg",
      places: [],
    /**lowerLeft: new GPSPoint(49.531529257558326, 8.336260285644531),//49.529954, 8.336239),//49.532216180960106, 8.335809103869432),
      upperRight: new GPSPoint(49.539717449098745, 8.349134888916016)}, */
      /**
       * lowerLeft: new GPSPoint(49.531529257558326, 8.336260285644531),//49.529954, 8.336239),//49.532216180960106, 8.335809103869432),
      upperRight: new GPSPoint(49.539357449098745, 8.349134888916016)}
       */
      lowerLeft: new GPSPoint(49.531949257558326, 8.33630090285644531),//49.529954, 8.336239),//49.532216180960106, 8.335809103869432),
      upperRight: new GPSPoint(49.539057449098745, 8.34974888916016)},//49.539609, 8.349096)},//(49.540093, 8.3496)},
    { name: 'lmb',
      mapImagePath: "assets/images/lmb.jpg",
      places: [], 
      lowerLeft: new GPSPoint(49.15506133804025, 8.146921657828026),
      upperRight: new GPSPoint(49.155864756319644, 8.148375415114097)},
    { name: 'landau',
      mapImagePath: "assets/images/thomasnast2.png",
      places: [], 
      lowerLeft: new GPSPoint(49.20409330375299, 8.111271076373926),
      upperRight: new GPSPoint(49.219680780031794, 8.142513446979395)}
                  ];
  
  currentArea: Area = this.areas[0];
//lat = Y
// long = X


  public initArea() {
    console.log('initArea');
    navigator.geolocation.getCurrentPosition((position)=>{
      this.errorMsg = '';
      this.currentPosition.lat = position.coords.latitude;
      this.currentPosition.lng = position.coords.longitude;

      this.areas.forEach(area => {
        const dist = area.lowerLeft.distanceTo(this.currentPosition);
        if (dist < this.currentArea.lowerLeft.distanceTo(this.currentPosition)){
          this.currentArea = area;
        }
      });

      if (this.currentArea.name == 'ksb') {
        console.log('jup')
        this.canvasRef.nativeElement.className = 'ksb'
      }
      console.log(this.currentArea.name)
    });
  }

  askForPermission() {
    this.errorMsg = 'Aktiviere deine Ortung in den Geräteeinstellungen'
    console.log('askForPermission')
    if ( navigator.permissions && navigator.permissions.query) {
      
      //try permissions APIs first
        navigator.permissions.query({ name: 'geolocation' }).then(function(result) {
            // Will return ['granted', 'prompt', 'denied']
            const permission = result.state;
            console.log(permission)
             if (permission == 'denied') {
               this.errorMsg = 'Aktiviere die Ortung für deinen Broweser in den Einstellungen'
              setTimeout(() => {
                this.askForPermission()
              }, 500);
              return
             } 
           

        });
      }
      if (navigator.geolocation) {
        this.initArea();
        
      }else {
        setTimeout(() => {          
          this.askForPermission()
        }, 500);
        return
      }



    
  }

  updateLocation(): void{
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
          this.currentPosition.lat = position.coords.latitude;
          this.currentPosition.lng = position.coords.longitude;
          
          //this.currentPosition = new GPSPoint(49.207803, 8.116118)
          
          let totalDistanceX = new GPSPoint(this.currentArea.lowerLeft.lat, this.currentArea.upperRight.lng).distanceTo(this.currentArea.upperRight);
          let totalDistanceY = new GPSPoint(this.currentArea.upperRight.lat, this.currentArea.lowerLeft.lng).distanceTo(this.currentArea.upperRight);
          
          let dx = this.currentPosition.distanceTo(new GPSPoint(this.currentArea.lowerLeft.lat, this.currentPosition.lng))
          let dy = this.currentPosition.distanceTo(new GPSPoint(this.currentPosition.lat, this.currentArea.lowerLeft.lng))

          

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
       this.askForPermission();
    }
  }



  ngAfterViewInit(): void {
     this.askForPermission();     
     this.updateLocation();
    

    this.ctx  = this.canvasRef.nativeElement.getContext('2d');

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
      console.log(point) 
      point.x = Math.min(Math.max(0, point.x), point.x);
      point.y = Math.min(Math.max(0, point.y), point.y);
      
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


    getMapImage() {
      return this.currentArea.mapImagePath;
    }

}



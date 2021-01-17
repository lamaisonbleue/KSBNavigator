import { GoogleMap } from '@agm/core/services/google-maps-types';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
declare const google: any;


@Component({
  selector: 'app-agm-example',
  templateUrl: './agm-example.component.html',
  styleUrls: ['./agm-example.component.css'],
})
export class AgmExampleComponent implements OnInit {

  //@ViewChild('map', {static: false}) map: ElementRef;
  selected = false

  lat = 49.208898999999995;
  lng = 8.1212122;
  pointList: { lat: number; lng: number }[] = [];
  drawingManager: any;
  selectedShape: any;
  selectedArea = 0;
  map: GoogleMap;
  

  locations: {name: string, color: string, p: { lat: number; lng: number }[], drawedPolygon?}[] = [
    {name: 'A1: La Maison Bleue', color: 'blue', p: [ {lat:   49.15540718467235, lng: 8.147882100856773},
                                        {lat: 49.155468581296944, lng: 8.148024257934562},
                                        {lat: 49.15554401133156,  lng: 8.147949156082145},
                                        {lat: 49.15548261480045,  lng: 8.147804316795341}]},
      {name: 'A2: Hühnerstall', color: 'yellow', p: [  { lat: 49.155615932885475,  lng: 8.148032304561607},
                                      { lat: 49.15559488268537,   lng: 8.147989389217368},
                                      { lat: 49.15549840248714,   lng: 8.148102041995994},
                                      { lat: 49.15548436898811,   lng: 8.148051080024711},
                                      { lat: 49.15545279360073,   lng: 8.148134228504173},
                                      { lat: 49.15547910642493,   lng: 8.1481932371025    }]},
    {name: 'B1: Thomas-Nast-Haus', color: 'green', p: [ { lat: 49.20916451684112, lng: 8.12104250629229 },
                                        { lat: 49.20903484751857,   lng: 8.120972768857904  },
                                        { lat: 49.20902608606559,   lng: 8.121031777456231  },
                                        { lat: 49.208980526485085,  lng: 8.121034459665246  },
                                        { lat: 49.20892795768616,   lng: 8.12129999835772   },
                                        { lat: 49.20907865476017,   lng: 8.121377782419152  }]}
  ]




  constructor() {}

  ngOnInit() {
    this.setCurrentPosition();
  }

  onMapReady(map) {
    this.map = map;
    this.initDrawingManager(map);

    this.locations.forEach(location =>{
      const polygon = new google.maps.Polygon({
        paths: location.p,
        strokeColor: "black",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: location.color,//"#FF0000",
        fillOpacity: 0.35,
      });
      polygon.setMap(map);

      location.drawedPolygon = polygon
    })
  }

  initDrawingManager = (map: any) => {
    const self = this;
    const options = {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: ['polygon'],
      },
      polygonOptions: {
        draggable: true,
        editable: true,
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
    };
    this.drawingManager = new google.maps.drawing.DrawingManager(options);
    this.drawingManager.setMap(map);
    google.maps.event.addListener(
      this.drawingManager,
      'overlaycomplete',
      (event) => {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          const paths = event.overlay.getPaths();
          for (let p = 0; p < paths.getLength(); p++) {
            google.maps.event.addListener(
              paths.getAt(p),
              'set_at',
              () => {
                if (!event.overlay.drag) {
                  self.updatePointList(event.overlay.getPath());
                }
              }
            );
            google.maps.event.addListener(
              paths.getAt(p),
              'insert_at',
              () => {
                self.updatePointList(event.overlay.getPath());
              }
            );
            google.maps.event.addListener(
              paths.getAt(p),
              'remove_at',
              () => {
                self.updatePointList(event.overlay.getPath());
              }
            );
          }
          self.updatePointList(event.overlay.getPath());
          this.selectedShape = event.overlay;
          this.selectedShape.type = event.type;
        }
        if (event.type !== google.maps.drawing.OverlayType.MARKER) {
          // Switch back to non-drawing mode after drawing a shape.
          self.drawingManager.setDrawingMode(null);
          // To hide:
          self.drawingManager.setOptions({
            drawingControl: false,
          });
        }
      }
    );
  }
  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    }
  }


  deleteSelectedShape() {
    if (this.selectedShape) {
      this.selectedShape.setMap(null);
      this.selectedArea = 0;
      this.pointList = [];
      // To show:
      this.drawingManager.setOptions({
        drawingControl: true,
      });
    }
  }

  updatePointList(path) {
    console.log(path)
    this.pointList = [];
    const len = path.getLength();
    for (let i = 0; i < len; i++) {
      this.pointList.push(
        path.getAt(i).toJSON()
      );
    }
    
    this.selectedArea = google.maps.geometry.spherical.computeArea(
      path
    );

    this.locations.push({name: 'C' + (this.locations.length - 2), color: 'gray', p: this.pointList});

  }

  show(location) {
    this.selected = true;
    console.log(location)
    this.lat = location.p[0].lat
    this.lng = location.p[0].lng
    
    console.log(location.drawedPolygon)
    location.drawedPolygon.fillColor = 'red'

    location.drawedPolygon.setMap(this.map);

  }


}

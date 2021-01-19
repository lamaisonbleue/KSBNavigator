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
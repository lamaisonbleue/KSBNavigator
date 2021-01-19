import { GPSPoint } from "./gpsPoint";
import { Polygon } from "./polygon";

export interface Area {

    lowerLeft: GPSPoint;
    upperRight: GPSPoint;
    name: string;
    mapImagePath: string;
    places: {name: string, polygon: Polygon}[]; 
}
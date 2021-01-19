import { Point } from './point';

/**
 * Class that represents a polygon.
 */
export class Polygon {

  points: Point[];

  /**
   * Constructor of a polygon instance.
   * @param points The point array that describes the polygon.
   */
  constructor(points: Point[]) {
    this.points = points;
  }

  /**
   * Checks whether the given point is in the polygon of this instance or not.
   * @param point The given point.
   * @return Boolean that determines whether the point is in the polygon or not.
   */
  contains(point: Point): boolean {
    const vs = this.points;

    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i].x;
      const yi = vs[i].y;
      const xj = vs[j].x;
      const yj = vs[j].y;

      const intersect = ((yi > point.y) !== (yj > point.y))
            && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);

      if (intersect) { inside = !inside; }
    }

    return inside;
  }

}

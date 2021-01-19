/**
 * Class that represents a point on a 2D-plane.
 */
export class Point {
  x: number;
  y: number;

  /**
   * Constructor for a point instance.
   * @param x x-axis value of the point.
   * @param y y-axis value of the point.
   */
  constructor(x: number, y: number) {
    this.x = Math.round(x * 100) / 100;
    this.y = Math.round(y * 100) / 100;
  }
}

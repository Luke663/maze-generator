import { colourSettings, finishColour, startColour } from "./colours.js";

/**
 * Renders the entire grid, including start and finish points, and the walls of each cell.
 *
 * @param {*} ctx - The canvas context used for rendering.
 * @param {*} grid - Object representing the maze/grid with keys as coordinates (e.g., "0,0")
 *                   and values as wall data (e.g., { top: true, right: false, ... }).
 * @param {*} cellWidth - The width of each cell in the grid.
 * @param {*} bounds - Object containing starting x and y positions for rendering (e.g., { xStart: 0, yStart: 0 }).
 * @param {*} gridWidth - The number of columns in the grid.
 * @param {*} gridHeight - The number of rows in the grid.
 * @param {*} startPoint - Object representing the top-left corner of the grid for rendering.
 */
export function drawGrid(
  ctx,
  grid,
  cellWidth,
  bounds,
  gridWidth,
  gridHeight,
  startPoint
) {
  // Draw start and finish cells with their designated colors
  drawStartFinish(ctx, bounds, cellWidth, gridWidth, gridHeight);

  // Iterate over each cell in the grid and draw its walls
  Object.keys(grid).forEach((cords) => {
    drawCellWalls(ctx, cords.split(","), grid[cords], startPoint, cellWidth);
  });
}

/**
 * Shades the start and finish cells on the canvas using designated colors.
 *
 * @param {*} ctx - The canvas context used for rendering.
 * @param {*} bounds - Object containing x and y positions of the maze for rendering.
 * @param {*} cellWidth - The width of each cell in the grid.
 * @param {*} gridWidth - The number of columns in the grid.
 * @param {*} gridHeight - The number of rows in the grid.
 */
function drawStartFinish(ctx, bounds, cellWidth, gridWidth, gridHeight) {
  // Shade the start cell
  shadeRectangle(
    ctx,
    startColour,
    bounds.xStart,
    bounds.yStart,
    cellWidth,
    cellWidth
  );

  // Shade the finish cell
  shadeRectangle(
    ctx,
    finishColour,
    bounds.xStart + cellWidth * (gridWidth - 1),
    bounds.yStart + cellWidth * (gridHeight - 1),
    cellWidth,
    cellWidth
  );
}

/**
 * Shades a rectangular area on the canvas with a given color.
 *
 * @param {*} ctx - The canvas context used for rendering.
 * @param {*} colour - The fill color for the rectangle.
 * @param {*} x - The x-coordinate of the top-left corner of the rectangle.
 * @param {*} y - The y-coordinate of the top-left corner of the rectangle.
 * @param {*} width - The width of the rectangle.
 * @param {*} height - The height of the rectangle.
 */
function shadeRectangle(ctx, colour, x, y, width, height) {
  ctx.fillStyle = colour;

  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.fill();
  ctx.closePath();
}

/**
 * Draws the walls of a single cell in the grid.
 *
 * @param {*} ctx - The canvas context used for rendering.
 * @param {*} cords - Array containing the cell's coordinates as integers [x, y].
 * @param {*} walls - Object representing the presence of each wall for the cell (e.g., { top: true, right: false }).
 * @param {*} startPoint - Object representing the top-left corner of the grid for rendering.
 * @param {*} cellWidth - The width of each cell in the grid.
 */
function drawCellWalls(ctx, cords, walls, startPoint, cellWidth) {
  const xVal = parseInt(cords[0]);
  const yVal = parseInt(cords[1]);

  // Draw the top wall if it exists
  if (walls["top"])
    drawLine(
      ctx,
      startPoint.x + cellWidth * xVal,
      startPoint.y + cellWidth * yVal,
      startPoint.x + cellWidth * (xVal + 1),
      startPoint.y + cellWidth * yVal
    );

  // Draw the right wall if it exists
  if (walls["right"])
    drawLine(
      ctx,
      startPoint.x + cellWidth * (xVal + 1),
      startPoint.y + cellWidth * yVal,
      startPoint.x + cellWidth * (xVal + 1),
      startPoint.y + cellWidth * (yVal + 1)
    );

  // Draw the bottom wall if it exists
  if (walls["bottom"])
    drawLine(
      ctx,
      startPoint.x + cellWidth * (xVal + 1),
      startPoint.y + cellWidth * (yVal + 1),
      startPoint.x + cellWidth * xVal,
      startPoint.y + cellWidth * (yVal + 1)
    );

  // Draw the left wall if it exists
  if (walls["left"])
    drawLine(
      ctx,
      startPoint.x + cellWidth * xVal,
      startPoint.y + cellWidth * (yVal + 1),
      startPoint.x + cellWidth * xVal,
      startPoint.y + cellWidth * yVal
    );
}

/**
 * Draws a line on the canvas between two points.
 *
 * @param {*} ctx - The canvas context used for rendering.
 * @param {*} xFrom - The starting x-coordinate of the line.
 * @param {*} yFrom - The starting y-coordinate of the line.
 * @param {*} xTo - The ending x-coordinate of the line.
 * @param {*} yTo - The ending y-coordinate of the line.
 */
function drawLine(ctx, xFrom, yFrom, xTo, yTo) {
  ctx.beginPath();

  ctx.moveTo(xFrom, yFrom);
  ctx.lineTo(xTo, yTo);

  ctx.stroke();
  ctx.closePath();
}

/**
 * Draws the solution path found through the maze on the canvas.
 *
 * @export
 * @param {*} ctx - The canvas context used for rendering.
 * @param {*} closed - Object representing the nodes that have been fully processed in the pathfinding algorithm.
 * @param {*} goal - String, the coordinates of the goal cell (e.g., "4,4").
 * @param {*} cellWidth - The width of each cell in the grid.
 * @param {*} bounds - Object containing starting x and y positions for rendering.
 */
export function drawFoundPath(ctx, closed, goal, cellWidth, bounds) {
  let current = goal; // Current node in the path being drawn
  let cords = undefined; // Placeholder for the parsed coordinates of the current node

  // Backtrack from the goal to the start through the parent nodes
  while (current !== undefined) {
    // Separate the coordinates into x and y
    cords = current.split(",");

    // Shade the current cell in the path
    shadeRectangle(
      ctx,
      colourSettings.solutionPath,
      bounds.xStart + cellWidth * parseInt(cords[0]) + cellWidth * 0.35,
      bounds.yStart + cellWidth * parseInt(cords[1]) + cellWidth * 0.35,
      cellWidth * 0.3,
      cellWidth * 0.3
    );

    // Stop once the start point is reached
    if (current === "0,0") break;

    // Move to the parent node in the path
    current = closed[current].parent;
  }
}

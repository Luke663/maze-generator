import { colourSettings } from "./colours.js";
import { drawFoundPath, drawGrid } from "./render.js";
import { findPath } from "./solveMaze.js";
import { generateMaze } from "./createMaze.js";

// Get canvas and rendering context
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

// Input elements for customization
const backgroundColourSelect = document.getElementById("backgroundcolour");
const foregroundColourSelect = document.getElementById("foregroundcolour");
const solutionColourSelect = document.getElementById("solutioncolour");
const numCols = document.getElementById("colInput");
const solveMaze = document.getElementById("findSolution");
const generateMazeButton = document.getElementById("generateButton");
const toolbar = document.getElementById("toolbar");

// Canvas setup
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - toolbar.offsetHeight;

// Maze variables
let grid; // Object representing the maze
let bounds; // Bounds for maze drawing
let cellWidth; // Pixel width of a cell
let gridWidth = 50; // Default number of columns
let gridHeight; // Number of rows
const startPoint = { x: 20, y: 20 }; // Starting point of the grid

// Update canvas size on window resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - toolbar.offsetHeight;
  renderGrid(); // Redraw the grid after resizing
});

// Change background color
backgroundColourSelect.addEventListener("change", function () {
  colourSettings.background = backgroundColourSelect.value;
  canvas.style.background = colourSettings.background;
});

// Change maze wall color
foregroundColourSelect.addEventListener("change", function () {
  colourSettings.foreground = foregroundColourSelect.value;
  renderGrid();
});

// Change solution path color
solutionColourSelect.addEventListener("change", function () {
  colourSettings.solutionPath = solutionColourSelect.value;
  renderGrid();
});

// Update the grid width (number of columns)
numCols.addEventListener("input", (e) => {
  gridWidth = parseFloat(e.target.value) || 50;
});

// Toggle maze solution rendering
solveMaze.addEventListener("change", function () {
  if (solveMaze.checked) findPath(grid, gridWidth, gridHeight);
  renderGrid();
});

// Generate a new maze
generateMazeButton.addEventListener("click", main);

/**
 * Set up the bounds for the grid and calculate cell dimensions.
 */
function setGridBounds() {
  bounds = {
    xStart: startPoint.x,
    xStop: canvas.width - startPoint.x,
    yStart: startPoint.y,
    yStop: canvas.height - startPoint.y,
  };

  cellWidth = (bounds.xStop - bounds.xStart) / gridWidth;
  gridHeight = Math.floor((bounds.yStop - bounds.yStart) / cellWidth);
}

/**
 * Initialize the grid object with default wall settings for each cell.
 */
function populateGrid(_gridHeight, _gridWidth) {
  grid = {};
  for (let i = 0; i < _gridWidth; i++) {
    for (let j = 0; j < _gridHeight; j++) {
      grid[[i, j]] = { top: true, bottom: true, left: true, right: true };
    }
  }
}

/**
 * Ensure the grid width is within acceptable limits.
 * @returns {boolean} Whether the grid width is valid.
 */
function validateGridWidth() {
  const minWidth = 10;
  const maxWidth = 300;

  if (gridWidth < minWidth || gridWidth > maxWidth) {
    alert(`There must be between ${minWidth} and ${maxWidth} columns.`);
    return false;
  }
  return true;
}

/**
 * Clear the canvas and redraw the grid and (optionally) the solution path.
 */
function renderGrid() {
  ctx.strokeStyle = colourSettings.foreground; // Set wall color
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

  drawGrid(ctx, grid, cellWidth, bounds, gridWidth, gridHeight, startPoint);

  if (solveMaze.checked) {
    const solution = findPath(grid, gridWidth, gridHeight);
    drawFoundPath(ctx, solution[0], solution[1], cellWidth, bounds);
  }
}

/**
 * Main function to generate and render the maze.
 */
function main() {
  if (!validateGridWidth()) return;

  setGridBounds();
  populateGrid(gridHeight, gridWidth);
  generateMaze(grid);
  renderGrid();
}

// Initial rendering of the maze
main();

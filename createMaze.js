/**
 * Removes the wall between two adjacent cells in the grid.
 *
 * @param {*} _grid - Object { { [0,1]: { top: true, bottom: true, left: true, right: true } }, ... }
 * The maze object consisting of coordinates and four boolean values denoting if that side is a wall or open.
 * @param {*} cellFrom - Cell, int[]. The coordinates of the current cell being investigated.
 * @param {*} cellTo - Cell, int[]. The coordinates of the next cell to be investigated.
 */
function removeWall(_grid, cellFrom, cellTo) {
  // Calculate the direction between the two cells (relative movement)
  const directionResult = [cellTo[0] - cellFrom[0], cellTo[1] - cellFrom[1]];

  // Mapping of relative directions to wall names for both cells
  const directionDictionary = {
    "0,-1": ["top", "bottom"], // Moving up
    "0,1": ["bottom", "top"], // Moving down
    "1,0": ["right", "left"], // Moving right
    "-1,0": ["left", "right"], // Moving left
  };

  // Get the walls to be removed for both cells
  const walls = directionDictionary[`${directionResult}`];

  // Update the grid: set walls to false for both the current cell and the target cell
  _grid[cellFrom][walls[0]] = false;
  _grid[cellTo][walls[1]] = false;
}

/**
 * Finds a random valid neighbouring cell that has not been visited yet.
 *
 * @param {*} current - Cell, int[]. The coordinates of the current cell being investigated.
 * @param {*} _grid - Object { { [0,1]: { top: true, bottom: true, left: true, right: true } }, ... }
 * The maze object consisting of coordinates and four boolean values denoting if that side is a wall or open.
 * @param {*} visited - Set(), "0,2". Set containing previously visited cells as strings.
 * @return {*} - Cell, int[]. The coordinates of a random, valid neighbour or null if none exist.
 */
function getRandomNeighbour(current, _grid, visited) {
  const validNeighbours = []; // List of valid neighbours

  // Check for each potential movement direction (right, left, down, up) - Right
  if (
    _grid[[current[0] + 1, current[1]]] && // If coordinates are within the grid
    !visited.has(`${current[0] + 1},${current[1]}`) // If cell has not been previously visited
  ) {
    validNeighbours.push([current[0] + 1, current[1]]); // Add neighbour to return value
  }

  // Left
  if (
    _grid[[current[0] - 1, current[1]]] &&
    !visited.has(`${current[0] - 1},${current[1]}`)
  ) {
    validNeighbours.push([current[0] - 1, current[1]]);
  }

  // Down
  if (
    _grid[[current[0], current[1] + 1]] &&
    !visited.has(`${current[0]},${current[1] + 1}`)
  ) {
    validNeighbours.push([current[0], current[1] + 1]);
  }

  // Up
  if (
    _grid[[current[0], current[1] - 1]] &&
    !visited.has(`${current[0]},${current[1] - 1}`)
  ) {
    validNeighbours.push([current[0], current[1] - 1]);
  }

  // Return a random valid neighbour or null if none exist
  return validNeighbours.length
    ? validNeighbours[Math.floor(Math.random() * validNeighbours.length)]
    : null;
}

/**
 * Generates a maze using a randomized depth-first search algorithm.
 *
 * @export
 * @param {*} _grid - Object { { [0,1]: { top: true, bottom: true, left: true, right: true } }, ... }
 * The maze object consisting of coordinates and four boolean values denoting if that side is a wall or open.
 */
export function generateMaze(_grid) {
  let current = [0, 0]; // Starting point (top left)
  const stack = [current]; // Stack to keep track of cells to be processed
  const visited = new Set(`${current[0]},${current[1]}`); // Set to track visited cells

  // Continue until all cells are visited (stack is empty)
  while (stack.length > 0) {
    current = stack.pop(); // Take the last cell from the stack

    // Get a random valid neighbour to move to
    const chosenNeighbour = getRandomNeighbour(current, _grid, visited);

    if (chosenNeighbour) {
      // If a valid neighbour exists, push the current cell back onto the stack
      stack.push(current);

      // Remove the wall between the current cell and the chosen neighbour
      removeWall(_grid, current, chosenNeighbour);

      // Mark the neighbour as visited
      visited.add(`${chosenNeighbour[0]},${chosenNeighbour[1]}`);

      // Push the chosen neighbour onto the stack to process in the next iteration
      stack.push(chosenNeighbour);
    }
  }
}

/**
 * Uses the A-Star search algorithm to find the route through the current maze.
 *
 * @export
 * @param {*} grid Object, containing current status of the grid/maze. Each key is a cell coordinate
 * in string format, and the value is an object indicating wall states (top, bottom, left, right).
 * @param {*} gridWidth Int, number of columns in the grid.
 * @param {*} gridHeight Int, number of rows in the grid.
 * @return {*} If a path is found, returns an array containing the closedNodes object
 * (with details of the path) and the finish cell coordinate. If no path is found, returns undefined.
 */
export function findPath(grid, gridWidth, gridHeight) {
  // Initialize the finish cell's coordinates as a string
  const finishCell = String(gridWidth - 1) + "," + String(gridHeight - 1);

  // Dictionaries to track visited nodes (closed) and nodes to investigate (open)
  const closedNodes = {};
  const openNodes = {};

  // Add the starting point (0,0) to the open dictionary
  openNodes["0,0"] = {
    parent: "0,0", // Parent node, used to reconstruct the path
    moveCost: 0, // Cost to reach this node from the start
    distCost: 0, // Heuristic estimate of distance to the finish
    totalCost: 0, // Total cost = moveCost + distCost
  };

  // While there are nodes to investigate
  while (Object.keys(openNodes).length > 0) {
    // Get the key of the node with the lowest total cost
    const minKey = getLowestCostNodeKey(openNodes);
    const current = [minKey, openNodes[minKey]]; // Current node being processed

    // Check if we've reached the finish cell
    if (current[0] === finishCell) {
      closedNodes[current[0]] = current[1]; // Mark the finish cell as closed

      return [closedNodes, finishCell]; // Return the path and finish cell
    }

    // Get valid neighboring cells
    const possibleNeighbours = getViableNeighbours(
      grid,
      current[0],
      closedNodes
    );

    // Evaluate each neighbor
    for (let i = 0; i < possibleNeighbours.length; i++) {
      const neighbourNode = {
        parent: current[0], // Set the current node as the parent
        moveCost: current[1].moveCost + 1, // Increment move cost
        distCost: getHeuristicMeasure(possibleNeighbours[i], finishCell), // Calculate heuristic distance
        totalCost: 0, // Placeholder for total cost
      };

      // Calculate the total cost for the neighbor
      neighbourNode.totalCost = neighbourNode.moveCost + neighbourNode.distCost;

      // Add neighbor to openNodes if not already there, or update it if the current path is cheaper
      if (!openNodes.hasOwnProperty(possibleNeighbours[i])) {
        openNodes[possibleNeighbours[i]] = neighbourNode;
      } else if (
        openNodes[possibleNeighbours[i]].totalCost > neighbourNode.totalCost
      ) {
        openNodes[possibleNeighbours[i]] = neighbourNode;
      }
    }

    closedNodes[current[0]] = current[1]; // Make record of completed node
    delete openNodes[current[0]]; // Finished investigating current node
  }

  // If all nodes are exhausted and no path is found, return undefined
  return undefined;
}

/**
 * Finds the key of the node in openNodes with the lowest total cost.
 *
 * @param {*} openNodes { Object } List of current grid nodes under investigation.
 * Each key is a coordinate string, and the value is an object containing cost details.
 * @return {*} { String } Key of the node with the lowest total movement cost.
 */
function getLowestCostNodeKey(openNodes) {
  return Object.entries(openNodes).reduce((minEntry, [key, value]) => {
    return value.totalCost < openNodes[minEntry].totalCost ? key : minEntry;
  }, Object.keys(openNodes)[0]);
}

/**
 * Converts a string-formatted coordinate into an array of integers.
 *
 * @param {*} cordsStr - String, coordinates in the format "x,y".
 * @return {*} - int[], an array of integers representing the coordinates, e.g., [x, y].
 */
function getNumericalCoordinates(cordsStr) {
  const splitCurrent = cordsStr.split(",");
  return [parseInt(splitCurrent[0]), parseInt(splitCurrent[1])];
}

/**
 * Finds all valid neighboring cells of the current node.
 * A valid neighbor must be within the grid, not closed, and accessible (wall removed).
 *
 * @param {*} grid Object, containing the current state of the maze/grid.
 * @param {*} currentNode String, the coordinate of the current node being processed.
 * @param {*} closedNodes Object, the set of nodes that have already been fully processed.
 * @return {*} [ int[] ], an array of valid neighbor coordinates.
 */
function getViableNeighbours(grid, currentNode, closedNodes) {
  const cords = getNumericalCoordinates(currentNode);

  const possibleNeighbours = [
    [cords[0], cords[1] - 1], // Up
    [cords[0], cords[1] + 1], // Down
    [cords[0] - 1, cords[1]], // Left
    [cords[0] + 1, cords[1]], // Right
  ];

  // Remove invalid neighbors: outside the grid, already closed, or walls blocking access
  if (
    !grid.hasOwnProperty(possibleNeighbours[3]) ||
    grid[possibleNeighbours[3]].left ||
    closedNodes[possibleNeighbours[3]]
  ) {
    possibleNeighbours.splice(3, 1); // Remove right neighbor
  }
  if (
    !grid.hasOwnProperty(possibleNeighbours[2]) ||
    grid[possibleNeighbours[2]].right ||
    closedNodes[possibleNeighbours[2]]
  ) {
    possibleNeighbours.splice(2, 1); // Remove left neighbor
  }
  if (
    !grid.hasOwnProperty(possibleNeighbours[1]) ||
    grid[possibleNeighbours[1]].top ||
    closedNodes[possibleNeighbours[1]]
  ) {
    possibleNeighbours.splice(1, 1); // Remove down neighbor
  }
  if (
    !grid.hasOwnProperty(possibleNeighbours[0]) ||
    grid[possibleNeighbours[0]].bottom ||
    closedNodes[possibleNeighbours[0]]
  ) {
    possibleNeighbours.splice(0, 1); // Remove up neighbor
  }

  return possibleNeighbours; // Return valid neighbors
}

/**
 * Calculates the Manhattan distance between two cells.
 * This heuristic is used to estimate the cost of reaching the finish cell from the current cell.
 *
 * @param {*} currentCell int[], the coordinates of the current cell.
 * @param {*} targetCell String, the coordinates of the target cell as a string.
 * @return {*} int, the Manhattan distance between the two cells.
 */
function getHeuristicMeasure(currentCell, targetCell) {
  const targetCords = getNumericalCoordinates(targetCell);

  // Manhattan distance: |x2 - x1| + |y2 - y1|
  return (
    Math.abs(targetCords[0] - currentCell[0]) +
    Math.abs(targetCords[1] - currentCell[1])
  );
}

// Let's represent the graph by an adjacent matrice
// For this problem the graph is undirected

class GameBoard {
  constructor() {
    // the case [i,j] will be the vertices i * 8 + j
    this.graph = new Array(64).fill(null).map(() => new Array(64).fill(0));
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const mooves = Knight.accessibleMove(i, j);
        const currentCaseNumber = GameBoard.getVertexNumber(i, j);
        mooves.forEach((moove) => {
          const vertex = GameBoard.getVertexNumber(...moove);
          this.graph[currentCaseNumber][vertex] = 1;
        });
      }
    }
  }
  static isValid(moove) {
    return moove[0] < 8 && moove[1] < 8 && moove[0] >= 0 && moove[1] >= 0;
  }

  static getVertexNumber(i, j) {
    return 8 * i + j;
  }
  static getCase(number) {
    return [Math.floor(number / 8), number - Math.floor(number / 8) * 8];
  }

  shortestPath(depart, arrival) {
    // find a shortest path from depart to arrival using DFS
    // Will simulate queue with array shift and push though inneficient goal is only to learn
    const queue = [depart];
    const visited = new Set([GameBoard.getVertexNumber(...depart)]);
    const parents = new Map();
    while (queue.length != 0) {
      const newVertex = queue.shift();
      // first get new vertex to visit next
      const mooves = [];
      const currentVertexNumber = GameBoard.getVertexNumber(...newVertex);
      // to get all possible neighboor go through the line current vertex
      for (let j = 0; j < 64; j++) {
        if (this.graph[currentVertexNumber][j]) {
          const neighboor = GameBoard.getCase(j);
          if (!visited.has(j)) {
            mooves.push(neighboor);
            visited.add(j);
          }
        }
      }
      queue.push(...mooves);
      for (let moove of mooves) {
        // need hashable value in sets and maps keys
        parents.set(GameBoard.getVertexNumber(...moove), currentVertexNumber);
      }
      if (parents.has(GameBoard.getVertexNumber(arrival))) {
        break;
      }
    }
    // arrival has been found cause the game must have a solution
    // need to construct the path back
    const reversedPath = [arrival];
    let currentVertex = arrival;
    while (currentVertex) {
      let parentVertexNumber = parents.get(
        GameBoard.getVertexNumber(...currentVertex)
      );
      if (!parentVertexNumber) {
        break;
      }
      const parent = GameBoard.getCase(parentVertexNumber);
      console.log(parent);
      reversedPath.push(parent);
      currentVertex = parent;
    }
    reversedPath.reverse();
    return reversedPath;
  }
}

class Knight {
  static accessibleMove(i, j) {
    const mooves = [];
    for (let k = -1; k <= 1; k++) {
      for (let n = -1; n <= 1; n++) {
        if (n !== 0 && k !== 0) {
          const potentialMoove1 = [i + k * 2, j + n * 1];
          const potentialMoove2 = [i + k * 1, j + n * 2];
          if (GameBoard.isValid(potentialMoove1)) {
            mooves.push(potentialMoove1);
          }
          if (GameBoard.isValid(potentialMoove2)) {
            mooves.push(potentialMoove2);
          }
        }
      }
    }
    return mooves;
  }
}

const gameBoard = new GameBoard();

console.log(Knight.accessibleMove(5, 4));

console.log(gameBoard.shortestPath([0, 0], [7, 5]));

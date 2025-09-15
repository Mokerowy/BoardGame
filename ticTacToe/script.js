const cells = document.querySelectorAll(".cell");
let currentPlayer = "O";
const board = Array(9).fill(null);
const playerMoves = { X: [], O: [] };
const restartButton = document.getElementById("restartButton");
const playerTurnDisplay = document.getElementById("playerTurn");
const gameResultDisplay = document.getElementById("gameResult");

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => handleClick(index));
});

restartButton.addEventListener("click", startGame);

function startGame() {
  currentPlayer = "O";
  board.fill(null);
  playerMoves["X"] = [];
  playerMoves["O"] = [];
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("added", "removed");
    cell.addEventListener("click", handleClick, { once: true });
  });
  gameResultDisplay.textContent = ""; // Wyczyść komunikat o wygranej
  updatePlayerTurnDisplay();
}

function handleClick(index) {
  if (board[index] || checkWinner()) return;
  if (playerMoves[currentPlayer].length === 3) {
    const oldestMove = playerMoves[currentPlayer].shift();
    board[oldestMove] = null;
    cells[oldestMove].textContent = "";
    cells[oldestMove].classList.add("removed");
    setTimeout(() => cells[oldestMove].classList.remove("removed"), 300);
  }
  board[index] = currentPlayer;
  playerMoves[currentPlayer].push(index);
  cells[index].textContent = currentPlayer;
  cells[index].classList.add("added");
  setTimeout(() => cells[index].classList.remove("added"), 300);
  if (checkWinner()) {
    endGame(false);
  } else if (board.every((cell) => cell)) {
    endGame(true);
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updatePlayerTurnDisplay();
  }
}

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return winningCombinations.some((combination) => {
    const [a, b, c] = combination;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

function endGame(draw) {
  if (draw) {
    gameResultDisplay.textContent = "Remis!";
  } else {
    gameResultDisplay.textContent = ` ${
      currentPlayer === "O" ? "Player 1 " : "Player 2 "
    } Win`;
  }
  cells.forEach((cell) => cell.removeEventListener("click", handleClick)); // Po zakończeniu gry zablokuj kliknięcia
}

function updatePlayerTurnDisplay() {
  playerTurnDisplay.textContent =
    currentPlayer === "O" ? "Tura Player 1 (O)" : "Tura Player 2 (X)";
}

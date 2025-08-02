const board = document.getElementById('gameBoard');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const confettiCanvas = document.getElementById('confettiCanvas');

let cells = Array(9).fill("");
let currentPlayer = 'X';
let gameActive = true;

const winningCombinations = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function createBoard() {
  board.innerHTML = '';
  cells = Array(9).fill("");
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('button');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleMove);
    board.appendChild(cell);
  }
  currentPlayer = 'X';
  gameActive = true;
  updateStatus("Your Turn (X)");
}

function handleMove(e) {
  const index = e.target.dataset.index;
  if (cells[index] || !gameActive || currentPlayer !== 'X') return;

  makeMove(index, 'X');

  if (checkGameOver('X')) return;

  setTimeout(() => {
    const aiIndex = getBestMove();
    if (aiIndex !== null) {
      makeMove(aiIndex, 'O');
      checkGameOver('O');
    }
  }, 500);
}

function makeMove(index, player) {
  cells[index] = player;
  const cell = board.querySelector(`[data-index='${index}']`);
  cell.textContent = player;
  cell.disabled = true;
}

function getBestMove() {
  const available = cells.map((v, i) => v === "" ? i : null).filter(v => v !== null);
  return available.length > 0 ? available[Math.floor(Math.random() * available.length)] : null;
}

function checkGameOver(player) {
  if (checkWin(player)) {
    updateStatus(`${player === 'X' ? "You Win!" : "AI Wins!"}`);
    gameActive = false;
    celebrateWin();
    return true;
  }

  if (cells.every(cell => cell !== "")) {
    updateStatus("It's a Draw!");
    gameActive = false;
    return true;
  }

  updateStatus(player === 'X' ? "AI's Turn (O)" : "Your Turn (X)");
  return false;
}

function checkWin(player) {
  return winningCombinations.some(combo =>
    combo.every(i => cells[i] === player)
  );
}

function updateStatus(message) {
  statusText.textContent = message;
}

function celebrateWin() {
  confetti.create(confettiCanvas, {
    resize: true,
    useWorker: true
  })({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

restartBtn.addEventListener('click', createBoard);

createBoard();

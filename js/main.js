let game;
const canvas = document.getElementById('gameCanvas');
const nextPieceCanvas = document.getElementById('nextPieceCanvas');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const linesEl = document.getElementById('lines');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const restartBtn = document.getElementById('restartBtn');
const gameOverModal = document.getElementById('gameOverModal');

function initGame() {
    game = new TetrisGame(canvas, nextPieceCanvas);
    gameOverModal.classList.remove('show');
    updateUI();
}

function startGame() {
    if (!game) {
        initGame();
    }
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
}

function pauseGame() {
    game.paused = !game.paused;
    pauseBtn.textContent = game.paused ? 'RESUME' : 'PAUSE';
}

function resetGame() {
    game.reset();
    updateUI();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'PAUSE';
    resetBtn.disabled = false;
}

function updateUI() {
    scoreEl.textContent = game.score;
    levelEl.textContent = game.level;
    linesEl.textContent = game.lines;
}

function gameLoop() {
    if (game) {
        game.update();
        game.draw();
        updateUI();

        if (game.gameOver) {
            showGameOverModal();
        }
    }
    requestAnimationFrame(gameLoop);
}

function showGameOverModal() {
    document.getElementById('finalScore').textContent = game.score;
    document.getElementById('finalLevel').textContent = game.level;
    document.getElementById('finalLines').textContent = game.lines;
    gameOverModal.classList.add('show');
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
resetBtn.addEventListener('click', resetGame);
restartBtn.addEventListener('click', () => {
    resetGame();
    startGame();
});

initGame();
gameLoop();
const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;
const BLOCK_SIZE = 30;

class TetrisGame {
    constructor(canvas, nextPieceCanvas) {
        this.canvas = canvas;
        this.nextPieceCanvas = nextPieceCanvas;
        this.ctx = canvas.getContext('2d');
        this.nextCtx = nextPieceCanvas.getContext('2d');

        this.grid = Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(0));
        this.currentPiece = getRandomTetromino();
        this.nextPiece = getRandomTetromino();
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.gameOver = false;
        this.paused = false;
        this.dropInterval = 1000;
        this.lastDropTime = Date.now();

        this.setupKeyListeners();
    }

    setupKeyListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    handleKeyPress(e) {
        if (this.gameOver || this.paused) return;

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.movePiece(-1, 0);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.movePiece(1, 0);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.movePiece(0, 1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.rotatePiece();
                break;
            case ' ':
                e.preventDefault();
                this.hardDrop();
                break;
        }
    }

    movePiece(dx, dy) {
        this.currentPiece.x += dx;
        this.currentPiece.y += dy;

        if (this.hasCollision()) {
            this.currentPiece.x -= dx;
            this.currentPiece.y -= dy;

            if (dy > 0) {
                this.lockPiece();
            }
            return false;
        }
        return true;
    }

    rotatePiece() {
        const oldRotation = this.currentPiece.rotation;
        const rotated = rotateTetromino(this.currentPiece);

        this.currentPiece = rotated;
        if (this.hasCollision()) {
            this.currentPiece.rotation = oldRotation;
            this.currentPiece = rotateTetromino(this.currentPiece);
        }
    }

    hardDrop() {
        while (this.movePiece(0, 1)) {}
    }

    hasCollision() {
        const shape = this.currentPiece.shape;

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const newX = this.currentPiece.x + col;
                    const newY = this.currentPiece.y + row;

                    if (newX < 0 || newX >= GRID_WIDTH || newY >= GRID_HEIGHT) {
                        return true;
                    }

                    if (newY >= 0 && this.grid[newY][newX]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    lockPiece() {
        const shape = this.currentPiece.shape;

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const gridY = this.currentPiece.y + row;
                    const gridX = this.currentPiece.x + col;

                    if (gridY >= 0) {
                        this.grid[gridY][gridX] = this.currentPiece.color;
                    }
                }
            }
        }

        this.clearLines();
        this.currentPiece = this.nextPiece;
        this.nextPiece = getRandomTetromino();

        if (this.hasCollision()) {
            this.gameOver = true;
        }
    }

    clearLines() {
        let linesCleared = 0;

        for (let row = GRID_HEIGHT - 1; row >= 0; row--) {
            if (this.grid[row].every(cell => cell !== 0)) {
                this.grid.splice(row, 1);
                this.grid.unshift(Array(GRID_WIDTH).fill(0));
                linesCleared++;
                row++;
            }
        }

        if (linesCleared > 0) {
            const points = [0, 40, 100, 300, 1200];
            this.score += points[linesCleared] * this.level;
            this.lines += linesCleared;
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
        }
    }

    update() {
        if (this.gameOver || this.paused) return;

        const now = Date.now();
        if (now - this.lastDropTime > this.dropInterval) {
            this.movePiece(0, 1);
            this.lastDropTime = now;
        }
    }

    draw() {
        this.ctx.fillStyle = '#0f3460';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawGrid();
        this.drawPiece();
        this.drawNextPiece();

        if (this.paused) {
            this.drawPausedText();
        }
    }

    drawGrid() {
        for (let row = 0; row < GRID_HEIGHT; row++) {
            for (let col = 0; col < GRID_WIDTH; col++) {
                const x = col * BLOCK_SIZE;
                const y = row * BLOCK_SIZE;

                if (this.grid[row][col]) {
                    this.ctx.fillStyle = this.grid[row][col];
                    this.ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
                    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
                } else {
                    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                    this.ctx.lineWidth = 0.5;
                    this.ctx.strokeRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
                }
            }
        }
    }

    drawPiece() {
        const shape = this.currentPiece.shape;

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const x = (this.currentPiece.x + col) * BLOCK_SIZE;
                    const y = (this.currentPiece.y + row) * BLOCK_SIZE;

                    this.ctx.fillStyle = this.currentPiece.color;
                    this.ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
                    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
                }
            }
        }
    }

    drawNextPiece() {
        this.nextCtx.fillStyle = '#0f3460';
        this.nextCtx.fillRect(0, 0, this.nextPieceCanvas.width, this.nextPieceCanvas.height);

        const shape = this.nextPiece.shape;
        const offsetX = (4 - shape[0].length) * 15;
        const offsetY = (4 - shape.length) * 15;

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const x = offsetX + col * 30;
                    const y = offsetY + row * 30;

                    this.nextCtx.fillStyle = this.nextPiece.color;
                    this.nextCtx.fillRect(x, y, 30, 30);
                    this.nextCtx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                    this.nextCtx.lineWidth = 1;
                    this.nextCtx.strokeRect(x, y, 30, 30);
                }
            }
        }
    }

    drawPausedText() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#ffff00';
        this.ctx.font = 'bold 30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
    }

    reset() {
        this.grid = Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(0));
        this.currentPiece = getRandomTetromino();
        this.nextPiece = getRandomTetromino();
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.gameOver = false;
        this.paused = false;
        this.dropInterval = 1000;
        this.lastDropTime = Date.now();
    }
}
const TETROMINOES = {
    I: {
        shape: [[1, 1, 1, 1]],
        color: '#00d4ff',
        width: 4,
        height: 1
    },
    O: {
        shape: [[1, 1], [1, 1]],
        color: '#ffff00',
        width: 2,
        height: 2
    },
    T: {
        shape: [[0, 1, 0], [1, 1, 1]],
        color: '#d946ef',
        width: 3,
        height: 2
    },
    S: {
        shape: [[0, 1, 1], [1, 1, 0]],
        color: '#10b981',
        width: 3,
        height: 2
    },
    Z: {
        shape: [[1, 1, 0], [0, 1, 1]],
        color: '#ef4444',
        width: 3,
        height: 2
    },
    J: {
        shape: [[1, 0, 0], [1, 1, 1]],
        color: '#3b82f6',
        width: 3,
        height: 2
    },
    L: {
        shape: [[0, 0, 1], [1, 1, 1]],
        color: '#f97316',
        width: 3,
        height: 2
    }
};

function getRandomTetromino() {
    const keys = Object.keys(TETROMINOES);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const tetromino = TETROMINOES[randomKey];
    return {
        ...tetromino,
        x: 3,
        y: 0,
        rotation: 0
    };
}

function rotateTetromino(piece) {
    const rotated = {
        ...piece,
        shape: piece.shape[0].map((_, colIndex) =>
            piece.shape.map(row => row[colIndex]).reverse()
        ),
        rotation: (piece.rotation + 1) % 4
    };

    [rotated.width, rotated.height] = [rotated.height, rotated.width];
    return rotated;
}
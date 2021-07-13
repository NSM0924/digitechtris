function randomNextBlockMatrix() {
    const blockSet = [
        [
            [1,1],
            [1,1]
        ],
        [
            [0,2,0],
            [2,2,2],
            [0,0,0]
        ],
        [
            [0,3,3],
            [3,3,0],
            [0,0,0]
        ],
        [
            [4,4,0],
            [0,4,4],
            [0,0,0]
        ],
        [
            [5,0,0],
            [5,5,5],
            [0,0,0]
        ],
        [
            [0,0,6],
            [6,6,6],
            [0,0,0]
        ],
        [
            [0,0,0,0],
            [7,7,7,7],
            [0,0,0,0],
            [0,0,0,0]
        ]
    ]

    return blockSet[getRandomIndex(blockSet.length)];
}

function initMatrix(rows, cols) {
    let matrix = [];
    for(let y=0; y < rows; y++) {
        matrix.push(new Array(cols).fill(0));
    }
    return matrix;
}

function stack(block, matrix) {
    block.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value > 0) {
                matrix[y+block.y][x+block.x] = block.shape[y][x];
            }
        });
    });
}

function checkFilledLines(matrix) {
    result = [];
    for(let y=0; y < matrix.length; y++) {
        if(matrix[y].every(value => value > 0)) {
            result.push(y);
        }
    }
    return result;
}

function removeLines(matrix, lineIndexes) {
    lineIndexes.forEach((y, i) => {
        matrix.splice(y, 1);
        matrix.unshift(new Array(matrix[0].length).fill(0));
    });
}
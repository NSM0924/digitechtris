function drawBlock(block, ctx) {
    block.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value > 0) {
                ctx.fillStyle = COLOR_SET[value-1];
                ctx.fillRect(x + block.x, y + block.y, 1, 1);
            }
        });
    });
}

function drawBoard(matrix, ctx) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value > 0) {
                ctx.fillStyle = COLOR_SET[matrix[y][x]-1];
                ctx.fillRect(x, y, 1, 1);
            }
        });
    });
}

function drawRemovingLines(ctx, cols, lineIndexes) {
    lineIndexes.forEach((y, i) => {
        for(let x=0; x < cols; x++) {
            ctx.fillStyle = 'red';
            ctx.fillRect(x, y, 1, 1);
        }
    });
}

function drawLattice(board, ctx) {
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if((x%2 == 0 && y%2 == 0) || (x%2 == 1 && y%2 == 1)){
                ctx.fillStyle = '#f9f9ff';
            } else {
                ctx.fillStyle = '#eeeeff';
            }
            ctx.fillRect(x, y, 1, 1);
        });
    });
}

function drawCombo(ctx, comboCount, colorSet) {
    if(comboCount > 1) {
        let adjustTextPosition = 0;
        if(String(comboCount-1).length >= 2) {
            adjustTextPosition = -0.2;
        }
        if(comboCount%2 === 0) {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = colorSet[comboCount%7];
            ctx.fillRect(6, 0.2, 4, 1.6);
            ctx.globalAlpha = 1.0;
            ctx.font = '1px NeoDungGeunMo';
            ctx.fillStyle = '#ffffff';
            ctx.fillText('콤보 +'+(comboCount-1), 6.2+adjustTextPosition, 1.3);
        } else {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = colorSet[comboCount%7];
            ctx.fillRect(0, 0.2, 4, 1.6);
            ctx.globalAlpha = 1.0;
            ctx.font = '1px NeoDungGeunMo';
            ctx.fillStyle = '#ffffff';
            ctx.fillText('콤보 +'+(comboCount-1), 0.2+adjustTextPosition, 1.3);
        }
    }
    ctx.globalAlpha = 1.0;
}
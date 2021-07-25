window.onload = () => {
    db = firebase.firestore();
    batch = db.batch();

        firebase
            .auth()
            .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => {
                const provider = new firebase.auth.GoogleAuthProvider()
                firebase.auth().onAuthStateChanged((user) => {
                    if (user) {
                        const user = firebase.auth().currentUser;
                        if (user !== null) {
                            // The user object has basic properties such as display name, email, etc.
                            displayName = user.displayName;
                            email = user.email;
                            photoURL = user.photoURL;
                            uid = user.uid;
                            console.log(user);
                            console.log(displayName);
                            console.log(email);
                            console.log(photoURL);
                            console.log(uid);

                            let docRef = db.collection('ranking').doc(uid);
                            docRef.get().then((doc) => {
                                dbScore = doc.data().score;
                                highScoreElem.textContent = dbScore;
                                level = doc.data().level;
                                maxLevel = level;
                            })
                            
                            db.collection('ranking').doc(uid).get().then((doc) => {
                                if (doc.data()) {
                                    return;
                                } else {
                                    db.collection('ranking').doc(uid).set({ score: 0, level: 1, displayName: displayName, email: email, photoURL: photoURL });
                                }
                            })

                        }
                    } else {
                        window.location.href = '/login.html';
                    }
                })
            })

    main();
}

function main() {
    rebuild();
    window.addEventListener('resize', rebuild);
}

function start() {
    reset();
    gameStatus = 'A';
    setNextBlock();
    repeatMotion(0);
    addLines(3);
    window.addEventListener('keydown', KeyDownController);
    window.addEventListener('keyup', KeyUpController);
    // window.addEventListener('keydown', KeyboardController({
    //     37: function() { if(gameStatus == 'A') validMove(mainBlock, matrixMainBoard, -1, 0);},
    //     39: function() { if(gameStatus == 'A') validMove(mainBlock, matrixMainBoard, 1, 0); },
    //     40: function() { if(gameStatus == 'A') validMove(mainBlock, matrixMainBoard, 0, 1); }
    // }, 80));
    window.addEventListener('keydown', keyHandler)
    startButton.blur();
}

function resetScoreBoard() {
    totalScore = 0;
    scoreElem.textContent = "0";
    addScoreElem.textContent = "";

    currentLevel = 1;
    levelElem.textContent = "1";
    levelUpElem.textContent = "";

    remaningLines = 0;
    linesElem.textContent = "0";
    removeLinesElem.textContent = "";
}

function reset() {
    matrixMainBoard = initMatrix(gameBoard_rows, gameBoard_cols);
    time = 0;
    timeForRemovingLines = 0;
    mainBlock = null;
    nextBlock = null;
    holdBlock = null;
    resetScoreBoard();
    speed = 800;
    comboCount = 0;
    holdCheck = true;
}

function setButtonStyle(elem, witdh) {
    elem.style.fontSize = witdh/350+'rem';
    elem.style.paddingTop = witdh/1400+'rem';
    elem.style.paddingBottom = witdh/1400+'rem';
    elem.style.paddingLeft = witdh/350+'rem';
    elem.style.paddingRight = witdh/350+'rem';
}

function resize() {
    const window_width = (window.innerWidth > 770)?770:window.innerWidth;
    const gameContent_width = Math.floor(window_width*0.5);
    const blockSize = Math.floor(gameContent_width/gameBoard_cols);
    
    gameBoard_ctx.canvas.width = blockSize*gameBoard_cols;
    gameBoard_ctx.canvas.height = blockSize*gameBoard_rows;
    gameBoard_ctx.scale(blockSize, blockSize);
    
    nextBoard_ctx.canvas.width = blockSize*nextBoard_cols;
    nextBoard_ctx.canvas.height = blockSize*nextBoard_rows;
    nextBoard_ctx.scale(blockSize, blockSize);

    holdBoard_ctx.canvas.width = blockSize*holdBoard_cols;
    holdBoard_ctx.canvas.height = blockSize*holdBoard_rows;
    holdBoard_ctx.scale(blockSize, blockSize);
    
    const fontSize = window_width/350;
    document.getElementById('hold-contents').style.fontSize = fontSize+'rem';
    document.getElementById('side-contents').style.fontSize = fontSize+'rem';

    setButtonStyle(startButton, window_width);
    setButtonStyle(quitButton, window_width);
    setButtonStyle(pauseButton, window_width);
    setButtonStyle(menuBtn1, window_width);
    setButtonStyle(menuBtn2, window_width);
    setButtonStyle(menuBtn3, window_width);
}

function rebuild() {
    resize();
    drawLattice(matrixMainBoard, gameBoard_ctx);
    drawLattice((new Array(4)).fill((new Array(4)).fill(0)), nextBoard_ctx);
    drawLattice((new Array(4)).fill((new Array(4)).fill(0)), holdBoard_ctx);
    if (mainBlock) {
        drawBlock(mainBlock, gameBoard_ctx);
        drawBlock(nextBlock, nextBoard_ctx);
        holdBlock?drawBlock(holdBlock, holdBoard_ctx):'';
    }
    drawBoard(matrixMainBoard, gameBoard_ctx);
    drawRemovingLines(gameBoard_ctx, gameBoard_cols, filledLines);
    drawCombo(gameBoard_ctx, comboCount, COLOR_SET);
}

function createNextBlock() {
    const nextBlock = {
        x: 0,
        y: 0,
        shape: randomNextBlockMatrix()
    }
    
    return nextBlock;
}

let keys = {
    37: function() { if(gameStatus == 'A') validMove(mainBlock, matrixMainBoard, -1, 0);},
    39: function() { if(gameStatus == 'A') validMove(mainBlock, matrixMainBoard, 1, 0); },
    40: function() { if(gameStatus == 'A') validMove(mainBlock, matrixMainBoard, 0, 1); }
}
let repeat = 80;
var timers= {};
function KeyDownController(e) {
        var key= (e || window.event).keyCode;
        if (!(key in keys))
        return true;
        if (!(key in timers)) {
            timers[key]= null;
            keys[key]();
            if (repeat!==0)
            timers[key]= setInterval(keys[key], repeat);
        }
        return false;
};
function KeyUpController(e) {
    var key= (e || window.event).keyCode;
    if (key in timers) {
        if (timers[key]!==null)
        clearInterval(timers[key]);
        delete timers[key];
    }
};
// window.onblur= function() {
//     console.log('c');
//     for (key in timers)
//     if (timers[key]!==null)
//     clearInterval(timers[key]);
//     timers= {};
// };

let rotateCheck = true;
let holdCheck = true;
function keyHandler(e) {
    const inputKey = e.keyCode;

    const KEY = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SPACE: 32,
        C: 67
    }

    switch(inputKey) {
        case KEY.UP :
            if(gameStatus == 'A'){
                if(rotateCheck)
                    validRotate(mainBlock, matrixMainBoard);
                    rotateCheck = false;
            }
            break;
        case KEY.SPACE :
            if(gameStatus == 'A'){
                while(validMove(mainBlock, matrixMainBoard, 0, 1)){
                    globalAddScore += 20*currentLevel;
                };
                nextStep();
                time = 0;
            }
            break;
        case KEY.C :
            if(gameStatus == 'A'){
                if (holdCheck) {
                    hold(mainBlock);
                }
            }
            break;
    }

    drawBlock(mainBlock, gameBoard_ctx);
}
window.addEventListener('keyup', (e)=>{if(e.code == 'ArrowUp') rotateCheck = true})

function hold(block) {
    if(holdBlock){
        setNextBlock('hold')
        holdCheck = false;
    }else{
        holdBlock = clone(block);
        holdBlock.y = (holdBlock.shape[1][0]===7)?0:1;
        holdBlock.x = (holdBlock.shape[0][0]===1)?1:0;
        drawBlock(holdBlock, holdBoard_ctx);
        setNextBlock()
        holdCheck = false;
    }
}

function setNextBlock(e) {
    if (e == 'hold') {
        let newHold = clone(mainBlock);
        mainBlock = holdBlock;
        mainBlock.y = 0;
        mainBlock.x = 3;
        holdBlock = newHold;
        holdBlock.y = (holdBlock.shape[1][0]===7)?0:1;
        holdBlock.x = (holdBlock.shape[0][0]===1)?1:0;
        drawBlock(holdBlock, holdBoard_ctx);
        nextBlock.y = (nextBlock.shape[1][0]===7)?0:1;
        nextBlock.x = (nextBlock.shape[0][0]===1)?1:0;
    }else if (e == 'end') {
        mainBlock = nextBlock?nextBlock:createNextBlock();
        mainBlock.y = -1;
        mainBlock.x = 3;
        nextBlock = createNextBlock();
        nextBlock.y = (nextBlock.shape[1][0]===7)?0:1;
        nextBlock.x = (nextBlock.shape[0][0]===1)?1:0;
    }
    else{
        mainBlock = nextBlock?nextBlock:createNextBlock();
        mainBlock.y = 0;
        mainBlock.x = 3;
        nextBlock = createNextBlock();
        nextBlock.y = (nextBlock.shape[1][0]===7)?0:1;
        nextBlock.x = (nextBlock.shape[0][0]===1)?1:0;
    }
}

function initRemoveLines() {
    filledLines = [];
    timeForRemovingLines = 0;
    time = 0;
}

function nextStep() {
    stack(mainBlock, matrixMainBoard);
    filledLines = checkFilledLines(matrixMainBoard);

    if(filledLines.length === 0) {
        comboCount = 0;
        addScore(globalAddScore);
        globalAddScore = 0;
        matrixMainBoard[0].some((value, x) => {
            if(value > 0) {
                gameStatus = 'Q';
                return true;
            }
        });

        const cloneNextBlock = clone(nextBlock);
        cloneNextBlock.y = 0;
        cloneNextBlock.x = 3;
        if(validate(cloneNextBlock, matrixMainBoard)) {
            setNextBlock();
        } else {
            let endLineCheck = false;
            for (let i = 0; i < matrixMainBoard[0].length; i++) {
                if(matrixMainBoard[0][i]==0){
                    endLineCheck = true;
                }else{
                    endLineCheck = false;
                    break;
                }
            }
            if (endLineCheck) {
                setNextBlock('end');
                gameStatus = 'Q';
            }else{
                gameStatus = 'Q';
            }
        }
    }
    holdCheck = true;
}

function pause() {
    console.log(gameStatus);
    if (gameStatus == 'Q') {
        return;
    }else{
        if(gameStatus == 'A') {
            window.cancelAnimationFrame(requestAnimationId);
            requestAnimationId = null;
            console.log('a');
            gameBoard_ctx.fillStyle = '#6f9cf0';
            gameBoard_ctx.fillRect(1, 3, 8, 1.8);
            gameBoard_ctx.font = '1px NeoDungGeunMo';
            gameBoard_ctx.fillStyle = '#ffffff';
            gameBoard_ctx.fillText('일시 정지', 2.8, 4.2);

            gameStatus = 'P';
        
        } else {
            gameStatus = 'A';
    
            repeatMotion(0);
        }
    }
    pauseButton.blur();
}

function quit() {
    window.removeEventListener('keydown', KeyDownController);
    // window.removeEventListener('keyup', KeyUpController);
    window.removeEventListener('keydown', keyHandler);

    gameBoard_ctx.fillStyle = '#f0b71b';
    gameBoard_ctx.fillRect(1, 3, 8, 1.8);
    gameBoard_ctx.font = '1px NeoDungGeunMo';
    gameBoard_ctx.fillStyle = '#ffffff';
    gameBoard_ctx.fillText('게임 오버', 2.8, 4.2);

    
    window.cancelAnimationFrame(requestAnimationId);
    requestAnimationId = null;
    
    speed = 800;

    let highLevel = Number(levelElem.textContent);
    if(highLevel > maxLevel){
        db.collection('ranking').doc(uid).update({ level: currentLevel });
    }

    highScore = Number(highScoreElem.textContent);
    if(totalScore > highScore) {
        // localStorage.setItem('high-score', totalScore);
        console.log(totalScore);
        console.log(highScore);
        db.collection('ranking').doc(uid).update({ score: totalScore });
        highScoreElem.textContent = totalScore;
        gameBoard_ctx.fillStyle = '#f0b71b';
        gameBoard_ctx.fillRect(1, 3, 8, 1.8);
        gameBoard_ctx.font = '1px NeoDungGeunMo';
        gameBoard_ctx.fillStyle = '#ffffff';
        gameBoard_ctx.fillText('기록 갱신', 2.8, 4.2);
    } else {
        console.log(totalScore);
        console.log(highScore);
        gameBoard_ctx.fillStyle = '#f0b71b';
        gameBoard_ctx.fillRect(1, 3, 8, 1.8);
        gameBoard_ctx.font = '1px NeoDungGeunMo';
        gameBoard_ctx.fillStyle = '#ffffff';
        gameBoard_ctx.fillText('게임 오버', 2.8, 4.2);
    }
    gameStatus = 'Q';

    quitButton.blur();
}

let keyDownCheck = false;
function repeatMotion(timeStamp) {
    if(time === 0) {
        time = timeStamp;
    }
    
    if(timeStamp - time > speed) {
        if(!validMove(mainBlock, matrixMainBoard, 0, 1)) {
            nextStep();
        }
        time = timeStamp;
    }

    if(filledLines.length > 0) {
        if(timeForRemovingLines === 0) {
            timeForRemovingLines = timeStamp;
        }

        if(timeStamp - timeForRemovingLines > 100) {
            comboCount++;
            globalAddScore += 100*filledLines.length*currentLevel*comboCount;
            removeLines(matrixMainBoard, filledLines);
            globalAddScore += 100*filledLines.length*currentLevel;
            addScore(globalAddScore);
            globalAddScore = 0;
            addLines(filledLines.length*-1);

            while(remaningLines <= 0) {
                addLevel(1);
                addLines(3*currentLevel);
            }
            initRemoveLines();
            setNextBlock();
        }
    }

    rebuild();

    if(gameStatus === 'A') {
        requestAnimationId = window.requestAnimationFrame(repeatMotion);
    } else if (gameStatus === 'P') {
        gameBoard_ctx.fillStyle = '#6f9cf0';
        gameBoard_ctx.fillRect(1, 3, 8, 1.8);
        gameBoard_ctx.font = '1px NeoDungGeunMo';
        gameBoard_ctx.fillStyle = '#ffffff';
        gameBoard_ctx.fillText('일시 정지', 2.8, 4.2);
    } else {
        quit();
    }
}

function addScore(score) {
    totalScore += score;
    scoreElem.textContent = totalScore;
    if(score > 0) {
        addScoreElem.textContent = '+' + score;
    }
    if(addScoreId){
        clearTimeout(addScoreId);
    }
    addScoreId = setTimeout(() => {
        addScoreElem.textContent = "";
    }, 1000);
}

function addLines(lines) {
    remaningLines += lines;
    linesElem.textContent = remaningLines;
    if(lines < 0) {
        removeLinesElem.textContent = lines;
    }
    if(removeLinesId){
        clearTimeout(removeLinesId);
    }
    removeLinesId = setTimeout(() => {
        removeLinesElem.textContent = "";
    }, 1000);
}

function addLevel(level) {
    currentLevel += level;
    if (speed>100) {
        speed-=100;
    }
    levelElem.textContent = currentLevel;
    if(level > 0) {
        levelUpElem.textContent = '레벨 업!';
    }
    if(levelUpId){
        clearTimeout(levelUpId);
    }
    levelUpId = setTimeout(() => {
        levelUpElem.textContent = "";
    }, 2000);

}
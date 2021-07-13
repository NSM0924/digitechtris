const gameBoard = document.getElementById('game-board');
const gameBoard_ctx = gameBoard.getContext('2d');
const nextBoard = document.getElementById('nextBlock');
const nextBoard_ctx = nextBoard.getContext('2d');
const holdBoard = document.getElementById('hold-board');
const holdBoard_ctx = holdBoard.getContext('2d');

const startButton = document.querySelector('#start-button');
const quitButton = document.querySelector('#quit-button');
const pauseButton = document.querySelector('#pause-button');
let highScoreElem = document.querySelector('#high-score');

const gameBoard_cols = 10;
const gameBoard_rows = 20;
const nextBoard_cols = 4;
const nextBoard_rows = 4;
const holdBoard_cols = 4;
const holdBoard_rows = 4;

let mainBlock = null;
let nextBlock = null;
let holdBlock = null;

let time = 0;
let requestAnimationId = null;

let matrixMainBoard = initMatrix(gameBoard_rows, gameBoard_cols);

let timeForRemovingLines = 0;
let filledLines = [];

let playing = false;

const COLOR_SET = [
    '#1726f3',
    '#df2736',
    '#38a73b',
    '#fc902c',
    '#6f4af7',
    '#ffd151',
    '#1c2491',
    '#9c9c9c'
];

let totalScore = 0;
let scoreElem = document.querySelector('#score');
let addScoreElem = document.querySelector('#add-score');
let addScoreId = null;
let globalAddScore = 0;

let currentLevel = 1;

let levelElem = document.querySelector('#level');
let levelUpElem = document.querySelector('#level-up');
let levelUpId = null;

let remaningLines = 0;
let linesElem = document.querySelector('#lines');
let removeLinesElem = document.querySelector('#remove-lines');
let removeLinesId = null;

let speed = 800;

let comboCount = 0;
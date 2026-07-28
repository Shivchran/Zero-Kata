const clickSound =
  new Audio(
    "sounds/click.mp3"
  );

const winSound =
  new Audio(
    "sounds/victory.mp3"
  );

const loseSound =
  new Audio(
    "sounds/defeat.mp3"
  );

// =================================
// GAME STATE
// =================================

let playerName =
  "Player";

let board =
  Array(9).fill("");

let currentPlayer =
  "O";

let gameOver =
  false;

let replaceMode =
  false;

let selectedTile =
  null;

let tilesUsed = {

  O:[],

  X:[]
};

// =================================
// ELEMENTS
// =================================

const grid =
  document.getElementById(
    "grid"
  );

const turnText =
  document.getElementById(
    "turn"
  );

const moveText =
  document.getElementById(
    "moveText"
  );

const message =
  document.getElementById(
    "message"
  );

// =================================
// START GAME
// =================================

function startGame(){

  // AUDIO UNLOCK

  clickSound.play()
    .then(()=>{

      clickSound.pause();

      clickSound.currentTime = 0;

      return winSound.play();

    })
    .then(()=>{

      winSound.pause();

      winSound.currentTime = 0;

      return loseSound.play();

    })
    .then(()=>{

      loseSound.pause();

      loseSound.currentTime = 0;

    })
    .catch(()=>{});

  playerName =

    document
      .getElementById(
        "playerName"
      )
      .value ||

    "Player";

  document
    .getElementById(
      "aiMenu"
    )
    .classList.add(
      "hidden"
    );

  document
    .getElementById(
      "game"
    )
    .classList.remove(
      "hidden"
    );

  document
    .getElementById(
      "players"
    )
    .innerText =

      playerName +
      " vs AI";

  createGrid();

  updateTurn();
}

// =================================
// CREATE GRID
// =================================

function createGrid(){

  grid.innerHTML =

    '<div id="line"></div>';

  for(let i=0;i<9;i++){

    const tile =

      document
        .createElement(
          "div"
        );

    tile.className =
      "tile";

    tile.onclick =
      ()=>handleClick(i);

    grid.appendChild(
      tile
    );
  }
}

// =================================
// HANDLE CLICK
// =================================

function handleClick(i){

  if(gameOver) return;

  // PLAYER TURN
  if(currentPlayer !== "O"){
    return;
  }

  // CLICK SOUND
  clickSound.pause();
  clickSound.currentTime = 0;
  clickSound.play().catch(()=>{});

  // =================================
  // REPLACE MODE
  // =================================

  if(replaceMode){

    // Select another own tile
    if(board[i] === "O"){

      selectedTile = i;

      highlight();

      message.innerText =
        "Select empty box";

      return;
    }

    // Move selected tile
    if(
      board[i] === "" &&
      selectedTile !== null
    ){

      board[selectedTile] = "";

      tilesUsed.O =
        tilesUsed.O.filter(
          x => x !== selectedTile
        );

      board[i] = "O";

      tilesUsed.O.push(i);

      replaceMode = false;

      selectedTile = null;

      message.innerText = "";

      renderBoard();

      checkWin();

      if(!gameOver){
        switchTurn();
      }
    }

    return;
  }

  // =================================
  // AFTER 3 TILES
  // =================================

  if(tilesUsed.O.length >= 3){

    // Directly select own tile
    if(board[i] === "O"){

      replaceMode = true;

      selectedTile = i;

      highlight();

      message.innerText =
        "Select empty box";

      return;
    }

    message.innerText =
      "Select your tile first";

    return;
  }

  // =================================
  // NORMAL MOVE
  // =================================

  if(board[i] !== ""){
    return;
  }

  board[i] = "O";

  tilesUsed.O.push(i);

  renderBoard();

  checkWin();

  if(!gameOver){
    switchTurn();
  }
}

// =================================
// SWITCH TURN
// =================================

function switchTurn(){

  currentPlayer =

    currentPlayer === "O"
    ? "X"
    : "O";

  updateTurn();

  // AI TURN

  if(
    currentPlayer === "X" &&
    !gameOver
  ){

    message.innerText =
      "AI Thinking...";

    setTimeout(
      aiMove,
      700
    );
  }
}

// =========================================================================
// IMPOSSIBLE AI — MINIMAX + ALPHA-BETA HELPERS
// =========================================================================
// Everything below this block is NEW code that supports aiMove().
// Nothing above this block was touched.
// The AI works in two phases, same as the human player:
//   1) PLACEMENT PHASE  -> while tilesUsed.X.length < 3, AI places a new X.
//   2) MOVEMENT PHASE   -> once AI has 3 tiles down, it moves one existing
//                          X to any empty square (no adjacency restriction).
// The AI never mutates the real game state while "thinking" — it only
// works on cloned boards/tile-lists, and applies the chosen move to the
// real board/tilesUsed at the very end, exactly like the old random AI did.
// =========================================================================

// All 8 winning lines on the 3x3 board (same triples used in checkWin()).
const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// How many plies (half-moves) the search is allowed to look ahead.
// Because pieces can move forever (no draws), the search tree is
// technically infinite, so we MUST cap the depth. 7 plies is deep
// enough to play perfectly on a 3x3 board while still running instantly
// in the browser, thanks to alpha-beta pruning cutting most branches.
const AI_SEARCH_DEPTH = 7;

// -----------------------------------------------------------------------
// getWinnerOnBoard(boardState)
// Pure (no DOM, no side effects) version of checkWin()'s win detection.
// Returns "O", "X", or null. Used millions of times inside the search,
// so it must not touch the DOM or global game state.
// -----------------------------------------------------------------------
function getWinnerOnBoard(boardState){

  for(const [a,b,c] of WIN_LINES){

    if(
      boardState[a] !== "" &&
      boardState[a] === boardState[b] &&
      boardState[a] === boardState[c]
    ){
      return boardState[a];
    }
  }

  return null;
}

// -----------------------------------------------------------------------
// getEmptyCells(boardState)
// Returns an array of indices (0-8) that are currently empty.
// -----------------------------------------------------------------------
function getEmptyCells(boardState){

  const empty = [];

  for(let i=0;i<9;i++){
    if(boardState[i] === ""){
      empty.push(i);
    }
  }

  return empty;
}

// -----------------------------------------------------------------------
// generateCandidateMoves(boardState, xTiles, oTiles, player)
// Builds the list of legal moves for `player` ("X" or "O") given the
// current board and how many tiles each side has already placed.
//
// A move is described as:
//   { type: "place", to: index }              (placement phase)
//   { type: "move",  from: index, to: index }  (movement phase, any empty)
// -----------------------------------------------------------------------
function generateCandidateMoves(boardState, xTiles, oTiles, player){

  const empty = getEmptyCells(boardState);
  const myTiles = player === "X" ? xTiles : oTiles;

  const moves = [];

  // PLACEMENT PHASE: still have tiles left to place.
  if(myTiles.length < 3){

    for(const cell of empty){
      moves.push({ type:"place", to:cell });
    }

    return moves;
  }

  // MOVEMENT PHASE: move any one of my 3 tiles to any empty square.
  for(const from of myTiles){
    for(const to of empty){
      moves.push({ type:"move", from:from, to:to });
    }
  }

  return moves;
}

// -----------------------------------------------------------------------
// applyCandidateMove(boardState, xTiles, oTiles, player, move)
// Returns a brand new { board, xTiles, oTiles } after applying `move`.
// Never mutates the arrays it was given — everything is cloned so the
// search tree can branch safely.
// -----------------------------------------------------------------------
function applyCandidateMove(boardState, xTiles, oTiles, player, move){

  const newBoard = boardState.slice();
  const newXTiles = xTiles.slice();
  const newOTiles = oTiles.slice();

  const myTiles = player === "X" ? newXTiles : newOTiles;

  if(move.type === "place"){

    newBoard[move.to] = player;
    myTiles.push(move.to);

  } else {

    // movement: clear old spot, remove it from the tile list,
    // then occupy the new spot.
    newBoard[move.from] = "";

    const idx = myTiles.indexOf(move.from);
    if(idx !== -1){
      myTiles.splice(idx,1);
    }

    newBoard[move.to] = player;
    myTiles.push(move.to);
  }

  return {
    board: newBoard,
    xTiles: newXTiles,
    oTiles: newOTiles
  };
}

// -----------------------------------------------------------------------
// evaluateBoard(boardState, xTiles, oTiles)
// Heuristic score used only when the search hits its depth limit without
// the game having ended. Positive favors X (AI), negative favors O
// (human). For every line of 3 that isn't blocked by the opponent, we
// reward having pieces already on it — 2-in-a-line is worth much more
// than 1-in-a-line, because it's one move away from winning.
// -----------------------------------------------------------------------
function evaluateBoard(boardState, xTiles, oTiles){

  let score = 0;

  for(const [a,b,c] of WIN_LINES){

    const line = [boardState[a], boardState[b], boardState[c]];

    const xCount = line.filter(v => v === "X").length;
    const oCount = line.filter(v => v === "O").length;

    // Line has both symbols -> nobody can ever win on it, worth 0.
    if(xCount > 0 && oCount > 0) continue;

    if(xCount === 2) score += 10;
    else if(xCount === 1) score += 1;

    if(oCount === 2) score -= 10;
    else if(oCount === 1) score -= 1;
  }

  return score;
}

// -----------------------------------------------------------------------
// minimax(boardState, xTiles, oTiles, depth, isMaximizing, alpha, beta)
// The core Minimax search with Alpha-Beta pruning.
//
// isMaximizing = true  -> it's X's (AI's) turn, we want the HIGHEST score.
// isMaximizing = false -> it's O's (human's) turn, we want the LOWEST score.
//
// Winning is scored as (1000 - depth) / (depth - 1000) so that the AI
// prefers winning SOONER and delays losing as LONG as possible, instead
// of being indifferent between "win in 1 move" and "win in 5 moves".
// -----------------------------------------------------------------------
function minimax(boardState, xTiles, oTiles, depth, isMaximizing, alpha, beta){

  const winner = getWinnerOnBoard(boardState);

  if(winner === "X") return 1000 - depth;
  if(winner === "O") return depth - 1000;

  if(depth >= AI_SEARCH_DEPTH){
    return evaluateBoard(boardState, xTiles, oTiles);
  }

  const player = isMaximizing ? "X" : "O";
  const moves = generateCandidateMoves(boardState, xTiles, oTiles, player);

  // Safety net: if somehow no moves are available, fall back to the
  // static evaluation instead of crashing.
  if(moves.length === 0){
    return evaluateBoard(boardState, xTiles, oTiles);
  }

  if(isMaximizing){

    let best = -Infinity;

    for(const move of moves){

      const result = applyCandidateMove(boardState, xTiles, oTiles, player, move);

      const score = minimax(
        result.board,
        result.xTiles,
        result.oTiles,
        depth + 1,
        false,
        alpha,
        beta
      );

      best = Math.max(best, score);
      alpha = Math.max(alpha, best);

      if(beta <= alpha) break; // prune

    }

    return best;

  } else {

    let best = Infinity;

    for(const move of moves){

      const result = applyCandidateMove(boardState, xTiles, oTiles, player, move);

      const score = minimax(
        result.board,
        result.xTiles,
        result.oTiles,
        depth + 1,
        true,
        alpha,
        beta
      );

      best = Math.min(best, score);
      beta = Math.min(beta, best);

      if(beta <= alpha) break; // prune

    }

    return best;
  }
}

// -----------------------------------------------------------------------
// findBestMoveForX(boardState, xTiles, oTiles)
// Top-level search call: tries every legal move for X, runs minimax on
// the resulting position (now it's O's turn, so isMaximizing = false),
// and returns the move with the highest score. This is what aiMove()
// calls to decide what to actually do on the real board.
// -----------------------------------------------------------------------
function findBestMoveForX(boardState, xTiles, oTiles){

  const moves = generateCandidateMoves(boardState, xTiles, oTiles, "X");

  let bestScore = -Infinity;
  let bestMove = moves[0];

  for(const move of moves){

    const result = applyCandidateMove(boardState, xTiles, oTiles, "X", move);

    const score = minimax(
      result.board,
      result.xTiles,
      result.oTiles,
      1,
      false,
      -Infinity,
      Infinity
    );

    if(score > bestScore){
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

// =================================
// AI MOVE  (REPLACED — now Impossible AI via Minimax + Alpha-Beta)
// =================================

function aiMove(){

  if(gameOver) return;

  // Ask the search for the mathematically best move given the CURRENT
  // real board and tile lists. This explores placement moves if the AI
  // still has tiles left to place, or movement moves once all 3 X tiles
  // are down — exactly mirroring the human player's rules.
  const bestMove =
    findBestMoveForX(board, tilesUsed.X, tilesUsed.O);

  if(bestMove.type === "place"){

    board[bestMove.to] = "X";

    tilesUsed.X.push(bestMove.to);

  } else {

    // movement: clear the old square, update tilesUsed.X, occupy new one.
    board[bestMove.from] = "";

    tilesUsed.X =
      tilesUsed.X.filter(
        x => x !== bestMove.from
      );

    board[bestMove.to] = "X";

    tilesUsed.X.push(bestMove.to);
  }

  renderBoard();

  checkWin();

  // BACK PLAYER

  if(!gameOver){

    currentPlayer =
      "O";

    updateTurn();

    message.innerText =
      "";
  }
}

// =================================
// UPDATE TURN
// =================================

function updateTurn(){

  turnText.innerText =

    "Turn: " +
    currentPlayer;

  moveText.innerText =

    currentPlayer +
    "'s Move";
}

// =================================
// RENDER BOARD
// =================================

function renderBoard(){

  const tiles =

    document
      .querySelectorAll(
        ".tile"
      );

  tiles.forEach((tile,i)=>{

    tile.innerText =
      board[i];

    tile.className =
      "tile";

    if(board[i]){

      tile.classList.add(
        board[i]
      );
    }

    tile.onclick =
      ()=>handleClick(i);
  });
}

// =================================
// HIGHLIGHT
// =================================

function highlight(){

  const tiles =

    document
      .querySelectorAll(
        ".tile"
      );

  tiles.forEach(tile=>

    tile.classList.remove(
      "selected"
    )
  );

  if(selectedTile !== null){

    tiles[selectedTile]
      .classList.add(
        "selected"
      );
  }
}

// =================================
// CHECK WIN
// =================================

function checkWin(){

  const wins = [

    [0,1,2],
    [3,4,5],
    [6,7,8],

    [0,3,6],
    [1,4,7],
    [2,5,8],

    [0,4,8],
    [2,4,6]
  ];

  for(let [a,b,c] of wins){

    if(

      board[a] !== "" &&

      board[a] === board[b] &&

      board[a] === board[c]
    ){

      gameOver =
        true;

      drawLine(a,c);

      let isWinner =
        board[a] === "O";

      let text =

        isWinner

        ? "You Win 🎉"

        : "You Lose 😢";

      // WIN SOUND

      if(isWinner){

        winSound.pause();

        winSound.currentTime = 0;

        winSound.play()
          .catch(()=>{});
      }

      // LOSE SOUND

      else{

        loseSound.pause();

        loseSound.currentTime = 0;

        loseSound.play()
          .catch(()=>{});
      }

      // SHOW POPUP

      setTimeout(()=>{

        showPopup(text);

      },1000);

      return;
    }
  }
}

// =================================
// DRAW LINE
// =================================

function drawLine(a,c){

  const tiles =

    document
      .querySelectorAll(
        ".tile"
      );

  const line =

    document
      .getElementById(
        "line"
      );

  let r1 =
    tiles[a]
    .getBoundingClientRect();

  let r2 =
    tiles[c]
    .getBoundingClientRect();

  let gridRect =
    grid
    .getBoundingClientRect();

  let x1 =

    r1.left +
    r1.width/2 -
    gridRect.left;

  let y1 =

    r1.top +
    r1.height/2 -
    gridRect.top;

  let x2 =

    r2.left +
    r2.width/2 -
    gridRect.left;

  let y2 =

    r2.top +
    r2.height/2 -
    gridRect.top;

  let length =

    Math.hypot(
      x2-x1,
      y2-y1
    );

  let angle =

    Math.atan2(
      y2-y1,
      x2-x1
    ) * 180 / Math.PI;

  line.style.left =
    x1 + "px";

  line.style.top =
    y1 + "px";

  line.style.width =
    length + "px";

  line.style.transform =

    `rotate(${angle}deg)`;

  line.style.background =

    board[a] === "O"

    ? "#00ff9d"

    : "#ff3c3c";

  line.style.boxShadow =

    board[a] === "O"

    ? "0 0 15px #00ff9d"

    : "0 0 15px #ff3c3c";

  line.style.display =
    "block";
}

// =================================
// SHOW POPUP
// =================================

function showPopup(text){

  document
    .getElementById(
      "popup"
    )
    .classList.remove(
      "hidden"
    );

  document
    .getElementById(
      "popupTitle"
    )
    .innerText =
      text;
}

// =================================
// CLOSE POPUP
// =================================

function closePopup(){

  document
    .getElementById(
      "popup"
    )
    .classList.add(
      "hidden"
    );

  resetGame();
}

// =================================
// RESET
// =================================

function resetGame(){

  location.reload();
}
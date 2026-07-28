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

const socket = io();

// =================================
// GAME STATE
// =================================

let board =
  Array(9).fill("");

let currentPlayer =
  "O";

let mySymbol =
  "";

let roomId =
  "";

let gameOver =
  false;

let tilesUsed = {

  O:[],

  X:[]
};

let replaceMode =
  false;

let selectedTile =
  null;

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
// CREATE ROOM
// =================================

function createRoom(){

  const username =

    document
      .getElementById(
        "username"
      )
      .value;

  if(username === ""){

    alert(
      "Enter Username"
    );

    return;
  }

  roomId =

    Math.floor(
      100000 +
      Math.random() *
      900000
    ).toString();

  socket.emit(
    "createRoom",
    {

      roomId,

      username
    }
  );

  document
    .getElementById(
      "menu"
    )
    .classList.add(
      "hidden"
    );

  document
    .getElementById(
      "waiting"
    )
    .classList.remove(
      "hidden"
    );

  document
    .getElementById(
      "roomText"
    )
    .innerText =

      "Room ID : " +
      roomId;
}

// =================================
// JOIN ROOM
// =================================

function joinRoom(){

  const username =

    document
      .getElementById(
        "username"
      )
      .value;

  roomId =

    document
      .getElementById(
        "roomInput"
      )
      .value;

  if(username === ""){

    alert(
      "Enter Username"
    );

    return;
  }

  if(roomId === ""){

    alert(
      "Enter Room ID"
    );

    return;
  }

  socket.emit(
    "joinRoom",
    {

      roomId,

      username
    }
  );
}

// =================================
// START GAME
// =================================

socket.on(
  "startGame",

  data=>{

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

    mySymbol =
      data.symbol;

    document
      .getElementById(
        "menu"
      )
      .classList.add(
        "hidden"
      );

    document
      .getElementById(
        "waiting"
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

        data.player1 +
        " vs " +
        data.player2;

    // RESET

    board =
      Array(9).fill("");

    currentPlayer =
      "O";

    gameOver =
      false;

    replaceMode =
      false;

    selectedTile =
      null;

    tilesUsed = {

      O:[],

      X:[]
    };

    createGrid();

    updateTurn();
  }
);

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

  // MY TURN ONLY

  if(currentPlayer !== mySymbol){
    return;
  }

  // CLICK SOUND

  clickSound.pause();

  clickSound.currentTime = 0;

  clickSound.play()
    .catch(()=>{});

  // =================================
  // REPLACE MODE
  // =================================

  if(replaceMode){

    // SELECT OWN TILE

    if(board[i] === mySymbol){

      selectedTile = i;

      highlight();

      message.innerText =
        "Select empty box";

      return;
    }

    // MOVE TILE

    if(

      board[i] === "" &&

      selectedTile !== null
    ){

      socket.emit(
        "replaceMove",
        {

          roomId,

          oldIndex:
            selectedTile,

          newIndex:i,

          symbol:
            mySymbol
        }
      );

      replaceMode =
        false;

      selectedTile =
        null;

      message.innerText =
        "";
    }

    return;
  }

  // FILLED TILE

  if(board[i] !== ""){
    return;
  }

  // NORMAL MOVE

  if(
    tilesUsed[mySymbol]
    .length < 3
  ){

    socket.emit(
      "makeMove",
      {

        roomId,

        index:i,

        symbol:
          mySymbol
      }
    );
  }

  // START REPLACE MODE

  else{

    replaceMode =
      true;

    message.innerText =
      "Select your tile";
  }
}

// =================================
// UPDATE BOARD
// =================================

socket.on(
  "updateBoard",

  data=>{

    board =
      data.board;

    currentPlayer =
      data.turn;

    tilesUsed =
      data.tilesUsed;

    renderBoard();

    updateTurn();

    checkWin();
  }
);

// =================================
// UPDATE TURN
// =================================

function updateTurn(){

  turnText.innerText =

    "Turn: " +
    currentPlayer;

  if(currentPlayer === mySymbol){

    moveText.innerText =
      "Your Move";
  }

  else{

    moveText.innerText =
      "Opponent Move";
  }
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

      let text =

        board[a] === mySymbol

        ? "You Win 🎉"

        : "You Lose 😢";

      // WIN SOUND

      if(board[a] === mySymbol){

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

      // POPUP

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
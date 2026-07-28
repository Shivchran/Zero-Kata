const express =
  require("express");

const http =
  require("http");

const { Server } =
  require("socket.io");

// =================================
// APP
// =================================

const app =
  express();

const server =
  http.createServer(app);

const io =
  new Server(server);

// =================================
// PUBLIC
// =================================

app.use(
  express.static("public")
);

// =================================
// ROOM STORAGE
// =================================

let rooms = {};

// =================================
// CONNECTION
// =================================

io.on(
  "connection",
  socket=>{

    console.log(
      "Connected:",
      socket.id
    );

    // =============================
    // CREATE ROOM
    // =============================

    socket.on(
      "createRoom",
      data=>{

        rooms[data.roomId] = {

          players:[

            {
              id:socket.id,
              username:data.username,
              symbol:"O"
            }

          ],

          board:
            Array(9).fill(""),

          turn:"O",

          tilesUsed:{

            O:[],

            X:[]
          }
        };

        socket.join(
          data.roomId
        );

        console.log(
          "Room Created:",
          data.roomId
        );
      }
    );

    // =============================
    // JOIN ROOM
    // =============================

    socket.on(
      "joinRoom",
      data=>{

        const room =
          rooms[data.roomId];

        // room not found

        if(!room){

          socket.emit(
            "roomNotFound"
          );

          return;
        }

        // room full

        if(
          room.players.length >= 2
        ){

          socket.emit(
            "roomFull"
          );

          return;
        }

        room.players.push({

          id:socket.id,

          username:
            data.username,

          symbol:"X"
        });

        socket.join(
          data.roomId
        );

        // START GAME

        room.players.forEach(player=>{

          io.to(player.id)
            .emit(
              "startGame",
              {

                player1:
                  room.players[0]
                  .username,

                player2:
                  room.players[1]
                  .username,

                symbol:
                  player.symbol
              }
            );
        });

        console.log(
          "Player Joined:",
          data.roomId
        );
      }
    );

    // =============================
    // NORMAL MOVE
    // =============================

    socket.on(
      "makeMove",
      data=>{

        const room =
          rooms[data.roomId];

        if(!room){
          return;
        }

        // wrong turn

        if(
          room.turn !== data.symbol
        ){
          return;
        }

        // filled box

        if(
          room.board[data.index] !== ""
        ){
          return;
        }

        // max 3 tiles check

        if(
          room.tilesUsed[data.symbol]
          .length >= 3
        ){
          return;
        }

        // place move

        room.board[data.index] =
          data.symbol;

        room.tilesUsed[data.symbol]
          .push(data.index);

        // switch turn

        room.turn =
          room.turn === "O"
          ? "X"
          : "O";

        // update

        io.to(data.roomId)
          .emit(
            "updateBoard",
            {

              board:
                room.board,

              turn:
                room.turn,

              tilesUsed:
                room.tilesUsed
            }
          );
      }
    );

    // =============================
    // REPLACE MOVE
    // =============================

    socket.on(
      "replaceMove",
      data=>{

        const room =
          rooms[data.roomId];

        if(!room){
          return;
        }

        // remove old tile

        room.board[data.oldIndex] =
          "";

        room.tilesUsed[data.symbol] =

          room.tilesUsed[data.symbol]
          .filter(
            x => x !== data.oldIndex
          );

        // place new tile

        room.board[data.newIndex] =
          data.symbol;

        room.tilesUsed[data.symbol]
          .push(data.newIndex);

        // switch turn

        room.turn =
          room.turn === "O"
          ? "X"
          : "O";

        // update board

        io.to(data.roomId)
          .emit(
            "updateBoard",
            {

              board:
                room.board,

              turn:
                room.turn,

              tilesUsed:
                room.tilesUsed
            }
          );
      }
    );

    // =============================
    // DISCONNECT
    // =============================

    socket.on(
      "disconnect",
      ()=>{

        console.log(
          "Disconnected:",
          socket.id
        );

        for(let id in rooms){

          rooms[id].players =

            rooms[id].players.filter(
              player=>
                player.id !== socket.id
            );

          // delete empty room

          if(
            rooms[id].players.length === 0
          ){

            delete rooms[id];
          }
        }
      }
    );
  }
);

// =================================
// START SERVER
// =================================

server.listen(
  3000,
  ()=>{

    console.log(
      "http://localhost:3000"
    );
  }
);
'use strict';
const path = require('path');
const jsdom = require('jsdom');
const Datauri = require('datauri');
const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
var doms = {}
var players = {}


io.on('connection', function (socket) {
  // create a new player and add it to our players object
  socket.on('join', function (roomId) {

    socket.join(roomId);
    console.log(roomId, doms);
    if (players[roomId] == undefined)
      players[roomId] = {}
    players[roomId][socket.id] = {
      rotation: 0,
      x: Math.floor(Math.random() * 700) + 50,
      y: Math.floor(Math.random() * 500) + 50,
      playerId: socket.id,
      direction: 'down',
      team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue',
      input: {
        left: false,
        right: false,
        up: false,
        down: false
      }
    };
    console.log('Im am ok');
    // add player to server
    setTimeout(() => {
      doms[roomId].window.players = players[roomId];
      doms[roomId].window.AppConnection.addPlayer(doms[roomId].window.MyScene, players[roomId][socket.id]);
      console.log('Im am ok');
      // send the players object to the new player
      socket.emit('currentPlayers', players[roomId]);
      // update all other players of the new player
      socket.broadcast.to(roomId).emit('newPlayer', players[roomId][socket.id]);

      socket.on('disconnect', function () {
        // remove player from server
        doms[roomId].window.AppConnection.removePlayer(doms[roomId].window.MyScene, socket.id);
        // remove this player from our players object
        delete players[roomId][socket.id];
        // emit a message to all players to remove this player
        socket.broadcast.to(roomId).emit('disconnect', socket.id);
        socket.leave(roomId);

      });

      // when a player moves, update the player data
      socket.on('playerInput', function (inputData) {
        doms[roomId].window.AppConnection.handlePlayerInput(doms[roomId].window.MyScene, socket.id, inputData);
      });
    }, 5000)
  });

});



const { JSDOM } = jsdom;
const datauri = new Datauri();
const port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/game/:room', function (req, res) {
  const roomId = req.params.room;
  if (!doms[roomId])
    setupAuthoritativePhaser(roomId);
  res.sendFile(__dirname + '/public/index.html');
});

server.listen(port, () => {
  console.log(`App running on port ${port}.`)
});

function setupAuthoritativePhaser(roomId) {

  JSDOM.fromFile(path.join(__dirname, 'authoritative_server/index.html'), {
    // To run the scripts in the html file
    runScripts: "dangerously",
    // Also load supported external resources
    resources: "usable",
    // So requestAnimatinFrame events fire
    pretendToBeVisual: true,
    omitJSDOMErrors: true
  }).then((dom) => {
    dom.window.gameLoaded = () => {
      dom.window.URL.createObjectURL = (blob) => {
        if (blob) {
          return datauri.format(blob.type, blob[Object.getOwnPropertySymbols(blob)[0]]._buffer).content;
        }
      };
      dom.window.URL.revokeObjectURL = (objectURL) => { };
    };
    doms[roomId] = dom;
    dom.window.roomId = roomId;
    dom.window.io = io;
  }).catch((error) => {
    console.log(error.message);
  });
}

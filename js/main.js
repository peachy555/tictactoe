// To check
// - Why doesn't .box:hover working
// - How to "remove/hide" background image of .box ('x' and 'o')


// Things left to do
// - Use LocalStorage
// - Support networked multiplayer
// - Customize player's tokens


// var myFirebaseRef = new Firebase("https://tictactoe-e7931.firebaseio.com/");
// window.firebaseExample = new Firebase('https://docs-examples.firebaseio.com/web/data');

$(document).ready(function() {
  $winnerMessage = $('#winner-message');
  $currentScore = $('.current-score');

  var boardSize = 'normal';
  var scoreBoard = {
    player1: 0,
    player2: 0
  }

  var updateScoreboard = function() {
    $currentScore.html(scoreBoard.player1 + ' - ' + scoreBoard.player2);
  }

  var initializeGame = function() {
    tictactoe.board = [[0, 0, 0],
                      [0, 0, 0],
                      [0, 0, 0]];
    tictactoe.winner = 0;
    tictactoe.currentPlayer = 1;
    tictactoe.turnCounter = 0;
    $(".box").removeClass("x");
    $(".box").removeClass("o");
    $(".box").addClass("clear");
  }

  var tictactoe = {
    isSinglePlay: true,
    turnCounter: 0,
    currentPlayer: 1,
    winner: 0,
    board: [[0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]],
    markingScheme: {

    },

    getPosition: function(boxId) {
      var row = boxId[0];
      var col = boxId[2];
      this.pushInput(row, col);
    },

    scoreEmptyBox: function() {
      var emptySlots = [];
      for (var row = 0; row < 3; row++) {
        for (var col = 0; col < 3; col++) {
          if (this.board[row][col] === 0) {
            emptySlots.push([row, col]);
          }
        }
      }
      return emptySlots;
    },

    AIdebugger: function(input) {
      var arr = input.sort();
      var bff = arr[0];
      var output = [];
      output.push(bff);
      for (i = 1; i < arr.length; i++) {
        if (bff !== arr[i]) {
          output.push(arr[i]);
          bff = arr[i];
        }
      }
    },

    checkForAI: function(currentBox, potentialPick) {
      var my = 3;
      var opponentWin = 50;
      var section = [];
      // Check row
      for (var row = 0; row < 3 ; row++) {
        // check empty row
        if ((this.board[row][0]===0)&&
            (this.board[row][1]===0)&&
            (this.board[row][2]===0)) {
              potentialPick.push([row,0]);
              potentialPick.push([row,1]);
              potentialPick.push([row,2]);
            }
        section = [this.board[row][0], this.board[row][1], this.board[row][2]];
        if (section.sort().toString() === [0,0,2].toString()) {
          section = [this.board[row][0], this.board[row][1], this.board[row][2]];
          var index = section.indexOf(2);
          for (var i = 0; i < 3; i++) {
            if (i !== index) {
              for (var j = 0; j < my; j++) {
                potentialPick.push([row,i]);
                console.log('my row ' + row + ' ' + i);
              }
            }
          }
        }
        section = [this.board[row][0], this.board[row][1], this.board[row][2]];
        if (section.sort().toString() === [0,1,1].toString()) {
          section = [this.board[row][0], this.board[row][1], this.board[row][2]];
          var index = section.indexOf(0);
          for (var j = 0; j < opponentWin; j++) {
            potentialPick.push([row,index]);
            console.log('opponent row ' + row + ' ' + index);
          }
        }
      }
      // Check col
      for (var col = 0; col < 3 ; col++) {
        // check empty col
        if ((this.board[0][col]===0)&&
            (this.board[1][col]===0)&&
            (this.board[2][col]===0)) {
              potentialPick.push([0,col]);
              potentialPick.push([1,col]);
              potentialPick.push([2,col]);
            }
        // check my col
        section = [this.board[0][col], this.board[1][col], this.board[2][col]];
        if (section.sort().toString() === [0,0,2].toString()) {
          section = [this.board[0][col], this.board[1][col], this.board[2][col]];
          var index = section.indexOf(2);
          for (var i = 0; i < 3; i++) {
            if (i !== index) {
              for (var j = 0; j < my; j++) {
                potentialPick.push([i,col]);
                console.log('my col ' + i + ' ' + col);
              }
            }
          }
        }
        if (section.sort().toString() === [0,1,1].toString()) {
          section = [this.board[0][col], this.board[1][col], this.board[2][col]];
          var index = section.indexOf(0);
          for (var j = 0; j < opponentWin; j++) {
            potentialPick.push([index,col]);
            console.log('opponent col ' + index + ' ' + col);
          }
        }
      }
      // check diag
      if ((this.board[0][0]===0)&&(this.board[1][1]===0)&&(this.board[2][2]===0)) {
        potentialPick.push([0,0]);
        potentialPick.push([1,1]);
        potentialPick.push([2,2]);
      }
      if ((this.board[2][0]===0)&&(this.board[1][1]===0)&&(this.board[0][2]===0)) {
        potentialPick.push([2,0]);
        potentialPick.push([1,1]);
        potentialPick.push([0,2]);
      }
      section = [this.board[0][0], this.board[1][1], this.board[2][2]];
      if (section.sort().toString() === [0,0,2].toString()) {
        section = [this.board[0][0], this.board[1][1], this.board[2][2]];
        var index = section.indexOf(2);
        for (var i = 0; i < 3; i++) {
          if (i !== index) {
            for (var j = 0; j < my; j++) {
              potentialPick.push([i,i]);
              console.log('my diag 1 ' + i + ' ' + i);
            }
          }
        }
      }
      if (section.sort().toString() === [0,1,1].toString()) {
        section = [this.board[0][0], this.board[1][1], this.board[2][2]];
        var index = section.indexOf(0);
        for (var j = 0; j < opponentWin; j++) {
          potentialPick.push([index,index]);
          console.log('opponent diag 1 ' + index + ' ' + index);
        }
      }
      section = [this.board[2][0], this.board[1][1], this.board[0][2]];
      if (section.sort().toString() === [0,0,2].toString()) {
        section = [this.board[2][0], this.board[1][1], this.board[0][2]];
        var index = section.indexOf(2);
        for (var i = 0; i < 3; i++) {
          if (i !== index) {
            for (var j = 0; j < my; j++) {
              potentialPick.push([2-i,i]);
              console.log('my diag 2 ' + 2-i + ' ' + i);
            }
          }
        }
      }
      if (section.sort().toString() === [0,1,1].toString()) {
        section = [this.board[2][0], this.board[1][1], this.board[0][2]];
        var index = section.indexOf(0);
        for (var j = 0; j < opponentWin; j++) {
          potentialPick.push([2-index,index]);
          console.log('opponent diag 2 ' + 2-index + ' ' + index);
        }
      }
      // console.log(potentialPick.sort());
      var randomIndex = Math.floor(Math.random()*potentialPick.length);
      console.log(potentialPick.sort());
      console.log(randomIndex);
      return potentialPick[randomIndex];

    },

    AIturn: function() {
      var emptyBoxes = this.scoreEmptyBox();
      var potentialPick = emptyBoxes;
      var AIchoice = this.checkForAI(emptyBoxes, potentialPick);

      return AIchoice;
    },

    pushInput: function(row, col) {
      if(this.currentPlayer === 1 && this.winner === 0) {
        if (this.board[row][col] === 0) {
          this.board[row][col] = 1;
          $('#' + row + '-' + col).removeClass("clear");
          $('#' + row + '-' + col).addClass("o");
          this.currentPlayer = 2;
          this.turnCounter++;
          this.checkWinner(row, col);
          console.log(this.turnCounter);
          if (this.isSinglePlay && (this.turnCounter < 9)) {
            var resArray = this.AIturn();
            var row = resArray[0];
            var col = resArray[1];
            this.board[row][col] = 2;
            $('#' + row + '-' + col).removeClass("clear");
            $('#' + row + '-' + col).addClass("x");
            this.currentPlayer = 1;
            this.turnCounter++;
            this.checkWinner(row, col);
          }
        }
      } else {
        if (this.board[row][col] === 0 && this.winner === 0) {
          if (this.isSinglePlay) {
            var resArray = this.AIturn();
            var row = resArray[0];
            var col = resArray[1];
            this.board[row][col] = 2;
            $('#' + row + '-' + col).removeClass("clear");
            $('#' + row + '-' + col).addClass("x");
            this.currentPlayer = 1;
            this.turnCounter++;
            this.checkWinner(row, col);
          } else {
            this.board[row][col] = 2;
            $('#' + row + '-' + col).removeClass("clear");
            $('#' + row + '-' + col).addClass("x");
            this.currentPlayer = 1;
            this.turnCounter++;
            this.checkWinner(row, col);
          }
        }
      }

      // console.log("board: " + this.board);
      // console.log("winner: " + this.winner);
    },

    checkWinner: function(row, col) {
      // Checking process
      if ((this.board[row][0] === this.board[row][1]) && (this.board[row][1] === this.board[row][2])) {
        this.winner = this.board[row][0];
      } else if ((this.board[0][col] === this.board[1][col]) && (this.board[1][col] === this.board[2][col])) {
          this.winner = this.board[0][col];
      } else if((row+col)%2 === 0) {
        if (((this.board[0][0] === this.board[1][1]) && (this.board[1][1] === this.board[2][2])) ||
            ((this.board[2][0] === this.board[1][1]) && (this.board[1][1] === this.board[0][2]))) {
          this.winner = this.board[1][1];
        }
      }
      // Winner message
      if (this.winner !== 0 || this.turnCounter === 9) {
        if (this.winner !== 0) {
          scoreBoard['player'+this.winner]++;
          updateScoreboard();
          $winnerMessage = $('#winner-message');
          $winnerMessage.html('The winner is player ' + this.winner + '!').show();
        } else {
          $winnerMessage = $('#winner-message');
          $winnerMessage.html('Draw!').show();
        }
        $('.ui.modal.small').modal('show');

      }
    },
  };

  initializeGame();
  updateScoreboard();
  $('.ui.modal.small').modal('hide');

  $(document).on('click', '.box', function() {
    var clickedId = $(this).attr('id');
    tictactoe.getPosition(clickedId);
  });

  $(document).on('click', '#new-game', function() {
    $("#board").fadeOut(800, function() {
      initializeGame();
    });
    $("#board").fadeIn(800);
  });

  $(document).on('click', '#new-game-popUp', function() {
    $('.ui.modal.small').modal('hide');
    $("#board").fadeOut(800, function() {
      initializeGame();
    });
    $("#board").fadeIn(800);
  });

  $(document).on('click', '#clear-board', function() {
    scoreBoard.player1 = 0;
    scoreBoard.player2 = 0;
    initializeGame();
    updateScoreboard();
  });

  $(document).on('click', '#board-size', function() {
    if (boardSize === 'normal') {
      boardSize = 'big';
      $(".box").addClass('big');
      $("#board").addClass('big');
      $('#board-size').html('Too BIG!!!');
    } else {
      boardSize = 'normal';
      $(".box").removeClass('big');
      $("#board").removeClass('big');
      $('#board-size').html('Bigger!!!!');
    }
  });

  $(document).on('click', '#single-play', function() {
    scoreBoard.player1 = 0;
    scoreBoard.player2 = 0;
    initializeGame();
    updateScoreboard();
    $('#single-play').addClass('primary');
  })
})

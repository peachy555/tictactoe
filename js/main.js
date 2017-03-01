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

  var initializeGame = function() {
    var localGame = localStorage.getItem("tictactoeState");
    if(localGame){
      tictactoe.state = JSON.parse(localGame);
    }
    for (var row = 0; row < 3; row++) {
      for (var col = 0; col< 3; col++) {
        if (tictactoe.state.board[row][col] === 1) {
          $('#' + row + '-' + col).removeClass("clear");
          $('#' + row + '-' + col).addClass("o");
        } else if (tictactoe.state.board[row][col] === 2) {
          $('#' + row + '-' + col).removeClass("clear");
          $('#' + row + '-' + col).addClass("x");
        }
      }
    }
    updateScoreboard();
  }

  var updateScoreboard = function() {
    $currentScore.html(tictactoe.state.scoreBoard.player1.score + ' - ' + tictactoe.state.scoreBoard.player2.score);
  }

  var resetGame = function() {
    $("#board").fadeOut(800, function() {
      tictactoe.state = {
        turnCounter: 0,
        currentPlayer: 1,
        winner: 0,
        board: [[0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]],
        scoreBoard: tictactoe.state.scoreBoard
              };
        $(".box").removeClass("x");
        $(".box").removeClass("o");
        $(".box").addClass("clear");
        updateScoreboard();
        localStorage.setItem("tictactoeState", JSON.stringify(tictactoe.state));
    });
    $("#board").fadeIn(800);

  };


  window.tictactoe = {

    state: {
      isSinglePlay: false,
      turnCounter: 0,
      currentPlayer: 1,
      winner: 0,
      board: [[0, 0, 0],
              [0, 0, 0],
              [0, 0, 0]],
      scoreBoard: {
        player1: {
          name: 'Peach',
          score: 0
        },
        player2: {
          name: 'Xander',
          score: 0
        }
      }
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
          if (this.state.board[row][col] === 0) {
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
        if ((this.state.board[row][0]===0)&&
            (this.state.board[row][1]===0)&&
            (this.state.board[row][2]===0)) {
              potentialPick.push([row,0]);
              potentialPick.push([row,1]);
              potentialPick.push([row,2]);
            }
        section = [this.state.board[row][0], this.state.board[row][1], this.state.board[row][2]];
        if (section.sort().toString() === [0,0,2].toString()) {
          section = [this.state.board[row][0], this.state.board[row][1], this.state.board[row][2]];
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
        section = [this.state.board[row][0], this.state.board[row][1], this.state.board[row][2]];
        if (section.sort().toString() === [0,1,1].toString()) {
          section = [this.state.board[row][0], this.state.board[row][1], this.state.board[row][2]];
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
        if ((this.state.board[0][col]===0)&&
            (this.state.board[1][col]===0)&&
            (this.state.board[2][col]===0)) {
              potentialPick.push([0,col]);
              potentialPick.push([1,col]);
              potentialPick.push([2,col]);
            }
        // check my col
        section = [this.state.board[0][col], this.state.board[1][col], this.state.board[2][col]];
        if (section.sort().toString() === [0,0,2].toString()) {
          section = [this.state.board[0][col], this.state.board[1][col], this.state.board[2][col]];
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
          section = [this.state.board[0][col], this.state.board[1][col], this.state.board[2][col]];
          var index = section.indexOf(0);
          for (var j = 0; j < opponentWin; j++) {
            potentialPick.push([index,col]);
            console.log('opponent col ' + index + ' ' + col);
          }
        }
      }
      // check diag
      if ((this.state.board[0][0]===0)&&(this.state.board[1][1]===0)&&(this.state.board[2][2]===0)) {
        potentialPick.push([0,0]);
        potentialPick.push([1,1]);
        potentialPick.push([2,2]);
      }
      if ((this.state.board[2][0]===0)&&(this.state.board[1][1]===0)&&(this.state.board[0][2]===0)) {
        potentialPick.push([2,0]);
        potentialPick.push([1,1]);
        potentialPick.push([0,2]);
      }
      section = [this.state.board[0][0], this.state.board[1][1], this.state.board[2][2]];
      if (section.sort().toString() === [0,0,2].toString()) {
        section = [this.state.board[0][0], this.state.board[1][1], this.state.board[2][2]];
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
        section = [this.state.board[0][0], this.state.board[1][1], this.state.board[2][2]];
        var index = section.indexOf(0);
        for (var j = 0; j < opponentWin; j++) {
          potentialPick.push([index,index]);
          console.log('opponent diag 1 ' + index + ' ' + index);
        }
      }
      section = [this.state.board[2][0], this.state.board[1][1], this.state.board[0][2]];
      if (section.sort().toString() === [0,0,2].toString()) {
        section = [this.state.board[2][0], this.state.board[1][1], this.state.board[0][2]];
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
        section = [this.state.board[2][0], this.state.board[1][1], this.state.board[0][2]];
        var index = section.indexOf(0);
        for (var j = 0; j < opponentWin; j++) {
          potentialPick.push([2-index,index]);
          console.log('opponent diag 2 ' + 2-index + ' ' + index);
        }
      }
      var randomIndex = Math.floor(Math.random()*potentialPick.length);
      return potentialPick[randomIndex];

    },

    AIturn: function() {
      var emptyBoxes = this.scoreEmptyBox();
      var potentialPick = emptyBoxes;
      var AIchoice = this.checkForAI(emptyBoxes, potentialPick);

      return AIchoice;
    },

    pushInput: function(row, col) {
      console.log('turnCounter ' + this.state.turnCounter);
      if(this.state.currentPlayer === 1 && this.state.winner === 0 && this.state.board[row][col] === 0) {
        this.state.board[row][col] = 1;
        $('#' + row + '-' + col).removeClass("clear");
        $('#' + row + '-' + col).addClass("o");
        this.state.currentPlayer = 2;
        this.state.turnCounter++;
        this.checkWinner(row, col);
        if (this.isSinglePlay && (this.state.turnCounter < 9)) {
          var resArray = this.AIturn();
          var row = resArray[0];
          var col = resArray[1];
          this.state.board[row][col] = 2;
          $('#' + row + '-' + col).removeClass("clear");
          $('#' + row + '-' + col).addClass("x");
          this.state.currentPlayer = 1;
          this.state.turnCounter++;
          this.checkWinner(row, col);
        }
      } else {
        if (this.state.board[row][col] === 0 && this.state.winner === 0) {
          // if (this.isSinglePlay) {
          //   var resArray = this.AIturn();
          //   var row = resArray[0];
          //   var col = resArray[1];
          //   this.state.board[row][col] = 2;
          //   $('#' + row + '-' + col).removeClass("clear");
          //   $('#' + row + '-' + col).addClass("x");
          //   this.state.currentPlayer = 1;
          //   this.state.turnCounter++;
          //   this.checkWinner(row, col);
          // } else {
            this.state.board[row][col] = 2;
            $('#' + row + '-' + col).removeClass("clear");
            $('#' + row + '-' + col).addClass("x");
            this.state.currentPlayer = 1;
            this.state.turnCounter++;
            this.checkWinner(row, col);
          // }
        }
      }
      localStorage.setItem("tictactoeState", JSON.stringify(tictactoe.state));
      // console.log("state.board: " + this.state.board);
      // console.log("winner: " + this.winner);
    },

    checkWinner: function(row, col) {
      // Checking process
      if ((this.state.board[row][0] === this.state.board[row][1]) && (this.state.board[row][1] === this.state.board[row][2])) {
        this.state.winner = this.state.board[row][0];
      } else if ((this.state.board[0][col] === this.state.board[1][col]) && (this.state.board[1][col] === this.state.board[2][col])) {
          this.state.winner = this.state.board[0][col];
      } else if((row+col)%2 === 0) {
        if (((this.state.board[0][0] === this.state.board[1][1]) && (this.state.board[1][1] === this.state.board[2][2])) ||
            ((this.state.board[2][0] === this.state.board[1][1]) && (this.state.board[1][1] === this.state.board[0][2]))) {
          this.state.winner = this.state.board[1][1];
        }
      }
      // Winner message
      if (this.state.winner !== 0 || this.state.turnCounter === 9) {
        if (this.state.winner !== 0) {
          this.state.scoreBoard['player'+this.state.winner].score++;
          updateScoreboard();
          $winnerMessage.html('The winner is player ' + this.state.winner + '!').show();
        } else {
          $winnerMessage = $('#winner-message');
          $winnerMessage.html('Draw!').show();
          updateScoreboard();
        }
        $('.ui.modal.small').modal('show');

      }
    },
  };

  initializeGame();
  $('.ui.modal.small').modal('hide');

  $(document).on('click', '.box', function() {
    var clickedId = $(this).attr('id');
    tictactoe.getPosition(clickedId);
  });

  $(document).on('click', '#new-game', function() {
    resetGame();
  });

  $(document).on('click', '#new-game-popUp', function() {
    $('.ui.modal.small').modal('hide');
    resetGame();
  });

  $(document).on('click', '#clear-board', function() {
    tictactoe.state.scoreBoard.player1.score = 0;
    tictactoe.state.scoreBoard.player2.score = 0;
    resetGame();
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
    if (tictactoe.isSinglePlay === true) {
      $('#single-play').removeClass('primary').html('Play with me');
      tictactoe.isSinglePlay = false;
    } else {
      $('#single-play').addClass('primary').html('Play with AI');
      tictactoe.isSinglePlay = true;
    }
    tictactoe.state.scoreBoard.player1.score = 0;
    tictactoe.state.scoreBoard.player2.score = 0;
    resetGame();
  })
})

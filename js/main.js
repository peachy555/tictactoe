// To check
// - Why doesn't .box:hover working
// - How to "remove/hide" background image of .box ('x' and 'o')



$(document).ready(function() {
  $winnerMessage = $('#winner-message');
  $currentScore = $('#current-score');

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
    $(".box").removeClass("x");
    $(".box").removeClass("o");
    $(".box").addClass("clear");
    $winnerMessage.hide();
  }

  var tictactoe = {

    turnCounter: 0,
    currentPlayer: 1,
    winner: 0,
    board: [[0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]],

    getPosition: function(boxId) {
      var row = boxId[0];
      var col = boxId[2];
      this.pushInput(row, col);
    },

    pushInput: function(row, col) {
      if(this.currentPlayer === 1) {
        if (this.board[row][col] === 0) {
          this.board[row][col] = 1;
          $('#' + row + '-' + col).removeClass("clear");
          $('#' + row + '-' + col).addClass("x");
          this.currentPlayer = 2;
        }

      } else {
        if (this.board[row][col] === 0) {
          this.board[row][col] = 2;
          $('#' + row + '-' + col).removeClass("clear");
          $('#' + row + '-' + col).addClass("o");
          this.currentPlayer = 1;
        }
      }

      this.checkWinner(row, col);
      console.log("board: " + this.board);
      console.log("winner: " + this.winner);
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
      if (this.winner !== 0) {
        scoreBoard['player'+this.winner]++;
        updateScoreboard();
        $winnerMessage = $('#winner-message');
        $winnerMessage.show();
        $winnerMessage.html('The winner is player ' + this.winner + '!');

      }
    },
  };

  // $winnerMessage.hide();
  initializeGame();
  updateScoreboard();

  $(document).on('click', '.box', function() {
    var clickedId = $(this).attr('id');
    tictactoe.getPosition(clickedId);
  });

  $(document).on('click', '#new-game', function() {
    initializeGame();
  });




})

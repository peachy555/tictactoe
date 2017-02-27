// Things needed to be fixed/do
// - Shifting of box when data get entered
// - Check why winner message got printed before box .html update


$(document).ready(function() {
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
        this.board[row][col] = 1;
        $('#' + row + '-' + col).html(this.currentPlayer);
        this.currentPlayer = 2;
      } else {
        this.board[row][col] = 2;
        $('#' + row + '-' + col).html(this.currentPlayer);
        this.currentPlayer = 1;
      }

      console.log(this.board);
      this.checkRow(row);
      this.checkCol(col);
      if ((row+col)%2 === 0){
        this.checkDiag();
      }

    },
    checkRow: function(row) {
      if ((this.board[row][0] === this.board[row][1]) && (this.board[row][1] === this.board[row][2])) {
        this.winner = this.board[row][0];
      }

      if (this.winner !== 0) {
        alert('The winner is player ' + this.winner);
      }
    },
    checkCol: function(col) {
      if ((this.board[0][col] === this.board[1][col]) && (this.board[1][col] === this.board[2][col])) {
        this.winner = this.board[0][col];
      }

      if (this.winner !== 0) {
        alert('The winner is player ' + this.winner);
      }
    },
    checkDiag: function() {
      if (((this.board[0][0] === this.board[1][1]) && (this.board[1][1] === this.board[2][2])) ||
          ((this.board[2][0] === this.board[1][1]) && (this.board[1][1] === this.board[0][2]))) {
        this.winner = this.board[1][1];
      }

      if (this.winner !== 0) {
        alert('The winner is player ' + this.winner);
      }
    }
  };



  $(document).on('click', '.box', function() {
    var clickedId = $(this).attr('id');
    tictactoe.getPosition(clickedId);
  });




})

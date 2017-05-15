// To check

// Things left to do
// - Support networked multiplayer
// - Border around logo when selected
// - Clean up and restructure code


// window.firebaseExample = new Firebase('https://docs-examples.firebaseio.com/web/data');

$(document).ready(function() {

  var myFirebaseRef = new Firebase("https://tictactoe-e7931.firebaseio.com/");
  var gameState = myFirebaseRef.child('game').child('state');


  $winnerMessage = $('#winner-message');
  $currentScore = $('#current-score');
  $popUpLogo = $('#popUp-logo');

  var boardSize = 'normal';
  var inputCounter = 1;

  var gameModeBtnToggle = function() {
    if(tictactoe.state.gameMode === 'Single') {
      $('#AI-dropdown').show();
      $('#single-mode').addClass('primary');
      $('#local-mode').removeClass('primary');
      $('#init-single-mode').addClass('primary');
      $('#init-local-mode').removeClass('primary');
    } else {
      $('#AI-dropdown').hide();
      $('#local-mode').addClass('primary');
      $('#single-mode').removeClass('primary');
      $('#init-local-mode').addClass('primary');
      $('#init-single-mode').removeClass('primary');
    }
  }

  var initializeGame = function() {
    var localGame = localStorage.getItem("tictactoeState");
    // Load previous data
    if(localGame){
      tictactoe.state = JSON.parse(localGame);
      for (var row = 0; row < 3; row++) {
        for (var col = 0; col< 3; col++) {
          if (tictactoe.state.board[row][col] === 1) {
            $('#' + row + '-' + col).removeClass("clear");
            $('#' + row + '-' + col).addClass(tictactoe.state.scoreBoard.player1.logo);
          } else if (tictactoe.state.board[row][col] === 2) {
            $('#' + row + '-' + col).removeClass("clear");
            $('#' + row + '-' + col).addClass(tictactoe.state.scoreBoard.player2.logo);
          }
        }
      }
      updateScoreboard();
      // Get new player data
    } else {
      $('#init-game-mode-box').modal('show');
    }
    gameModeBtnToggle();
  }

  // Update score board
  var updateScoreboard = function() {
    $currentScore.html(tictactoe.state.scoreBoard.player1.score + ' - ' + tictactoe.state.scoreBoard.player2.score);
  }

  // Reset game stat
  var resetGame = function() {
    $("#board").fadeOut(800, function() {
      tictactoe.state.turnCounter = 0;
      tictactoe.state.currentPlayer = 1;
      tictactoe.state.winner = 0;
      tictactoe.state.board = [[0, 0, 0],
                               [0, 0, 0],
                               [0, 0, 0]];
        $(".box").removeClass(tictactoe.state.scoreBoard.player1.logo);
        $(".box").removeClass(tictactoe.state.scoreBoard.player2.logo);
        $(".box").removeClass('draw');
        $(".box").addClass("clear");
        $(".popUp-logo").removeClass(tictactoe.state.scoreBoard.player1.logo);
        $(".popUp-logo").removeClass(tictactoe.state.scoreBoard.player2.logo);
        $(".popUp-logo").removeClass('draw');
        $(".popUp-logo").addClass("clear");
        updateScoreboard();
        localStorage.setItem("tictactoeState", JSON.stringify(tictactoe.state));
    });
    $("#board").fadeIn(800);
    gameModeBtnToggle();
  };

  window.tictactoe = {
    state: {
      gameMode: 'Local',
      turnCounter: 0,
      currentPlayer: 1,
      winner: 0,
      board: [[0, 0, 0],
              [0, 0, 0],
              [0, 0, 0]],
      scoreBoard: {
        player1: {
          name: 'Name1',
          score: 0,
          logo: 'o'
        },
        player2: {
          name: 'AI',
          score: 0,
          logo: 'x'
        }
      },
      AImode: 'Greedy',
    },

    getPosition: function(boxId) {
      var row = boxId[0];
      var col = boxId[2];
      // this.pushInput(row, col);
      if(this.state.currentPlayer === 1 && this.state.winner === 0 && this.state.board[row][col] === 0) {
        this.state.board[row][col] = 1;
        $('#' + row + '-' + col).removeClass("clear");
        $('#' + row + '-' + col).addClass(this.state.scoreBoard.player1.logo);
        this.state.currentPlayer = 2;
        this.state.turnCounter++;
        this.checkWinner(row, col);
        if (this.state.gameMode === 'Single' && this.state.winner === 0 && this.state.turnCounter<9) {
          var resArray = this.AIturn();
          var row = resArray[0];
          var col = resArray[1];
          this.state.board[row][col] = 2;
          $('#' + row + '-' + col).removeClass("clear");
          $('#' + row + '-' + col).addClass(this.state.scoreBoard.player2.logo);
          this.state.currentPlayer = 1;
          this.state.turnCounter++;
          this.checkWinner(row, col);
        }
      } else {
        if (this.state.board[row][col] === 0 && this.state.winner === 0) {
            this.state.board[row][col] = 2;
            $('#' + row + '-' + col).removeClass("clear");
            $('#' + row + '-' + col).addClass(this.state.scoreBoard.player2.logo);
            this.state.currentPlayer = 1;
            this.state.turnCounter++;
            this.checkWinner(row, col);
        }
      }
      localStorage.setItem("tictactoeState", JSON.stringify(tictactoe.state));
    },

    AIturn: function() {
      var potentialPick = [];
      for (var row = 0; row < 3; row++) {
        for (var col = 0; col < 3; col++) {
          if (this.state.board[row][col] === 0) {
            potentialPick.push([row, col]);
          }
        }
      }
      if (this.state.AImode === 'Stupid') {
        var my1 = 1;
        var my2 = 1;
        var opponentWin = 1;
      } else if (this.state.AImode === 'Greedy') {
        var my1 = 3;
        var my2 = 100;
        var opponentWin = 80;
      } else if (this.state.AImode === 'PlaySafe') {
        var my1 = 3;
        var my2 = 5;
        var opponentWin = 200;
      }

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
              for (var j = 0; j < my1; j++) {
                potentialPick.push([row,i]);
              }
            }
          }
        }
        if (section.sort().toString() === [0,2,2].toString()) {
          section = [this.state.board[row][0], this.state.board[row][1], this.state.board[row][2]];
          var index = section.indexOf(2);
          for (var i = 0; i < 3; i++) {
            if (i !== index) {
              for (var j = 0; j < my2; j++) {
                potentialPick.push([row,i]);
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
              for (var j = 0; j < my1; j++) {
                potentialPick.push([i,col]);
              }
            }
          }
        }
        section = [this.state.board[0][col], this.state.board[1][col], this.state.board[2][col]];
        if (section.sort().toString() === [0,2,2].toString()) {
          section = [this.state.board[0][col], this.state.board[1][col], this.state.board[2][col]];
          var index = section.indexOf(2);
          for (var i = 0; i < 3; i++) {
            if (i !== index) {
              for (var j = 0; j < my2; j++) {
                potentialPick.push([i,col]);
              }
            }
          }
        }
        if (section.sort().toString() === [0,1,1].toString()) {
          section = [this.state.board[0][col], this.state.board[1][col], this.state.board[2][col]];
          var index = section.indexOf(0);
          for (var j = 0; j < opponentWin; j++) {
            potentialPick.push([index,col]);
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
            for (var j = 0; j < my1; j++) {
              potentialPick.push([i,i]);
            }
          }
        }
      }
      section = [this.state.board[0][0], this.state.board[1][1], this.state.board[2][2]];
      if (section.sort().toString() === [0,2,2].toString()) {
        section = [this.state.board[0][0], this.state.board[1][1], this.state.board[2][2]];
        var index = section.indexOf(2);
        for (var i = 0; i < 3; i++) {
          if (i !== index) {
            for (var j = 0; j < my2; j++) {
              potentialPick.push([i,i]);
            }
          }
        }
      }
      if (section.sort().toString() === [0,1,1].toString()) {
        section = [this.state.board[0][0], this.state.board[1][1], this.state.board[2][2]];
        var index = section.indexOf(0);
        for (var j = 0; j < opponentWin; j++) {
          potentialPick.push([index,index]);
        }
      }
      section = [this.state.board[2][0], this.state.board[1][1], this.state.board[0][2]];
      if (section.sort().toString() === [0,0,2].toString()) {
        section = [this.state.board[2][0], this.state.board[1][1], this.state.board[0][2]];
        var index = section.indexOf(2);
        for (var i = 0; i < 3; i++) {
          if (i !== index) {
            for (var j = 0; j < my1; j++) {
              potentialPick.push([2-i,i]);
            }
          }
        }
      }
      section = [this.state.board[2][0], this.state.board[1][1], this.state.board[0][2]];
      if (section.sort().toString() === [0,0,2].toString()) {
        section = [this.state.board[2][0], this.state.board[1][1], this.state.board[0][2]];
        var index = section.indexOf(2);
        for (var i = 0; i < 3; i++) {
          if (i !== index) {
            for (var j = 0; j < my2; j++) {
              potentialPick.push([2-i,i]);
            }
          }
        }
      }
      if (section.sort().toString() === [0,1,1].toString()) {
        section = [this.state.board[2][0], this.state.board[1][1], this.state.board[0][2]];
        var index = section.indexOf(0);
        for (var j = 0; j < opponentWin; j++) {
          potentialPick.push([2-index,index]);
        }
      }
      var randomIndex = Math.floor(Math.random()*potentialPick.length);
      return potentialPick[randomIndex];
    },

    checkWinner: function(row, col) {
      // Check for potential winner
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
        if (this.state.winner === 1) {
          this.state.scoreBoard.player1.score++;
          updateScoreboard();
          $popUpLogo.removeClass('draw');
          $popUpLogo.removeClass(this.state.scoreBoard.player2.logo);
          $popUpLogo.addClass(this.state.scoreBoard.player1.logo);
          $winnerMessage.html(this.state.scoreBoard.player1.name + ' wins!').show();
        } else if (this.state.winner === 2) {
          this.state.scoreBoard.player2.score++;
          updateScoreboard();
          $popUpLogo.removeClass('draw');
          $popUpLogo.removeClass(this.state.scoreBoard.player1.logo);
          $popUpLogo.addClass(this.state.scoreBoard.player2.logo);
          $winnerMessage.html(this.state.scoreBoard.player2.name + ' wins!').show();
        } else {
          $popUpLogo.removeClass(this.state.scoreBoard.player1.logo);
          $popUpLogo.removeClass(this.state.scoreBoard.player2.logo);
          $popUpLogo.addClass('draw');
          $winnerMessage.html('Draw!').show();
          updateScoreboard();
        }
        $('#popUp-box').modal('show');
      }
    },
  };

  initializeGame();
  var selectedPlayer ='player'+tictactoe.state.currentPlayer;
  gameModeBtnToggle();

  // Click on any empty slot
  $(document).on('click', '.box', function() {
    var clickedId = $(this).attr('id');
    tictactoe.getPosition(clickedId);
  });

  // Inside game mode
  $(document).on('click', '.mode', function() {
    tictactoe.state.gameMode = $(this).html();
    if (tictactoe.state.gameMode === 'Online') {
      gameState.child('gameMode').set('Online');
    }
    tictactoe.state.scoreBoard.player1.score = 0;
    tictactoe.state.scoreBoard.player2.score = 0;
    resetGame();
    $('#init-game-mode-box').modal('hide');
    $('#input-box').modal('show');
    gameModeBtnToggle();
  });

  // init-single-mode clicked
  $(document).on('click', '#init-single-mode', function() {
    tictactoe.state.currentPlayer = 1;
    $('#input-box').modal('show');
  });

  // init-online-mode clicked
  $(document).on('click', '#init-online-mode', function() {
    gameState.update({
      "scoreBoard/gameMode": tictactoe.state.gameMode
    });
    tictactoe.state.currentPlayer = 1;
    $('#input-box').modal('show');
  });

  // init-local-mode clicked
  $(document).on('click', '#init-local-mode', function() {
    tictactoe.state.currentPlayer = 1;
    $('#input-box').modal('show');
    tictactoe.state.currentPlayer = 2;
    $('#input-box').modal('show');
  });

  // Local game mode button
  $(document).on('click', '#mode-button', function() {
    $('#game-mode-box').modal('show');
  });

  // Local new game button
  $(document).on('click', '#new-game', function() {
    resetGame();
  });

  // New game button, in 'winner messave'
  $(document).on('click', '#new-game-popUp', function() {
    $('#popUp-box').modal('hide');
    resetGame();
  });

  // Reset game stat
  $(document).on('click', '#clear-board', function() {
    tictactoe.state.scoreBoard.player1.score = 0;
    tictactoe.state.scoreBoard.player2.score = 0;
    resetGame();
  });

  // Reset user data on localStorage
  $(document).on('click', '#reset-user', function() {
    tictactoe.state.scoreBoard = {
      player1: {
        name: 'Name1',
        score: 0,
        logo: 'o'
      },
      player2: {
        name: 'AI',
        score: 0,
        logo: 'x'
      }
    }
    localStorage.removeItem("tictactoeState");
    tictactoe.state.scoreBoard.player1.score = 0;
    tictactoe.state.scoreBoard.player2.score = 0;
    resetGame();
    $('#init-game-mode-box').modal('show');
  });

  // Change board size
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

  // Choosing logo in "input-box"
  $(document).on('click', '.logo-element', function() {
    var logoName = $(this).attr('value');
    if( $('.logo-element').hasClass('selected') ) {
      $('.logo-element').removeClass('selected');
    }
    $(this).addClass('selected');
    tictactoe.state.scoreBoard['player'+tictactoe.state.currentPlayer].logo = logoName;
  });

  // Selecting AI mode
  $(document).on('click', '#AI-dropdown .each.item', function() {
    tictactoe.state.AImode = $(this).attr('value');
    console.log(tictactoe.state.AImode);
  });


  var getNameLogo = function() {
    tictactoe.state.scoreBoard['player'+tictactoe.state.currentPlayer].name = $('#name-box').val();

    $('#name-box').val('')
    $('#input-box').modal('hide');

    if (tictactoe.state.gameMode === 'Online') {
      // Firebase stuff
      gameState.update({
        "scoreBoard/player1": {
          "name": tictactoe.state.scoreBoard.player1.name,
          "logo": tictactoe.state.scoreBoard.player1.logo
        }
      });
    }

    if (inputCounter<2 && tictactoe.state.gameMode==='Local') {
      tictactoe.state.currentPlayer = 2;
      $('#input-box2').modal('show');
      inputCounter++;
    } else {
      tictactoe.state.currentPlayer = 1;
    }
  }

  // Enter game button in "input-box"
  $(document).on('click', '#enter-game', getNameLogo);

  // Press enter in "input-box"
  $('#input-box').keypress(function(e) {
    if(e.which == 13) {
      getNameLogo();
    }
  });

  // Input box for player2
  var getNameLogo2 = function() {
    tictactoe.state.scoreBoard.player2.name = $('#name-box2').val();
    $('#name-box2').val('')
    $('#input-box2').modal('hide');
    tictactoe.state.currentPlayer = 1;
    inputCounter = 0;
  }

  // Enter game button in "input-box", player2
  $(document).on('click', '#enter-game2', getNameLogo2);

  // Press enter in "input-box", player2
  $('#input-box2').keypress(function(e) {
    if(e.which == 13) {
      getNameLogo2();
    }
  });
});

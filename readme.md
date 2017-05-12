

# Welcome to Tic Tac Toe (by Peach)

https://peachy555.github.io/tictactoe/

## Warning
Online mode is not quite finished (yet).

## General Information
Once you enter game page for the first time, pop up message will ask you to select game mode.
You can either choose:
 * 'Single' to play against AI
 * 'Local' to play with you friend on same page
 * ~~'Online' to play against others~~

New pop up page will ask user to select "tic tac toe" icon
(by directly click on the icon you would like to choose) and name.

The game page will keep track of current game, win tally, and player's information at all time.
All data will have backup stored in `localStorage`, which will be restore after the page was reloaded

Changes to user's information (icon and name) can be made by opening the game in different platform
or run JavaScript code `localStorage.removeItem("tictactoeState")` to remove data in `localStorage`.

On the menu bar below game board (from left to right):
 * New game: to reset current game
 * Toggle to change size of game board
 * Restart!: to reset all game stats including win tally
 * Game Mode!: To re-select game mode user wish to play

# __Enjoy the game!__

## Features
### AI
AI bot used in 'Single' mode was designed based on point-based decision making.
Each coordinates on empty slots will be appointed with points corresponding to how 'important' they are.

In general, section with at least one of AI's mark is more 'important' than
empty section or section with one of opponent mark.
Section where opponent may win with will need to be block of first.

(Note: section in this context means row, column or diagonal)

For simple approach, these marks can be summed through calculation compared with marking scheme.
Then select coordinate with highest mark as AI's 'best' next move.

In my approach to AI's design, instead, I created a long array and
push the possible next coordinates and finally select one randomly
(similar to lottery). This way, AI will still prioritise choosing more 'important'
coordinates, but it will not be definite.

This way, the game have more uncertainties and is possible for player to win against AI.
Difficulty level of AI can be set by changing the marking scheme
and priority for AI's decision.

### localStorage
localStorage is used as backup to restore the game data if the page was refreshed.
All game data is stored inside an object `tictactoe.state`.
Because `localStorage` can only store one string, `tictactoe.state` was stringify to store in `localStorage`
and `parse` back to object (using JSON methods) to restore data.

### Firebase
Firebase is partially implemented into the code, but not fully functional.

## Further Improvements & Issues
* popup page for AI's difficulty can be implement by:
  * having different sets of marking scheme.
  * create event listeners for 'difficulty' buttons and function to
    map the marking scheme with corresponding to difficulty selected.


* Game board will left align when the window is too small (may be something to do with Semantic UI).

* Finish multiplayer (online) mode.

* Display/hide AI dropdown only when the game is on 'Single' mode.

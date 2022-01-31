'use strict';
//Selecting elements -
const player0 = document.querySelector('.player--0');
const player1 = document.querySelector('.player--1');
const score0 = document.getElementById('score--0');
const score1 = document.getElementById('score--1');
const current0 = document.getElementById('current--0');
const current1 = document.getElementById('current--1');
const dice = document.querySelector('.dice');
//Buttons
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

//declaring variables
let score, currentScore, activePlayer, playing;

//Initial Conditions
const init = function () {
  score = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;

  score0.textContent = 0;
  score1.textContent = 0;
  current0.textContent = 0;
  current1.textContent = 0;

  dice.classList.add('hidden');
  player0.classList.add(`player--active`);
  player1.classList.remove(`player--active`);
  player0.classList.remove(`player--winner`);
  player1.classList.remove(`player--winner`);
};

//First initialization
init();

//Switch the player
const switchPlayer = function () {
  currentScore = 0;
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0.classList.toggle(`player--active`);
  player1.classList.toggle(`player--active`);
};

//Rolling Dice Functionality
btnRoll.addEventListener('click', function () {
  if (playing) {
    //1 Generating random dice roll
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    console.log(diceRoll);

    //2 Display Dice
    dice.classList.remove('hidden');
    dice.src = `dice-${diceRoll}.png`;
    //3 Check for rolled 1
    if (diceRoll !== 1) {
      //Add to the Current Score
      currentScore += diceRoll;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
      // current0.textContent = currentScore;
    } else {
      //Switch to next player
      switchPlayer();
    }
  }
});

btnHold.addEventListener('click', function () {
  if (playing) {
    // 1. Add current score
    score[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      score[activePlayer];
    //2. Check if the players score is >= 100;

    if (score[activePlayer] >= 100) {
      //Finish the game
      playing = false;
      dice.classList.add('hidden');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add(`player--winner`);
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove(`player--active`);
    } else {
      //Switch the player
      switchPlayer();
    }
  }
});

//Resetting the Game
btnNew.addEventListener('click', init);


document.addEventListener('DOMContentLoaded', e => {

  const boardSpaces = document.querySelectorAll('.board-space');
  const topOfBoard = boardSpaces[0];
  const arrows = ["&#60;----", "----&#62;", "^^^^^", "&#8744&#8744&#8744&#8744&#8744"]
  const [leftArrow, rightArrow, upArrow, downArrow] = arrows;
  let startedFlag = false;
  let keyToPress = '';
  let intervalId;
  const scoreNum = document.querySelector('#score-num');

  // randomly select which arrow direction to prompt
  const chooseArrow = () => {
    const chosenArrow = Math.floor(Math.random() * arrows.length);
    for (let i = 1; i < boardSpaces.length; i++) {
      boardSpaces[i].innerHTML = '_____';
    }
    topOfBoard.innerHTML = arrows[chosenArrow];

    return chosenArrow;
  };

  // move arrow down board, stopping at end of board
  const moveArrow = (arrowHTML) => {
    let arrowLocation = topOfBoard;
    intervalId = window.setInterval(() => {
      if (arrowLocation != boardSpaces[boardSpaces.length - 1]) {
        arrowLocation.innerHTML = '_____';
        arrowLocation = arrowLocation.parentElement.nextElementSibling.firstElementChild;
        arrowLocation.innerHTML = arrowHTML;
      } else {
        // when the arrow gets to the end of the board, stop moving it 
        // and reset the arrow location to the top for next time (unsure if necessary)
        // also, lower the score by 1
        // begin next arrow
        clearInterval(intervalId);
        intervalId = null;
        arrowLocation = topOfBoard;
        decrementScore();
        startGame();
      }
    }, 150);
  };

  // increase score by 1
  const incrementScore = () => {
    const newScore = parseInt(scoreNum.textContent, 10) + 1;
    scoreNum.textContent = newScore;
  };

  // decrease score by 1
  const decrementScore = () => {
    if (scoreNum.textContent == 0) {
      return;
    } else {
      const newScore = parseInt(scoreNum.textContent, 10) - 1;
      scoreNum.textContent = newScore;
    }
  };

  // choose an arrow, select the appropriate key to check for, call function to move arrow
  const startGame = () => {
    startedFlag = true;

    let chosenArrow = chooseArrow();

    switch (chosenArrow) {
      case 0:
        keyToPress = 'ArrowLeft';
        break;
      case 1:
        keyToPress = 'ArrowRight';
        break;
      case 2:
        keyToPress = 'ArrowUp';
        break;
      case 3:
        keyToPress = 'ArrowDown';

    }
    moveArrow(arrows[chosenArrow]);
  };

  // if key is pressed and game is in play, check if correct key
  // if yes, increase score and select a new arrow
  // if no, decrease score and wait for correct arrow
  const keyboardHandler = () => {
    document.addEventListener('keydown', e => {
      if (startedFlag == true) {
        if (e.key == keyToPress) {
          clearInterval(intervalId);
          incrementScore();
          startGame();
        } else {
          decrementScore();
        }
      }
    });
  };

  // handles clicks on start and stop buttons
  const clickHandler = () => {
    document.addEventListener('click', e => {
      // if start is clicked, change to stop button
      // and start game
      if (e.target.matches('#start')) {
        e.target.textContent = "Stop!";
        e.target.id = "stop";
        startGame();
      } else if (e.target.matches('#stop')) {
        // if stop is clicked, change to start button
        // reset keypress to listen for
        // change started flag to false
        
        e.target.textContent = "Start!";
        e.target.id = "start";
        keyToPress = '';
        startedFlag = false;
        clearInterval(intervalId);
        for (let space of boardSpaces) {
          space.innerHTML = '_____';
        }
        scoreNum.textContent = 0;
      }
    });
  };

  clickHandler();
  keyboardHandler();

});
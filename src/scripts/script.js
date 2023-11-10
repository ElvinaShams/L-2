const wrapper = document.querySelector(".wrapper");
const blocks = document.querySelectorAll(".block");
const restartButton = document.querySelector(".restart");
const user = document.querySelector(".user");
const winner = document.querySelector(".winner");
const buttonFriend = document.getElementById("friend");
const buttonLightBot = document.getElementById("light");
const buttonHardBot = document.getElementById("hard");
const blockButtons = document.querySelector(".radio-buttons");

const array = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const players = {
  x: "X",
  o: "O",
};


let tempArr = [];
let currentPlayer = "";
let isGameRunning = false;
let boardState = Array(9).fill("");
let gameBot = false;

const checkGameOver = () => {
  for (const line of array) {
    if (checkLine(line)) {
      winner.textContent = `Победил: ${currentPlayer}!`;
      return true;
    }
  }
  if (!boardState.includes("")) {
    winner.textContent = "Ничья!!";
    return true;
  }
};

const finishGame = () => {
  isGameRunning = false;
  user.textContent = "";
};

const clickBlock = (event) => {
  const target = event.target;
  if (!isGameRunning) {
    return;
  }
  if (target.textContent) {
    return;
  }
  target.textContent = currentPlayer;
  const blockIndex = target.dataset.id;
  boardState[blockIndex] = currentPlayer;
  if (blockButtons.classList.contains("friend")) {
    if (checkGameOver()) {
      return finishGame();
    }
    
    user.textContent = `Сейчас ходит ${currentPlayer}`;
  
  }
  if (blockButtons.classList.contains("light")) {
    
    if (checkGameOver()) {
      return finishGame();
    }
    currentPlayer = currentPlayer === players.o ? players.x : players.o;
    randomBot();
  }
  if (blockButtons.classList.contains("hard")) {
    validateWinBot();
  }
};

const checkLine = (array) => {
  const [a, b, c] = array;
  const blockA = boardState[a];
  const blockB = boardState[b];
  const blockC = boardState[c];

  if ([blockA, blockB, blockC].includes("")) {
    return false;
  }
  return blockA === blockB && blockB === blockC;
};

const startGame = () => {
  isGameRunning = true;
  blocks.forEach((block) => (block.textContent = ""));
  winner.textContent = "";
  currentPlayer = players.x;
  user.textContent = `Сейчас ходит ${currentPlayer}`;
};

const restartGame = () => {
  finishGame();
  startGame();
  boardState.fill("");
};

const randomBot = () => {
  if (boardState.includes("X") && currentPlayer === players.o) {
    currentPlayer = currentPlayer === players.o ? players.x : players.o;
    user.textContent = `Сейчас ходит ${currentPlayer}`;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === "") {
        tempArr.push(i);
      }
    }
    let randIndexTempArr = Math.floor(Math.random() * tempArr.length);
    let randNull = tempArr[randIndexTempArr];

    makeMove(randNull, "O");

  }

};


function validateWinBot() {
  for (const line of array) {
    const [a, b, c] = line;
    const blockA = boardState[a];
    const blockB = boardState[b];
    const blockC = boardState[c];

    // Проверка выигрыша для "O"
    if (checkWinCondition(blockA, blockB, blockC, "O")) {
      makeMove(c, "O");
      currentPlayer = players.o;
      return;
    } else if (checkWinCondition(blockA, blockC, blockB, "O")) {
      makeMove(b, "O");
      currentPlayer = players.o;
      return;
    } else if (checkWinCondition(blockB, blockC, blockA, "O")) {
      makeMove(a, "O");
      currentPlayer = players.o;
      return;
    }
    else if (checkWinCondition(blockA, blockB, blockC, "X")) {
      makeMove(c, "O");
      return;
    } else if (checkWinCondition(blockA, blockC, blockB, "X")) {
      makeMove(b, "O");
      return;
    } else if (checkWinCondition(blockB, blockC, blockA, "X")) {
      makeMove(a, "O");
      return;
    }
  }
  currentPlayer = players.x;
  if (boardState.includes("X")) {
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === "") {
        tempArr.push(i);
      }
    }
    let randIndexTempArr = Math.floor(Math.random() * tempArr.length);
    let randNull = tempArr[randIndexTempArr];
    makeMove(randNull, "O");
  }

  // Если ни одно из условий не выполнено, изменяем игрока
  currentPlayer = players.x;
  console.log(currentPlayer);
}

function checkWinCondition(cell1, cell2, emptyCell, player) {
  return cell1 === player && cell2 === player && emptyCell === "";
}


// Функция для выполнения хода и обновления доски
function makeMove(cellIndex, player) {
  blocks[cellIndex].textContent = player;
  boardState[cellIndex] = player;
}

const activeFriends = () => {
  blockButtons.classList.add("friend");
  blockButtons.classList.remove("light");
  blockButtons.classList.remove("hard");
  restartGame();
};

const activeLight = () => {
  blockButtons.classList.add("light");
  blockButtons.classList.remove("friend");
  blockButtons.classList.remove("hard");
  restartGame();
};

const activeHard = () => {
  blockButtons.classList.add("hard");
  blockButtons.classList.remove("friend");
  blockButtons.classList.remove("light");
  restartGame();
};

wrapper.addEventListener("click", clickBlock);
restartButton.addEventListener("click", restartGame);
buttonFriend.addEventListener("click", activeFriends);
buttonLightBot.addEventListener("click", activeLight);
buttonHardBot.addEventListener("click", activeHard);

window.addEventListener("load", () => {
  startGame();
  restartGame();
  wrapper.addEventListener("click", clickBlock);
});
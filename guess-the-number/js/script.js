const settingButton = document.querySelector(".settings");
const rangeMenu = document.querySelector(".range");

const restart = document.getElementById("restart");
const numberInput = document.getElementById("number-input");
const buttonForm = document.getElementById("number-submit");
const minValueInput = document.getElementById("min-number-input");
const maxValueInput = document.getElementById("max-number-input");
const wrapperButtons = document.querySelector(".wrapper-buttons");

const answerValue = document.getElementById("answer-count");
const answerItems = document.querySelector(".answer-items");
const prevention = document.querySelector(".prevention");
const helpText = document.querySelector(".help");

// //инициализация переменных максимального и минимального числа, попыток угадывания и случайный выбор числа для угадывания
let guessCount = 0;
let failedAttempts = 0;
let minNumber = 1;
let maxNumber = 100;
let randomNumber =
  Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;

function hidePrevention() {
  setTimeout(function () {
    prevention.textContent = "";
    prevention.classList.add("visually-hidden");
    prevention.style.backgroundColor = "initial";
  }, 2000);
}

rangeMenu.addEventListener("change", () => {
  minNumber = parseInt(minValueInput.value);
  maxNumber = parseInt(maxValueInput.value);

  if (minNumber >= maxNumber) {
    minNumber = maxNumber - 1;
    minValueInput.value = minNumber;
  }

  if (maxNumber <= minNumber) {
    maxNumber = minNumber + 1;
    maxValueInput.value = maxNumber;
  }
});

// Добавьте слушатель для события клика на весь документ
document.addEventListener("click", function (event) {
  // Проверьте, является ли цель клика частью вашего блока
  const isClickInsideBlock = rangeMenu.contains(event.target);
  const isClicksettingButton = settingButton.contains(event.target);

  // Если клик был вне блока, скройте блок
  if (!isClickInsideBlock && !isClicksettingButton) {
    rangeMenu.classList.add("visually-hidden");
  }
});

//Проверяем угадал ли пользователь число
function checkGuess() {
  console.log(numberInput.value);
  const userGuess = Number(numberInput.value);
  help.textContent = "";

  //Если пользователь ввел некорректное число то просим ввести заново
  if (userGuess < minNumber || userGuess > maxNumber) {
    alert(
      "Пожалуйста, введите число в пределах диапазона от " +
        minNumber +
        " до " +
        maxNumber
    );
    numberInput.value = "";
    return;
  }
  //И записываем введенный результат в список неудачных попыток
  guessCount++;
  answerValue.textContent += `${userGuess} `;
  console.log(numberInput.value);
  //Если пользователь угадал то поздравляем его и завершаем игру
  if (userGuess === randomNumber) {
    prevention.classList.remove("visually-hidden");
    prevention.textContent = "Поздравляем! Вы угадали число!";
    prevention.style.backgroundColor = "rgb(12, 190, 12)";
    answerItems.textContent = "";

    hidePrevention();
    setGameOver();
  } else {
    //Если проиграл то уведомляем его об этом и даем информацию о последнем предположении

    prevention.classList.remove("visually-hidden");
    prevention.textContent = "Неправильно!";
    prevention.style.backgroundColor = "red";

    hidePrevention();

    if (userGuess < randomNumber) {
      answerItems.textContent =
        "Последнее предположение было слишком маленьким!";
    } else if (userGuess > randomNumber) {
      answerItems.textContent = "Последнее предположение было слишком большим!";
    }
    //Каждые три неудачные попытки даем пользователю подсказку о том, является ли число четным или нечетным
    if (guessCount % 3 === 0) {
      failedAttempts++;
      if (randomNumber % 2 === 0) {
        help.textContent += ` Загаданное число четное. Это ${failedAttempts} подсказка.`;
      } else {
        help.textContent += ` Загаданное число нечетное. Это ${failedAttempts} подсказка.`;
      }
    }
  }

  numberInput.value = "";
  numberInput.focus();
}

// //Проверку производим по клику на кнопку
buttonForm.addEventListener("click", checkGuess);

//При окончании игры дисейблим поле ввода и кнопку проверки числа
function setGameOver() {
  numberInput.disabled = true;
  buttonForm.disabled = true;
}

settingButton.addEventListener("click", () => {
  rangeMenu.classList.toggle("visually-hidden");
});

//При начале новой игры
restart.addEventListener("click", () => {
  //Сбрасываем попытки, отчищаем поля с прошлой игры
  guessCount = 0;
  const historyBlock = document.querySelectorAll(".history div");
  for (let i = 0; i < historyBlock.length; i++) {
    historyBlock[i].textContent = "";
  }
  //Даем доступ к взаимодействию
  numberInput.disabled = false;
  buttonForm.disabled = false;
  numberInput.value = "";
  numberInput.focus();

  //Загадываем новое число
  randomNumber =
    Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
});

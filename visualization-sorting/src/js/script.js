const DELAY = 1;
let array = null;
const buttonAdd = document.querySelector(".add");
const buttonClear = document.querySelector(".clear");
const input = document.querySelector(".input__arr");
const sortBox = document.querySelectorAll(".sort-box");
const radioButtons = document.querySelector(".radio-buttons");
const sortContainer = document.querySelector('.sort');

let arr = [];
let isCreateArr = false;

const Compare = {
  LESS_THAN: -1,
  BIGGER_THAN: 1,
};

function defaultCompare(a, b) {
  if (a === b) {
    return 0;
  }
  return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN;
}

radioButtons.addEventListener("click", function (event) {
  const target = event.target.id;

  const sortingAlgorithms = ["bubble-radio", "choice-radio", "insertion-radio", "quick-radio", "merge-radio"];

  // Remove all sorting-related classes
  sortingAlgorithms.forEach((algorithm) => {
    radioButtons.classList.remove(algorithm);
  });

  // Add the selected algorithm class
  if (sortingAlgorithms.includes(target)) {
    radioButtons.classList.add(target);
  }

  console.log(radioButtons);
  console.log(target);
});

// Функция задержки
const delay = async (ms) =>
  await new Promise((resolve) => setTimeout(resolve, ms));

// Класс колонки
class Column {
  _number = 0;
  _less = false;
  _larger = false;
  _timerFlash = null;
  constructor(container, number) {
    // Создаем новую колонку
    (this.column = document.createElement("div")),
      (this.line = document.createElement("div")),
      (this.lineValue = document.createElement("div")),
      (this.infoNumber = document.createElement("span"));

    this.column.classList.add("chart-column");
    this.line.classList.add("chart-column-line");
    this.lineValue.classList.add("chart-column-value");
    this.infoNumber.classList.add("chart-column-number");

    this.number = number;

    this.line.append(this.lineValue);
    this.column.append(this.line);
    this.column.append(this.infoNumber);
    container.append(this.column);
  }

  // Установка статуса larger/less
  setStatus(status) {
    this.resetStatus();
    this.column.classList.add(status);
    if (status == "larger") this.flash();
  }

  // Сброс статусов
  resetStatus() {
    this.column.classList.remove("current");
    this.column.classList.remove("larger");
    this.column.classList.remove("less");
  }

  // Вспышка
  flash() {
    this.column.classList.remove("flash");
    clearTimeout(this._timerFlash);
    this.column.classList.add("flash");
    this._timerFlash = setTimeout(() => {
      this.column.classList.remove("flash");
    }, 1000);
  }

  // Установка номера
  set number(value) {
    this._number = value;
    this.lineValue.style.height = value + "%";
    if (array.length - 1 <= 40) {
      this.infoNumber.textContent = this.number;
    }
    if (value >= 100) {
      this.lineValue.style.height = 100 + "%";
    }
  }

  // Получение номера
  get number() {
    return this._number;
  }
}

function createSortBox(container, sortFunction) {
  // Создаем элементы контейнера
  const chartBox = document.createElement("div"),
    infoBox = document.createElement("div"),
    leftInfo = document.createElement("div"),
    startBtn = document.createElement("button"),
    iterations = document.createElement("div"),
    iterationsCaption = document.createElement("span"),
    iterationsValue = document.createElement("span"),
    time = document.createElement("div"),
    timeCaption = document.createElement("span"),
    timeValue = document.createElement("span");

  // Добавляем классы
  infoBox.classList.add("info-box");
  chartBox.classList.add("chart-box");
  leftInfo.classList.add("left-info");
  startBtn.classList.add("start-btn");
  iterations.classList.add("iterations", "info");
  iterationsCaption.classList.add("caption");
  iterationsValue.classList.add("value");
  time.classList.add("time", "info");
  timeCaption.classList.add("caption");
  timeValue.classList.add("value");

  // Добавляем текст
  iterationsCaption.textContent = "Итераций:";
  iterationsValue.textContent = "0";
  timeCaption.textContent = "Время сортировки:";
  timeValue.textContent = "0";
  startBtn.textContent = "Старт";

  // Добавляем элементы в DOM
  iterations.append(iterationsCaption);
  iterations.append(iterationsValue);
  leftInfo.append(startBtn);
  leftInfo.append(iterations);
  infoBox.append(leftInfo);
  time.append(timeCaption);
  time.append(timeValue);
  infoBox.append(time);
  container.append(infoBox);
  container.append(chartBox);

  const columns = [];
  // Настраиваем сетку для графика под нужное кол-во
  chartBox.setAttribute(
    "style",
    `grid-template-columns: repeat(${array.length}, 1fr);`
  );

  // Добавление колонок
  array.forEach((number) => {
    columns.push(new Column(chartBox, Number(number)));
  });

  // Запуск выполнения
  startBtn.addEventListener("click", function () {
// Передаем в колбек-функцию параметры
    startBtn.disabled = true;
    sortFunction(columns, { iterationsValue, timeValue });
  });
}

// Финал
function finishFlash(columns) {
  for (const column of columns) {
    column.flash();
  }
}

buttonAdd.addEventListener("click", createArr);
buttonClear.addEventListener("click", clearArr);

function createArr() {
  let inputVal = document.querySelector(".input__arr").value;
  if (isCreateArr) {
    return;
  }
  isCreateArr = true;

  arr = inputVal.split(",");
  array = arr;

  inputVal = "";

  if (radioButtons.classList.contains("bubble-radio")) {
    document.getElementById('bubble').classList.add('active');
    sortBubble();
  }
  if (radioButtons.classList.contains("choice-radio")) {
    document.getElementById('choice').classList.add('active');
    sortChoice();
    
  }
  if (radioButtons.classList.contains("insertion-radio")) {
    document.getElementById('insertion').classList.add('active');
    sortInsertion();

  }
  if (radioButtons.classList.contains("quick-radio")) {
    document.getElementById('quick').classList.add('active');
    sortQuick();

  }
  if (radioButtons.classList.contains("merge-radio")) {
    document.getElementById('merge').classList.add('active');
    sortMerge();

  }

  input.value = "";
}

function clearArr() {
  input.value = "";
  isCreateArr = false;
  arr.slice(0, arr.length);
  array.slice(0, array.length);
  sortBox.forEach((sort) => {sort.innerHTML = "";
sort.classList.remove('active')});
}

function sortBubble() {
  return createSortBox(
    document.getElementById("bubble"),
    async function (columns, { iterationsValue, timeValue }) {
      let startTime = Date.now();

      let interval = setInterval(function () {
        var elapsedTime = Date.now() - startTime;
        timeValue.textContent = (elapsedTime / 1000).toFixed(3);
      }, 100);

      for (let j = columns.length - 1; j > 0; j--) {
        for (let i = 0; i < j; i++) {
          const A = columns[i],
            B = columns[i + 1];

          A.setStatus("current");
          B.setStatus("current");

          // Задержка
          await delay(DELAY / 2);
          if (A.number > B.number) {
            // Меняем местами
            const temp = A.number;
            A.number = B.number;
            B.number = temp;

            B.setStatus("larger");
            A.setStatus("less");
          } else {
            A.resetStatus();
            B.resetStatus();
          }

          // Кол-во итераций
          iterationsValue.textContent++;

          // Задержка
          await delay(DELAY);
        }
      }
      finishFlash(columns);
      clearInterval(interval);
    }
  );
}


function sortChoice(){
    return         createSortBox(
      document.getElementById("choice"),
      async function (columns, { iterationsValue, timeValue }) {
        let startTime = Date.now();

        let interval = setInterval(function () {
          var elapsedTime = Date.now() - startTime;
          timeValue.textContent = (elapsedTime / 1000).toFixed(3);
        }, 100);

        for (let i = 0, l = columns.length, k = l - 1; i < k; i++) {
          let indexMin = i;
          columns[i].setStatus("current");
          for (let j = i + 1; j < l; j++) {
            columns[j].setStatus("current");

            // Задержка
            await delay(DELAY / 4);
            columns[j].resetStatus();
            if (columns[indexMin].number > columns[j].number) {
              columns[indexMin].resetStatus();
              indexMin = j;
              columns[indexMin].setStatus("less");
              columns[i].setStatus("current");
            }

            // Кол-во итераций
            iterationsValue.textContent++;
          }
          await delay(DELAY / 4);
          if (indexMin !== i) {
            columns[i].resetStatus();
            columns[indexMin].setStatus("larger");
            [columns[i].number, columns[indexMin].number] = [
              columns[indexMin].number,
              columns[i].number,
            ];
          }
          columns[indexMin].resetStatus();

          // Задержка
          await delay(DELAY);
          columns[i].resetStatus();
          columns[indexMin].resetStatus();
        }
        finishFlash(columns);
        clearInterval(interval);
      }
    );
}

function sortInsertion(){
    return        createSortBox(
      document.getElementById("insertion"),
      async function (columns, { iterationsValue, timeValue }) {
        let startTime = Date.now();

        let interval = setInterval(function () {
          var elapsedTime = Date.now() - startTime;
          timeValue.textContent = (elapsedTime / 1000).toFixed(3);
        }, 100);

        for (let i = 1, l = columns.length; i < l; i++) {
          let key = columns[i].number;
          let j = i - 1;

          columns[i].setStatus("current");

          // Задержка
          await delay(DELAY / 2);

          while (j >= 0 && columns[j].number > key) {
            columns[j + 1].number = columns[j].number;
            columns[j + 1].setStatus("larger");
            columns[j].setStatus("less");

            // Задержка
            await delay(DELAY);

            columns[j + 1].resetStatus();
            columns[j].resetStatus();

            j--;

            // Кол-во итераций
            iterationsValue.textContent++;
          }

          columns[j + 1].number = key;

          // Задержка
          await delay(DELAY);

          columns[i].resetStatus();
        }

        finishFlash(columns);
        clearInterval(interval);
      }
    );
}

function sortQuick(){
    return     createSortBox(
      document.getElementById("quick"),
      async function quicksort(columns, { iterationsValue, timeValue }) {
        async function partition(low, high) {
          const pivot = columns[high];
          let i = low - 1;

          for (let j = low; j < high; j++) {
            columns[j].setStatus("current");
            pivot.setStatus("pivot");

            // Delay
            await delay(DELAY / 2);

            if (columns[j].number < pivot.number) {
              i++;

              // Swap
              const temp = columns[i].number;
              columns[i].number = columns[j].number;
              columns[j].number = temp;

              columns[i].setStatus("less");
              columns[j].setStatus("larger");
            } else {
              columns[j].resetStatus();
            }

            // Iterations count
            iterationsValue.textContent++;

            // Delay
            await delay(DELAY);
          }

          // Swap pivot with the element at (i + 1)
          const temp = columns[i + 1].number;
          columns[i + 1].number = pivot.number;
          pivot.number = temp;

          columns[i + 1].resetStatus();
          pivot.resetStatus();

          // Delay
          await delay(DELAY);

          return i + 1;
        }

        async function quicksortRecursive(low, high) {
          if (low < high) {
            const partitionIndex = await partition(low, high);

            await quicksortRecursive(low, partitionIndex - 1);
            await quicksortRecursive(partitionIndex + 1, high);
          }
        }

        let startTime = Date.now();

        let interval = setInterval(function () {
          var elapsedTime = Date.now() - startTime;
          timeValue.textContent = (elapsedTime / 1000).toFixed(3);
        }, 100);

        await quicksortRecursive(0, columns.length - 1);

        finishFlash(columns);
        clearInterval(interval);
      }
    );

}

function sortMerge(){
    return      createSortBox(
            document.getElementById("merge"),
            async function mergeSort(columns, { iterationsValue, timeValue }) {
              async function merge(left, middle, right) {
                const n1 = middle - left + 1;
                const n2 = right - middle;
      
                const leftArray = [];
                const rightArray = [];
      
                for (let i = 0; i < n1; i++) {
                  leftArray[i] = columns[left + i].number;
                }
      
                for (let j = 0; j < n2; j++) {
                  rightArray[j] = columns[middle + 1 + j].number;
                }
      
                let i = 0,
                  j = 0,
                  k = left;
      
                while (i < n1 && j < n2) {
                  columns[left + i].setStatus("current");
                  columns[middle + 1 + j].setStatus("current");
      
                  // Delay
                  await delay(DELAY / 2);
      
                  if (leftArray[i] <= rightArray[j]) {
                    columns[k].number = leftArray[i];
                    columns[k].setStatus("less");
                    i++;
                  } else {
                    columns[k].number = rightArray[j];
                    columns[k].setStatus("larger");
                    j++;
                  }
      
                  // Iterations count
                  iterationsValue.textContent++;
      
                  // Delay
                  await delay(DELAY);
                  columns[k].resetStatus();
                  k++;
                }
      
                while (i < n1) {
                  columns[k].number = leftArray[i];
                  columns[k].setStatus("less");
                  // Iterations count
                  iterationsValue.textContent++;
      
                  // Delay
                  await delay(DELAY);
                  columns[k].resetStatus();
                  i++;
                  k++;
                }
      
                while (j < n2) {
                  columns[k].number = rightArray[j];
                  columns[k].setStatus("larger");
                  // Iterations count
                  iterationsValue.textContent++;
      
                  // Delay
                  await delay(DELAY);
                  columns[k].resetStatus();
                  j++;
                  k++;
                }
              }
      
              async function mergeSortRecursive(left, right) {
                if (left < right) {
                  const middle = Math.floor((left + right) / 2);
      
                  await mergeSortRecursive(left, middle);
                  await mergeSortRecursive(middle + 1, right);
      
                  await merge(left, middle, right);
                }
              }
      
              let startTime = Date.now();
      
              let interval = setInterval(function () {
                var elapsedTime = Date.now() - startTime;
                timeValue.textContent = (elapsedTime / 1000).toFixed(3);
              }, 100);
      
              await mergeSortRecursive(0, columns.length - 1);
      
              finishFlash(columns);
              clearInterval(interval);
            }
          );
}
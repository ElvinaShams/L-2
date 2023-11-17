const blockList = document.querySelector(".wrapper__list");
const productList = blockList.querySelector(".product__list");
const inputNameProduct = document.getElementById("product-name");
const filterBlock = document.querySelector(".filter");
const addProductButton = blockList.querySelector(".add-product");
const clearButton = document.querySelector(".clear");
const clearList = filterBlock.querySelector(".clear__list");
const itemProduct = document.querySelector(".item");
const inputKkalProduct = document.getElementById("product-kkal");
const itemsProduct = document.querySelectorAll(".item");
const user = document.querySelector(".user");
const age = user.querySelector(".age__input");
const weight = user.querySelector(".weight__input");
const height = user.querySelector(".height__input");
const gender = user.querySelector(".gender");

const addKkal = document.querySelector(".check__kkal");
const kkalDay = document.querySelector(".value__kkal");

// график
const chartMarker = document.querySelector(".chart__marker");
let Circ_points = document.querySelector("#Circ_points");
let points = document.querySelector("#points");
let txt = document.querySelector("#txt1");

const calculateKkalWoman = (weight, height, age) => {
  return 655.1 + 9.563 * weight + 1.85 * height - 4.676 * age;
};

const calculateKkalMan = (weight, height, age) => {
  return 66.5 + 13.75 * weight + 5.003 * height - 6.775 * age;
};

let KkalDayTotal = 0;
let normalKkalDay = 0;
let formData = [];
let defaultData = [];

const createProduct = (name, kkal) => {
  let listItem = document.createElement("li");
  listItem.classList.add("item");

  listItem.innerHTML =
    '<span class="product-name">' +
    name +
    '</span> - <span class="product-value">' +
    kkal +
    "</span> kkal";

  productList.appendChild(listItem);

  listItem.addEventListener("click", function () {
    let productNameElement = this.querySelector(".product-name");
    this.remove();
    
    formData = deleteProduct(formData, productNameElement);
    defaultData = deleteProduct(defaultData, productNameElement);

    productList.innerHTML = "";
    for (obj of formData) {
      createProduct(obj.name, obj.kkal);
    }
    calculateTotalKkal();
  });
};

function deleteProduct(arr,productNameElement) {
return arr.filter(
  (obj) => obj.name !== productNameElement.textContent
);
}


const addProduct = () => {
  if (inputNameProduct.value && inputKkalProduct.value) {
    let user = {};
    user.name = inputNameProduct.value;
    user.kkal = inputKkalProduct.value;
    formData.push(user);
    createProduct(user.name, user.kkal);
    defaultData = [...formData];
    // Очищаем поле инпут
    inputNameProduct.value = "";
    inputKkalProduct.value = "";
    calculateTotalKkal();
  } else {
    alert("Введите название продукта и значения ккал.");
  }
};

const sortedMaxArray = (users) => {
  // Результат выполнения этого кода будет отсортированным массивом объектов users сначала по возрасту (по возрастанию),
  // а затем по имени (в алфавитном порядке внутри одинаковых возрастов).
  return users.sort((a, b) => {
    // Сначала сравниваем возраст
    if (a.kkal !== b.kkal) {
      return a.kkal - b.kkal;
    }
    // Если возраст одинаков, сравниваем имена по алфавиту
    return a.name.localeCompare(b.name);
  });
};

const sortedMinArray = (users) => {
  return users.sort((a, b) => {
    // Сначала сравниваем возраст
    if (a.kkal !== b.kkal) {
      return b.kkal - a.kkal;
    }
    // Если возраст одинаков, сравниваем имена по алфавиту
    return a.name.localeCompare(b.name);
  });
};

const sortedName = (users) => {
  return users.sort((a, b) => a.name.localeCompare(b.name));
};

function calculateKkalDay() {
  let totalKkal = 0;
  if (age.value && weight.value && height.value) {
    user.classList.contains("woman")
      ? (totalKkal = calculateKkalWoman(weight.value, height.value, age.value))
      : (totalKkal = calculateKkalMan(weight.value, height.value, age.value));
    normalKkalDay = Math.floor(totalKkal);
    kkalDay.textContent = `${normalKkalDay} kkal`;
   

  }
  calculateTotalKkal();
  saveKkal();
};

const calculateTotalKkal = () => {
  let sum = 0;
  for (let i = 0; i < productList.children.length; i++) {
    const kkal_value = productList.children[i].querySelector(".product-value");
    if (kkal_value) {
      const value = Number(kkal_value.textContent);
      sum += value;
    }
  }
  KkalDayTotal = sum;
  pointKkal(sum);
};

gender.addEventListener("click", function (event) {
  const target = event.target;
  if (target.classList.contains("woman")) {
    user.classList.add("woman");
    user.classList.remove("man");
  }
  if (target.classList.contains("man")) {
    user.classList.add("man");
    user.classList.remove("woman");
  }
});

addProductButton.addEventListener("click", addProduct);
addKkal.addEventListener("click", calculateKkalDay);

clearList.addEventListener("click", () => {
  productList.innerHTML = "";
  formData.splice(0, formData.length);
  defaultData.splice(0, defaultData.length);
  kkalDay.textContent = '';
  pointKkal(0);
  localStorage.removeItem("calculateKkal");

});

function pointKkal(value) {
  if (normalKkalDay) {
    let valueKkal = Math.floor((value / normalKkalDay) * 100);
    Circ_points.setAttribute("stroke-dashoffset", "500" - 5 * valueKkal);

    if (value < normalKkalDay) {
      Circ_points.setAttribute("stroke", "yellow");
    }

    if (value == normalKkalDay) {
      Circ_points.setAttribute("stroke", "green");
    }

    if (value > normalKkalDay) {
      Circ_points.setAttribute("stroke", "red");
      alert("Хватит переедать!");
    }
    txt.innerHTML = `${value} Kkal`;
  } else {
    alert("Введите ваши параметры. (Пол, возраст, вес, рост)");
  }
}

function filterItems() {
  filterBlock.addEventListener("change", function (event) {
    const target = event.target.value;

    productList.innerHTML = "";
    let array;
    if (target === "max-kkal") {
      array = sortedMaxArray(formData);
    }

    if (target === "min-kkal") {
      array = sortedMinArray(formData);
    }

    if (target === "name") {
      array = sortedName(formData);
    }

    if (target === "default") {
      array = defaultData;
    }

    for (obj of array) {
      createProduct(obj.name, obj.kkal);
    }
  });
}

function saveKkal() {
  const calculateState = {
    KkalDayTotal: KkalDayTotal,
    formData: formData,
    normalKkalDay: normalKkalDay,
    defaultData:defaultData,
  };

  localStorage.setItem("calculateKkal", JSON.stringify(calculateState));
}

function loadKkal() {
    const savedKkal = localStorage.getItem("calculateKkal");
    if (savedKkal) {
        const calculateState = JSON.parse(savedKkal);
        KkalDayTotal = calculateState.KkalDayTotal;
        formData = calculateState.formData;
        normalKkalDay = calculateState.normalKkalDay;
        defaultData = calculateState.defaultData;
    } 
}

window.onload = function() {
  loadKkal();
  for (obj of formData) {
    createProduct(obj.name, obj.kkal);
  }
if(KkalDayTotal){
  pointKkal(KkalDayTotal);
}
 
  kkalDay.textContent = `${normalKkalDay} kkal`;
};

filterItems();

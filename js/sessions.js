const $ = document;
const form = $.querySelector("#sessions-form");
const sessionNameElem = $.querySelector("#session-name-input");
const sessionTimeElem = $.querySelector("#session-time-input");
const sessionPriceElem = $.querySelector("#session-price-input");
const sessionCatElem = $.querySelector(".session-dropdown-text");

/* ! ------------------------ Events ------------------------ ! */
window.addEventListener("load", loadSessions);

sessionNameElem.addEventListener("input", () => {
  validityState(sessionNameElem.value, 2) ? validMessage("name") : invalidMessage("name");
});
sessionTimeElem.addEventListener("input", () => {
  validityState(sessionTimeElem.value, 5) ? validMessage("time") : invalidMessage("time");
});
sessionPriceElem.addEventListener("input", () => {
  validityState(sessionPriceElem.value, 0, true) ? validMessage("price") : invalidMessage("price");
});

$.querySelector(".session-dropdown-box").addEventListener("click", openDropDownMenu);

/* ! ------------------------ Functions ------------------------ ! */
function submitNewSession(event) {
  event.preventDefault();
  evaluateInputs();
}

function evaluateInputs() {
  let isNameValid = validityState(sessionNameElem.value, 2);
  let isTimeValid = validityState(sessionTimeElem.value, 5);
  let isPriceValid = validityState(sessionPriceElem.value, 0, true);

  isNameValid ? validMessage("name") : invalidMessage("name");
  isTimeValid ? validMessage("time") : invalidMessage("time");
  isPriceValid ? validMessage("price") : invalidMessage("price");

  if (isNameValid && isTimeValid && isPriceValid) {
    addNewSession();
  }
}

function validityState(inputElemValue, minLength, isNumber = false) {
  if (inputElemValue.length < minLength) {
    return false;
  } else if (isNumber) {
    let inputNum = Number(inputElemValue);
    if (isNaN(inputNum) || inputNum < 0) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
}

function validMessage(inputName) {
  let messageElem = $.querySelector(`.session-${inputName}-message`);
  let borderElem = $.querySelector(`.session-${inputName}-group`);
  messageElem.innerText = `Session ${inputName} is valid`;
  messageElem.setAttribute("class", `message valid-message session-${inputName}-message`);
  borderElem.setAttribute("class", `input-group valid session-${inputName}-group`);
}

function invalidMessage(inputName) {
  let messageElem = $.querySelector(`.session-${inputName}-message`);
  let borderElem = $.querySelector(`.session-${inputName}-group`);
  messageElem.innerText = `Session ${inputName} is invalid!`;
  messageElem.setAttribute("class", `message invalid-message session-${inputName}-message`);
  borderElem.setAttribute("class", `input-group invalid session-${inputName}-group`);
}

function clearInputValue() {
  $.querySelectorAll(".form-input").forEach((input) => {
    input.value = "";
  });
}

// function clearInputValue(inputElem){
//     validityState(inputElem.value) ? validMessage("name") : invalidMessage("name")
// }

function addNewSession() {
  let isFree;
  console.log(sessionPriceElem.value);
  sessionPriceElem.value == 0 ? (isFree = true) : (isFree = false);
  let sessionObj = {
    title: sessionNameElem.value,
    time: sessionTimeElem.value,
    isFree: isFree,
    course: sessionCatElem.innerText,
  };
  console.log(sessionObj);
  fetch(`http://localhost:3000/api/sessions`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(sessionObj),
  })
    .then((res) => res.json())
    .then(() => {
      clearInputValue();
      loadSessions();
    });
}

function openDropDownMenu() {
  let DropDownUl = $.querySelector(".session-dropdown-menu-box");
  if (DropDownUl.classList.contains("active")) {
    DropDownUl.classList.remove("active");
  } else {
    DropDownUl.classList.add("active");
  }
  $.querySelectorAll(".session-dropdown-menu-item").forEach((dropDownMenuItem) => {
    dropDownMenuItem.addEventListener("click", () => selectDropDownMenu(dropDownMenuItem.innerText));
  });
}

function selectDropDownMenu(name) {
  $.querySelector(".session-dropdown-text").innerText = name;
}

function loadSessions() {
  fetch(`http://localhost:3000/api/sessions`)
    .then((res) => res.json())
    .then((data) => {
      let sessionArray = data;
      $.querySelector(".sessions").innerHTML = "";
      sessionArray.forEach((sessionObj) => createSessionBox(sessionObj));
    });
}

function createSessionBox(sessionObj) {
  let paymentStatus;
  sessionObj.isFree ? (paymentStatus = "free") : (paymentStatus = "Payment required");
  $.querySelector(".sessions").insertAdjacentHTML(
    "beforeend",
    `
    <div class="session-box">
    <div>
        <h1 class="session-name-title">${sessionObj.title}</h1>
        <span class="session-category">${sessionObj.course}</span>
    </div>
    <div>
        <span class="session-price-badge">${paymentStatus}</span>
        <span class="session-time">${sessionObj.time}</span>
    </div>
    <span class="delete-session" onclick="openDeleteModal('${sessionObj._id}')">x</span>
</div>
    `,
  );
}

function openDeleteModal(id) {
  $.querySelector(".modal-container").classList.add("visible");
  $.querySelector(".delete-modal").classList.remove("modal-box");
  window.addEventListener("keyup", (e) => e.keyCode === 27 && closeDeleteModal());
  $.querySelector(".unaccept-btn").addEventListener("click", closeDeleteModal);
  $.querySelector(".accept-btn").addEventListener("click", () => {
    closeDeleteModal();
    deleteSession(id);
  });
}

function closeDeleteModal() {
  $.querySelector(".modal-container").classList.remove("visible");
  $.querySelector(".delete-modal").classList.add("modal-box");
}

function deleteSession(id) {
  fetch(`http://localhost:3000/api/sessions/${id}`, {
    method: "DELETE",
  }).then(() => loadSessions());
}

const $ = document;
const defaultProfileUrl = "content/img/profile/banana.png";
const usenameInput = $.querySelector("#username-input");
const firstnameInput = $.querySelector("#firstname-input");
const lastnameInput = $.querySelector("#lastname-input");

/* ! ------------------------------- events ------------------------------ ! */
document.querySelector(".form-register").addEventListener("submit", validateRegister);

/* ! ------------------------------- functions ------------------------------ ! */

async function validateRegister(e) {
  e.preventDefault();

  let validateFirstname = validateInputValue(
    firstnameInput,
    "firstname",
    3,
    true,
    "Firstname is valid!",
    "Firstname must be at least 3 character & Does not incluse special characters!",
  );
  let validateLastname = validateInputValue(
    lastnameInput,
    "lastname",
    3,
    true,
    "Lastname is valid!",
    "Lastname must be at least 3 character & Does not incluse special characters!",
  );

  await isUsernameUnique(usenameInput.value)
    .then(() => {
      let validateUsename = validateInputValue(
        usenameInput,
        "username",
        6,
        false,
        "Username is valid!",
        "Username must be at least 6 character!",
      );

      if (validateUsename && validateFirstname && validateLastname) {
        let newUserInfo = {
          firstName: firstnameInput.value,
          lastName: lastnameInput.value,
          userName: usenameInput.value,
          profile: "content/img/profile/banana.png",
        };
        registerNewUser(newUserInfo);
        $.querySelector(".success-register-modal").style.display = "block";
      }
    })
    .catch(() => {
      unUniqueUsername();
    });
}

function registerNewUser(newUserObject) {
  fetch("http://localhost:3000/api/users/", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(newUserObject),
  });
}

function warning(elemName, isvalid, message) {
  let warningElem = $.querySelector(`.${elemName}-massage`);
  warningElem.innerText = message;
  if (isvalid) {
    warningElem.setAttribute("class", `message valid-message ${elemName}-massage`);
  } else {
    warningElem.setAttribute("class", `message invalid-message ${elemName}-massage`);
  }
}

function validateInputValue(inputElem, elemName, minLength, isExcludeSpecialCharacter, validMessage, invalidMessage) {
  let validation = valiadeItem(inputElem, minLength, isExcludeSpecialCharacter);
  if (validation) {
    warning(elemName, validation, validMessage);
  } else {
    warning(elemName, validation, invalidMessage);
  }
  return validation;
}

function valiadeItem(inputElem, minLength = 3, isExcludeSpecialCharacter = false) {
  let inputValue = inputElem.value;
  let specialCharacter = /[^a-zA-Z0-9 ]/g;
  if (inputValue.length < minLength) {
    return false;
  } else if (isExcludeSpecialCharacter) {
    if (specialCharacter.test(inputValue)) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
}

function isUsernameUnique(username) {
  let isUnique = new Promise((resolve, reject) => {
    fetch("http://localhost:3000/api/users/")
      .then((res) => res.json())
      .then((data) => {
        let userArrayInfo = data;
        userArrayInfo.forEach((user) => {
          if (user.userName === username) {
            return reject();
          }
        });
        return resolve();
      });
  });

  return isUnique;
}

function unUniqueUsername() {
  let usernameMessage = $.querySelector(".username-massage");
  usernameMessage.innerText = `Sorry This username is already token!`;
  usernameMessage.setAttribute("class", "message invalid-message username-massage");
}

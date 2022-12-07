let $ = document;
const usernameInput = $.querySelector("#username-input");
const passwordInput = $.querySelector("#password-input");
const form = $.querySelector(".form-login");
const makePasswordVisibleIcon = $.querySelector(".input-group-icon");
let isPasswordVisible = false;

/* ! ---------------------------------- Events ---------------------------------- ! */
form.addEventListener("submit", validateInfo);

/* ! ---------------------------------- Functions ---------------------------------- ! */
function validateInfo(e) {
  e.preventDefault();
  fetch(`http://localhost:3000/api/admins`)
    .then((res) => res.json())
    .then((data) => trustInformation(data));
}

function changePasswordVisibility() {
  if (isPasswordVisible) {
    passwordInput.setAttribute("type", "password");
    isPasswordVisible = false;
  } else {
    passwordInput.setAttribute("type", "text");
    isPasswordVisible = true;
  }
}

function trustInformation(userObj) {
  let username = usernameInput.value;
  let password = passwordInput.value;
  let isUsernameExists = false;
  userObj.forEach((user, index) => {
    if (user.userName === username) {
      isUsernameExists = true;
      if (user.password === password) {
        return loginSuccessfully(userObj, index);
      } else {
        return passworsDoesNotMatch();
      }
    }
  });

  isUsernameExists || usernameDoesNotExists();
}

function loginSuccessfully(userObj, index) {
  clearUsernameAndPasswordMessage();
  setCookie(userObj[index]._id, 1);
}

function passworsDoesNotMatch() {
  clearUsernameAndPasswordMessage();
  $.querySelector(".password-message").innerText = "Incorrect Password!";
}

function usernameDoesNotExists() {
  clearUsernameAndPasswordMessage();
  $.querySelector(".username-message").innerText = "Username doesn't exists!";
}

function clearUsernameAndPasswordMessage() {
  $.querySelector(".username-message").innerHTML = "";
  $.querySelector(".password-message").innerHTML = "";
}

// function setCookies(key, value, expiresDay) {
//     let cookieExpires = new Date();
//     cookieExpires.setTime(
//       cookieExpires.getTime() + 1000 * 60 * 60 * 24 * Number(expiresDay),
//     );
//     document.cookie = `${key}=${value};path=/;expires=${cookieExpires}`;
//   }

function setCookie(adminId, expiresDay) {
  let d = new Date();
  d.setTime(d.getTime() + 1000 * 3600 * 24 * expiresDay);
  let expires = d.toUTCString();
  document.cookie = `userId = ${adminId}; path= /;  expires= ${expires}; SameSite=None; Secure`;
}

let cookie = document.cookie.split(";");
console.log(cookie);

let mainCookiesArray = document.cookie.split("; ");
let isUserIdAvailable = false;
let userId;

mainCookiesArray.forEach((cookie) => {
  if (cookie.includes("user_Id")) {
    userId = cookie.replace("user_Id=", "");
    isUserIdAvailable = true;
  }
});

isUserIdAvailable ? checkUserId(userId) : redirectToLoginPage();

function checkUserId(userId) {
  fetch(`http://localhost:3000/api/admins/${userId}`).then((res) => {
    if (res.status === 200) {
      //   location.href = "../panel-users.html";
      return;
    } else {
      redirectToLoginPage();
    }
  });
}

function redirectToLoginPage() {
  let locationNow = location.href;
  if (locationNow.includes("login.html")) {
    location.reload();
  } else {
    location.href = "../login.html";
  }
}

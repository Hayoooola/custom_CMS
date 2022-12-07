const $ = document;
const usersInfoContainer = $.querySelector(".users-wrap");
const modalContainer = $.querySelector(".modal-container");
const editModal = $.querySelector(".edit-modal");
const deleteModal = $.querySelector(".delete-modal");

/* ! ------------------------------- Events ------------------------------- ! */
window.addEventListener("load", loadUsers);

/* ! ------------------------------- Functions ------------------------------- ! */
function loadUsers() {
  usersInfoContainer.innerHTML = "";
  fetch("http://localhost:3000/api/users")
    .then((res) => res.json())
    .then((data) => {
      let usersArray = data;
      usersArray.forEach((user) => createUser(user));
    });
}

function createUser(userDataObj) {
  usersInfoContainer.insertAdjacentHTML(
    "beforeend",
    `
  <div class="user-box">
  <div class="user-box_left">
    <img src="${userDataObj.profile}" class="user-profile-box"/>
    <div class="user-detail">
      <h1 class="user-id">
        <span
          >${userDataObj.userName}
          <!-- username -->
        </span>
        <span class="user-history">
          ${userDataObj.created_AT}
          <!-- history -->
        </span>
      </h1>
      <h3 class="user-name"
        >${userDataObj.firstName} ${userDataObj.lastName}
        <!-- user name (first name and last name) -->
      </h3>
    </div>
  </div>
  <div class="user-btns-group">
  <!-- ! ------------------------------ edit btn ------------------------------- ! -->
  <button class="user-edit-btn" onclick= "editUser('${userDataObj._id}')"> edit </button>
  <!-- ! ----------------------------- remove btn ------------------------------ ! -->
  <button class="user-remove-btn" onclick= "deleteUser('${userDataObj._id}')"> remove </button>
</div>
  `,
  );
}

function editUser(userId) {
  openModal(editModal);
  fillEditModalWithUserInfo(userId);
  $.querySelector("form.edit-user-form").addEventListener("submit", (e) => {
    e.preventDefault();
    updateSelectedUser(userId);
  });
}

function deleteUser(userId) {
  openModal(deleteModal);
  $.querySelector(".unaccept-btn").addEventListener("click", () => closeModal(deleteModal));
  $.querySelector(".accept-btn").addEventListener("click", () => {
    closeModal(deleteModal);
    deleteSelectedUser(userId);
  });
  //   closeModal(deleteModal)
}

function openModal(modal) {
  modalContainer.classList.add("visible");
  modal.classList.remove("modal-box");
  window.addEventListener("keyup", (e) => e.keyCode === 27 && closeModal(modal));
}

function closeModal(modal) {
  modalContainer.classList.remove("visible");
  modal.classList.add("modal-box");
}

function fillEditModalWithUserInfo(userId) {
  fetch(`http://localhost:3000/api/users/${userId}`)
    .then((res) => res.json())
    .then((data) => {
      $.querySelector("#username-input").value = data.userName;
      $.querySelector("#first-name-input").value = data.firstName;
      $.querySelector("#last-name-input").value = data.lastName;
    });
}

function updateSelectedUser(userId) {
  closeModal(editModal);
  let userUpdateObj = {
    firstName: $.querySelector("#first-name-input").value,
    lastName: $.querySelector("#last-name-input").value,
    userName: $.querySelector("#username-input").value,
    profile: "content/img/profile/banana.png",
  };
  fetch(`http://localhost:3000/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(userUpdateObj),
  }).then(() => loadUsers());
}

function deleteSelectedUser(userId) {
  fetch(`http://localhost:3000/api/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
  }).then(() => loadUsers());
}

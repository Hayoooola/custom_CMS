const $ = document;
const addCourseBtn = $.querySelector(".add-new-course-btn");
// ------! inputs !------ //
const titleInput = $.querySelector("#course-title-input");
const detailInput = $.querySelector("#course-detail-input");
const timeInput = $.querySelector("#course-time-input");
const priceInput = $.querySelector("#course-price-input");
const categoryInput = $.querySelector("#course-category-input");

/* ! -------------------------------- Events ------------------------------- ! */
window.addEventListener("load", loadCourses);
addCourseBtn.addEventListener("click", openAddCourseModal);

/* ! -------------------------------- Functions ------------------------------- ! */
function openAddCourseModal() {
  $.querySelector(".modal-container").classList.add("visible");
  window.addEventListener("keyup", (e) => e.keyCode === 27 && closeAddCourseModal());
  $.querySelector(".add-new-course-form").addEventListener("submit", validateForm);
}

function closeAddCourseModal() {
  $.querySelector(".modal-container").classList.remove("visible");
  $.querySelectorAll(".form-input").forEach((input) => (input.value = ""));
}

function validateForm(e) {
  e.preventDefault();
  let isTitleValid = validityState(titleInput.value, 3);
  let isDetailValid = validityState(detailInput.value, 10);
  let isTimeValid = validityState(timeInput.value, 5);
  let isPriceValid = validityState(priceInput.value, 1, true);
  let isCategoryValid = validityState(categoryInput.value, 2);

  isTitleValid ? validMessage("title") : invalidMessage("title");
  isDetailValid ? validMessage("detail") : invalidMessage("detail");
  isTimeValid ? validMessage("time") : invalidMessage("time");
  isPriceValid ? validMessage("price") : invalidMessage("price");
  isCategoryValid ? validMessage("category") : invalidMessag("category");

  if (isTitleValid & isDetailValid & isTimeValid & isPriceValid & isCategoryValid) {
    addNewCourse(titleInput.value, detailInput.value, timeInput.value, priceInput.value, categoryInput.value);
  }

  closeAddCourseModal();
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
  let messageElem = $.querySelector(`.course-${inputName}-message`);
  let borderElem = $.querySelector(`.course-${inputName}-group`);
  messageElem.innerText = `course ${inputName} is valid`;
  messageElem.setAttribute("class", `message valid-message course-${inputName}-message`);
  borderElem.setAttribute("class", `input-group valid course-${inputName}-group`);
}

function invalidMessage(inputName) {
  let messageElem = $.querySelector(`.course-${inputName}-message`);
  let borderElem = $.querySelector(`.course-${inputName}-group`);
  messageElem.innerText = `course ${inputName} is invalid!`;
  messageElem.setAttribute("class", `message invalid-message course-${inputName}-message`);
  borderElem.setAttribute("class", `input-group invalid course-${inputName}-group`);
}

function addNewCourse(
  title,
  body,
  time,
  price,
  category,
  cover = "../content/img/course/course.png",
  students = "1401",
) {
  let courseDetails = {
    title,
    body,
    time,
    price,
    students,
    category,
    cover,
  };

  fetch(`http://localhost:3000/api/courses`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(courseDetails),
  }).then(() => loadCourses());
}

function loadCourses() {
  fetch("http://localhost:3000/api/courses")
    .then((res) => res.json())
    .then((data) => {
      let coursesArray = data;
      $.querySelector(".courses-wrap").innerHTML = "";
      coursesArray.forEach((course) => createCourseData(course));
    });
}

function createCourseData(courseObj) {
  let corsePrice;
  courseObj.price === "0" ? (corsePrice = "free") : (corsePrice = courseObj.price);
  $.querySelector(".courses-wrap").insertAdjacentHTML(
    "beforeend",
    `
  <article class="course-box">
  <img src="${courseObj.cover}" class="course-img" alt="course image" />
  <!-- course image -->
  <div class="course-right-section-box">
    <div class="course-explanation">
      <!-- course title -->
      <h1 class="course-title">${courseObj.title}</h1>
      <!-- course text -->
      <p class="course-text"
        >${courseObj.body}</p
      >
    </div>
    <div class="course-description">
      <h3 class="course-price">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <g
            id="vuesax_linear_dollar-square"
            data-name="vuesax/linear/dollar-square"
            transform="translate(-172 -572)"
          >
            <g id="dollar-square">
              <path
                id="Vector"
                d="M0,6.99A2.272,2.272,0,0,0,2.22,9.32H4.73A1.988,1.988,0,0,0,6.67,7.29,1.75,1.75,0,0,0,5.35,5.36L1.32,3.96A1.75,1.75,0,0,1,0,2.03,1.988,1.988,0,0,1,1.94,0H4.45A2.272,2.272,0,0,1,6.67,2.33"
                transform="translate(180.672 579.34)"
                fill="none"
                stroke="var(--dark-blue)"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
              />
              <path
                id="Vector-2"
                data-name="Vector"
                d="M0,0V12"
                transform="translate(184 578)"
                fill="none"
                stroke="var(--dark-blue)"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
              />
              <path
                id="Vector-3"
                data-name="Vector"
                d="M13,20H7c-5,0-7-2-7-7V7C0,2,2,0,7,0h6c5,0,7,2,7,7v6C20,18,18,20,13,20Z"
                transform="translate(174 574)"
                fill="none"
                stroke="var(--dark-blue)"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
              />
              <path
                id="Vector-4"
                data-name="Vector"
                d="M0,0H24V24H0Z"
                transform="translate(172 572)"
                fill="none"
                opacity="0"
              />
            </g>
          </g>
        </svg>
        <span>${corsePrice}</span>
        <!-- course price -->
      </h3>
      <h3 class="course-category">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <g
            id="vuesax_linear_folder-open"
            data-name="vuesax/linear/folder-open"
            transform="translate(-492 -188)"
          >
            <g id="folder-open">
              <path
                id="Vector"
                d="M19.354,3.3l-.4,5c-.15,1.53-.27,2.7-2.98,2.7H3.394C.684,11,.564,9.83.414,8.3l-.4-5a3.031,3.031,0,0,1,.65-2.19l.02-.02A2.975,2.975,0,0,1,2.994,0h13.38a2.965,2.965,0,0,1,2.29,1.07c.01.01.02.02.02.03A2.925,2.925,0,0,1,19.354,3.3Z"
                transform="translate(494.316 199)"
                fill="none"
                stroke="var(--dark-blue)"
                stroke-width="1.5"
              />
              <path
                id="Vector-2"
                data-name="Vector"
                d="M0,9.4V4.25C0,.85.85,0,4.25,0H5.52A2.017,2.017,0,0,1,7.56,1.02l1.27,1.7a1.352,1.352,0,0,0,1.36.68h2.55c3.4,0,4.25.85,4.25,4.25V9.44"
                transform="translate(495.5 190.03)"
                fill="none"
                stroke="var(--dark-blue)"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
              />
              <path
                id="Vector-3"
                data-name="Vector"
                d="M0,0H5.14"
                transform="translate(501.43 205)"
                fill="none"
                stroke="var(--dark-blue)"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
              />
              <path
                id="Vector-4"
                data-name="Vector"
                d="M0,0H24V24H0Z"
                transform="translate(516 212) rotate(180)"
                fill="none"
                opacity="0"
              />
            </g>
          </g>
        </svg>
        <span>${courseObj.category}</span>
        <!-- course cateogry -->
      </h3>
      <h3 class="course-students">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <g id="vuesax_linear_people" data-name="vuesax/linear/people" transform="translate(-620 -252)">
            <g id="people">
              <g id="Group">
                <path
                  id="Vector"
                  d="M2.67,5.16a.605.605,0,0,0-.19,0,2.585,2.585,0,1,1,.19,0Z"
                  transform="translate(635.33 254)"
                  fill="none"
                  stroke="var(--dark-blue)"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                />
                <path
                  id="Vector-2"
                  data-name="Vector"
                  d="M.03,4.94a5.635,5.635,0,0,0,3.94-.72A1.911,1.911,0,0,0,3.97.8,5.67,5.67,0,0,0,0,.09"
                  transform="translate(636.94 261.5)"
                  fill="none"
                  stroke="var(--dark-blue)"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                />
              </g>
              <g id="Group-2" data-name="Group">
                <path
                  id="Vector-3"
                  data-name="Vector"
                  d="M2.49,5.16a.605.605,0,0,1,.19,0,2.585,2.585,0,1,0-.19,0Z"
                  transform="translate(623.48 254)"
                  fill="none"
                  stroke="var(--dark-blue)"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                />
                <path
                  id="Vector-4"
                  data-name="Vector"
                  d="M5,4.94a5.635,5.635,0,0,1-3.94-.72,1.911,1.911,0,0,1,0-3.42A5.67,5.67,0,0,1,5.027.09"
                  transform="translate(622.003 261.5)"
                  fill="none"
                  stroke="var(--dark-blue)"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                />
              </g>
              <g id="Group-3" data-name="Group">
                <path
                  id="Vector-5"
                  data-name="Vector"
                  d="M2.67,5.16a.605.605,0,0,0-.19,0,2.585,2.585,0,1,1,.19,0Z"
                  transform="translate(629.33 261.47)"
                  fill="none"
                  stroke="var(--dark-blue)"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                />
                <path
                  id="Vector-6"
                  data-name="Vector"
                  d="M1.058.795a1.911,1.911,0,0,0,0,3.42,5.677,5.677,0,0,0,5.82,0,1.911,1.911,0,0,0,0-3.42A5.723,5.723,0,0,0,1.058.795Z"
                  transform="translate(628.032 268.985)"
                  fill="none"
                  stroke="var(--dark-blue)"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                />
              </g>
              <path
                id="Vector-7"
                data-name="Vector"
                d="M0,0H24V24H0Z"
                transform="translate(620 252)"
                fill="none"
                opacity="0"
              />
            </g>
          </g>
        </svg>
        <span>${courseObj.students}</span>
        <!-- course students number -->
      </h3>
    </div>
  </div>
</article>
  `,
  );
}

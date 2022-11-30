import { login } from "./utils.mjs";

/**
 *
 * @param {event} event Logs the user inn if they present a valid email and password that is registered to the API
 * @returns - Guard set up to hinder empty input boxes.
 */
function loginUser(event) {
  event.preventDefault();

  const userEmail = document.getElementById("userEmail").value.toLowerCase();
  const userPassword = document.getElementById("userPassword").value;

  if (!userEmail || !userPassword) {
    return;
  }
  login(userEmail, userPassword);
}

/**
 * initializes the searchbar if the user is logged inn.
 */
function initSearchForm() {
  const searchForm = document.getElementById("loginUser");

  if (searchForm) {
    searchForm.addEventListener("submit", loginUser);
  }
}

initSearchForm();

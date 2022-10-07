import { login } from "./utils.mjs";

function loginUser(event) {
  event.preventDefault();

  const userEmail = document.getElementById("userEmail").value;
  const userPassword = document.getElementById("userPassword").value;

  if (!userEmail || !userPassword) {
    return;
  }
  login(userEmail, userPassword);
}

const searchForm = document.getElementById("loginUser");

if (searchForm) {
  searchForm.addEventListener("submit", loginUser);
}

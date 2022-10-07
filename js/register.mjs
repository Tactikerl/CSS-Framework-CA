//
import { API_SOCIAL_URL, SOCIAL_REGISTER } from "./api.mjs";
import { login } from "./utils.mjs";

/**
 * This function registers a new user to the API an logs them in automaticly, sending them to
 * the index.html page where they can browse other users posts.
 * @param {SubmitEvent} event - When user clicks register button the submit event is run
 * @returns
 */
function register(event) {
  event.preventDefault();

  const newUser = document.getElementById("registerName").value;
  const newUserEmail = document.getElementById("registerEmail").value;
  const newUserPassword = document.getElementById("registerPassword").value;
  const repeatPassword = document.getElementById("repeatPassword").value;
  const newUserAvatar = document.getElementById("profileAvatar").value;

  /**
   * Guard set up to check if the new user have filled inn the requested info.
   */
  if (!newUser || !newUserEmail || !newUserPassword || !repeatPassword) {
    return;
  }

  /**
   * Guard set up to check that the user has repeated the password correctly
   */
  if (repeatPassword !== newUserPassword) {
    return;
  }

  /**
   *
   */
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    name: newUser,
    email: newUserEmail,
    password: newUserPassword,
    avatar: newUserAvatar,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  fetch(`${API_SOCIAL_URL}${SOCIAL_REGISTER}`, requestOptions)
    .then((response) => response.json())
    .then((newUser) => {
      login(newUser.email, newUserPassword);
    });
}

const form = document.getElementById("formRegister");

if (form) {
  form.addEventListener("submit", register);
}

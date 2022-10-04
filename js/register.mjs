//
function register(event) {
  event.preventDefault();

  const newUser = document.getElementById("registerName").value;
  const newUserEmail = document.getElementById("registerEmail").value;
  const newUserPassword = document.getElementById("registerPassword").value;
  const repeatPassword = document.getElementById("repeatPassword").value;

  if (!newUser || !newUserEmail || !newUserPassword || !repeatPassword) {
    return;
  }

  if (repeatPassword !== newUserPassword) {
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    name: newUser,
    email: newUserEmail,
    password: newUserPassword,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };
  fetch(
    "https://nf-api.onrender.com/api/v1/social/auth/register",
    requestOptions
  )
    .then((response) => response.json())
    .then((newUser) => {
      login(newUser.email, newUserPassword);
    });
}

const form = document.getElementById("formRegister");

if (form) {
  form.addEventListener("submit", register);
}

function login(email, password) {
  console.log(email, password);
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    email: email,
    password: password,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };
  fetch("https://nf-api.onrender.com/api/v1/social/auth/login", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result !== null) {
        const token = result.accessToken;
        localStorage.setItem("token", token);
        document.location = "/index.html";
      }
    })
    .catch((error) => console.log("error", error));
}

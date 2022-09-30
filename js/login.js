function login(event) {
  event.preventDefault();

  const userEmail = document.getElementById("userEmail").value;
  const userPassword = document.getElementById("userPassword").value;

  if (!userEmail || !userPassword) {
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    email: userEmail,
    password: userPassword,
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
        const userName = result.name;
        localStorage.setItem("username", userName);
        document.location = "/index.html";
      }
    })
    .catch((error) => console.log("error", error));
}

const searchForm = document.getElementById("loginUser");

if (searchForm) {
  searchForm.addEventListener("submit", login);
}

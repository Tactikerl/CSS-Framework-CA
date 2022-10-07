import { posts as fetchedPosts, replacePosts } from "./currentPosts.mjs";
import { renderPosts } from "./renderPosts.mjs";
import { search } from "./utils.mjs";

const postsContainer = document.querySelector("#postsContainer");

const loginID = document.querySelector("#loginId");

const token = localStorage.getItem("token");
const userName = localStorage.getItem("username");

// Login ID shown in banner --- Move to utils.js
if (token !== null) {
  loginID.innerHTML = `<a class="navbar-brand" href="#" id="loginId">The Social
                        Media<h5>Logged in as ${userName}</h5></a>`;
}

const navItems = document.querySelector("#navItems");
if (token) {
  navItems.innerHTML = `<li class="nav-item">
    <a class="nav-link active" aria-current="page"
      href="/">Homepage</a>
  </li>
  <li class="nav-item">
      <a class="nav-link" href="/profile.html">Profile</a>
  </li>
  <li class="nav-item">
    <button class="btn btn-primary"
    id="logout">Logout</button>
  </li>`;

  const logout = document.getElementById("logout");
  logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    document.location.reload();
  });
} else {
  navItems.innerHTML = `<a href="/login.html" class="nav-link">Login</a>
    <a href="/register.html" class="nav-link">Register</a>`;
}

//Fetch for token API key -- Move to api.js
let myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${token}`);

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

fetch(
  "https://nf-api.onrender.com/api/v1/social/posts/?_author=true&_reactions=true&_comments=true",
  requestOptions
)
  .then((response) => response.json())
  .then((posts) => {
    replacePosts(posts);
    renderPosts(posts);
  })
  .catch((error) => console.log("error", error));

const searchForm = document.getElementById("search");

if (searchForm) {
  searchForm.addEventListener("submit", search);
}

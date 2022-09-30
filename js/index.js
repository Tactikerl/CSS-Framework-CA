import { posts as fetchedPosts, replacePosts } from "./currentPosts.js";

const postsContainer = document.querySelector("#postsContainer");

const loginID = document.querySelector("#loginId");

const token = localStorage.getItem("token");
const userName = localStorage.getItem("username");

// Login ID shown in banner
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

//Fetch for token API key
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

function renderPosts(posts) {
  posts.forEach(function (getPosts) {
    const date = new Date(getPosts.created);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    // showing default avatar/profile image on page
    let avatarUrl =
      "https://st3.depositphotos.com/1767687/16607/v/450/depositphotos_166074422-stock-illustration-default-avatar-profile-icon-grey.jpg";
    if (validURL(getPosts.author.avatar)) {
      avatarUrl = getPosts.author.avatar;
    }

    //Rendering posts on page
    postsContainer.innerHTML += `<li class="d-flex" id="listObject">
    <a class="flex-shrink-0" href="#fakelink">
        <img class="media-object user-message"
            src="${avatarUrl}" alt="Avatar">
    </a>
    <div class="flex-grow-1 ms-3">
        <h4 class="fs-5">
            <a href="#fakelink">
                ${getPosts.author.name}
            </a>
        </h4>
        <a href="/post.html?post=${getPosts.id}">
            <h5 class"fs-5">
                ${getPosts.title}
            </h5>
        </a>
        <h6 class="fs-6">
            <small>
                ${date.toLocaleDateString("en-US", options)}
            </small>
        </h6>
        <p>
            ${getPosts.body}
        </p>
        <hr>
    </div>
</li>`;
  });
}

function validURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

function search(event) {
  event.preventDefault();

  const searchTerm = document.getElementById("searchInput").value;

  const postFound = fetchedPosts.filter(
    (post) =>
      post.title.includes(searchTerm) ||
      post.body.includes(searchTerm) ||
      post.author.name.includes(searchTerm)
  );
  postsContainer.innerHTML = "";

  renderPosts(postFound);
}

const searchForm = document.getElementById("search");

if (searchForm) {
  searchForm.addEventListener("submit", search);
}

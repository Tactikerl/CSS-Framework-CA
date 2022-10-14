import { posts as fetchedPosts, replacePosts } from "./currentPosts.mjs";
import { renderPosts, sortList } from "./renderPosts.mjs";
import { search } from "./utils.mjs";
import { API_SOCIAL_URL, API_POSTS_PARAMS, SOCIAL_POSTS } from "./api.mjs";

const loginID = document.querySelector("#loginId");

const token = localStorage.getItem("token");
const userName = localStorage.getItem("username");

/**
 * Checks if there is a valid validation token in local storage.
 * if so, the banner will say "Logged in as *USERNAME*"
 * */
if (token !== null) {
  loginID.innerHTML = `<a class="navbar-brand" href="#" id="loginId">The Social
                        Media<h5>Logged in as ${userName}</h5></a>`;
}

/**
 * similar to the above if statement, it checks for a valid token.
 * if valid the navbar will display additional items for the user to navigate.
 */
const navItems = document.querySelector("#navItems");
if (token) {
  navItems.innerHTML = `<li class="nav-item">
    <a class="nav-link active" aria-current="page"
      href="/">Homepage</a>
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

let myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${token}`);

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

/**
 * Fetches the posts and renders them on the index page.
 */
const btn = document.querySelector("#sortDate");
const sortButtons = document.getElementsByName("sortBy");
let shouldSort = false;
btn.addEventListener("submit", (click) => {
  click.preventDefault();

  let posts = fetchedPosts;
  let listToRender;
  if (!sortButtons[0].checked) {
    listToRender = sortList(posts);
  } else {
    listToRender = posts;
  }
  postsContainer.innerHTML = "";
  renderPosts(listToRender);
});
fetch(`${API_SOCIAL_URL}${SOCIAL_POSTS}${API_POSTS_PARAMS}`, requestOptions)
  .then((response) => response.json())
  .then((posts) => {
    replacePosts(posts);
    let listToRender;
    //let listToRender = shouldSort ? sortList(posts) : posts;
    if (shouldSort) {
      listToRender = sortList(posts);
    } else {
      listToRender = posts;
    }
    renderPosts(listToRender);
  })
  .catch((error) => console.log("error", error));

const searchForm = document.getElementById("search");

if (searchForm) {
  searchForm.addEventListener("submit", search);
}

import { API_SOCIAL_URL, SOCIAL_LOGIN } from "./api.mjs";
import { posts as fetchedPosts, replacePosts } from "./currentPosts.mjs";
import { renderPosts } from "./renderPosts.mjs";

export function validURL(str) {
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

export const dateOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

/**
 * This function logs the user into the API.
 * @param {string} userEmail
 * @param {string} userPassword
 */
export function login(userEmail, userPassword) {
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
  fetch(`${API_SOCIAL_URL}${SOCIAL_LOGIN}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.accessToken == undefined) {
        alert(result.message);
        return;
      }
      const token = result.accessToken;
      localStorage.setItem("token", token);
      const userName = result.name;
      localStorage.setItem("username", userName);
      document.location = "/index.html";
    })
    .catch((error) => console.log("error", error));
}

export let avatarUrl =
  "https://st3.depositphotos.com/1767687/16607/v/450/depositphotos_166074422-stock-illustration-default-avatar-profile-icon-grey.jpg";

/**
 *
 * @param {event} event - when user click the search icon or hits enter after filling out the search term, the function will run and find the posts with the written keyword, if available.
 */
export function search(event) {
  event.preventDefault();

  const searchTerm = document.getElementById("searchInput").value.toLowerCase();

  const postFound = fetchedPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm) ||
      post.body.toLowerCase().includes(searchTerm) ||
      post.author.name.includes(searchTerm)
  );
  postsContainer.innerHTML = "";

  renderPosts(postFound);
}

import { API_SOCIAL_URL, SOCIAL_POSTS, API_POSTS_PARAMS } from "./api.mjs";
import { renderPost, renderComments, addUpdate } from "./renderPosts.mjs";

const token = localStorage.getItem("token");
const userName = localStorage.getItem("username");

const urlSearchParams = new URLSearchParams(window.location.search);

const postId = urlSearchParams.get("post");

let currentPost = [];

const myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${token}`);
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
};

fetch(
  `${API_SOCIAL_URL}${SOCIAL_POSTS}/${postId}${API_POSTS_PARAMS}`,
  requestOptions
)
  .then((response) => response.json())
  .then((post) => {
    currentPost = post;
    if (post.author.name == userName) {
      addUpdate(post);
    }
    renderPost(post);
    renderComments(post.comments);
  })
  .catch((error) => console.log("error", error));

import { API_SOCIAL_URL, SOCIAL_POSTS, API_POSTS_PARAMS } from "./api.mjs";
import { renderPost, renderComments } from "./renderPosts.mjs";

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
      addUpdate();
    }
    renderPost(post);
    renderComments(post.comments);
  })
  .catch((error) => console.log("error", error));

function addUpdate() {
  document.querySelector(
    "#updateContainer"
  ).innerHTML = `<button id="update" class="btn btn-primary">Edit post</button>
  <button id="delete" class="btn btn-danger">Delete post</button>
  `;

  const updateButton = document.getElementById("update");
  updateButton.addEventListener("click", () => {
    addUpdateForm();
  });

  const deleteButton = document.getElementById("delete");
  deleteButton.addEventListener("click", () => {
    deletePost(postId);
  });
}

function addUpdateForm() {
  document.querySelector(".updatePost").innerHTML = `<form id="updatePost">
    <div class="mb-3">
      <label for="inputTitle" class="form-label">Title</label>
      <input type="text" class="form-control" id="inputTitle" value="${currentPost.title}" />
    </div>
    <div class="mb-3 mt-3">
      <label for="inputBody">Body:</label>
      <textarea class="form-control" rows="5" id="inputBody" name="text">${currentPost.body}</textarea>
    </div>
      <button type="submit" class="btn btn-primary">Confirm</button>
  </form>`;

  const form = document.getElementById("updatePost");

  if (form) {
    form.addEventListener("submit", submitUpdatedPost);
  }
}

function submitUpdatedPost(event) {
  event.preventDefault();

  const title = document.getElementById("inputTitle").value;

  const body = document.getElementById("inputBody").value;

  if (!title || !body) {
    return;
  }

  if (body.length < 10) {
    return;
  }

  updatePost(postId, title, body);
}

function updatePost(postId, title, body) {
  var raw = JSON.stringify({
    title: title,
    body: body,
  });
  console.log();

  var requestOptionsUpdate = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  fetch(
    `https://nf-api.onrender.com/api/v1/social/posts/${postId}?_author=true`,
    requestOptionsUpdate
  )
    .then((response) => response.json())
    .then((post) => {
      currentPost = post;
      document.querySelector(".updatePost").innerHTML = "";
      renderPost(currentPost);
    });
}

function deletePost(postId) {
  var requestOptionsDelete = {
    method: "DELETE",
    headers: myHeaders,
  };

  fetch(
    `https://nf-api.onrender.com/api/v1/social/posts/${postId}`,
    requestOptionsDelete
  )
    .then((response) => response.json())
    .then(() => (document.location = "/index.html"));
}

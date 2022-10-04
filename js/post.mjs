import { validURL } from "./utils.mjs";

const token = localStorage.getItem("token");
const userName = localStorage.getItem("username");

const urlSearchParams = new URLSearchParams(window.location.search);

const postId = urlSearchParams.get("post");

let currentPost = [];

var myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${token}`);
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: "GET",
  headers: myHeaders,
};

fetch(
  `https://nf-api.onrender.com/api/v1/social/posts/${postId}?_author=true&_reactions=true&_comments=true`,
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

function renderPost(post) {
  const date = new Date(post.created);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  let avatarUrl =
    "https://st3.depositphotos.com/1767687/16607/v/450/depositphotos_166074422-stock-illustration-default-avatar-profile-icon-grey.jpg";
  if (validURL(post.author.avatar)) {
    avatarUrl = post.author.avatar;
  }

  document.getElementById(
    "post"
  ).innerHTML = `<li class="d-flex" id="listObject">
    <a class="flex-shrink-0" href="#fakelink">
        <img class="media-object user-message"
            src="${avatarUrl}" alt="Avatar">
    </a>
    <div class="flex-grow-1 ms-3">
        <h4 class="fs-5">
            <a href="#fakelink">
                ${post.author.name}
            </a>
        </h4>        
          <h5 class"fs-5">
                ${post.title}
          </h5>        
        <h6 class="fs-6">
            <small>
                ${date.toLocaleDateString("en-US", options)}
            </small>
        </h6>
        <p>
            ${post.body}
        </p>
        
        <hr>
              
        </div>
    </div>
</li>`;
}

function renderComments(comments) {
  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];
    const date = new Date(comment.created);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    document.getElementById("postComments").innerHTML += `<div>
      <li>
        <ul>
          <div>
            <hr>
              <div>
                <p>${comment.body}
                </p>
              </div>
                posted by ${comment.owner}
          </div>  
            <small>${date.toLocaleDateString("en-US", options)}
          </small>
        </ul>
      </li>
    </div>`;
  }
}

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

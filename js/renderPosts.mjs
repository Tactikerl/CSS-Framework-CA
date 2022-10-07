import { validURL } from "./utils.mjs";
import { dateOptions } from "./utils.mjs";
let currentPost = [];

/**
 *  function for rendering all available post on index page
 * @param {object} posts - Gets the array object containing posts on the API
 */
export function renderPosts(posts) {
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

    let avatarUrl =
      "https://st3.depositphotos.com/1767687/16607/v/450/depositphotos_166074422-stock-illustration-default-avatar-profile-icon-grey.jpg";

    if (validURL(getPosts.author.avatar)) {
      avatarUrl = getPosts.author.avatar;
    }

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

/**
 * function for rendering a single post on a dedicated page.
 * @param {*} post
 */
export function renderPost(post) {
  const date = new Date(post.created);

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
                  ${date.toLocaleDateString("en-US", dateOptions)}
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

/**
 *
 * @param {*} comments
 */
export function renderComments(comments) {
  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];
    const date = new Date(comment.created);

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
              <small>${date.toLocaleDateString("en-US", dateOptions)}
            </small>
          </ul>
        </li>
      </div>`;
  }
}

/**
 *
 */
export function addUpdate() {
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

/**
 *
 */
export function addUpdateForm() {
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

/**
 *
 * @param {*} event
 * @returns
 */
export function submitUpdatedPost(event) {
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

/**
 *
 * @param {*} postId
 * @param {*} title
 * @param {*} body
 */
export function updatePost(postId, title, body) {
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

/**
 *
 * @param {*} postId
 */
export function deletePost(postId) {
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

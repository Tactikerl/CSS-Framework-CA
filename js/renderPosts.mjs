import { validURL, dateOptions } from "./utils.mjs";
import { API_SOCIAL_URL, SOCIAL_POSTS, API_POSTS_PARAMS } from "./api.mjs";
const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get("post");
let currentPost = [];

const token = localStorage.getItem("token");

const myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${token}`);
myHeaders.append("Content-Type", "application/json");

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

    /**
     * let - sets default avatar image.
     *  if - if a user has no profile avatar this will override and set a the default avatar image.
     */
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
 * @param {object} post - retrieves the selected post from the API
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
 * Renders the comments on the index.html page
 * @param {object} comments - gets the array of comments from the API
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
 * Enables the "update" and "delete" button on the page if the user is logged in and the creator of the post.
 */
export function addUpdate(post) {
  document.querySelector(
    "#updateContainer"
  ).innerHTML = `<button id="update" class="btn btn-primary">Edit post</button>
    <button id="delete" class="btn btn-danger">Delete post</button>
    `;

  const updateButton = document.getElementById("update");
  updateButton.addEventListener("click", () => {
    addUpdateForm(post);
  });

  const deleteButton = document.getElementById("delete");
  deleteButton.addEventListener("click", () => {
    deletePost(postId);
  });
}

/**
 * Adds the update text box for the editing of the title and post
 */
export function addUpdateForm(post) {
  document.querySelector(".updatePost").innerHTML = `<form id="updatePost">
      <div class="mb-3">
        <label for="inputTitle" class="form-label">Title</label>
        <input type="text" class="form-control" id="inputTitle" value="${post.title}" />
      </div>
      <div class="mb-3 mt-3">
        <label for="inputBody">Body:</label>
        <textarea class="form-control" rows="5" id="inputBody" name="text">${post.body}</textarea>
      </div>
        <button type="submit" class="btn btn-primary">Confirm</button>
    </form>`;

  const form = document.getElementById("updatePost");

  if (form) {
    form.addEventListener("submit", submitUpdatedPost);
  }
}

/**
 * submits the changes made to the post and updates the post to display the changes
 * @param {event} event - on click event for the form.
 * @returns - if the guards in the function is not passed the function will return blank.
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
 *  Sends the changes to the post to the API so that it can be updated
 * @param {number} postId - the id number for the post on the API
 * @param {string} title - The title text of the post
 * @param {string} body - The body text of the post.
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
    `${API_SOCIAL_URL}${SOCIAL_POSTS}/${postId}?_author=true`,
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
 * Lets the user delete their own posts
 * @param {number} postId - The id number for the post on the API.
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

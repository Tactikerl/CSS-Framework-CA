import { addToPosts } from "./currentPosts.mjs";
import { validURL } from "./utils.mjs";
import { API_SOCIAL_URL, API_POSTS_PARAMS, SOCIAL_POSTS } from "./api.mjs";

/**
 *
 * @param {event} event on click event that sends the new post to the API
 * @returns - guards set up to prevent the title and the body text to be empty, so that there are no blank posts created.
 */
function submitPost(event) {
  event.preventDefault();

  const title = document.getElementById("inputTitle").value;
  const token = localStorage.getItem("token");

  const body = document.getElementById("inputBody").value;

  if (!token) {
    return;
  }

  if (!title || !body) {
    return;
  }

  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    title: "",
    body: "",
    tags: [""],
    media: "",
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      title: title,
      body: body,
    }),
    redirect: "follow",
  };

  fetch(`${API_SOCIAL_URL}${SOCIAL_POSTS}${API_POSTS_PARAMS}`, requestOptions)
    .then((response) => response.json())
    .then((getPosts) => {
      addToPosts(getPosts);

      const postsContainer = document.querySelector("#postsContainer");

      let avatarUrl =
        "https://st3.depositphotos.com/1767687/16607/v/450/depositphotos_166074422-stock-illustration-default-avatar-profile-icon-grey.jpg";
      if (validURL(getPosts.author.avatar)) {
        avatarUrl = getPosts.author.avatar;
      }

      const date = new Date(getPosts.created);
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };

      if (postsContainer) {
        const newPost = `<li class="d-flex" id="listObject">
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

        postsContainer.insertAdjacentHTML("afterbegin", newPost);
        postForm.reset();
      }
    })
    .catch((error) => console.log("error", error));
}

const postForm = document.getElementById("createPost");

if (postForm) {
  postForm.addEventListener("submit", submitPost);
}

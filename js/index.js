const tokenKey = localStorage.getItem("tokenName");

const postsContainer = document.querySelector("#postsContainer");

var myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${tokenKey}`);

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
  .then((result) => createHTML(result))
  .catch((error) => console.log("error", error));

function createHTML(result) {
  result.forEach(function (getPosts) {
    postsContainer.innerHTML += `<div><a href="/#" <div class=""><h4>${getPosts.author.name}</h4></a>
    <h5>${getPosts.title}</h5><p>${getPosts.body}</p></div></div>`;
  });
}

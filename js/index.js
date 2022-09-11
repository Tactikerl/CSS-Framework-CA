console.log("test");
const tokenKey = localStorage.getItem("tokenName");
console.log(tokenKey);

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
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));

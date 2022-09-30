export let posts = [];

export const addToPosts = (post) => {
  posts.unshift(post);
};

export const replacePosts = (newPosts) => {
  posts = newPosts;
};

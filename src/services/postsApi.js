import axios from "axios";

// const API_KEY = 'ehZwOo8rreqdAS6moCnXC8ysqCHe3N3cGdYzk1Ik';
const BASE_URL = "https://jsonplaceholder.typicode.com/posts";
const COMMENTS_URL = "https://jsonplaceholder.typicode.com/comments";

async function FetchPosts() {
  try {
    const { data } = await axios(BASE_URL);
    return data;
  } catch (error) {
    console.log("error", { error });
    return null;
  }
}
async function FetchComments() {
  try {
    const { data } = await axios(COMMENTS_URL);
    return data;
  } catch (error) {
    console.log("error", { error });
    return null;
  }
}
// async function FetchRoverTotal(name) {
//   try {
//     const config = {
//       url: `/manifests/${name}`,
//     };
//     const { data } = await axios(config);
//     return data;
//   } catch (error) {
//     console.log('error', { error });
//     return null;
//   }
// }

// async function fetchRovers() {
//   try {
//     const config = {
//       url: `/rovers`,
//     };
//     const { data } = await axios(config);
//     return data;
//   } catch (error) {
//     console.log('error', { error });
//     return null;
//   }
// }

const api = {
  FetchPosts,
  FetchComments,
  // fetchRovers,
};

export default api;

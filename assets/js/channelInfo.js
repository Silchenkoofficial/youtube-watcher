import { API_KEY } from "./config";

document.querySelector(".channel-info").textContent = "HHHH";

$(document).ready(async () => {
  await fetch(
    `https://www.googleapis.com/youtube/v3/playlists?part=snippet&key=${API_KEY}`
  )
    .then((data) => data.json())
    .then((data) => {
      console.log(data);
    });
});

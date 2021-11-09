const API_KEY = "AIzaSyAasvdoh6Z2EObuRCWv-S0MMHSHHxbnm7Y";

const convertToInternationalCurrencySystem = (number) => {
  // Nine Zeroes for Billions
  return Math.abs(Number(number)) >= 1.0e9
    ? (Math.abs(Number(number)) / 1.0e9).toFixed(2) + "B"
    : // Six Zeroes for Millions
    Math.abs(Number(number)) >= 1.0e6
    ? (Math.abs(Number(number)) / 1.0e6).toFixed(2) + "M"
    : // Three Zeroes for Thousands
    Math.abs(Number(number)) >= 1.0e3
    ? (Math.abs(Number(number)) / 1.0e3).toFixed(0) + "K"
    : Math.abs(Number(number));
};

const getChannelID = () => {
  var paramsString = document.location.search; // ?page=4&limit=10&sortby=desc
  var searchParams = new URLSearchParams(paramsString);
  return searchParams.get("channelId");
};
const getLikesPercent = (video) => {
  let percent = Math.round(
    100 *
      (parseInt(video.likeCount) /
        (parseInt(video.likeCount) + parseInt(video.dislikeCount)))
  );
  return percent;
};
const getVideoDuration = (duration) => {
  return duration
    .replace("H", ":")
    .replace("M", ":")
    .replace("S", "")
    .replace("PT", "")
    .split(":")
    .map((num) => (num <= 9 ? `0${num}` : num))
    .join(":");
};

$(document).ready(async () => {
  await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${getChannelID()}&part=snippet,id&maxResults=20`
  )
    .then((data) => data.json())
    .then((data) => {
      $("#js-channel-title").text(data.items[0].snippet.channelTitle);
      data.items.map(async (video) => {
        await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${video.id.videoId}&key=${API_KEY}`
        )
          .then((data) => data.json())
          .then((data) => {
            data = data.items[0];
            console.log(data);
            $(".channel__videos__wrapper").append(`
        <a href="/v/?id=${video?.id?.videoId}" class="video">
        <div class="video__image"><img src="${
          video?.snippet?.thumbnails?.high?.url
        }" alt="Related image" /></div>
        <div class="video__title">${video?.snippet?.title}</div>
        <div class="video__chips">
            <div class="chip">
                <div class="chip__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <div class="chip__text">${getLikesPercent(
                  data.statistics
                )}%</div>
            </div>
            <div class="chip">
                <div class="chip__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <div class="chip__text">${getVideoDuration(
                  data.contentDetails.duration
                )}</div>
            </div>
            <div class="chip">
                <div class="chip__text">${convertToInternationalCurrencySystem(
                  data.statistics.viewCount
                )} Views</div>
            </div>
        </div>
      </a>
        `);
          });
      });
    });
});

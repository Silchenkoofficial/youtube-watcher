const iFrameVideo = document.getElementById("js-youtube-iframe");
import { API_KEY } from "./config";

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

const getVideoID = () => {
  var paramsString = document.location.search; // ?page=4&limit=10&sortby=desc
  var searchParams = new URLSearchParams(paramsString);
  return searchParams.get("id");
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

const showVideo = async () => {
  await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${getVideoID()}&key=${API_KEY}`
  )
    .then((data) => data.json())
    .then((data) => {
      console.log(data);
      data = data.items[0];
      let day = new Date(data.snippet.publishedAt).getDate();
      let month = new Date(data.snippet.publishedAt).getMonth() + 1;
      month = month > 9 ? month : "0" + month;
      let year = new Date(data.snippet.publishedAt).getFullYear();

      let htmlData = `
        <iframe
          src="https://www.youtube.com/embed/${getVideoID()}?rel=0&amp;modestbranding=1&amp;showinfo=0&amp;controls=1&amp;iv_load_policy=3&amp;autoplay=0&amp;enablejsapi=1" 
          seamless="" 
          frameborder="0" 
          allowfullscreen 
          allow="autoplay; encrypted-media; fullscreen"
        ></iframe>
    <div class="video-player__video-info video-info">
        <div class="video-info__name">${data.snippet.title}</div>
        <div class="video-info__sub-info">
            <div class="video__chips">
                <div class="chip">
                    <div class="chip__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                            viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="chip__text">${getLikesPercent(
                      data.statistics
                    )}%</div>
                </div>
                <div class="chip">
                    <div class="chip__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                            viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clip-rule="evenodd" />
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
            <a href="/ch" class="video-info__channel-name">${
              data.snippet.channelTitle
            }</a>
            <div class="video-info__video-date">${day}.${month}.${year}</div>
        </div>
        <div class="video-info__description">${data.snippet.description
          .replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, "$1 <br>$2")
          .replace(
            /\b(https?\:\/\/\S+)/gm,
            '<a class="description__link" href="$1">$1</a>'
          )}</div>
    </div>
        `;

      document.querySelector(".video-player__iframe").innerHTML = htmlData;
      document
        .querySelectorAll(".js-loading--iframe")
        .forEach((e) => e.remove());
    });
};

const loadRelatedVideos = async () => {
  await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${getVideoID()}&type=video&key=${API_KEY}`
  )
    .then((data) => data.json())
    .then((data) => {
      data.items
        .filter((_, index) => index !== data.items.length - 1)
        .map(async (video) => {
          await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${video.id.videoId}&key=${API_KEY}`
          )
            .then((data) => data.json())
            .then((data) => {
              if (
                video?.id &&
                video?.snippet?.thumbnails &&
                video?.snippet?.title
              ) {
                let videoLink = document.createElement("a");
                videoLink.classList.add("video");
                videoLink.href = `/v/?id=${video?.id?.videoId}`;

                let videoImage = document.createElement("div");
                videoImage.classList.add("video__image");
                videoImage.innerHTML = `<img src="${video?.snippet?.thumbnails?.high?.url}" alt="Related image" />`;

                let videoTitle = document.createElement("div");
                videoTitle.classList.add("video__title");
                videoTitle.textContent = video?.snippet?.title;

                $(videoLink).html(`
                <div class="video__chips">
                    <div class="chip">
                        <div class="chip__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                        <div class="chip__text">97%</div>
                    </div>
                    <div class="chip">
                        <div class="chip__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                        <div class="chip__text">31:06</div>
                    </div>
                    <div class="chip">
                        <div class="chip__text">312K Views</div>
                    </div>
                </div>
                `);

                // let videoChips = document.createElement('div');
                // videoChips.classList.add("video__chips");
                // for (let i = 0; i < 3; i++) {
                //   let videoChip = document.createElement('div');
                //   videoChip.classList.add("chip");

                // }

                videoLink.appendChild(videoImage);
                videoLink.appendChild(videoTitle);

                document
                  .querySelector("#js-related-videos")
                  .appendChild(videoLink);
              }
            });
        });
      document
        .querySelectorAll(".js-loading--related")
        .forEach((e) => e.remove());
    });
};

document.addEventListener("DOMContentLoaded", function () {
  if (iFrameVideo) {
    document.querySelector(".video-page").value =
      localStorage.getItem("video-url");
    showVideo();
    loadRelatedVideos();
  }
});

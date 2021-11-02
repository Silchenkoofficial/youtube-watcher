const iFrameVideo = document.getElementById("js-youtube-iframe");
const API_KEY = "AIzaSyC6OEeV1De1LWqluWcFqhdxByW9UoiiSD0";

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
    .replace("PT", "");
};

const showVideo = () => {
  $.getJSON(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${getVideoID()}&key=${API_KEY}`,
    function (data) {
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
        allowfullscreen="" 
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
                  <div class="chip__text">${
                    data.statistics.viewCount
                  } Views</div>
              </div>
          </div>
          <div class="video-info__channel-name">${
            data.snippet.channelTitle
          }</div>
          <div class="video-info__video-date">${day}.${month}.${year}</div>
      </div>
      <div class="video-info__description">${
        data.snippet.localized.description
      }</div>
  </div>
      `;
      $(".video-player__iframe").append(htmlData);
    }
  );
};

const loadRelatedVideos = () => {
  $.getJSON(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${getVideoID()}&type=video&key=${API_KEY}`,
    (data) => {
      data.items
        .filter((el, index) => index !== data.items.length - 1)
        .map((video, index) => {
          video.id &&
            video.snippet.thumbnails &&
            video.snippet.title &&
            $("#js-related-videos").append(`
          <a href="/v/?id=${video?.id?.videoId}" class="video">
            <div class="video__image">
                <img
                src="${video?.snippet?.thumbnails?.high?.url}"
                alt="Related image"
                />
            </div>
            <div class="video__title">${video?.snippet?.title}</div>
            </a>
          `);
        });
    }
  );
};

$(document).ready(() => {
  $(".video-page").val(localStorage.getItem("video-url"));
  if (iFrameVideo) {
    showVideo();
    loadRelatedVideos();
  }
});

{
  /* <a href="/v/?id=${video.id.videoId}" class="video">
  <div class="video__image">
    <img src="${video.snippet.thumbnails.standard.url}" alt="Related image" />
  </div>
  <div class="video__title">${video.snippet.title}</div>
  <div class="video__chips">
    <div class="chip">
      <div class="chip__icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <div class="chip__text">${getLikesPercent(video.statistics)}%</div>
    </div>
    <div class="chip">
      <div class="chip__icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <div class="chip__text">
        ${getVideoDuration(video.contentDetails.duration)}
      </div>
    </div>
    <div class="chip">
      <div class="chip__text">1172 Views</div>
    </div>
  </div>
</a>; */
}

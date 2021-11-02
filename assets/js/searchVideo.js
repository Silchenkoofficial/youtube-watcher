const iFrameVideo = document.getElementById("js-youtube-iframe");
const API_KEY = "AIzaSyC6OEeV1De1LWqluWcFqhdxByW9UoiiSD0";

const showVideo = () => {
  var paramsString = document.location.search; // ?page=4&limit=10&sortby=desc
  var searchParams = new URLSearchParams(paramsString);
  const videoID = searchParams.get("id");
  $.getJSON(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoID}&key=${API_KEY}`,
    function (data) {
      data = data.items[0];
      let likesPercent = Math.round(
        (100 * parseInt(data.statistics.likeCount)) /
          (parseInt(data.statistics.likeCount) +
            parseInt(data.statistics.dislikeCount))
      );

      let day = new Date(data.snippet.publishedAt).getDate();
      let month = new Date(data.snippet.publishedAt).getMonth() + 1;
      month = month > 9 ? month : "0" + month;
      let year = new Date(data.snippet.publishedAt).getFullYear();

      let htmlData = `
      <iframe
        src="https://www.youtube.com/embed/${videoID}?rel=0&amp;modestbranding=1&amp;showinfo=0&amp;controls=1&amp;iv_load_policy=3&amp;autoplay=0&amp;enablejsapi=1" 
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
                  <div class="chip__text">${likesPercent}%</div>
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
                  <div class="chip__text">${data.contentDetails.duration
                    .replace("H", ":")
                    .replace("M", ":")
                    .replace("S", "")
                    .replace("PT", "")}</div>
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
    `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&key=${API_KEY}`,
    (data) => {
      console.log(data);
      console.log(data.items[0].snippet.thumbnails.standard.url);
      let htmlRelatedVideo = `
      <div class="video">
      <div class="video__image">
        <img
          src="${data.items[0].snippet.thumbnails.default.url}"
          alt="Related image"
        />
      </div>
      <div class="video__title">
        Mini Raspberry Pi Server With Built Built BuiltBuilt
        Built Built
      </div>
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
          <div class="chip__text">97%</div>
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
          <div class="chip__text">27:05</div>
        </div>
        <div class="chip">
          <div class="chip__text">1172 Views</div>
        </div>
      </div>
    </div>
      `;
      $("#js-related-videos").append(htmlRelatedVideo);
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

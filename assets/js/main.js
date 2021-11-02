let copyrightYear = document.getElementById("js-year");
let searchForm = document.getElementById("js-search-form");
let searchInput = document.getElementById("js-search-input");

// Function of adding current year;
copyrightYear.innerText = new Date().getFullYear();

// Actions when you click the "Search" button
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  localStorage.setItem("video-url", searchInput.value);
  const videoID = [...searchInput.value.split("v=")][1];
  location.href = `/v/?id=${videoID}`;
});

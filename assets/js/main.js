let copyrightYear = document.getElementById("js-year");
let searchForm = document.getElementById("js-search-form");
let searchInput = document.getElementById("js-search-input");

// Function of adding current year;
copyrightYear.textContent = new Date().getFullYear();

// // Actions when you click the "Search" button
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  localStorage.setItem("video-url", searchInput.value);
  const videoID = [...searchInput.value.split("v=")][1];
  console.log([...searchInput.value.split("v=")][1]);
  if (
    [...searchInput.value.split("v=")][1] === "" ||
    [...searchInput.value.split("v=")][1] === undefined
  ) {
    document.querySelector(".error-message").textContent = "Введите ссылку";
  } else {
    window.location = `${document.location.protocol}//${document.location.host}/v/?id=${videoID}`;
  }
});

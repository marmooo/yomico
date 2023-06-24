function loadConfig() {
  if (localStorage.getItem("darkMode") == 1) {
    document.documentElement.dataset.theme = "dark";
  }
}

function toggleDarkMode() {
  if (localStorage.getItem("darkMode") == 1) {
    localStorage.setItem("darkMode", 0);
    delete document.documentElement.dataset.theme;
  } else {
    localStorage.setItem("darkMode", 1);
    document.documentElement.dataset.theme = "dark";
  }
}

loadConfig();

document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
document.getElementById("yomico").addEventListener("click", (e) => {
  import("./yomico.js").then((module) => {
    module.yomico("/yomico/index.yomi");
  });
  e.target.disabled = true;
}, { once: true });

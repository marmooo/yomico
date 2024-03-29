function loadConfig() {
  if (localStorage.getItem("darkMode") == 1) {
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }
}

function toggleDarkMode() {
  if (localStorage.getItem("darkMode") == 1) {
    localStorage.setItem("darkMode", 0);
    document.documentElement.setAttribute("data-bs-theme", "light");
  } else {
    localStorage.setItem("darkMode", 1);
    document.documentElement.setAttribute("data-bs-theme", "dark");
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

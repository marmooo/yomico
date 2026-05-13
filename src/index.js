function toggleDarkMode() {
  const html = document.documentElement;
  const newTheme = html.getAttribute("data-bs-theme") === "dark"
    ? "light"
    : "dark";
  html.setAttribute("data-bs-theme", newTheme);
  localStorage.setItem("darkMode", newTheme);
}

document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
document.getElementById("yomico").addEventListener("click", (e) => {
  import("./yomico.js").then((module) => {
    module.yomico("/yomico/index.yomi");
  });
  e.target.disabled = true;
}, { once: true });

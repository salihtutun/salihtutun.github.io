/* Theme and mobile menu for the DAT 5668 page. */
const root = document.documentElement;
const stored = localStorage.getItem("dat5668-theme");
if (stored === "light" || stored === "dark") root.setAttribute("data-theme", stored);

document.getElementById("theme-toggle").addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
  localStorage.setItem("dat5668-theme", next);
});

const menu = document.getElementById("nav-menu");
document.getElementById("menu-toggle").addEventListener("click", () => {
  menu.classList.toggle("open");
});
menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => menu.classList.remove("open"));
});

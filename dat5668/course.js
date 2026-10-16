/* Mobile menu for the DAT 5668 page. The site is light only. */
const menu = document.getElementById("nav-menu");
document.getElementById("menu-toggle").addEventListener("click", () => {
  menu.classList.toggle("open");
});
menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => menu.classList.remove("open"));
});

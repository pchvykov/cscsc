// Shared behaviour for the prototypes: nav disclosure + the generated lists.
(() => {
  const nav = document.getElementById("nav");
  if (nav) {
    const tops = nav.querySelectorAll("button.top");
    const closeAll = (except) => tops.forEach((b) => { if (b !== except) b.setAttribute("aria-expanded", "false"); });
    tops.forEach((b) => b.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = b.getAttribute("aria-expanded") === "true";
      closeAll(b);
      b.setAttribute("aria-expanded", String(!open));
    }));
    document.addEventListener("click", () => closeAll());
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeAll(); nav.classList.remove("open"); } });
    const toggle = nav.querySelector(".menu-toggle");
    toggle && toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Close" : "Menu";
    });
  }

  // Prototype-only: theme switch in the corner note (auto -> light -> dark).
  const note = document.querySelector(".proto-note");
  if (note) {
    const b = document.createElement("button");
    const modes = ["auto", "light", "dark"];
    let i = 0;
    try { i = Math.max(0, modes.indexOf(localStorage.getItem("proto-theme") || "auto")); } catch (e) {}
    const apply = () => {
      const m = modes[i];
      if (m === "auto") document.documentElement.removeAttribute("data-theme"); else document.documentElement.setAttribute("data-theme", m);
      b.textContent = "theme: " + m;
      try { localStorage.setItem("proto-theme", m); } catch (e) {}
    };
    b.addEventListener("click", () => { i = (i + 1) % modes.length; apply(); });
    note.append(" · ", b);
    apply();
  }

  const D = window.CSCSC;
  if (!D) return;
  const today = new Date().toISOString().slice(0, 10);
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Latest: the next upcoming item pinned first, then up to 3 recent items,
  // dropping anything older than ~4 months. The build will do the same.
  const cutoff = new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString().slice(0, 10);
  const upcoming = D.now.filter((x) => x.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const recent = D.now.filter((x) => x.date < today && x.date >= cutoff);
  const items = [...upcoming.slice(0, 1).map((x) => ({ ...x, next: true })), ...recent].slice(0, 4);
  const latest = document.getElementById("latest");
  if (latest) latest.innerHTML = items.map((x) => `
    <li class="${x.next ? "next" : ""}">
      <div class="when"><b>${x.next ? "Next · " : ""}${esc(x.label)}</b>${D.fmt(x.date)}</div>
      <div><h3><a href="${x.href}">${esc(x.title)}</a></h3><p>${esc(x.blurb)}</p></div>
    </li>`).join("");

  const qs = document.getElementById("questions");
  if (qs) qs.innerHTML = D.questions.map((q) => `
    <li><a href="#"><span class="q">${esc(q)}</span><span class="arrow" aria-hidden="true">→</span></a></li>`).join("");

  const posts = document.getElementById("posts");
  if (posts) posts.innerHTML = D.posts.map((p) => `
    <li><a href="#"><span class="meta">${D.fmt(p.date)} · ${esc(p.cat)}</span><span class="t">${esc(p.title)}</span><span class="x">${esc(p.excerpt)}</span></a></li>`).join("");
})();

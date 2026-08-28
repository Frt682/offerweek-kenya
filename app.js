const $ = (s, r = document) => r.querySelector(s);

const state = {
  tab: "latest",
  query: "",
  favOnly: false,
  favStores: JSON.parse(localStorage.getItem("ow-favs") || "[]"),
  viewer: null,
  page: 0
};

function saveFavs() {
  localStorage.setItem("ow-favs", JSON.stringify(state.favStores));
}

function isRealCatalog(c) {
  return !c.empty && Boolean(c.cover);
}

function filteredCatalogs() {
  const q = state.query.trim().toLowerCase();
  return APP_DATA.catalogs.filter((c) => {
    const hit = !q || c.store.toLowerCase().includes(q) || c.title.toLowerCase().includes(q);
    const fav = !state.favOnly || state.favStores.includes(c.storeId);
    return hit && fav;
  });
}

function filteredStores() {
  const q = state.query.trim().toLowerCase();
  return APP_DATA.stores.filter((s) => {
    const hit = !q || s.name.toLowerCase().includes(q);
    const fav = !state.favOnly || state.favStores.includes(s.id);
    return hit && fav;
  });
}

function catalogCount(storeId) {
  return APP_DATA.catalogs.filter((c) => c.storeId === storeId && isRealCatalog(c)).length;
}

function cardMarkup(c) {
  const date = c.date || (APP_DATA.week && APP_DATA.week.label) || "";
  if (c.empty || !c.cover) {
    const url = c.sourceUrl || "#";
    return `
      <a class="card card-empty" href="${url}" target="_blank" rel="noopener noreferrer">
        <div class="card-name">${c.store}</div>
        <div class="cover-wrap empty-cover">
          <div class="empty-cover-inner">
            <strong>No flyer this week</strong>
            <span>Open official promos</span>
          </div>
        </div>
        <div class="card-date">${date}</div>
      </a>
    `;
  }
  return `
    <button class="card" data-open="${c.id}">
      <div class="card-name">${c.store}</div>
      <div class="cover-wrap"><img src="${c.cover}" alt="${c.title}"></div>
      <div class="card-date">${date}</div>
    </button>
  `;
}

function render() {
  $("#tab-stores").classList.toggle("active", state.tab === "stores");
  $("#tab-latest").classList.toggle("active", state.tab === "latest");
  $("#starBtn").classList.toggle("on", state.favOnly);
  $("#storeList").style.display = state.tab === "stores" ? "grid" : "none";
  $("#grid").style.display = state.tab === "latest" ? "grid" : "none";

  if (state.tab === "latest") {
    const items = filteredCatalogs();
    $("#grid").innerHTML = items.length
      ? items.map(cardMarkup).join("")
      : `<div class="empty" style="grid-column:1/-1">No catalogues this week.</div>`;
  } else {
    const stores = filteredStores();
    $("#storeList").innerHTML = stores.length
      ? stores.map((s) => {
          const count = catalogCount(s.id);
          const starred = state.favStores.includes(s.id);
          return `
            <button class="store-row" data-store="${s.id}">
              <div class="badge" style="color:${s.color}">${s.name.slice(0, 2).toUpperCase()}</div>
              <div class="store-meta">
                <b>${s.name}</b>
                <span>${count} catalogue${count === 1 ? "" : "s"}</span>
              </div>
              <span>${starred ? "★" : "☆"}</span>
            </button>
          `;
        }).join("")
      : `<div class="empty">No stores found.</div>`;
  }
}

function openViewer(id) {
  const item = APP_DATA.catalogs.find((c) => c.id === id);
  if (!item) return;
  if (item.empty || !item.cover || !item.pages || !item.pages.length) {
    if (item.sourceUrl) window.open(item.sourceUrl, "_blank", "noopener,noreferrer");
    return;
  }
  state.viewer = item;
  state.page = 0;
  $("#viewerImg").src = item.pages[0];
  $("#viewerTitle").textContent = item.store;
  $("#viewer").classList.add("open");
}

function closeViewer() {
  $("#viewer").classList.remove("open");
  state.viewer = null;
}

function turn(dir) {
  if (!state.viewer) return;
  const next = state.page + dir;
  if (next < 0 || next >= state.viewer.pages.length) return;
  state.page = next;
  $("#viewerImg").src = state.viewer.pages[state.page];
}

document.addEventListener("click", (e) => {
  if (e.target.id === "tab-stores") { state.tab = "stores"; render(); }
  if (e.target.id === "tab-latest") { state.tab = "latest"; render(); }
  if (e.target.id === "starBtn") { state.favOnly = !state.favOnly; render(); }
  const open = e.target.closest("[data-open]");
  if (open) openViewer(open.dataset.open);
  const store = e.target.closest("[data-store]");
  if (store) {
    const id = store.dataset.store;
    if (e.target.textContent === "★" || e.target.textContent === "☆") {
      state.favStores = state.favStores.includes(id)
        ? state.favStores.filter((x) => x !== id)
        : [...state.favStores, id];
      saveFavs();
      render();
    } else {
      state.tab = "latest";
      state.query = APP_DATA.stores.find((s) => s.id === id).name;
      $("#search").value = state.query;
      render();
    }
  }
  if (e.target.id === "closeViewer") closeViewer();
  if (e.target.id === "prevPage") turn(-1);
  if (e.target.id === "nextPage") turn(1);
});

$("#search").addEventListener("input", (e) => {
  state.query = e.target.value;
  render();
});

render();

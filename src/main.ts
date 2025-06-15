import SideNavLinks from "./components/sidebarNav";
import { useNoteStore } from "./store/noteStore";
import "./style.css";
import { type Note } from "./types";

const form = document.querySelector<HTMLFormElement>("#note-form")!;
const titleInput = document.querySelector<HTMLInputElement>("#title")!;
const contentInput = document.querySelector<HTMLTextAreaElement>("#content")!;
const notesContainer =
  document.querySelector<HTMLDivElement>("#notes-container")!;

document.addEventListener("DOMContentLoaded", () => {
  renderNotes(getNotes());
  calculateHeaderHeight();
  initNavButtons();
  initBurgerMenu();
  initFullForm();
  initSearchInput();
});

// note form
form.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === "Enter") {
    e.preventDefault();

    const newNote: Note = {
      id: crypto.randomUUID(),
      title: titleInput.value,
      content: contentInput.value,
      pinned: false,
      backgroundColor: "#ffffff",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    useNoteStore.getState().addNote(newNote);
    renderNotes(getNotes());

    form.reset();
  }
});

// create note card
function createNoteCard(note: Note) {
  const card = document.createElement("div");
  card.className =
    "border border-[#e0e0e0] my-4 rounded-lg sm:w-[240px] flex flex-col h-full group";
  card.id = "note-card";

  // card title
  const title = document.createElement("h2");
  title.className =
    "text-lg md:text-xl lg:text-2xl font-semibold font-google-sans px-4 pt-2 m-0";
  title.innerHTML = note.title;

  // card content
  const content = document.createElement("p");
  content.className = "text-sm md:text-lg font-roboto py-3 px-4";
  content.innerHTML = note.content;

  // card quick actions
  const quickActions = document.createElement("div");
  quickActions.className =
    "quick-actions flex flex-wrap items-center my-[4px] mt-auto opacity-0 invisible transition-all duration-[0.218s] ease-in group-hover:opacity-100 group-hover:visible";

  // background color options container
  const bgColorOptionsContainer = document.createElement("div");
  bgColorOptionsContainer.className = "relative";

  // actions listing button container
  const actionListContainer = document.createElement("div");
  actionListContainer.className = "relative";

  // append action list button container, bg color options container to the quick actions
  quickActions.appendChild(bgColorOptionsContainer);
  quickActions.appendChild(actionListContainer);

  // bgColor option button
  const bgColorOptionBtn = document.createElement("button");
  bgColorOptionBtn.type = "button";
  bgColorOptionBtn.className =
    "cursor-pointer w-[32px] h-[32px] rounded-full mx-[3px] text-[rgb(32,33,36)] opacity-[0.71] hover:opacity-[.87] hover:bg-[rgba(95,99,104,0.157)]";
  bgColorOptionBtn.style.backgroundImage =
    "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjMDAwIj4KICA8cGF0aCBkPSJNMTIgMjJDNi40OSAyMiAyIDE3LjUxIDIgMTJTNi40OSAyIDEyIDJzMTAgNC4wNCAxMCA5YzAgMy4zMS0yLjY5IDYtNiA2aC0xLjc3Yy0uMjggMC0uNS4yMi0uNS41IDAgLjEyLjA1LjIzLjEzLjMzLjQxLjQ3LjY0IDEuMDYuNjQgMS42N0EyLjUgMi41IDAgMCAxIDEyIDIyem0wLTE4Yy00LjQxIDAtOCAzLjU5LTggOHMzLjU5IDggOCA4Yy4yOCAwIC41LS4yMi41LS41YS41NC41NCAwIDAgMC0uMTQtLjM1Yy0uNDEtLjQ2LS42My0xLjA1LS42My0xLjY1YTIuNSAyLjUgMCAwIDEgMi41LTIuNUgxNmMyLjIxIDAgNC0xLjc5IDQtNCAwLTMuODYtMy41OS03LTgtN3oiLz48Y2lyY2xlIGN4PSI2LjUiIGN5PSIxMS41IiByPSIxLjUiLz4KICA8Y2lyY2xlIGN4PSI5LjUiIGN5PSI3LjUiIHI9IjEuNSIvPjxjaXJjbGUgY3g9IjE0LjUiIGN5PSI3LjUiIHI9IjEuNSIvPjxjaXJjbGUgY3g9IjE3LjUiIGN5PSIxMS41IiByPSIxLjUiLz4KPC9zdmc+Cg==)";
  bgColorOptionBtn.style.backgroundRepeat = "no-repeat";
  bgColorOptionBtn.style.backgroundPosition = "center center";
  bgColorOptionBtn.style.backgroundSize = "18px 18px";
  bgColorOptionBtn.onclick = (e) => {
    e.preventDefault();
    const quickActions = bgColorOptionBtn.closest(
      ".quick-actions"
    ) as HTMLElement;
    quickActions.classList.toggle("opacity-0");
    quickActions.classList.toggle("invisible");
  };

  // append bg color options button to the bg color options container
  bgColorOptionsContainer.appendChild(bgColorOptionBtn);

  // actions listing button
  const actionListBtn = document.createElement("button");
  actionListBtn.type = "button";
  actionListBtn.className =
    "cursor-pointer w-[32px] h-[32px] rounded-full mx-[3px] text-[rgb(32,33,36)] opacity-[0.71] hover:opacity-[.87] hover:bg-[rgba(95,99,104,0.157)]";
  actionListBtn.style.backgroundImage =
    "url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWw6c3BhY2U9InByZXNlcnZlIiB2ZXJzaW9uPSIxLjEiIHk9IjBweCIgeD0iMHB4IiB2aWV3Qm94PSIwIDAgMTggMTgiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDE4IDE4IiAgZmlsbD0iIzAwMCI+CiAgPHBhdGggZD0ibTkgNS41YzEgMCAxLjgtMC44IDEuOC0xLjhzLTAuOC0xLjctMS44LTEuNy0xLjggMC44LTEuOCAxLjggMC44IDEuNyAxLjggMS43em0wIDEuN2MtMSAwLTEuOCAwLjgtMS44IDEuOHMwLjggMS44IDEuOCAxLjggMS44LTAuOCAxLjgtMS44LTAuOC0xLjgtMS44LTEuOHptMCA1LjNjLTEgMC0xLjggMC44LTEuOCAxLjhzMC44IDEuNyAxLjggMS43IDEuOC0wLjggMS44LTEuOC0wLjgtMS43LTEuOC0xLjd6Ii8+Cjwvc3ZnPgo=)";
  actionListBtn.style.backgroundRepeat = "no-repeat";
  actionListBtn.style.backgroundPosition = "center center";
  actionListBtn.style.backgroundSize = "18px 18px";

  // append actions listing button to the actions listing container
  actionListContainer.appendChild(actionListBtn);

  // append title to card
  if (note.title) {
    card.appendChild(title);
  }
  // append content to card
  if (note.content) {
    card.appendChild(content);
  }
  // append quick actions to card
  card.appendChild(quickActions);

  // card.innerHTML = `
  //     <h2 class="text-lg font-semibold font-google-sans">${note.title}</h2>
  //     <p class="text-sm font-roboto">${note.content}</p>
  //     <div class="">
  //     <button></button>
  //     </div>
  //   `;
  return card;
}

// get notes from local storage
function getNotes() {
  const notes = useNoteStore.getState().notes;
  return notes;
}

// render notes
function renderNotes(notes: Note[]) {
  notesContainer.innerHTML = "";

  for (const note of notes) {
    const noteCard = createNoteCard(note);
    notesContainer.appendChild(noteCard);
  }
}

// calculate header height
function calculateHeaderHeight() {
  const headerHeight = document.querySelector("header")?.clientHeight;
  document.body.style.setProperty("--headerHeight", `${headerHeight}px`);
}

// init burger menu
function initBurgerMenu() {
  const opener = document.querySelector<HTMLButtonElement>("#nav-opener");
  const holder = document.body;
  const activeClass = "nav-active";
  opener?.addEventListener("click", () => {
    holder.classList.toggle(activeClass);
  });
}

// init nav menu (buttons)
function initNavButtons() {
  const navBtnsContainer = document.querySelector(".nav-ul");
  if (navBtnsContainer) {
    navBtnsContainer.innerHTML = SideNavLinks();
  }
}

// init full sized form for note taking
function initFullForm() {
  contentInput?.addEventListener("focus", () => {
    if (titleInput?.classList.contains("hidden")) {
      titleInput?.classList.remove("hidden");
    }
  });
  contentInput?.addEventListener("keydown", (e: KeyboardEvent) => {
    const value = contentInput.value;
    const lines = value.split("\n");

    // 1. If Enter is pressed → increase rows
    if (e.key === "Enter") {
      contentInput.rows = lines.length + 1;
    }

    // 2. If Backspace on empty line → reduce rows
    if (
      e.key === "Backspace" &&
      lines[lines.length - 1] === "" &&
      contentInput.selectionStart === value.length // Only at the end
    ) {
      // prevent removing when only 1 row remains
      if (contentInput.rows > 1) {
        contentInput.rows = contentInput.rows - 1;
      }
    }
  });

  document?.addEventListener("click", (e) => {
    if (!form?.contains(e.target as Node)) {
      titleInput?.classList.add("hidden");
      titleInput.value = "";
      contentInput.value = "";
    }
  });
}

// init search input
function initSearchInput() {
  const searchForm = document.querySelector("#search-form") as HTMLFormElement;
  if (!searchForm) return;

  const searchInput = searchForm.querySelector("#search") as HTMLInputElement;
  const clearSearchBtn = searchForm.querySelector(
    "#clear-search-btn"
  ) as HTMLButtonElement;

  if (!searchInput) return;

  const notes = getNotes();

  searchInput.addEventListener("focus", () => {
    searchForm.style.backgroundColor = "white";
    searchForm.style.boxShadow =
      "0 1px 1px 0 rgba(65, 69, 73, 0.3), 0 1px 3px 1px rgba(65, 69, 73, 0.15)";
  });

  searchInput.addEventListener("blur", () => {
    searchForm.style.backgroundColor = "#f1f3f4";
    searchForm.style.boxShadow = "none";
  });

  searchInput.addEventListener("keyup", () => {
    if (searchInput.value.length > 0) {
      const query = searchInput.value.toLowerCase();
      clearSearchBtn?.classList.remove("invisible");

      form.classList.add("hidden");

      const filtered = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
      );

      renderNotes(filtered);
    } else {
      clearSearchBtn?.classList.add("invisible");
      form.classList.remove("hidden");
      renderNotes(getNotes());
    }
  });

  clearSearchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    searchInput.value = "";
    clearSearchBtn.classList.add("invisible");
    if (form.classList.contains("hidden")) {
      form.classList.remove("hidden");
    }
    renderNotes(getNotes());
  });
}

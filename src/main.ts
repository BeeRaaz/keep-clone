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
  card.className = "p-4 border border-[#e0e0e0] my-4 rounded-lg sm:w-[240px]";
  card.id = "note-card";
  card.innerHTML = `
      <h2 class="text-lg font-semibold font-google-sans">${note.title}</h2>
      <p class="text-sm font-roboto">${note.content}</p>
    `;
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

      const filtered = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
      );

      renderNotes(filtered);
    } else {
      clearSearchBtn?.classList.add("invisible");
      renderNotes(getNotes());
    }
  });

  clearSearchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    searchInput.value = "";
    clearSearchBtn.classList.add("invisible");
    renderNotes(getNotes());
  });
}

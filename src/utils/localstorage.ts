import type { Note } from "../types";

const STORAGE_KEY = "keep-notes";

export function getNotes(): Note[] {
  const notes = localStorage.getItem(STORAGE_KEY);
  return notes ? JSON.parse(notes) : [];
}

export function saveNotes(notes: Note[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}
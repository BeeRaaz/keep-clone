import { createStore } from "zustand";
import { type NoteStore } from "../types";
import { getNotes, saveNotes } from "../utils/localstorage";

export const useNoteStore = createStore<NoteStore>((set) => ({
  notes: getNotes(),

  addNote: (note) =>
    set((state) => {
      const updatedNotes = [...state.notes, note];
      saveNotes(updatedNotes);
      return { notes: updatedNotes };
    }),

  updateNote: (id, updatedNote) =>
    set((state) => {
      const updatedNotes = state.notes.map((note) =>
        note.id === id ? { ...note, ...updatedNote } : note
      );
      saveNotes(updatedNotes);
      return { notes: updatedNotes };
    }),

  deleteNote: (id) =>
    set((state) => {
      const updatedNotes = state.notes.filter((note) => note.id !== id);
      saveNotes(updatedNotes);
      return { notes: updatedNotes };
    }),
}));

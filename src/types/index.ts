export interface Note {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  backgroundColor: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteStore {
  notes: Note[];
  addNote: (note: Note) => void;
  updateNote: (id: string, updatedNote: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}
import { useEffect, useState } from "react";
import { getNotes, createNote, updateNote, deleteNote } from "../services/noteService";
import "./AdminNotesPage.css";

export default function AdminNotesPage() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    refreshNotes();
  }, []);

  const refreshNotes = async () => {
    const n = await getNotes();
    setNotes(n);
  };

  const handleSave = async () => {
    if (!newNote) return;

    try {
      let savedNote;
      if (editingId) {
        savedNote = await updateNote(editingId, { text: newNote });
        // Reemplazamos la nota editada en la lista
        setNotes(prevNotes =>
          prevNotes.map(n => n._id === savedNote._id ? savedNote : n)
        );
      } else {
        savedNote = await createNote({ text: newNote });
        // Agregamos la nueva nota al inicio de la lista
        setNotes(prevNotes => [savedNote, ...prevNotes]);
      }

      setNewNote("");
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Error guardando la nota");
    }
  };

  const handleEdit = (note) => {
    setEditingId(note._id);
    setNewNote(note.text);
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      // Eliminamos la nota de la lista sin recargar
      setNotes(prevNotes => prevNotes.filter(n => n._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error eliminando la nota");
    }
  };

  return (
    <div className="admin-notes-page">
      <h3>Administrar Notas</h3>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Escribe la nota..."
        />
        <button type="button" onClick={handleSave}>
          {editingId ? "Guardar" : "Crear"}
        </button>
      </div>
      <ul>
        {notes.map((note) => (
          <li key={note._id}>
            {note.text}{" "}
            <button onClick={() => handleEdit(note)}>✏️</button>{" "}
            <button onClick={() => handleDelete(note._id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

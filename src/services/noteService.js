import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/notes";

export const getNotes = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createNote = async (note) => {
  const res = await axios.post(API_URL, note);
  return res.data;
};

export const updateNote = async (id, note) => {
  const res = await axios.put(`${API_URL}/${id}`, note);
  return res.data;
};

export const deleteNote = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};

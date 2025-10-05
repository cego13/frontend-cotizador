const API_URL = "http://localhost:4000/api/quotations";

export const getQuotations = async () => {
  const res = await fetch(API_URL);
  return await res.json();
};

export const createQuotation = async (data) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const updateQuotation = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};
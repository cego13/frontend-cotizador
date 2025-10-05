const API_URL = 'http://localhost:4000/api/companies';

export const getCompanies = async () => {
  const res = await fetch(API_URL);
  return await res.json();
};

export const createCompany = async (data) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
};

export const updateCompany = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
};

export const deleteCompany = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  return await res.json();
};

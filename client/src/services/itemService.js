// client/src/services/itemService.js
import api from "./api";

export const getItems = (search = "") => {
    if (search) {
        return api.get("/items", { params: { search } });
    }
    return api.get("/items");
};

export const getItemById = (id) => api.get(`/items/${id}`);

export const createItem = (data) => api.post("/items", data);

export const updateItem = (id, data) => api.put(`/items/${id}`, data);

export const deleteItem = (id) => api.delete(`/items/${id}`);

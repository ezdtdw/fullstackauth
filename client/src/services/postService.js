import api from "./api";

export const getPosts = async (search = "") => {
    if (search) {
        return api.get("/posts", { params: { search } });
    }
    return api.get("/posts");
};

export const getPostById = async (id) => {
    return api.get(`/posts/${id}`);
};

export const createPost = async (data) => {
    return api.post("/posts", data);
};

export const updatePost = async (id, data) => {
    return api.put(`/posts/${id}`, data);
};

export const deletePost = async (id) => {
    return api.delete(`/posts/${id}`);
};

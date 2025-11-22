import React, { useState, useEffect, useContext } from "react";
import { getPosts, createPost, updatePost, deletePost } from "../services/postService";
import { AuthContext } from "../context/AuthContext";

const Posts = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ id: null, title: "", content: "" });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadPosts = async (searchQuery = "") => {
    try {
      setLoading(true);
      setError("");
      const res = await getPosts(searchQuery);
      setPosts(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!form.title || !form.content) {
        return setError("Title dan content wajib diisi");
      }

      if (form.id) {
        await updatePost(form.id, {
          title: form.title,
          content: form.content,
        });
      } else {
        await createPost({
          title: form.title,
          content: form.content,
        });
      }

      setForm({ id: null, title: "", content: "" });
      setError("");
      loadPosts(search);
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan post");
    }
  };

  const handleEdit = (post) => {
    setForm({
      id: post.id,
      title: post.title,
      content: post.content,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus post ini?")) return;

    try {
      await deletePost(id);
      setError("");
      loadPosts(search);
    } catch (err) {
      console.error(err);
      setError("Gagal menghapus post");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadPosts(search);
  };

  const handleClearSearch = () => {
    setSearch("");
    loadPosts("");
  };

  return (
    <div className="container mt-4">
      <h2>Posts</h2>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-4">
        <h4>{form.id ? "Edit Post" : "Buat Post Baru"}</h4>

        <div className="mb-2">
          <label className="form-label">Title</label>
          <input
            className="form-control"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Judul post"
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Content</label>
          <textarea
            className="form-control"
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Isi konten post"
            rows={5}
          />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            {form.id ? "Update Post" : "Buat Post"}
          </button>
          {form.id && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setForm({ id: null, title: "", content: "" })}
            >
              Batal Edit
            </button>
          )}
        </div>
      </form>

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Cari Posts</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSearch} className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Cari berdasarkan title atau content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-info">
              Cari
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClearSearch}
            >
              Reset
            </button>
          </form>
        </div>
      </div>

      <h4>Daftar Posts</h4>
      {loading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p>Belum ada data.</p>
      ) : (
        <div className="row">
          {posts.map((post) => (
            <div key={post.id} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.content}</p>
                  <small className="text-muted">
                    By: {post.User?.username || post.User?.email}
                  </small>
                  <div className="mt-3 d-flex gap-2">
                    {user?.id === post.userId && (
                      <>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleEdit(post)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(post.id)}
                        >
                          Hapus
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;

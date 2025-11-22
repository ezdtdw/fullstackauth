// client/src/pages/Items.jsx
import React, { useEffect, useState } from "react";
import { getItems, createItem, updateItem, deleteItem } from "../services/itemService";

const Items = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ id: null, name: "", stock: "" });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const loadItems = async (searchQuery = "") => {
    try {
      setLoading(true);
      const res = await getItems(searchQuery);
      setItems(res.data);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
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
      if (!form.name || form.stock === "") {
        return alert("Name dan stock wajib diisi");
      }

      if (form.id) {
        await updateItem(form.id, {
          name: form.name,
          stock: Number(form.stock),
        });
      } else {
        await createItem({
          name: form.name,
          stock: Number(form.stock),
        });
      }

      setForm({ id: null, name: "", stock: "" });
      loadItems(search);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan item");
    }
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      name: item.name,
      stock: item.stock,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus item ini?")) return;

    try {
      await deleteItem(id);
      loadItems(search);
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus item");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadItems(search);
  };

  const handleClearSearch = () => {
    setSearch("");
    loadItems("");
  };

  return (
    <div className="container mt-4">
      <h2>Items</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nama barang"
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Stock</label>
          <input
            type="number"
            className="form-control"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            placeholder="Jumlah stok"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {form.id ? "Update Item" : "Tambah Item"}
        </button>
        {form.id && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => setForm({ id: null, name: "", stock: "" })}
          >
            Batal Edit
          </button>
        )}
      </form>

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Cari Items</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSearch} className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Cari nama item..."
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

      <h4>Daftar Items</h4>
      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>Belum ada data.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Stock</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td>{it.id}</td>
                <td>{it.name}</td>
                <td>{it.stock}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(it)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(it.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Items;

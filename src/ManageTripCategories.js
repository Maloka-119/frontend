import React, { useEffect, useState } from "react";
import './ManageTripCategories.css';
import Categoryman from './Categoryman.jpg';

const ManageTripCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [formError, setFormError] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      const response = await fetch("https://localhost:7050/api/TripCategory", {
        headers: {
          "Authorization": `Bearer ${storedToken}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = '/login';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCategories(data);
    } catch (err) {
      showError(err.message.includes('Failed to fetch') 
        ? "Cannot connect to server. Please check your connection."
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 3000);
  };

  const showFormError = (message) => {
    setFormError(message);
    setTimeout(() => setFormError(""), 3000);
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name || !newCategory.description) {
      showFormError("Please fill in all fields");
      return;
    }

    // تحقق من وجود الفئة قبل الإضافة
    const categoryExists = categories.some(
      (category) => category.name.toLowerCase() === newCategory.name.toLowerCase()
    );
    if (categoryExists) {
      showFormError("Category already exists");
      return;
    }

    try {
      const storedToken = localStorage.getItem("token");
      const response = await fetch("https://localhost:7050/api/TripCategory", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${storedToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          Name: newCategory.name,
          Description: newCategory.description
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating category:", errorData);
        throw new Error(` ${response.status}`);
      }

      await fetchCategories();
      setNewCategory({ name: "", description: "" });
    } catch (err) {
      showFormError(err.message || "Failed to create category.");
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    if (!newCategory.name || !newCategory.description) {
      showFormError("Please fill in all fields");
      return;
    }

    try {
      const storedToken = localStorage.getItem("token");
      const response = await fetch(`https://localhost:7050/api/TripCategory/${editingCategory.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${storedToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          Name: newCategory.name,
          Description: newCategory.description
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating category:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchCategories();
      setEditingCategory(null);
      setNewCategory({ name: "", description: "" });
    } catch (err) {
      showError(err.message || "Failed to update category.");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const storedToken = localStorage.getItem("token");
      const response = await fetch(`https://localhost:7050/api/TripCategory/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${storedToken}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting category:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // حذف العنصر من الواجهة بدون انتظار إعادة تحميل
      setCategories(prev => prev.filter(cat => cat.id !== id));

    } catch (err) {
      showError(err.message || "Failed to delete category.");
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setNewCategory({ 
      name: category.name, 
      description: category.description 
    });
  };

  return (
    <div className="manage-trip-categories-container" style={{ backgroundImage: `url(${Categoryman})` }}>
      <h2 style={{color:"white"}}>Manage Trip Categories</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="create-category-form">
        <h3 style={{color:"white"}}>{editingCategory ? "Edit Category" : "Create New Category"}</h3>
        
        {formError && <div className="form-error">{formError}</div>}
        
        <input
          type="text"
          placeholder="Category Name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
        />
        
        <input
          type="text"
          placeholder="Category Description"
          value={newCategory.description}
          onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
        />
        
        <div className="form-actions">
          {editingCategory ? (
            <>
              <button onClick={handleUpdateCategory}>Update</button>
              <button onClick={() => {
                setEditingCategory(null);
                setNewCategory({ name: "", description: "" });
              }}>Cancel</button>
            </>
          ) : (
            <button onClick={handleCreateCategory}>Create</button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading categories...</div>
      ) : (
        <div className="categories-list">
          {categories.length === 0 ? (
            <p>No categories found</p>
          ) : (
            <table className="categories-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>{category.description}</td>
                    <td>
                      <button onClick={() => handleEditClick(category)}>Edit</button>
                      <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageTripCategories;
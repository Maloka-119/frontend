// the real one

// import React, { useEffect, useState } from "react";
// import './ManageTripCategories.css';
// import Categoryman from './Categoryman.jpg';
// import BackiconAdmin from './BackiconAdmin.jpg';

// const ManageTripCategories = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [newCategory, setNewCategory] = useState({ name: "", description: "" });
//   const [formError, setFormError] = useState("");
//   const [editingCategory, setEditingCategory] = useState(null);

//   const apiUrl = "YOUR_BACKEND_API_URL"; // استبدل بهذا الرابط الصحيح للـ API

//   // جلب الفئات من الـ API عند تحميل الصفحة
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch(`${apiUrl}/categories`);
//         const data = await response.json();
//         setCategories(data);
//       } catch (err) {
//         setError("Failed to fetch categories.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // التعامل مع إضافة أو تحديث أو حذف الفئات
//   const handleAction = async (id, action) => {
//     try {
//       const url = `${apiUrl}/categories/${id}`;
//       const method = action === "delete" ? "DELETE" : "PUT";

//       const response = await fetch(url, {
//         method: method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: action !== "delete" ? JSON.stringify(newCategory) : null,
//       });

//       if (response.ok) {
//         if (action === "delete") {
//           setCategories(categories.filter((category) => category.id !== id));
//         } else {
//           const updatedCategories = categories.map((category) =>
//             category.id === id ? { ...category, ...newCategory } : category
//           );
//           setCategories(updatedCategories);
//         }
//       } else {
//         setError("Failed to update category.");
//       }
//     } catch (err) {
//       setError("Network error. Please try again.");
//       console.error(err);
//     }
//   };

//   // إضافة فئة جديدة
//   const handleCreateCategory = async () => {
//     if (!newCategory.name || !newCategory.description) {
//       setFormError("Please fill in all fields.");
//       return;
//     }

//     try {
//       const response = await fetch(`${apiUrl}/categories`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newCategory),
//       });

//       if (response.ok) {
//         const createdCategory = await response.json();
//         setCategories([...categories, createdCategory]);
//         setNewCategory({ name: "", description: "" });
//         setFormError("");
//       } else {
//         setFormError("Failed to create category.");
//       }
//     } catch (err) {
//       setFormError("Network error. Please try again.");
//       console.error(err);
//     }
//   };

//   const handleEditCategory = (category) => {
//     setEditingCategory(category);
//     setNewCategory({ name: category.name, description: category.description });
//   };

//   return (
//     <div className="manage-trip-categories-container" style={{ backgroundImage: `url(${Categoryman})` }}>
//       <h2 style={{color:"white"}}>Manage Trip Categories</h2>

//       {/* إضافة فئة جديدة */}
//       <div className="create-category-form">
//         <h3 style={{color:"white"}}>{editingCategory ? "Edit Category" : "Create New Category"}</h3>
//         {formError && <p className="error-message">{formError}</p>}
//         <input
//           type="text"
//           placeholder="Category Name"
//           value={newCategory.name}
//           onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="Category Description"
//           value={newCategory.description}
//           onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
//         />
//         <button onClick={editingCategory ? () => handleAction(editingCategory.id, "update") : handleCreateCategory}>
//           {editingCategory ? "Update Category" : "Create Category"}
//         </button>
//       </div>

//       {/* عرض الفئات */}
//       {loading ? (
//         <p>Loading categories...</p>
//       ) : error ? (
//         <p className="error-message">{error}</p>
//       ) : (
//         <table className="categories-table">
//           <thead>
//             <tr>
//               <th>Category Name</th>
//               <th>Description</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {categories.map((category) => (
//               <tr key={category.id}>
//                 <td>{category.name}</td>
//                 <td>{category.description}</td>
//                 <td>
//                   <button onClick={() => handleEditCategory(category)}>Edit</button>
//                   <button onClick={() => handleAction(category.id, "delete")}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* Icon link to home page */}
//       <a href="/admin" className="home-icon-link">
//         <img src={BackiconAdmin} alt="Home" className="home-icon" />
//       </a>
//     </div>
//   );
// };

// export default ManageTripCategories;

 


//test

import React, { useEffect, useState } from "react";
import './ManageTripCategories.css';
import Categoryman from './Categoryman.jpg'
import BackiconAdmin from './BackiconAdmin.jpg'

const ManageTripCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [formError, setFormError] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  // جلب الفئات من الـ API عند تحميل الصفحة
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts"); // API وهمي لاختبار الكود
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError("Failed to fetch categories.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // التعامل مع إضافة أو تحديث أو حذف الفئات
  const handleAction = async (id, action) => {
    try {
      const url = `https://jsonplaceholder.typicode.com/posts/${id}`; // API وهمي لاختبار الكود
      const method = action === "delete" ? "DELETE" : "PUT";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: action !== "delete" ? JSON.stringify(newCategory) : null,
      });

      if (response.ok) {
        if (action === "delete") {
          setCategories(categories.filter((category) => category.id !== id));
        } else {
          const updatedCategories = categories.map((category) =>
            category.id === id ? { ...category, ...newCategory } : category
          );
          setCategories(updatedCategories);
        }
      } else {
        setError("Failed to update category.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    }
  };

  // إضافة فئة جديدة
  const handleCreateCategory = async () => {
    if (!newCategory.name || !newCategory.description) {
      setFormError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", { // API وهمي لاختبار الكود
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        const createdCategory = await response.json();
        setCategories([...categories, createdCategory]);
        setNewCategory({ name: "", description: "" });
        setFormError("");
      } else {
        setFormError("Failed to create category.");
      }
    } catch (err) {
      setFormError("Network error. Please try again.");
      console.error(err);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({ name: category.name, description: category.body });
  };

  return (
    <div className="manage-trip-categories-container" style={{ backgroundImage: `url(${Categoryman})` }}>
      <h2 style={{color:"white"}}>Manage Trip Categories</h2>

      {/* إضافة فئة جديدة */}
      <div className="create-category-form">
        <h3 style={{color:"white"}}>{editingCategory ? "Edit Category" : "Create New Category"}</h3>
        {formError && <p className="error-message">{formError}</p>}
        <input
          type="text"
          placeholder="Category Name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category Description"
          value={newCategory.description}
          onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
        />
        <button onClick={editingCategory ? () => handleAction(editingCategory.id, "update") : handleCreateCategory}>
          {editingCategory ? "Update Category" : "Create Category"}
        </button>
      </div>

      {/* عرض الفئات */}
      {loading ? (
        <p>Loading categories...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <table className="categories-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.title}</td>
                <td>{category.body}</td>
                <td>
                  <button onClick={() => handleEditCategory(category)}>Edit</button>
                  <button onClick={() => handleAction(category.id, "delete")}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Icon link to home page */}
  <a href="/admin" className="home-icon-link">
    <img src={BackiconAdmin} alt="Home" className="home-icon" /> 
  </a>
    </div>
  );
};

export default ManageTripCategories;

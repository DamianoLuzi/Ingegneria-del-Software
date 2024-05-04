import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function EditMenuPage(props: any) {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price:0
  });

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/${props.user.name}/menu`);
        console.log("Menu items:", response.data);
        setMenuItems(response.data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };
    fetchMenuItems();
  }, []);

  const handleEditMenuItem = (itemId: string) => {
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    try {
      await axios.delete(`http://localhost:8000/menu/${itemId}`);
      setMenuItems(prevMenuItems => prevMenuItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  const handleAddNewItem = () => {
    setShowForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newProduct = await axios.post(`http://localhost:8000/${encodeURIComponent(props.user.username)}/menu`, formData);
      console.log("new item  ", newProduct)
      setFormData({ name: '', description: '', price: 0 });
      setShowForm(false);
      const response = await axios.get(`http://localhost:8000/${encodeURIComponent(props.user.username)}/menu`);
      setMenuItems(response.data);
    } catch (error) {
      console.error("Error adding new menu item:", error);
    }
  };

  return (
    <div>
      <h1>Edit Menu</h1>
      <button onClick={handleAddNewItem}>Add New Item</button>
      {showForm && (
        <form onSubmit={handleFormSubmit}>
          <input type="text" name="name" placeholder="Item Name" value={formData.name} onChange={handleInputChange} />
          <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} />
          <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} />
          <button type="submit">Add</button>
        </form>
      )}
      <ul>
        {menuItems.map((item: any) => (
          <li key={item.id}>
            <div>
              <h2>{item.fields.name}</h2>
              <p>Description: {item.fields.description}</p>
              <p>Price: {item.fields.price} €</p>
              <button onClick={() => handleEditMenuItem(item.id)}>Edit</button>
              <button onClick={() => handleDeleteMenuItem(item.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EditMenuPage;

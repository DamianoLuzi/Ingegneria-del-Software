import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function EditMenuPage(props: any) {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
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

  const handleEditMenuItem = (item:any) => {
    console.log("item to edit\n", item)
    setShowEditForm(true)
    setFormData({
      id: item.pk,
      name: item.name,
      description: item.description,
      price: item.price
    });
  };

  const handleDeleteMenuItem = async (item: any) => {
    console.log("item to delete\n", item.pk)
    try {
      const response = await axios.delete(`http://localhost:8000/${encodeURIComponent(props.user.username)}/menu/${item.pk.toString()}`);
      console.log("deleted item\n", response.data)
      setMenuItems(prevMenuItems => prevMenuItems.filter(i => i.pk!== item.pk));
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  const handleAddNewItem = () => {
    setShowAddForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleAddFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newProduct = await axios.post(`http://localhost:8000/${encodeURIComponent(props.user.username)}/menu`, formData);
      console.log("new item  ", newProduct)
      setFormData({ id: '',name: '', description: '', price: 0 });
      setShowAddForm(false);
      const response = await axios.get(`http://localhost:8000/${encodeURIComponent(props.user.username)}/menu`);
      setMenuItems(response.data);
    } catch (error) {
      console.error("Error adding new menu item:", error);
    }
  };
  
  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/${encodeURIComponent(props.user.username)}/menu/${formData.id.toString()}`, formData);
      setShowEditForm(false);
      const response = await axios.get(`http://localhost:8000/${encodeURIComponent(props.user.username)}/menu`);
      setMenuItems(response.data);
    } catch (error) {
      console.error("Error updating menu item:", error);
    }
  };

  return (
    <>
    <div>
      <h1>Edit Menu</h1>
      <button onClick={handleAddNewItem}>Add New Item</button>
      {showAddForm && (
        <form onSubmit={handleAddFormSubmit}>
          <input type="text" name="name" placeholder="Item Name" value={formData.name} onChange={handleInputChange} />
          <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} />
          <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} />
          <button type="submit">Add</button>
        </form>
      )}
      {
        showEditForm && (
          <div className="card">
            <form onSubmit={handleEditFormSubmit}>
            <input type="text" name="name" placeholder="Item Name" value={formData.name} onChange={handleInputChange} />
            <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} />
            <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} />
            <button type="submit">Update</button>
            </form>
          </div>)
      }
      <ul className="card-list">
        {menuItems.map((item: any) => (
          <li key={item.id}>
            <div className="card">
              <h2>{item.name}</h2>
              <p>Description: {item.description}</p>
              <p>Price: {item.price} €</p>
              <button onClick={() => handleEditMenuItem(item)}>Edit</button>
              <button onClick={() => handleDeleteMenuItem(item)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}

export default EditMenuPage;

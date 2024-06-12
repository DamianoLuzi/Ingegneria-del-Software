import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function EditMenuPage(props: any) {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price:0
  });
  const [filterText, setFilterText] = useState('')

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
      setMessage("Prodotto Eliminato Correttamente")
      setTimeout(() => {
        setMessage('');
      }, 5000);
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
      setMessage("Prodotto Aggiunto Correttamente")
      setTimeout(() => {
        setMessage('');
      }, 5000);
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
      setMessage("Prodotto Aggiornato Correttamente")
      setTimeout(() => {
        setMessage('');
      }, 5000);
    } catch (error) {
      console.error("Error updating menu item:", error);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value); // Update filter text state when input changes
  };


  return (
    <>
    <div>
      <h1>Modifica Menu</h1>
      {message && (<h1>{message}</h1>)}
      <input
        className="form-input"
        type="text"
        placeholder="Filtra Prodotti"
        value={filterText}
        onChange={handleFilterChange}
      />
      <button className="button" onClick={handleAddNewItem}>Aggiungi Nuovo Prodotto</button>
      {showAddForm && (
        <form className="form-container" onSubmit={handleAddFormSubmit}>
          <input className="form-input" type="text" name="name" placeholder="Nome Prodotto" value={formData.name} onChange={handleInputChange} />
          <input className="form-input" type="text" name="description" placeholder="Descrizione" value={formData.description} onChange={handleInputChange} />
          <input className="form-input" type="number" name="price" placeholder="Prezzo" value={formData.price} onChange={handleInputChange} />
          <button className="button" type="submit">Aggiungi</button>
        </form>
      )}
      {
        showEditForm && (
            <form className="form-container" onSubmit={handleEditFormSubmit}>
            <input type="text" name="name" placeholder="Item Name" value={formData.name} onChange={handleInputChange} />
            <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} />
            <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} />
            <button type="submit">Aggiorna</button>
            </form>
        )
      }
      <ul className="list">
        {menuItems
        .filter((item: any) =>
          item.name.toLowerCase().includes(filterText.toLowerCase())
        )
        .map((item: any) => (
          <li key={item.id}>
            <div className="card">
              <h2>{item.name}</h2>
              <p>Descrizione: {item.description}</p>
              <p>Prezzo: {item.price} €</p>
              <button className="button" onClick={() => handleEditMenuItem(item)}>Modifica</button>
              <button className="button" onClick={() => handleDeleteMenuItem(item)}>Elimina</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}

export default EditMenuPage;

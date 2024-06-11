import axios from "axios";
import { useEffect, useState } from "react";

function AccountPage(props: any) {
  const [formData, setFormData] = useState({
    username: props.user.username || "",
    password: props.user.password || "",
    email: props.user.email || "",
    orarioApertura: props.user.orarioApertura || "",
    orarioChiusura: props.user.orarioChiusura || "",
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({
    username: false,
    password: false,
    email: false,
    orarioApertura: false,
    orarioChiusura: false
  });
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFieldClick = (fieldName: string) => {
    setEditMode({ ...editMode, [fieldName]: true });
  };

  const handleFieldBlur = (fieldName: string) => {
    setEditMode({ ...editMode, [fieldName]: false });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8000/${props.user.ruolo}/${props.user.username}/account`, formData);
      if(response) props.setUser(response.data)
      setMessage("Profilo Aggiornato Con Successo!")
    } catch (error:any) {
      setError(error)
      console.error("Error updating profile:", error);
    }
  };
  
  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete(`http://localhost:8000/${props.user.ruolo}/${props.user.username}/account`);
      setMessage(response.data.username +" Eliminato Con Successo!")
      props.setUser(response.data)
      setTimeout(() => {
        window.location.href = "/"; 
        props.setUser(null);
      }, 5000);
      
    } catch (error:any) {
      setError(error.response.data.message || "An error occurred while deleting the account.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="form-container">
      {message && <h1>{message}</h1>}
      {error && <h1>Error: {error}</h1>}
      <h1>Informazioni Personali</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          {editMode.username ? (
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              //onBlur={() => handleFieldBlur("username")}
            />
          ) : (
            <p onClick={() => handleFieldClick("username")}>{formData.username}</p>
          )}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          {editMode.password ? (
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleFieldBlur("password")}
            />
          ) : (
            <p onClick={() => handleFieldClick("password")}>{formData.password}</p>
          )}
        </div>
        {props.user.ruolo === "ristorante" && (
          <>
            <div>
              <label htmlFor="orarioApertura">Orario di Apertura:</label>
              {editMode.orarioApertura ? (
                <input
                  type="text"
                  id="orarioApertura"
                  name="orarioApertura"
                  value={formData.orarioApertura}
                  onChange={handleChange}
                  onBlur={() => handleFieldBlur("orarioApertura")}
                />
              ) : (
                <p onClick={() => handleFieldClick("orarioApertura")}>{formData.orarioApertura}</p>
              )}
            </div>
            <div>
              <label htmlFor="orarioChiusura">Orario di Chiusura:</label>
              {editMode.orarioChiusura ? (
                <input
                  type="text"
                  id="orarioChiusura"
                  name="orarioChiusura"
                  value={formData.orarioChiusura}
                  onChange={handleChange}
                  onBlur={() => handleFieldBlur("orarioChiusura")}
                />
              ) : (
                <p onClick={() => handleFieldClick("orarioChiusura")}>{formData.orarioChiusura}</p>
              )}
            </div>
          </>
        )}
        <div>
          <label htmlFor="email">Email:</label>
          {editMode.email ? (
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleFieldBlur("email")}
            />
          ) : (
            <p onClick={() => handleFieldClick("email")}>{formData.email}</p>
          )}
        </div>
        <button type="submit" className="button">Aggiorna Profilo</button>
      </form>
      <button type="button" className="button" onClick={handleDeleteAccount}>Elimina Account</button>
    </div>
  );
}

export default AccountPage;

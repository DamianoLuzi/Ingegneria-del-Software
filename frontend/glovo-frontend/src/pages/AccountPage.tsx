import axios from "axios";
import { useEffect, useState } from "react";

function AccountPage(props: any) {
  const [formData, setFormData] = useState({
    username: props.user.username || "",
    password: props.user.password || "",
    email: props.user.email || "",
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({
    username: false,
    password: false,
    email: false,
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
      console.log("form PUT  ", formData)
      const response = await axios.put(`http://localhost:8000/${props.user.ruolo}/${props.user.username}/account`, formData);
      console.log("updated user\t", response.data)
      if(response) props.setUser(response.data)
      setMessage("Profile updated successfully!")
    } catch (error:any) {
      setError(error)
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      {message && <h1>{message}</h1>}
      {error && <h1>Error: {error}</h1>}
      <h1>Profile</h1>
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
              onBlur={() => handleFieldBlur("username")}
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
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default AccountPage;

import { useState } from "react";
import RuoliMenu from "../components/RuoliMenu";
import axios from "axios";

function PasswordResetPage(props: any) {
  const [errors, setErrors] = useState('');
  const [formData, setFormData] = useState({
    username: "",
    email:"",
    ruolo:"",
    password: "",
    password2: "",
  });

  const handleFormSubmit = async () => {
    try {
      if(formData.password === formData.password2) {
        const response = await axios.put(`http://localhost:8000/${formData.ruolo}/${formData.username}/password_reset`, formData);
      props.setUser(response.data);
      setErrors("La tua password di recupero è "+ response.data.password+ "")
      } else {
        setTimeout(() => {
          return setErrors('Passwords did not match');
        }, 5000);
      }
    } catch (error:any) {
      console.error("Error:", error);
      setErrors(error.response.data);
      setTimeout(() => {
        return setErrors(error.response.data);
      }, 5000);
      
    }
  };

  const handleRoleSelection = (selectedRole: string) => {
    const newRole =
      formData.ruolo === selectedRole ? "" : selectedRole; // Toggle the role
    setFormData({ ...formData, ruolo: newRole });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h3>Reset your password!</h3>
      <div>
        <button
          className={formData.ruolo === "cliente" ? "active" : ""}
          onClick={() => handleRoleSelection("cliente")}
        >
          Customer
        </button>
        <button
          className={formData.ruolo === "ristorante" ? "active" : ""}
          onClick={() => handleRoleSelection("ristorante")}
        >
          Restaurant
        </button>
        <button
          className={formData.ruolo === "rider" ? "active" : ""}
          onClick={() => handleRoleSelection("rider")}
        >
          Rider
        </button>
      </div>
      <br />
      <form>
        <div>
          {errors && (
            <div>
              <h3>Errors:</h3>
              <ul>
                <li>{errors}</li>
              </ul>
            </div>
          )}
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <p>
          Don't have an account? Create one <a href="/signup">Here</a>!
        </p>
        
        <button type="button" onClick={handleFormSubmit}>
          Reset
        </button>
      </form>
    </div>
  );
}

export default PasswordResetPage;

import { useState } from "react";
import axios from "axios";
import "../styles/App.css"; 

function SignUpForm(props: any) {
  const [errors, setErrors] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    ruolo: "",
    posizione: "",
  });

  const handleFormSubmit = async () => {
    try {
      console.log("signup POST ", formData)
      const response = await axios.post(
        "http://localhost:8000/signup",
        formData
      );
      console.log("Response:", response.data);
      props.setUser(response.data);
    } catch (error:any) {
      console.error("Error:", error);
      setErrors(error.response.data);
      setTimeout(() => {
        setErrors(null);
      }, 5000);
    }
  };

  const handleRoleSelection = (selectedRole: string) => {
    setFormData({ ...formData, ruolo: selectedRole });
    console.log(formData)
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <h3>Scegli il tuo ruolo</h3>
      <div className="role-selection">
        <button
          className={formData.ruolo === "cliente" ? "active" : ""}
          onClick={() => handleRoleSelection("cliente")}
        >
          Join the Customers Community Now!
        </button>
        <button
          className={formData.ruolo === "ristorante" ? "active" : ""}
          onClick={() => handleRoleSelection("ristorante")}
        >
          Join the Restaurants Community Now!
        </button>
        <button
          className={formData.ruolo === "rider" ? "active" : ""}
          onClick={() => handleRoleSelection("rider")}
        >
          Join the Riders Community Now!
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
        {(/*formData.ruolo === "rider"||*/ formData.ruolo === "ristorante") && (
          <div>
            <label htmlFor="posizione">Posizione:</label>
            <input
              type="text"
              id="posizione"
              name="posizione"
              value={formData.posizione}
              onChange={handleChange}
            />
          </div>
        )}
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <p>
          Have an account? Log in <a href="/login">Here</a>!
        </p>
        <button type="button" onClick={handleFormSubmit}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUpForm;

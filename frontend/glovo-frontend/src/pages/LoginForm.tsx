import { useState } from "react";
import axios from "axios";
import "../styles/App.css";

function LoginForm(props: any) {
  const [errors, setErrors] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    ruolo: "",
  });

  const handleFormSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:8000/login",formData);
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
    const newRole =
      formData.ruolo === selectedRole ? "" : selectedRole; 
    setFormData({ ...formData, ruolo: newRole });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
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
          Forgot your password? Reset it <a href="/resetpw">Here!</a>
        </p>
        <p>
          Don't have an account? Create one <a href="/signup">Here</a>!
        </p>
        
        <button className="button" type="button" onClick={handleFormSubmit}>
          Log In
        </button>
      </form>
    </div>
  );
}

export default LoginForm;

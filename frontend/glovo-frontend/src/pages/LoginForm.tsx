import { useState } from "react";
import RuoliMenu from "../components/RuoliMenu";
import axios from "axios";

function LoginForm(props: any) {
  const [errors, setErrors] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    ruolo:''
  });

  const handleFormSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8000/login', formData);
      // Handle the response here
      console.log('Response:', response.data[0]);
      props.setUser(response.data[0])
      console.log('setUser', response.data[0]);
    } catch (error : any) {
      // Handle errors here
      console.error('Error:', error);
      setErrors(error.response.data); 
      setTimeout(() => {
        setErrors(null);
      }, 5000);
    }
  }

  const handleChange = (e: any) => {
    console.log("handle change event", e)
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log("form data ", formData)
  };

  return (
    <div>
      <h2>Login</h2>
      <h3>Scegli il tuo ruolo</h3>
      <RuoliMenu selectedRole={formData.ruolo} handleChange={handleChange}/>
      <br/>
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
            name='username'
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name='password'
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <p>Don't have an account? Create one <a href="/signup">Here</a>!</p>
        <button type="button" onClick={handleFormSubmit}>Log In</button>
      </form>
    </div>
  )
}

export  default LoginForm;
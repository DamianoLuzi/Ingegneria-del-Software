import { useState } from "react";
import RuoliMenu from "./RuoliMenu";
import axios from "axios";

function SignUpForm(props: any) {
  const [errors, setErrors] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email:'',
    ruolo:''
  });
  const [position, setPosition] = useState('')

  const handleFormSubmit = async () => {
    try {
      let updatedFormData = { ...formData, 'posizione': ''};
      if (formData && (formData.ruolo === 'ristorante' || formData.ruolo === 'rider')) {
         updatedFormData = { ...updatedFormData, 'posizione': position };
      }
    setFormData(updatedFormData);
    console.log('update form data', updatedFormData)
      const response = await axios.post('http://localhost:8000/signup', updatedFormData);
      console.log('Response:', response.data[0]);
      props.setUser(response.data[0])
    } catch (error : any) {
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
    if (name === 'posizione') setPosition(value)
    console.log("position", position)
    console.log("form data ", formData)
  };

  return (
    <div>
      <h2>Sign Up</h2>
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
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name='email'
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        {formData && (formData.ruolo === 'rider' || formData.ruolo === 'ristorante') && 
          <div>
          <label htmlFor="posizione">Posizione:</label>
          <input
            type="posizione"
            id="posizione"
            name='posizione'
            value={position}
            onChange={handleChange}
          />
        </div>}
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
        <p>Have an account? Log in <a href="/login">Here</a>!</p>
        <button type="button" onClick={handleFormSubmit}>Log In</button>
      </form>
    </div>
  )
}

export  default SignUpForm;
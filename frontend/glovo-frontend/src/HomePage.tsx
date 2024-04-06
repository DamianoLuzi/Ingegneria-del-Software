import { useState, useEffect } from 'react'
import axios from 'axios';

function HomePage() {
  const [homeMessage, setHomeMessage] = useState('')
  useEffect(() => {
    const getHomeData = async () => {
      const response = await axios.get('http://localhost:8000')
      if(response) {   
        setHomeMessage(response.data.message)
      }
    }
    getHomeData()
  }, [])
  return (
    <>
      <h1>{homeMessage}</h1>
    </>
  )
}

export default HomePage;
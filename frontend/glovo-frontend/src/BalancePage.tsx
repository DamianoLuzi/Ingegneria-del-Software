import axios from "axios";
import { useEffect, useState } from "react";

function BalancePage(props: any) {
  const [balance, setBalance] = useState(0)
  useEffect(() => {
    console.log("props user", props.user)
    const fetchBalance = async () => {
      const username = props.user.ruolo === 'ristorante' ? props.user.name : props.user.username
      console.log("username orders", username)
      const response = await axios.get(`http://localhost:8000/${username}/balance`)
      console.log("orders response", response)
      if(response) setBalance(response.data)
    }
    fetchBalance()
  }, [])

  return(
    <div>
    <h1>Your balance: </h1>
    {balance && 
      <div>
        <h2>{`${balance} €`}</h2>
      </div>}
    </div>
  )

}

export default BalancePage;
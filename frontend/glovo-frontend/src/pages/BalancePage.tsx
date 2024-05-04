import axios from "axios";
import { useEffect, useState } from "react";

function BalancePage(props: any) {
  const [balance, setBalance] = useState(0)
  const handleTopUp = async () => {
    const updatedBalance = balance + 1;
    setBalance(updatedBalance);
    
    try {
      const u = props.user
      u.balance = updatedBalance
      console.log("PUT username", props.user.username.replace(" ",'%20'))
      const response = await axios.put(`http://localhost:8000/${encodeURIComponent(props.user.username)}/balance`,u);
      console.log("top up response", response)
      props.user.balance = updatedBalance
    } catch (error) {
      console.error("Error updating balance:", error);
      setBalance(balance);
    }
  }
  useEffect(() => {
    console.log("props user", props.user)
    const fetchBalance = async () => {
      const response = await axios.get(`http://localhost:8000/${props.user.username}/balance`)
      console.log("balanceresponse", response)
      if(response) setBalance(response.data)
    }
    fetchBalance()
  }, [])

  return(
    <div className="container">
    <h1>Your balance: </h1>
    {balance && 
      <div>
        <h2>{`${balance} €`}</h2>
      </div>}
      <button onClick={handleTopUp}>Top Up</button>
    </div>
  )

}

export default BalancePage;
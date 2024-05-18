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
      const response = await axios.put(`http://localhost:8000/${props.user.ruolo}/${encodeURIComponent(props.user.username)}/balance`,u);
      props.user.balance = updatedBalance
    } catch (error) {
      console.error("Error updating balance:", error);
      setBalance(balance);
    }
  }

  const handleWithdraw = async () => {
    const updatedBalance = balance - 1;
    setBalance(updatedBalance);
    
    try {
      const u = props.user
      u.balance = updatedBalance
      const response = await axios.put(`http://localhost:8000/${props.user.ruolo}/${encodeURIComponent(props.user.username)}/balance`,u);
      props.user.balance = updatedBalance
    } catch (error) {
      console.error("Error updating balance:", error);
      setBalance(balance);
    }
  }
  useEffect(() => {
    const fetchBalance = async () => {
      const response = await axios.get(`http://localhost:8000/${props.user.ruolo}/${props.user.username}/balance`)
      if(response) setBalance(response.data.balance)
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
      <button onClick={handleWithdraw}>Withdraw</button>
    </div>
  )

}

export default BalancePage;
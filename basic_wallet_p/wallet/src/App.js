import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

function App() {
  const [state, setState] = useState({
    balance: 0,
    name: '',
    amount: 0,
    username: '',
    user_balance: 0
  });

  updateValues = async (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    axios.get('http://localhost:5000/chain')
      .then(res => {
        setState({ ...state, chain: res.data })
      }).catch(e => e);
  }, []);

  getBalance = () => {
    for(let i=0; i<state.chain.length; i++){
      for(let j=0; j<state.chain[i].transactions.length; j++){
        if(state.chain[i].transactions[j].recipient === state.username){
          setState({
            ...state,
            balance: state.balance + parseInt(state.chain[i].transactions[j].amount)
          })
        }
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Your React Tokens Wallet
        </p>
        {state.username.length === 0 ? 
          <>
            <p>Enter Your Name to Start</p>
            <div>
              <label>Your Wallet Name: </label>
              <input name="username" value={state.username} />
            </div>
          </>
        :
          <>
          <p
            className="App-link"
            target="_blank"
          >
            Balance: {state.balance}
          </p>
          <div>
            <label>Receiver Name: </label>
            <input name="name" value={state.name} />
          </div>
          <div>
            <label>Amount: </label>
            <input name="amount" value={state.amount} />
          </div>
          </>
        }
        </header>
    </div>
  );
}

export default App;

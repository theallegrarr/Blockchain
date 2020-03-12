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
    user_name: '',
    user_balance: 0,
    recipient: '',
    transactions: []
  });

  const updateValues = async (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setState({
      ...state,
      user_name: state.username
    })
    getBalance(state.chain)
  }

  const sendFunds = (e) => {
    e.preventDefault()
    if(state.balance > state.amount){
      axios.post('http://localhost:5000/transactions/new', { sender: state.user_name, recipient: state.recipient, amount: state.amount.toString() })
        .then(res => {
          window.alert(res.data.message)
        }).catch(e => e)
      } else {
        window.alert("Not Enough Funds")
      }
  }

  useEffect(() => {
    axios.get('http://localhost:5000/chain')
      .then(res => {
        setState({ ...state, chain: res.data.chain })
        getBalance(res.data.chain);
      }).catch(e => e);
    
  }, []);

  const getBalance = (chain) => {
    let newbalance = 0;
    state.transactions = []
    for(let i=0; i<chain.length; i++){
      for(let j=0; j<chain[i].transactions.length; j++){
        console.log(chain[i].transactions[j], state.username)
        if(chain[i].transactions[j].recipient === state.username){
          state.transactions.push(chain[i].transactions[j])
          newbalance = newbalance + parseInt(chain[i].transactions[j].amount)
          setState({
            ...state,
            user_name: state.username,
            balance: newbalance
          })
        } else if(chain[i].transactions[j].sender === state.username){
          newbalance = newbalance - parseInt(chain[i].transactions[j].amount)
          state.transactions.push(chain[i].transactions[j])
            setState({
              ...state,
              user_name: state.username,
              balance: newbalance
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
        {state.user_name.length === 0 ? 
          <>
            <p>Enter Your ID to Start</p>
            <div>
              <label>Enter Your ID: </label>
              <input name="username" value={state.username} onChange={updateValues}/>
            </div>
            <button onClick={onSubmit}>Submit</button>
          </>
        :
          <>
          <p
            className="App-link"
            target="_blank"
          >
            Token Balance: {state.balance}
          </p>
          <div>
            <label>Receiver Name: </label>
            <input name="recipient" value={state.recipient} onChange={updateValues}/>
          </div>
          <div>
            <label>Amount: </label>
            <input name="amount" value={state.amount} onChange={updateValues}/>
          </div>
            <button onClick={sendFunds}>Submit</button>
          
          <div>
            <label>Change ID: </label>
            <input name="username" value={state.username} onChange={updateValues}/>
          </div>
          <button onClick={onSubmit}>Save New ID</button>
          </>
        }
        {
          state.transactions.length > 0 &&
          <table>
            <tr>
              <th>Amount</th>
              <th>sender</th>
              <th>recipient</th>
            </tr>
            {
              state.transactions.map(txn => 
                <tr>
                  <th>{txn.amount}</th>
                  <th>{txn.sender}</th>
                  <th>{txn.recipient}</th>
                </tr>
                )
            }
          </table>
        }
          
        </header>
    </div>
  );
}

export default App;

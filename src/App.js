import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function getQueryVariable(variable) {
  const query = window.location.hash.substring(1)
  const vars = query.split('&')
  const code = vars
    .map(i => {
      const pair = i.split('=')
      if (pair[0] === variable) {
        return pair[1]
      }
      return null
    })
    .filter(d => {
      if (d) {
        return true
      }
      return false
    })
  return code[0]
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      user: {},
      accessToken: ''
    }
  }

  componentWillMount(){
    let token = window.localStorage.getItem('access_token');
    console.log(token)
    if (token){
      this.setState({accessToken: token})
    }
  }

  componentDidMount(){
    let token = window.localStorage.getItem('access_token');
    if (this.state.accessToken) {
      this.getUsers()
    } else if (!token) {
      this.instagramLogin()
    }
  }

  instagramLogin(){
    if (window.location.hash.includes('access_token')) {
      window.localStorage.setItem('access_token', getQueryVariable('access_token'))
      window.location.href = window.location.pathname
    } else if (window.location.search.includes('error')) {
      console.error('error'+getQueryVariable('error'))
    } else {
      const clientId = 'bd54c430051b4970a6333ea361559121',
            scope = 'basic+public_content+comments+relationships+likes+follower_list',
            redirectUri = window.location.href
      window.location.href = `https://api.instagram.com/oauth/authorize/?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`
    }
  }

  getUsers(){
    fetch(`https://api.instagram.com/v1/users/self/?access_token=${this.state.accessToken}`)
      .then(response => response.json())
      .then(data => this.setState({ user: data.data }))
      .catch(error => {
        console.log(error)
      });
  }

  render() {
    let user = this.state.user;
    console.log(user)
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <li>user id: {user.id}</li>
        <li>user username: {user.username}</li>
        <li>user full_name: {user.full_name}</li>
      </div>
    );
  }
}

export default App;

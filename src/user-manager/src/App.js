import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import Users from './components/users'
import './App.css'

/**
 * @returns {void} starts the app
 */
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello to User-Manager App.</h1>
      </header>
      <main>
        <Users />
      </main>
    </div>
  )
}

export default App

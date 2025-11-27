import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UseReducerPage from './useReducerPage'
import UseReducerCompany from './useReducerCompany'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <UseReducerCompany />
    </>
  )
}

export default App

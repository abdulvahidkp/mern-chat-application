import { useState } from 'react'
import { Button } from '@chakra-ui/react'
import './App.css'
import {Routes,Route} from 'react-router-dom'
import Homepage from './pages/Homepage'
import Chatpage from './pages/Chatpage'
import './App.css'

function App() {

  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/chat' element={<Chatpage/>}/>

      </Routes>
    </div>
  )
}

export default App

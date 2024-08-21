import React from 'react';
import './index.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Welcome from './views/Welcome';



function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Welcome />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

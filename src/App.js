import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import LoginPage from './Components/Login';
import RegisterPage from './Components/Register';

// Add all pages in Components and add routes here.
// All API calls should be in Services.
function App() {
  return (
    <div className="App">

      {
        // Add you pages to the route here
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      }

    </div>
  );
}

export default App;

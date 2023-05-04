import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import LoginPage from './Components/Login';
import RegisterPage from './Components/Register';
import CuisineSection from './Components/CusineSection';
import { useEffect, useState } from 'react';
import { AppBar, Avatar, Box, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import ResultScreen from './Components/ResultScreen';

// Add all pages in Components and add routes here.
// All API calls should be in Services.
function App() {

  const [user, setUser] = useState();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignout = () => {
    window.localStorage.removeItem("user");
    setAnchorEl(null);
    window.location.href = "/";
  };

  useEffect(() => {
    setUser(window.localStorage.getItem("user"));
  }, []);

  return (
    <div className="App">

      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', alignItems: 'center', background: "#d31d30" }}>
          <Typography variant="h4" component="div">
            Couple<b>Eats</b>
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {
            user
              ? <Avatar alt={user} onClick={handleMenuClick} sx={{ ":hover": { background: "#86121e", transition: "0.5s" } }} />
              : null
          }
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleSignout}>Sign out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {
        // Add you pages to the route here
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/cuisineselection" element={<CuisineSection />} />
          <Route path="/result" element={<ResultScreen />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      }

    </div>
  );
}

export default App;

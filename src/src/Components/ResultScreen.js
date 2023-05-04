import { Button, CardContent, Modal } from '@mui/joy';
import { Typography, AppBar, Box, Menu, MenuItem, Card, CardHeader, Toolbar, Avatar, Grid, Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { allYelpCategories } from './YelpCuisineList';
import InputAdornment from '@mui/material/InputAdornment';
import { Close, MyLocation } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import FoodGuessVideo from '../Assets/FooDCuisineAsset.mp4';
import CuisineSection from './CusineSection';

const ResultScreen = () => {
    const location = useLocation();
    const pos = location.state.location;
    const radius = location.state.radius;
    const cuisines = location.state.cusinesSelected;
    
    const [user, setUser] = useState();
    const [anchorEl, setAnchorEl] = useState(null);
    const [validRests, setValidRests] = useState([]);

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

    const getValidRestaurants = () => {
        //search through restaurants, all must be valid:
        //if restaurant location - current location <= radius
        //if cuisine is in cuisinesSelected (prioritizs if multiple are present)
        //cap it at a certain number of restaurants (10?)

    }

    useEffect(() => {
        setUser(window.localStorage.getItem("user"));
    }, []);
    return (
        <Box>
            <AppBar position="static">
                <Toolbar sx={{ display: 'flex', alignItems: 'center', background: "#d31d30" }}>
                    <Typography variant="h4" component="div">
                        Couple<b>Eats</b>
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Avatar alt={user} onClick={handleMenuClick} sx={{ ":hover": { background: "#86121e", transition: "0.5s" } }} />
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem onClick={handleSignout}>Sign out</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: '90vh' }}
            >
                <Grid item xl={64}>
                    <Card sx={{ margin: 5, boxShadow: 10, minWidth: "30vw", top: "50%" }}>

                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}
export default ResultScreen;
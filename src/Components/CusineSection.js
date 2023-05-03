import { Button, CardContent, Modal } from '@mui/joy';
import { Typography, AppBar, Box, Menu, MenuItem, Card, CardHeader, Toolbar, Avatar, Grid, Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { allYelpCategories } from './YelpCuisineList';
import InputAdornment from '@mui/material/InputAdornment';
import { Close, MyLocation } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CuisineSection = () => {

    const [user, setUser] = useState();
    const [anchorEl, setAnchorEl] = useState(null);
    const [location, setLocation] = useState("");
    const [person1Cusines, setPerson1Cusines] = useState([]);
    const [person2Cusines, setPerson2Cusines] = useState([]);
    const [cusinesSelected, setCusinesSelected] = useState([]);
    const [openErrorModal, setOpenErrorModal] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!window.localStorage.getItem("user")) {
            window.location.href = "/";
        }
        handleLocationClick();
    }, []);

    const getAddressFromLatLng = async (lat, lng) => {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
        const response = await fetch(url);
        const data = await response.json();
        const address = data.display_name;
        return address;
    }

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.permissions
                .query({ name: "geolocation" })
                .then(function (result) {
                    if (result.state === "granted") {
                        navigator.geolocation.getCurrentPosition(async (position) => {
                            const { latitude, longitude } = position.coords;
                            const address = await getAddressFromLatLng(latitude, longitude);
                            setLocation(address);
                        });
                    } else if (result.state === "prompt") {
                        console.log(result.state);
                    } else if (result.state === "denied") {
                        alert("Please allow location access to use this app");
                    }
                    result.onchange = function () {
                        console.log(result.state);
                    };
                });
        }
    };

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

    const handleLocationClick = () => {
        setLocation("Loading...");
        getLocation();
    }

    useEffect(() => {
        setCusinesSelected([...person1Cusines, ...person2Cusines]);
    }, [person1Cusines, person2Cusines]);

    const handlePerson1CusineChange = (event, value) => {
        if (value.length !== 0) {
            setPerson1Cusines(prevPerson1Cusines => [...prevPerson1Cusines, value[value.length - 1].title]);
        } else {
            setPerson1Cusines([]);
        }
    }

    const handlePerson2CusineChange = (event, value) => {
        if (value.length !== 0) {
            setPerson2Cusines(prevPerson2Cusines => [...prevPerson2Cusines, value[value.length - 1].title]);
        } else {
            setPerson2Cusines([]);
        }
    }

    const handleSubmit = () => {

        if (cusinesSelected.length === 0) {
            setOpenErrorModal(true);
            setError("Please select at least one cuisine.");
            return;
        }

        if (location === "" || location === "Loading...") {
            setOpenErrorModal(true);
            setError("Please enter your location.");
            return;
        }

        // This will be used to send the data to the result page and navigate to it.
        // navigate("/result", { state: { location, cusinesSelected } });
    }


    useEffect(() => {
        setUser(window.localStorage.getItem("user"));
    }, []);

    return (
        <Box>
            <AppBar position="static">
                <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h4" component="div">
                        Couple<b>Eats</b>
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <TextField
                        placeholder='Your Location'
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        sx={{
                            background: "rgba(255, 255, 255, 0.5)",
                            marginRight: 2,
                            width: 400,
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" onClick={handleLocationClick} >
                                    <MyLocation />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Avatar alt={user} onClick={handleMenuClick} sx={{ ":hover": { backgroundColor: "red", transition: "0.5s" } }} />
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
                justify="center"
                style={{ minHeight: '90vh' }}
            >
                <Grid item xl={64}>
                    <Card sx={{ width: "30vw", margin: 5, boxShadow: 10 }}>
                        <CardHeader title="Person 1 - Preferences" />
                        <CardContent>
                            <Autocomplete
                                multiple
                                id="person1-cusines"
                                onChange={handlePerson1CusineChange}
                                options={allYelpCategories}
                                getOptionLabel={(option) => option.title}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="You cusine preferences"
                                        placeholder="Cusines"
                                    />
                                )}
                                sx={{ margin: 2 }}
                            />
                        </CardContent>
                    </Card>
                    <Card sx={{ margin: 5, boxShadow: 10 }}>
                        <CardHeader title="Person 2 - Preferences" />
                        <CardContent>
                            <Autocomplete
                                multiple
                                id="person2-cusines"
                                onChange={handlePerson2CusineChange}
                                options={allYelpCategories}
                                getOptionLabel={(option) => option.title}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="You cusine preferences"
                                        placeholder="Cusines"
                                    />
                                )}
                                sx={{ margin: 2 }}
                            />
                        </CardContent>
                    </Card>
                    <Button variant="contained" onClick={handleSubmit} sx={{ margin: 2, background: "rgb(25, 118, 210)", color: "white" }}>Submit</Button>
                </Grid>
            </Grid>

            <Modal
                open={openErrorModal}
                onClose={() => setOpenErrorModal(false)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box>
                    <Box sx={{
                        position: 'relative',
                        width: '60vw',
                        maxWidth: '400px',
                        bgcolor: 'background.paper',
                        border: '1px solid #000',
                        boxShadow: 24,
                        p: '1.5vw'
                    }}>
                        <Close onClick={() => setOpenErrorModal(false)} sx={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer' }} />
                        <Typography id="modal-modal-title" variant="h5" component="h2">
                            Error
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: '2vw' }}>
                            {error}
                        </Typography>
                    </Box>
                </Box>
            </Modal>



        </Box>
    )
}

export default CuisineSection;
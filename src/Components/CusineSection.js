import { Button, CardContent, Modal } from '@mui/joy';
import { Typography, Box, Card, CardHeader, Grid, Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { allYelpCategories } from './YelpCuisineList';
import InputAdornment from '@mui/material/InputAdornment';
import { Close, MyLocation } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import FoodGuessVideo from '../Assets/FooDCuisineAsset.mp4';

const CuisineSection = () => {

    const [location, setLocation] = useState("");
    const [person1Cusines, setPerson1Cusines] = useState([]);
    const [person2Cusines, setPerson2Cusines] = useState([]);
    const [cusinesSelected, setCusinesSelected] = useState([]);
    const [openErrorModal, setOpenErrorModal] = useState(false);
    const [error, setError] = useState('');
    const [radius, setRadius] = useState(); // in Kilometers [0, 25, 50, 100
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
                        navigator.geolocation.getCurrentPosition(async (position) => {
                            const { latitude, longitude } = position.coords;
                            const address = await getAddressFromLatLng(latitude, longitude);
                            setLocation(address);
                        }, function (error) {
                            console.error(error);
                            setOpenErrorModal(true);
                            setError("Please allow location access to use this app");
                        });
                    } else if (result.state === "denied") {
                        alert("Please allow location access to use this app");
                    }
                    result.onchange = function () {
                        console.log(result.state);
                    };
                });
        }
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

        console.log(cusinesSelected);

        if (cusinesSelected.length === 0) {
            setOpenErrorModal(true);
            setError("Please select at least one cuisine.");
            return;
        }

        if (radius === "" || radius === undefined) {
            setOpenErrorModal(true);
            setError("Please enter a radius.");
            return;
        }

        if (location === "" || location === "Loading...") {
            setOpenErrorModal(true);
            setError("Please enter your location.");
            return;
        }

        // This will be used to send the data to the result page and navigate to it.
        const cuisines = cusinesSelected.map((cuisine) => cuisine.toLowerCase());           // Convert all cuisines to lowercase for API
        const Cuisines = [...new Set(cuisines.map((cuisine) => cuisine.toLowerCase()))];    // Remove duplicates
        navigate("/result", { state: { location, radius, Cuisines } });
    }

    return (
        <Box>
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
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Box sx={{ flex: '1' }}>
                                <CardHeader title="Pick your Cuisines" />
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
                                                label="User 1 cusine preferences"
                                                placeholder="Cusines"
                                            />
                                        )}
                                        sx={{
                                            marginLeft: 4,
                                            marginBottom: 2,
                                        }}
                                    />
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
                                                label="User 2 cusine preferences"
                                                placeholder="Cusines"
                                            />
                                        )}
                                        sx={{
                                            marginLeft: 4,
                                            marginBottom: 2,
                                        }}
                                    />
                                    <TextField
                                        placeholder='Enter Search Radius'
                                        value={radius}
                                        onChange={(e) => setRadius(e.target.value)}
                                        variant="outlined"
                                        sx={{
                                            border: '0px solid black',
                                            padding: "0 0 5px 14px",
                                            width: "95%",
                                            ml: 2,
                                            mr: 2,
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'black',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'black',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'black',
                                                },
                                            },
                                            '& .MuiInputBase-input': {
                                                padding: '10px 14px',
                                                width: '100%',
                                            },
                                        }}
                                    />

                                    <TextField
                                        placeholder='Your Location'
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        sx={{
                                            border: '0px solid black',
                                            padding: "5px 0 0 14px",
                                            width: "95%",
                                            ml: 2,
                                            mr: 2,
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'black',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'black',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'black',
                                                },
                                            },
                                            '& .MuiInputBase-input': {
                                                padding: '10px 14px',
                                                width: '100%',
                                            },
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" onClick={handleLocationClick} >
                                                    <MyLocation />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={handleSubmit}
                                        sx={{
                                            margin: 2,
                                            background: "#d31d30",
                                            marginLeft: 4,
                                            marginBottom: 3,
                                            color: "white",
                                            ":hover": {
                                                background: "#86121e",
                                                transition: "0.2s"
                                            }
                                        }}>
                                        Submit
                                    </Button>
                                </CardContent>
                            </Box>
                            <Box sx={{ width: '30%', position: 'relative' }}>
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    src={FoodGuessVideo}
                                    style={{
                                        position: 'relative',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        aspectRatio: '16/9',
                                    }}
                                />
                            </Box>
                        </Box>
                    </Card>
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
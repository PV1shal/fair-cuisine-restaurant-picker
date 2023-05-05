import { Button, CardContent, FormControl, Modal } from '@mui/joy';
import { Alert, CircularProgress, Typography, Box, Card, Grid, Table, TableRow, TableCell, Rating, Chip, Switch, MenuItem, Select, InputLabel } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ArrowBack, AttachMoney, Close } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import YelpServices from '../Services/YelpServices';

const ResultScreen = () => {
    const location = useLocation();

    const [restaurants, setRestaurants] = useState([]);
    const [openRestaurantsOnly, setOpenRestaurantsOnly] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [ratingFilter, setRatingFilter] = useState('1');
    const [priceFilter, setPriceFilter] = useState('$$$');
    const [typeOfRestaurantsFound, setTypeOfRestaurantsFound] = useState('');
    const [openRandomRestaurantModal, setOpenRandomRestaurantModal] = useState(false);
    const [randomRestaurant, setRandomRestaurant] = useState();
    const [restaurantIsOpen, setRestaurantsIsOpen] = useState(true);

    useEffect(() => {
        setLoading(true);
        const data = {
            "userPreferences": {
                "location": location.state.location,
                "categories": location.state.Cuisines,
                "radius": parseInt(location.state.radius) * 1000 || 10000
            }
        };

        YelpServices.getBusinesses(data)
            .then((res) => {
                var allRestaurants = res.data.yelpAPI;
                setRestaurants(allRestaurants);
                Promise.all(allRestaurants.map(checkIsOpen))
                    .then((isOpenArr) => {
                        const openRestaurants = allRestaurants.filter((restaurant, index) => isOpenArr[index]);
                        setOpenRestaurantsOnly(openRestaurants);
                    })
                    .catch((err) => {
                        console.log(err);
                        setRestaurants([]);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
                if (res.status === 200) {
                    setTypeOfRestaurantsFound("We found some restaurants that had all the categories you selected!");
                } else if (res.status === 201) {
                    setTypeOfRestaurantsFound("We couldn't find any restaurants with all the categories selected, but we found some that had one of them.");
                }
            })
            .catch((err) => {
                console.log(err);
                setRestaurants([]);
                setLoading(false);
            });
    }, []);

    const getCategories = (data) => {
        return data.map((category) => {
            // console.log(category);
            return (
                <Chip
                    key={category.alias}
                    label={category.title}
                    style={{ margin: "0.5rem" }}
                />
            );
        });
    }

    const checkIsOpen = async (restaurant) => {
        var result = false;
        await YelpServices.getBusinessesByIDs(restaurant.id)
            .then((res) => {
                if (res.data.business.hours[0].is_open_now) {
                    result = true;
                } else {
                    result = false;
                }
            })
            .catch((err) => {
                result = true;
            });
        return result;
    }

    const handleRatingFilterChange = (e) => {
        setRatingFilter(e.target.value);
    }

    const handlePriceFilterChange = (e) => {
        setPriceFilter(e.target.value);
    }

    const getFilteredRestaurants = () => {
        var tempRest = restaurantIsOpen ? openRestaurantsOnly : restaurants;
        if (!tempRest) {
            return;
        }
        return tempRest.filter((restaurant) => {
            return restaurant.rating >= ratingFilter && restaurant.price <= priceFilter;
        });
    };

    const getValidRestaurants = () => {
        const filteredRestaurants = getFilteredRestaurants();
        if (filteredRestaurants.length === 0 && isLoading === false) {
            return (
                <Card
                    sx={{
                        borderRadius: 3,
                        margin: 3,
                        boxShadow: 10,
                        width: "100%",
                        height: "5vh",
                    }}
                >
                    <CardContent>
                        <Typography variant="h5" component="div">
                            No restaurants found with the selected cuisine and filters.
                        </Typography>
                    </CardContent>
                </Card>
            );
        }

        return filteredRestaurants.map((restaurant) => {
            return (
                <Card
                    key={restaurant.id}
                    sx={{ borderRadius: 3, margin: 3, boxShadow: 10 }}
                >
                    <Table>
                        <TableRow>
                            <TableCell
                                sx={{
                                    width: "37%",
                                }}
                            >
                                <img
                                    src={restaurant.image_url}
                                    alt='restaurant'
                                    style={{
                                        width: "100%",
                                        height: "15vh",
                                        aspectRatio: "16/9",
                                        objectFit: "cover",
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <Typography variant="h5" component="div">
                                    {restaurant.name}
                                </Typography>
                                <Rating readOnly value={restaurant.rating} precision={0.5} />
                                <Typography variant="h5" color="text.secondary">
                                    {restaurant.price}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {getCategories(restaurant.categories)}
                                </Typography>
                                <Button
                                    onClick={() => { restaurant.url && window.open(restaurant.url, "_blank") }}
                                    sx={{
                                        margin: "0.5rem",
                                        background: "#d31d30",
                                        ":hover": {
                                            background: "#86121e",
                                        },
                                    }}
                                >
                                    Go to Yelp Page!
                                </Button>
                            </TableCell>
                        </TableRow>
                    </Table>
                </Card>
            );
        });
    }

    const handleSuggestions = () => {
        const filteredRestaurants = getFilteredRestaurants();
        const cuisines = location.state.Cuisines; // an array of cuisines selected by the user
        const cuisineCounts = cuisines.map(cuisine => {
            const matchingRestaurants = filteredRestaurants.filter(r => r.Cuisines && r.Cuisines.includes(cuisine));
            return matchingRestaurants.length;
        });

        const lowestCount = Math.min(...cuisineCounts);
        const lowestCuisineIndex = cuisineCounts.findIndex(count => count === lowestCount);

        const restaurantsToAdd = [];
        if (lowestCount > 0) {
            const lowestCuisine = cuisines[lowestCuisineIndex];
            const restaurantsWithLowestCuisine = filteredRestaurants.filter(r => r.Cuisines && r.Cuisines.includes(lowestCuisine));
            const numToAdd = cuisineCounts.filter(count => count === lowestCount).length - restaurantsWithLowestCuisine.length;

            for (let i = 0; i < numToAdd; i++) {
                restaurantsToAdd.push(...restaurantsWithLowestCuisine);
            }
        }

        const filteredRestaurantsWithDuplicates = [...filteredRestaurants, ...restaurantsToAdd];
        setRandomRestaurant(filteredRestaurantsWithDuplicates[Math.floor(Math.random() * filteredRestaurantsWithDuplicates.length)]);
        setOpenRandomRestaurantModal(true);
    }

    const handleSliderChange = (e) => {
        setRestaurantsIsOpen(e.target.checked);
    };

    const filterRadioButtons = () => {
        return (
            <div style={{
                display: "flex",
                marginBottom: "10px"
            }}>
                <div>
                    <FormControl>
                        <InputLabel id="rating-filter-label">Filter by Rating (min rating)</InputLabel>
                        <Select
                            labelId="rating-filter-label"
                            id="rating-filter"
                            value={ratingFilter}
                            onChange={handleRatingFilterChange}
                        >
                            <MenuItem value={1}><Rating value={1} readOnly /></MenuItem>
                            <MenuItem value={2}><Rating value={2} readOnly /></MenuItem>
                            <MenuItem value={3}><Rating value={3} readOnly /></MenuItem>
                            <MenuItem value={4}><Rating value={4} readOnly /></MenuItem>
                            <MenuItem value={5}><Rating value={5} readOnly /></MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div
                    style={{
                        marginLeft: "20px"
                    }}
                >
                    <FormControl>
                        <InputLabel id="price-filter-label">Filter by Price (max price)</InputLabel>
                        <Select
                            labelId="price-filter-label"
                            id="price-filter"
                            value={priceFilter}
                            onChange={handlePriceFilterChange}
                        >
                            <MenuItem value={"$"}><AttachMoney fontSize='small' sx={{ color: "#d31d30" }} /></MenuItem>
                            <MenuItem value={"$$"}><div><AttachMoney fontSize='small' sx={{ color: "#d31d30" }} /><AttachMoney fontSize='small' sx={{ color: "#d31d30" }} /></div></MenuItem>
                            <MenuItem value={"$$$"}><div><AttachMoney fontSize='small' sx={{ color: "#d31d30" }} /><AttachMoney fontSize='small' sx={{ color: "#d31d30" }} /><AttachMoney fontSize='small' sx={{ color: "#d31d30" }} /></div></MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div
                    style={{
                        marginLeft: "20px"
                    }}
                >
                    <label>Cuisines you've picked</label><br />
                    {
                        location.state.Cuisines.map((cuisine) => {
                            return (
                                <Chip
                                    key={cuisine}
                                    label={cuisine}
                                    style={{ margin: "0.5rem" }}
                                />
                            );
                        })
                    }
                </div>
                <div
                    style={{
                        marginLeft: "20px"
                    }}
                >
                    <label>Radius you've picked</label><br />
                    <Chip
                        key={location.state.radius}
                        label={location.state.radius + " km"}
                        style={{ margin: "0.5rem" }}
                    />
                </div>
                <div
                    style={{
                        marginLeft: "20px"
                    }}
                >
                    <label>Open Restaurants only!</label><br />
                    <Switch
                        checked={restaurantIsOpen}
                        onChange={handleSliderChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </div>
            </div>
        );
    }

    return (
        <Box>
            <div
                style={{
                    display: "flex",
                    width: "6%"
                }}
            >
                <ArrowBack
                    titleAccess='Back to Cuisines Selection Page'
                    sx={{
                        fontSize: "40px",
                        color: "#208cac",
                        top: "7%",
                        left: "2%",
                        display: "flex",
                        ":hover": {
                            cursor: "pointer"
                        }
                    }}
                    onClick={() => window.location.href = "/cuisineselection"}
                />
                Back to Selection Page
            </div>
            {
                isLoading
                    ? <CircularProgress />
                    : (
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "4%" }}>
                                <Grid
                                    container
                                    spacing={0}
                                    direction="column"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    {filterRadioButtons()}
                                    <Alert severity="info" sx={{ fontSize: 18 }}>
                                        {typeOfRestaurantsFound}
                                    </Alert>
                                    <Grid item xl={6}>
                                        <Box sx={{ borderRadius: 3 }}>
                                            {getValidRestaurants()}
                                        </Box>
                                    </Grid>
                                    <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", height: "3%", paddingBottom: "14px", paddingTop: "10px", backgroundColor: "white", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)" }}>
                                        <Button onClick={handleSuggestions} sx={{ background: "#208cac", fontSize: "17px" }} >Suggest us one!</Button>
                                    </div>
                                </Grid>

                            </Box>

                            {
                                randomRestaurant &&

                                <Modal
                                    open={openRandomRestaurantModal}
                                    onClose={() => setOpenRandomRestaurantModal(false)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Box>
                                        <Box sx={{
                                            position: 'relative',
                                            maxWidth: '40vw',
                                                bgcolor: 'rgba(255, 255, 255, 0.6)',
                                                borderRadius: "10px",
                                            border: '1px solid #000',
                                            boxShadow: 24,
                                            p: '1.5vw'
                                        }}>
                                            <Close onClick={() => setOpenRandomRestaurantModal(false)} sx={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer' }} />
                                                {/* <Card
                                                key={randomRestaurant.id}
                                                sx={{ borderRadius: 3, margin: 3, boxShadow: 10 }}
                                            > */}
                                                <Table>
                                                    <TableRow>
                                                        <TableCell
                                                            sx={{
                                                                width: "37%",
                                                            }}
                                                        >
                                                            <img
                                                                src={randomRestaurant.image_url}
                                                                alt='restaurant'
                                                                style={{
                                                                    width: "100%",
                                                                    height: "15vh",
                                                                    aspectRatio: "16/9",
                                                                    objectFit: "cover",
                                                                    borderRadius: "10px"
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="h5" component="div">
                                                                {randomRestaurant.name}
                                                            </Typography>
                                                            <Rating readOnly value={randomRestaurant.rating} precision={0.5} />
                                                            <Typography variant="h5" color="text.secondary">
                                                                {randomRestaurant.price}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {getCategories(randomRestaurant.categories)}
                                                            </Typography>
                                                            <Button
                                                                onClick={() => { randomRestaurant.url && window.open(randomRestaurant.url, "_blank") }}
                                                                sx={{
                                                                    margin: "0.5rem",
                                                                    background: "#d31d30",
                                                                    ":hover": {
                                                                        background: "#86121e",
                                                                    },
                                                                }}
                                                            >
                                                                Go to Yelp Page!
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell colSpan={2}>
                                                            <Typography variant="body2" color="text.secondary" sx={{ color: "black" }}>
                                                                How it was chosen: <br />
                                                                - First we filtered all the restaurants based on your choices. <br />
                                                                - Then we filter out the restaurants that are based on your rating and price preferences. <br />
                                                                - Then we apply weighted randomize to be fair and randomly picked one of the restaurants that matched your preferences. <br />
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                </Table>
                                                {/* </Card> */}
                                        </Box>
                                    </Box>
                                </Modal>
                            }

                        </>
                    )
            }
        </Box>
    )
}
export default ResultScreen;
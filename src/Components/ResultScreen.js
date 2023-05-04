import { Button, CardContent, FormControl, FormLabel, Modal, Radio, RadioGroup } from '@mui/joy';
import { CircularProgress, Typography, Box, Card, Grid, Table, TableRow, TableCell, Rating, Chip, FormControlLabel } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { AttachMoney, Close } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import YelpServices from '../Services/YelpServices';

const ResultScreen = () => {
    const location = useLocation();

    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [ratingFilter, setRatingFilter] = useState('1');
    const [priceFilter, setPriceFilter] = useState('$$$');
    const [typeOfRestaurantsFound, setTypeOfRestaurantsFound] = useState('');
    const [openRandomRestaurantModal, setOpenRandomRestaurantModal] = useState(false);
    const [randomRestaurant, setRandomRestaurant] = useState();

    useEffect(() => {
        setLoading(true);
        const data = {
            "userPreferences": {
                "location": location.state.location,
                "categories": location.state.Cuisines,
                "radius": parseInt(location.state.radius) * 1000
            }
        };

        YelpServices.getBusinesses(data)
            .then((res) => {
                setRestaurants(res.data.yelpAPI);
                var openRestaurants = [];

                res.data.yelpAPI.map((restaurant) => {
                    if (checkIsOpen(restaurant)) {
                        openRestaurants.push(restaurant);
                    }
                });

                setRestaurants(openRestaurants);

                if (res.status === 200) {
                    setTypeOfRestaurantsFound("We found some restaurants that had all the cuisines you selected!");
                } else if (res.status === 201) {
                    setTypeOfRestaurantsFound("We couldn't find any restaurants which had all the cuisines you selected, but we found some that had some of them.");
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
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
                console.log(err);
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
        if (!restaurants) {
            return;
        }
        return restaurants.filter((restaurant) => {
            return restaurant.rating >= ratingFilter && restaurant.price <= priceFilter;
        });
    };

    const getValidRestaurants = () => {

        if (restaurants.length === 0) {
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
                            No restaurants found within radius or with selected cuisines or open now
                        </Typography>
                    </CardContent>
                </Card>
            );
        }

        const filteredRestaurants = getFilteredRestaurants();
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
                                    Yelp Page
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
        setRandomRestaurant(filteredRestaurants[Math.floor(Math.random() * filteredRestaurants.length)]);
        setOpenRandomRestaurantModal(true);
    }

    const filterRadioButtons = () => {
        return (
            <div style={{
                position: "absolute",
                top: "10%",
                right: "2%",
            }}>
                <div>
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Filter by Rating (min rating)</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={ratingFilter}
                            onChange={handleRatingFilterChange}
                        >
                            <FormControlLabel
                                value="1"
                                control={<Radio />}
                                label={
                                    <Rating value={1} readOnly />
                                }
                            />
                            <FormControlLabel
                                value="2"
                                control={<Radio />}
                                label={
                                    <Rating value={2} readOnly />
                                }
                            />
                            <FormControlLabel
                                value="3"
                                control={<Radio />}
                                label={
                                    <Rating value={3} readOnly />
                                }
                            />
                            <FormControlLabel
                                value="4"
                                control={<Radio />}
                                label={
                                    <Rating value={4} readOnly />
                                }
                            />
                            <FormControlLabel
                                value="5"
                                control={<Radio />}
                                label={
                                    <Rating value={5} readOnly />
                                }
                            />
                        </RadioGroup>
                    </FormControl>
                </div>
                <br />
                <div>
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Filter by Price (max price)</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={priceFilter}
                            onChange={handlePriceFilterChange}
                        >
                            <FormControlLabel
                                value="$"
                                control={<Radio />}
                                label={
                                    <div>
                                        <AttachMoney fontSize='small' sx={{ color: "#d31d30" }} />
                                    </div>
                                }
                            />
                            <FormControlLabel
                                value="$$"
                                control={<Radio />}
                                label={
                                    <div>
                                        <AttachMoney fontSize='small' sx={{ color: "#d31d30" }} />
                                        <AttachMoney fontSize='small' sx={{ color: "#d31d30" }} />
                                    </div>
                                }
                            />
                            <FormControlLabel
                                value="$$$"
                                control={<Radio />}
                                label={
                                    <div>
                                        <AttachMoney fontSize='small' sx={{ color: "#d31d30" }} />
                                        <AttachMoney fontSize='small' sx={{ color: "#d31d30" }} />
                                        <AttachMoney fontSize='small' sx={{ color: "#d31d30" }} />
                                    </div>
                                }
                            />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div>
                    <Button onClick={handleSuggestions}>Suggest us one!</Button>
                </div>
            </div>
        );
    }

    return (
        <Box>
            {
                isLoading
                    ? <CircularProgress />
                    : (
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Grid
                                    container
                                    spacing={0}
                                    direction="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    style={{ minHeight: '90vh' }}
                                >
                                    <Grid item xl={6}>
                                        <Box sx={{ borderRadius: 3 }}>
                                            <Typography variant="body2" component="div">
                                                {typeOfRestaurantsFound}
                                            </Typography>
                                            {getValidRestaurants()}
                                        </Box>
                                    </Grid>
                                </Grid>

                                {filterRadioButtons()}

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
                                            bgcolor: 'background.paper',
                                            border: '1px solid #000',
                                            boxShadow: 24,
                                            p: '1.5vw'
                                        }}>
                                            <Close onClick={() => setOpenRandomRestaurantModal(false)} sx={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer' }} />
                                            <Card
                                                key={randomRestaurant.id}
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
                                                                src={randomRestaurant.image_url}
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
                                                                {randomRestaurant.name}
                                                            </Typography>
                                                            <Rating disabled value={randomRestaurant.rating} precision={0.5} />
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
                                                                Yelp Page
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                </Table>
                                            </Card>
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
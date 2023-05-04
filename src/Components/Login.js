import { Box, Card, Typography, Link, Chip, Table, TableRow, TableCell, TextField, Button, CardContent, CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import "./Login.css";
import { ReactComponent as LoginSVG } from "../Assets/loginImage.svg";
import UserServices from "../Services/UserServices";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (window.localStorage.getItem("user")) {
            // window.location.href = "/cuisineselection";
            window.location.href = "/home";
        }
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (username.trim() === "" || password.trim() === "") {
            setErrorMessage("Enter username and password");
            return;
        }
        setLoading(true);
        var data = {
            "userDetails": {
                "username": username,
                "password": password
            }
        };
        UserServices.getUserByIdLogin(username, data)
            .then((response) => {
                window.localStorage.setItem("user", username);
                // window.location.href = "/cuisineselection";
                window.location.href = "/home";
            })
            .catch((error) => {
                console.log(error);
                setErrorMessage("Invalid username or password");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="mainDiv">
            <Box sx={{ width: "50vw", height: "70vh", boxShadow: 10, gap: 2, borderRadius: 3 }}>
                <Card sx={{ height: "100%", borderRadius: 3 }} >
                    <Table sx={{ height: "100%" }} >
                        <TableRow>
                            <TableCell>
                                <form onSubmit={(e) => handleSubmit(e)}>
                                    <label style={{ fontSize: 34, color: "#d31d30", fontWeight: "bold", marginLeft: "2%" }}>
                                        Login
                                    </label>
                                    <TextField
                                        id="outlined-basic"
                                        label="Username"
                                        variant="outlined"
                                        sx={{ margin: 1, width: "95%", background: "#f5f5f5" }}
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value)
                                            setErrorMessage("")
                                        }}
                                    />

                                    <TextField id="outlined-basic"
                                        label="Password"
                                        variant="outlined"
                                        sx={{ margin: 1, width: "95%", background: "#f5f5f5" }}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                            setErrorMessage("")
                                        }}
                                    />

                                    <div style={{ display: "flex", justifyContent: "flex-end", marginRight: "3%" }}>
                                        <Link href="/register" underline="hover" sx={{ textAlign: "right" }}>Dont have an Account?</Link>
                                    </div>
                                    <br />
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        {isLoading ? <CircularProgress /> :
                                            <Button variant="contained"
                                                type="submit"
                                                sx={{
                                                    margin: 1,
                                                    width: "25%",
                                                    height: "50px",
                                                    background: "#d31d30",
                                                    fontSize: "18px",
                                                    fontWeight: "bold",
                                                    color: "white",
                                                    borderRadius: "24px",
                                                    ":hover": {
                                                        background: "#0c1e5c",
                                                        color: "white",
                                                    },
                                                }}>
                                                Login
                                            </Button>}
                                    </div>
                                    {errorMessage && (
                                        <Typography sx={{ color: "red", textAlign: "center" }}>
                                            {errorMessage}
                                        </Typography>
                                    )}
                                </form>
                            </TableCell>
                            <TableCell sx={{ width: "40%", background: "#d31d30", overflow: "hidden" }}>
                                <LoginSVG style={{ background: "#d31d30", transform: "scale(1.75)" }} />
                            </TableCell>
                        </TableRow>
                    </Table>
                </Card>
            </Box>
        </div >
    );
}

export default LoginPage;

import { Box, Card, Typography, Link, Chip, Table, TableRow, TableCell, TextField, Button, CardContent } from "@mui/material";
import React, { useState, useEffect } from "react";
import "./Login.css";
import { ReactComponent as LoginSVG } from "../Assets/registerImage.svg";
import AspectRatio from '@mui/joy/AspectRatio';
import UserServices from "../Services/UserServices";

const RegisterPage = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (window.localStorage.getItem("user")) {
            window.location.href = "/cuisineselection";
        }
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (username.trim() === "" || password.trim() === "") {
            setErrorMessage("Enter username and password");
            return;
        }
        if (password !== ConfirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }
        setLoading(true);
        var data = {
            "userDetails": {
                "username": username,
                "password": password
            }
        };
        setLoading(true);
        UserServices.createUser(data)
            .then((response) => {
                window.localStorage.setItem("user", username);
                window.location.href = "/cuisineselection";
            })
            .catch((error) => {
                console.log(error);
                setErrorMessage("Username already exists");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <div className="mainDiv">
            <Box sx={{ width: "50vw", height: "40vh", boxShadow: 10, gap: 2, borderRadius: 3 }}>
                <Card sx={{ height: "100%", borderRadius: 3 }} >
                    <Table sx={{ height: "100%" }} >
                        <TableRow>
                            <TableCell>
                                <form onSubmit={(e) => handleSubmit(e)}>
                                    <label style={{ fontSize: 34, color: "#d31d30", fontWeight: "bold", marginLeft: "2%" }}>
                                        Register
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

                                    <TextField id="outlined-basic"
                                        label="Confirm Password"
                                        variant="outlined"
                                        sx={{ margin: 1, width: "95%", background: "#f5f5f5" }}
                                        value={ConfirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value)
                                            setErrorMessage("")
                                        }}
                                    />

                                    <div style={{ display: "flex", justifyContent: "flex-end", marginRight: "3%" }}>
                                        <Link href="/" underline="hover" sx={{ textAlign: "right" }}>Already have an Account?</Link>
                                    </div>
                                    <br />
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        {isLoading ? <p>Loading...</p> :
                                            <Button variant="contained"
                                                type="submit"
                                                sx={{
                                                    margin: 1,
                                                    width: "40%",
                                                    height: "50px",
                                                    background: "#d31d30",
                                                    fontSize: "14px",
                                                    fontWeight: "bold",
                                                    color: "white",
                                                    borderRadius: "24px",
                                                    ":hover": {
                                                        background: "#0c1e5c",
                                                        color: "white",
                                                    },
                                                }}>
                                                Register now
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
                                <LoginSVG style={{ background: "#d31d30", transform: "scale(1.25)" }} />
                            </TableCell>
                        </TableRow>
                    </Table>
                </Card>
            </Box>
        </div >
    );
}

export default RegisterPage;
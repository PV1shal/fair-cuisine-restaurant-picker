import { Box, Card, Typography, Link, Chip, Table, TableRow, TableCell, TextField, Button, CardContent } from "@mui/material";
import React, { useState, useEffect } from "react";
import "./Login.css";
import { ReactComponent as LoginSVG } from "../Assets/loginImage.svg";
import AspectRatio from '@mui/joy/AspectRatio';

const RegisterPage = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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

        // Validation logic here
    }

    return (
        <div className="mainDiv">
            <Box sx={{ width: "50vw", height: "40vh", boxShadow: 10, gap: 2, borderRadius: 3 }}>
                <Card sx={{ height: "100%", borderRadius: 3 }} >
                    <Table sx={{ height: "100%" }} >
                        <TableRow>
                            <TableCell>
                                <form onSubmit={(e) => handleSubmit(e)}>
                                    <label style={{ fontSize: 34, color: "#1A4AF2", fontWeight: "bold", marginLeft: "2%" }}>
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
                                                    background: "#1A4AF2",
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
                            <TableCell sx={{ width: "40%", background: "#1A4AF2" }}>
                                <AspectRatio ratio={11 / 9}>
                                    <LoginSVG style={{ background: "#1A4AF2" }} />
                                </AspectRatio>
                            </TableCell>
                        </TableRow>
                    </Table>
                </Card>
            </Box>
        </div >
    );
}

export default RegisterPage;
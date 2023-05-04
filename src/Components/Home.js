import { Box, Button, Card, CardContent, CardHeader, Grid, Modal, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from 'react';
import UserServices from "../Services/UserServices";
import GroupServices from "../Services/GroupServices";
import { Add, Close } from "@mui/icons-material";

const Home = () => {

    const [user, setUser] = useState({});
    const [groupDetails, setGroupDetails] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const username = window.localStorage.getItem("user");
        (async function runEffect() {
            const fetchedUser = await UserServices.getUserById(username);
            if (fetchedUser && fetchedUser.data) {
                setUser(fetchedUser.data);
            }
        })();
    }, []);

    useEffect(() => {
        if (user.user && user.user.groups) {
            setGroupDetails([]);
            user.user.groups.forEach((group, index) => {
                setGroups(group);
            });
        }
    }, [user]);


    const printGroups = () => {
        return groupDetails.map((group, index) => {
            return (
                <Card
                    key={index}
                    onClick={() => { window.location.href = "/cuisineselection" }}
                    sx={{
                        boxShadow: 10,
                        borderRadius: 3,
                        width: "50%",
                        margin: "1rem",
                        padding: "1rem",
                        ":hover": {
                            cursor: "pointer",
                            background: "#c5c2c2",
                            transition: "0.5s"
                        }
                    }}
                >
                    <CardHeader title={group.groupName} />
                    <CardContent sx={{ padding: 0 }}>
                        <b>Description:</b> {group.groupDesc}
                    </CardContent>
                </Card>
            );
        });
    };

    const setGroups = (groupId) => {
        GroupServices.getGroupById(groupId)
            .then((response) => {
                setGroupDetails(oldGroupDetails => [...oldGroupDetails, response.data.group])
            });
    }

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleAddGroup = () => {
        const groupName = document.getElementById("groupName").value;
        const groupDesc = document.getElementById("groupDesc").value;

        const data = {
            "groupDetails": {
                "groupName": groupName,
                "groupDesc": groupDesc
            }
        };

        GroupServices.addGroup(data)
            .then((response) => {
                const tempUser = user.user;
                tempUser.groups.push(response.data._id);
                setUser({ user: tempUser });

                console.log(tempUser);


                const temp = {
                    "userDetails": {
                        "username": tempUser._id,
                        "password": tempUser.password,
                        "groups": tempUser.groups,
                    }
                };

                UserServices.updateUser(tempUser._id, temp)
                    .then((response) => {
                        console.log(response);
                    })
                    .catch((error) => {
                        console.log(error);
                    });

                setModalOpen(false);
            });
    };

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
        >
            {user.user &&
                <Box
                    sx={{
                        width: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column"
                    }}
                >
                    <Typography variant="h4" component="div" sx={{ margin: 4 }}>
                        Your groups, {user.user._id}
                    </Typography>
                    {printGroups()}
                    <Button
                        onClick={() => { handleModalOpen() }}
                        sx={{
                            margin: 2,
                            borderRadius: 50,
                            background: "#d31d30",
                            color: "white",
                            ":hover": {
                                background: "#86121e",
                            }
                        }}>
                        <Add />
                    </Button>
                </Box>
            }

            <Modal
                open={modalOpen}
                onClose={() => { handleModalClose() }}
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
                        <Close onClick={() => { handleModalClose() }} sx={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer' }} />
                        <Typography id="modal-modal-title" variant="h5" component="h2">
                            Create a new Group
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: '2vw' }}>
                            <TextField id="groupName" label="Group Name" variant="outlined" sx={{ width: '100%', mb: '1vw' }} />
                            <TextField id="groupDesc" label="Group Description" variant="outlined" sx={{ width: '100%', mb: '1vw' }} />
                            <Button
                                onClick={() => { handleAddGroup() }}
                                sx={{
                                    width: '100%', mb: '1vw',
                                    background: '#d31d30',
                                    color: 'white',
                                    ':hover': { background: '#86121e' }
                                }}>
                                Create
                            </Button>
                        </Typography>
                    </Box>
                </Box>
            </Modal>

        </Grid >
    );
}

export default Home;

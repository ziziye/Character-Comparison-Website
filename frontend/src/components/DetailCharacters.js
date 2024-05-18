import { useEffect, useState } from 'react';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import BasicTable from './BasicTable';
import axios from 'axios';
import { ReviewCard } from './ReviewCard';
import Drawer from '@mui/material/Drawer';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useUser } from '../contexts/UserContext';
import CircularProgress from '@mui/material/CircularProgress';

axios.defaults.withCredentials = true;
export default function DetailCharacters() {
    const [open, setOpen] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [editDrawerOpen, setEditDrawerOpen] = useState(false);
    const [messageSeverity, setMessageSeverity] = useState("error");
    const [message, setMessage] = useState("");
    const [alertOpen, setAlertOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const { user } = useUser();

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleEditDrawerOpen = () => { // 3. Open edit drawer
        setEditDrawerOpen(true);
    };
    const handleCharacterDelete = async (character) => {
        try {
            const res = await axios.delete(`http://localhost:3001/api/v1/character/${character.id}/delete`, {
                withCredentials: true
            });
            if (res.data.code === 200) {
                // If the role is successfully deleted, the role list displayed on the page is updated
                fetchCharacters(currentPage);
                setMessageSeverity("success"); // Set the message type to Success
                setMessage(res.data.msg);
                setAlertOpen(true); // Set "true" after the role is successfully created
                setSelectedCharacter(null);
                // Set alertOpen to false after 3 seconds to control the display time of warning messages
                setTimeout(() => {
                    setAlertOpen(false);
                }, 3000);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setMessageSeverity("error");
                setMessage(error.response.data.msg);
                setAlertOpen(true);
                setTimeout(() => {
                    setAlertOpen(false);
                }, 3000);
            } else {
                setMessageSeverity("error");
                setMessage(error.response.data.msg);
                setAlertOpen(true);
                setTimeout(() => {
                    setAlertOpen(false);
                }, 3000);
            }
        }
    }
    const handleEditDrawerClose = () => { // 3. Close edit drawer
        setEditDrawerOpen(false);
    };
    const rows = Object.values(characters).map(character => ({ name: character.name }));
    const fetchCharacters = async (page) => {
        try {
            const resCharacters = await axios.get(`http://localhost:3001/api/v1/character/list?page=${page}&limit=10`, {
                withCredentials: true
            });
            const charactersData = resCharacters.data;
            setCharacters(charactersData.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchCharacters(currentPage);
    }, [currentPage]);

    // Update the page number when click the "Previous" button
    const handlePreviousClick = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            fetchCharacters(currentPage - 1);
        }
    };
    // Update the page number when click the "Next" button
    const handleNextClick = async () => {
        try {
            const resCharacters = await axios.get(`http://localhost:3001/api/v1/character/list?page=${currentPage + 1}&limit=10`, {
                withCredentials: true
            });
            const charactersData = resCharacters.data;
            if (charactersData.data.length > 0) {
                setCurrentPage(currentPage + 1);
                fetchCharacters(currentPage + 1);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevents default form submission behavior
        // Generate a unique ID based on name
        const id = event.target.name.value.toLowerCase();
        const form = event.target;
        const strength = form.elements.strength.value;
        const speed = form.elements.speed.value;
        const skill = form.elements.skill.value;
        const fear_factor = form.elements.fear_factor.value;
        const power = form.elements.power.value;
        const intelligence = form.elements.intelligence.value;
        const wealth = form.elements.wealth.value;
        const fields = [strength, speed, skill, fear_factor, power, intelligence, wealth];
        for (let field of fields) {
            if (field < 0 || field > 100) {
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 2000);
                return;
            }
        }
        setShowAlert(false);
        try {
            const res = await axios.post('http://localhost:3001/api/v1/character/create', {
                // The data in the form is sent to the back end as the body of a request
                id: id,
                name: event.target.name.value,
                subtitle: event.target.subtitle.value,
                description: event.target.description.value,
                image_url: "images/unknown.png",
                strength: event.target.strength.value,
                speed: event.target.speed.value,
                skill: event.target.skill.value,
                fear_factor: event.target.fear_factor.value,
                power: event.target.power.value,
                intelligence: event.target.intelligence.value,
                wealth: event.target.wealth.value,
            }, {
                withCredentials: true,
            });
            handleClose();
            if (res.data.code === 201) {
                setMessageSeverity("success"); // Set the message type to Success
                setMessage(res.data.msg);
                setAlertOpen(true);
                setTimeout(() => {
                    setAlertOpen(false);
                }, 3000);
                handleClose();
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setMessageSeverity("info");
                setMessage(error.response.data.msg);
                setAlertOpen(true);
                setTimeout(() => {
                    setAlertOpen(false);
                }, 3000);
                handleClose();
            } else if (error.response && error.response.status === 404) {
                setMessageSeverity("error"); // Set the message type to error
                setMessage(error.response.data.msg);
                setAlertOpen(true);
                setTimeout(() => {
                    setAlertOpen(false);
                }, 3000);
                handleClose();
            } else {
                setMessageSeverity("error"); // Set the message type to error
                setMessage(error.response.data.msg);
                setAlertOpen(true);
                setTimeout(() => {
                    setAlertOpen(false);
                }, 3000);
                handleClose();
            }
        }
    };
    const handleEditSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        const newName = form.elements.name.value;
        const newSubtitle = form.elements.subtitle.value;
        const newDescription = form.elements.description.value;
        const newStrength = form.elements.strength.value;
        const newSpeed = form.elements.speed.value;
        const newSkill = form.elements.skill.value;
        const newFearFactor = form.elements.fear_factor.value;
        const newPower = form.elements.power.value;
        const newIntelligence = form.elements.intelligence.value;
        const newWealth = form.elements.wealth.value;
        const fields = [newStrength, newSpeed, newSkill, newFearFactor, newPower, newIntelligence, newWealth];
        for (let field of fields) {
            if (field < 0 || field > 100) {
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 2000);
                return;
            }
        }
        setShowAlert(false);
        //If the user didn't edit anything, return empty
        if (
            newName == selectedCharacter.name &&
            newSubtitle == selectedCharacter.subtitle &&
            newDescription == selectedCharacter.description &&
            newStrength == selectedCharacter.strength &&
            newSpeed == selectedCharacter.speed &&
            newSkill == selectedCharacter.skill &&
            newFearFactor == selectedCharacter.fear_factor &&
            newPower == selectedCharacter.power &&
            newIntelligence == selectedCharacter.intelligence &&
            newWealth == selectedCharacter.wealth
        ) {
            handleEditDrawerClose();
            return;
        }
        try {
            const res = await axios.post('http://localhost:3001/api/v1/character/edit', {
                id: selectedCharacter.id,
                name: event.target.name.value,
                subtitle: event.target.subtitle.value,
                description: event.target.description.value,
                strength: event.target.strength.value,
                speed: event.target.speed.value,
                skill: event.target.skill.value,
                fear_factor: event.target.fear_factor.value,
                power: event.target.power.value,
                intelligence: event.target.intelligence.value,
                wealth: event.target.wealth.value,
            }, {
                withCredentials: true,
            });
            if (res.data.code === 201) {
                // If the user is an administrator, the role information is updated and approved automatically
                if (user.isAdmin) {
                    setSelectedCharacter({
                        ...selectedCharacter,
                        name: event.target.name.value,
                        subtitle: event.target.subtitle.value,
                        description: event.target.description.value,
                        strength: event.target.strength.value,
                        speed: event.target.speed.value,
                        skill: event.target.skill.value,
                        fear_factor: event.target.fear_factor.value,
                        power: event.target.power.value,
                        intelligence: event.target.intelligence.value,
                        wealth: event.target.wealth.value
                    });
                    setMessageSeverity("success");
                    setMessage(res.data.msg);
                    setAlertOpen(true);
                    setTimeout(() => {
                        setAlertOpen(false);
                    }, 3000);
                    handleEditDrawerClose();
                } else {
                    // If the user is not an administrator, the system prompts the administrator for approval
                    setMessageSeverity("info");
                    setMessage(res.data.msg);
                    setAlertOpen(true);
                    setTimeout(() => {
                        setAlertOpen(false);
                    }, 3000);
                    handleEditDrawerClose();
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setMessageSeverity("info");
                setMessage(error.response.data.msg);
                setAlertOpen(true);
                setTimeout(() => {
                    setAlertOpen(false);
                }, 3000);
                handleEditDrawerClose();
            } else if (error.response && error.response.status === 404) {
                setMessageSeverity("error");
                setMessage(error.response.data.msg);
                setAlertOpen(true);
                setTimeout(() => {
                    setAlertOpen(false);
                }, 3000);
                handleEditDrawerClose();
            } else {
                setMessageSeverity("error");
                setMessage(error.response.data.msg);
                setAlertOpen(true);
                setTimeout(() => {
                    setAlertOpen(false);
                }, 3000);
                handleEditDrawerClose();
            }
        }
    };

    if (!characters) {
        return (
            <React.Fragment>
                <svg width={0} height={0}>
                    <defs>
                        <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#e01cd5" />
                            <stop offset="100%" stopColor="#1CB5E0" />
                        </linearGradient>
                    </defs>
                </svg>
                <CircularProgress sx={{
                    width: 100,
                    height: 100,
                    'svg circle': { stroke: 'url(#my_gradient)' } // Set the color of CircularProgress
                }} />
            </React.Fragment>
        );

    }
    if (selectedCharacter) {
        return (
            <div className="page-container">
                <div>
                    {alertOpen && (
                        <Stack spacing={2} sx={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)', // Center the alarm
                            zIndex: 9999, // Make sure the alert is on top of everything else
                            maxWidth: '80%',
                            textAlign: 'center',
                        }}>
                            <Alert severity={messageSeverity} sx={{ width: "100%" }}>
                                {message}
                            </Alert>
                        </Stack>
                    )}
                    <ReviewCard selectedCharacter={selectedCharacter} />

                    <Button variant="contained" onClick={() => setSelectedCharacter(null)} sx={{ marginLeft: '43px', marginTop: '11px' }}>Back</Button>
                    <Button variant="contained" onClick={handleEditDrawerOpen} sx={{ marginLeft: '33px', marginTop: '11px' }}>Edit</Button>
                    {user.isAdmin && (
                        <Button variant="contained" onClick={() => handleCharacterDelete(selectedCharacter)} sx={{ marginLeft: '33px', marginTop: '11px' }}>Delete</Button>
                    )}

                    <Drawer anchor="top" open={editDrawerOpen} onClose={handleEditDrawerClose}
                        sx={{ // Custom styling using sx prop
                            '& .MuiDrawer-paper': { // Target the paper element of the drawer
                                width: '850px', // Set the width of the drawer
                                backgroundColor: '#ffffff', // Set the background color of the drawer
                                padding: '20px', // Add padding to the drawer content
                                marginLeft: '500px',
                                borderRadius: '10px',
                                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                                height: '550px',
                                transform: 'translateX(-50%)',
                                marginTop: '30px'
                            },
                        }}
                    >
                        <div>
                            <form onSubmit={handleEditSubmit} enctype="multipart/form-data" >
                                {/* Form fields for editing character properties */}
                                <DialogTitle
                                    sx={{
                                        color: '#333',
                                        marginBottom: '20px',
                                        textAlign: 'center',
                                        paddingBottom: '10px',
                                    }}
                                >Edit Characters</DialogTitle>
                                <TextField label="Name" id="name" defaultValue={selectedCharacter.name} size="small" sx={{ marginRight: '20px', marginBottom: '20px' }} />
                                <TextField label="Subtitle" id="subtitle" defaultValue={selectedCharacter.subtitle} size="small" />
                                <br />
                                <TextField id="description" inputProps={{ type: 'number' }} label="Description" multiline rows={4} defaultValue={selectedCharacter.description} sx={{ width: '620px', marginBottom: '20px' }} />
                                <br /><TextField required id="strength" inputProps={{ type: 'number' }} label="Strength" defaultValue={selectedCharacter.strength} variant="standard" sx={{ marginRight: '20px', marginBottom: '20px' }} />
                                <TextField required id="speed" inputProps={{ type: 'number' }} label="Speed" defaultValue={selectedCharacter.speed} variant="standard" sx={{ marginRight: '20px' }} />
                                <TextField required id="skill" inputProps={{ type: 'number' }} label="Skill" defaultValue={selectedCharacter.skill} variant="standard" sx={{ marginRight: '20px' }}/>
                                <TextField required id="fear_factor" inputProps={{ type: 'number' }} label="Fear_Factor" defaultValue={selectedCharacter.fear_factor} variant="standard" sx={{ marginRight: '20px', marginBottom: '20px' }} />
                                <TextField required id="power" inputProps={{ type: 'number' }} label="Power" defaultValue={selectedCharacter.power} variant="standard" sx={{ marginRight: '20px' }} />
                                <TextField required id="intelligence" inputProps={{ type: 'number' }} label="Intelligence" defaultValue={selectedCharacter.intelligence} variant="standard" sx={{ marginRight: '20px' }}/>
                                <TextField required id="wealth" inputProps={{ type: 'number' }} label="Wealth" defaultValue={selectedCharacter.wealth} variant="standard" />
                                {showAlert && (
                                    <Alert severity="error" sx={{ width: "350px", marginTop: "10px", marginBottom: "-30px" }}>
                                        All values must be between 0 and 100
                                    </Alert>
                                )}
                                <br /><br />
                                <Button type="submit" variant="contained">Save</Button>
                            </form>
                        </div>
                    </Drawer>
                </div>
            </div>
        );
    }
    return (
        <div className="page-container">

            <div>
                {alertOpen && (
                    <Stack spacing={2} sx={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)', // Center the alarm
                        zIndex: 9999, // Make sure the alert is on top of everything else
                        maxWidth: '80%',
                        textAlign: 'center',
                    }}>
                        <Alert severity={messageSeverity} sx={{ width: "100%" }}>
                            {message}
                        </Alert>
                    </Stack>
                )}
                <BasicTable
                    rows={characters}
                    currentPage={currentPage}
                    setSelectedCharacter={setSelectedCharacter}
                    handlePreviousClick={handlePreviousClick} // Pass the handlePreviousClick function
                    handleNextClick={handleNextClick} // Pass the handleNextClick function
                />
                <br />
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        right: 0,
                        zIndex: 1000, // Make sure the element sits on top of everything else
                        p: 2,
                    }}
                >
                    <Fab color="primary" aria-label="add" onClick={handleClickOpen}>
                        <AddIcon />
                    </Fab>
                </Box>
                <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                    <DialogTitle>Add Characters</DialogTitle>
                    <DialogContent>
                        <form onSubmit={handleSubmit}>
                            <TextField required label="Name" id="name" size="small" sx={{ marginBottom: '21px', marginRight: '23px', marginTop: '11px' }} />
                            <TextField label="Subtitle" id="subtitle" size="small" sx={{ marginBottom: '21px', marginRight: '23px', marginTop: '11px' }} />
                            <br />
                            <TextField id="description" label="Description" multiline rows={4} sx={{ marginBottom: '21px', width: '80%' }} />
                            <br /><TextField required id="strength" inputProps={{ type: 'number' }} label="Strength" variant="standard" sx={{ marginRight: '23px' }} />
                            <TextField required id="speed" inputProps={{ type: 'number' }} label="Speed" variant="standard" sx={{ marginRight: '23px' }} />
                            <TextField required id="skill" label="Skill" variant="standard" sx={{ marginRight: '23px' }} />
                            <TextField required id="fear_factor" inputProps={{ type: 'number' }} label="Fear_Factor" variant="standard" sx={{ marginRight: '23px' }} />
                            <TextField required id="power" inputProps={{ type: 'number' }} label="Power" variant="standard" sx={{ marginRight: '23px' }} />
                            <TextField required id="intelligence" inputProps={{ type: 'number' }} label="Intelligence" variant="standard" sx={{ marginRight: '23px' }} />
                            <TextField required id="wealth" inputProps={{ type: 'number' }} label="Wealth" variant="standard" sx={{ marginRight: '23px' }} />
                            <br /><br />
                            {showAlert && (
                                <Alert severity="error" sx={{ width: "100%", marginBottom: "20px" }}>
                                    All values must be between 0 and 100
                                </Alert>
                            )}
                            <Button type="submit" variant="contained">save</Button>
                        </form>
                    </DialogContent>

                </Dialog>
            </div>
        </div>
    );
}
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Avatar, Box, Card, CardContent, Container, Divider, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { Email, Person, AccountCircle } from "@mui/icons-material";

const TaskDetail = () => {
    const { id } = useParams();
    const [task, setTask] = useState(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axios.get(`/api/v1/task/${id}`);
                setTask(response.data.data);
                console.log("TaskDetail.jsx: task: ", response.data);
            } catch (err) {
                console.error("Error fetching task details:", err);
            }
        };

        fetchTask();
    }, [id]);

    if (!task) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 4 }}>
                    <Box display="flex" alignItems="center" mb={4}>
                        <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                            <PersonIcon sx={{ fontSize: 32 }} />
                        </Avatar>
                        <Typography variant="h4" component="h1" ml={2} fontWeight="medium">
                            {task.title}
                        </Typography>
                    </Box>

                    {[
                        { label: "Title", value: task.title, icon: <Person sx={{ color: "action.active" }} /> },
                        { label: "Description", value: task.description, icon: <AccountCircle sx={{ color: "action.active" }} /> },
                        { label: "Status", value: task.status, icon: <Email sx={{ color: "action.active" }} /> },


                    ].map((field, index) => (
                        <Box key={field.label} sx={{ mb: index !== 2 ? 4 : 0 }}>
                            <Box display="flex" alignItems="center" mb={1}>
                                {field.icon}
                                <Typography variant="subtitle2" color="text.secondary" sx={{ ml: 1 }}>
                                    {field.label}
                                </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ fontSize: "1.1rem", ml: 4 }}>
                                {field.value}
                            </Typography>
                            {index !== 2 && <Divider sx={{ mt: 3 }} />}
                        </Box>
                    ))}
                </CardContent>
            </Card>
        </Container>
    );
};

export default TaskDetail;

import { useEffect, useState } from "react";
import { TextField, Button, Typography, Grid, Box, Container, Card, CardContent, MenuItem } from "@mui/material";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Assignment, SaveAlt } from "@mui/icons-material"; // Đổi icon cho hợp với Task
import { useSearchParams } from "react-router-dom";
import { tasksService, projectsService } from "../services";

const errorMessageSx = {
    color: "error.main",
    fontSize: "0.75rem",
    mt: 0.5,
    ml: 1.5,
};

const NewTasks = () => {
    const [searchParams] = useSearchParams();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await projectsService.getAll();
                setProjects(response.data || []);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProjects();
    }, []);

    const preselectedProjectId = searchParams.get("projectId") || "";

    const TaskSchema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        description: Yup.string().required("Description is required"),
        status: Yup.string().required("Status is required"),
        priority: Yup.string().required("Priority is required"),
    });

    const handleTaskSubmit = async (values, { resetForm }) => {
        try {
            await tasksService.create({
                title: values.title,
                description: values.description,
                status: values.status,
                priority: values.priority,
                dueDate: values.dueDate || null,
                projectId: values.projectId ? Number(values.projectId) : null,
            });

            toast.success("Task created successfully");
            resetForm();
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while creating the task");
        }
    };

    return (
        <Container maxWidth="md" component="main" sx={{ py: 10 }}>
            <Card elevation={10} sx={{ borderRadius: 5 }}>
                <CardContent sx={{ p: 5 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                        <Assignment sx={{ fontSize: 32, color: "primary.main", mr: 2 }} />
                        <Typography variant="h4" component="h1" gutterBottom fontWeight="medium">
                            New Task
                        </Typography>
                    </Box>
                    <Formik

                        initialValues={{
                            title: "",
                            description: "",
                            dueDate: "",
                            projectId: preselectedProjectId,
                            status: "TODO",
                            priority: "MEDIUM",
                        }}
                        enableReinitialize
                        validationSchema={TaskSchema}
                        onSubmit={handleTaskSubmit}
                    >
                        {({ handleSubmit, isSubmitting }) => (
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            name="title"
                                            as={TextField}
                                            label="Title"
                                            required
                                            fullWidth
                                            variant="outlined"
                                        />
                                        <ErrorMessage name="title">{(msg) => <Box sx={errorMessageSx}>{msg}</Box>}</ErrorMessage>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            name="description"
                                            as={TextField}
                                            label="Description"
                                            required
                                            fullWidth
                                            variant="outlined"
                                        />
                                        <ErrorMessage name="description">{(msg) => <Box sx={errorMessageSx}>{msg}</Box>}</ErrorMessage>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Field name="dueDate"
                                            as={TextField}
                                            label="Due Date"
                                            type="date"
                                            fullWidth
                                            variant="outlined"
                                            InputLabelProps={{ shrink: true }} />
                                        <ErrorMessage name="dueDate"> {(msg) => <Box sx={errorMessageSx}>{msg}</Box>} </ErrorMessage>
                                    </Grid>



                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            name="projectId"
                                            as={TextField}
                                            select
                                            label="Project"
                                            fullWidth
                                            variant="outlined"
                                        >
                                            <MenuItem value="">No Project</MenuItem>
                                            {projects.map((project) => (
                                                <MenuItem value={project.id} key={project.id}>
                                                    {project.name}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </Grid>


                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            name="status"
                                            as={TextField}
                                            select
                                            label="Status"
                                            required
                                            fullWidth
                                            variant="outlined"
                                        >
                                            <MenuItem value="TODO">To Do</MenuItem>
                                            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                                            <MenuItem value="REVIEW">Review</MenuItem>
                                            <MenuItem value="DONE">Done</MenuItem>
                                        </Field>
                                        <ErrorMessage name="status">{(msg) => <Box sx={errorMessageSx}>{msg}</Box>}</ErrorMessage>
                                    </Grid>


                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            name="priority"
                                            as={TextField}
                                            select
                                            label="Priority"
                                            required
                                            fullWidth
                                            variant="outlined"
                                        >
                                            <MenuItem value="LOW">Low</MenuItem>
                                            <MenuItem value="MEDIUM">Medium</MenuItem>
                                            <MenuItem value="HIGH">High</MenuItem>
                                            <MenuItem value="URGENT">Urgent</MenuItem>
                                            <MenuItem value="ULTRA">Ultra</MenuItem>
                                        </Field>
                                        <ErrorMessage name="priority">{(msg) => <Box sx={errorMessageSx}>{msg}</Box>}</ErrorMessage>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                            size="large"
                                            disabled={isSubmitting}
                                            startIcon={<SaveAlt />}
                                            sx={{ mt: 2, px: 4, py: 1.5, borderRadius: 2 }}
                                        >
                                            Create Task
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    </Formik>
                </CardContent>
            </Card>
        </Container>
    );
};

export default NewTasks;
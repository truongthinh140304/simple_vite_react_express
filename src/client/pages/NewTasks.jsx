import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TextField, Button, Typography, Grid, Box, Container, Card, CardContent, MenuItem } from "@mui/material";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Assignment, SaveAlt } from "@mui/icons-material";
import { useProjects, useContacts } from "../hooks";

const errorMessageSx = {
    color: "error.main",
    fontSize: "0.75rem",
    mt: 0.5,
    ml: 1.5,
};

const NewTasks = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use custom hooks instead of manual fetch
    const { projects, isLoading: projectsLoading } = useProjects();
    const { contacts, isLoading: contactsLoading } = useContacts();

    const preselectedProjectId = searchParams.get("projectId") || "";
    const isLoading = projectsLoading || contactsLoading;

    const TaskSchema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        description: Yup.string().required("Description is required"),
        status: Yup.string().required("Status is required"),
        priority: Yup.string().required("Priority is required"),
    });

    const handleTaskSubmit = async (values, { resetForm }) => {
        try {
            setIsSubmitting(true);

            const response = await fetch("/api/v1/task/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: values.title,
                    description: values.description,
                    status: values.status,
                    priority: values.priority,
                    dueDate: values.dueDate || null,
                    projectId: values.projectId ? Number(values.projectId) : null,
                    assigneeId: values.assigneeId ? Number(values.assigneeId) : null,
                }),
            });

            if (!response.ok) throw new Error("Failed to create task");

            toast.success("Task created successfully");
            resetForm();
            navigate("/tasks");
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while creating the task");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container maxWidth="lg" component="main" sx={{ py: 8 }}>
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
                            assigneeId: "",
                            status: "TODO",
                            priority: "MEDIUM",
                        }}
                        enableReinitialize
                        validationSchema={TaskSchema}
                        onSubmit={handleTaskSubmit}
                    >
                        {({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
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
                                    <Grid size={{ xs: 12, sm: 6 }}>
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

                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Field name="dueDate"
                                            as={TextField}
                                            label="Due Date"
                                            type="date"
                                            fullWidth
                                            variant="outlined"
                                            InputLabelProps={{ shrink: true }} />
                                        <ErrorMessage name="dueDate"> {(msg) => <Box sx={errorMessageSx}>{msg}</Box>} </ErrorMessage>
                                    </Grid>



                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Field
                                            name="projectId"
                                            as={TextField}
                                            select
                                            label="Project"
                                            fullWidth
                                            variant="outlined"
                                            disabled={isLoading}
                                        >
                                            <MenuItem value="">No Project</MenuItem>
                                            {projects.map((project) => (
                                                <MenuItem value={project.id} key={project.id}>
                                                    {project.name}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Field
                                            name="assigneeId"
                                            as={TextField}
                                            select
                                            label="Assignee"
                                            fullWidth
                                            variant="outlined"
                                            disabled={isLoading}
                                        >
                                            <MenuItem value="">Unassigned</MenuItem>
                                            {contacts.map((contact) => (
                                                <MenuItem value={contact.id} key={contact.id}>
                                                    {[contact.firstName, contact.lastName].filter(Boolean).join(" ") || contact.email}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </Grid>


                                    <Grid size={{ xs: 12, sm: 6 }}>
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


                                    <Grid size={{ xs: 12, sm: 6 }}>
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

                                    <Grid size={{ xs: 12 }}>
                                        <Box display="flex" justifyContent="flex-end" mt={2}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                size="large"
                                                disabled={isSubmitting || isLoading}
                                                startIcon={<SaveAlt />}
                                                sx={{ minWidth: 180, py: 1.5, borderRadius: 2 }}
                                            >
                                                Create Task
                                            </Button>
                                        </Box>
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
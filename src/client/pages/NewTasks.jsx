import { TextField, Button, Typography, Grid, Box, Container, Card, CardContent, MenuItem } from "@mui/material";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Assignment, SaveAlt } from "@mui/icons-material"; // Đổi icon cho hợp với Task
import { tasksService } from "../services";

const errorMessageSx = {
    color: "error.main",
    fontSize: "0.75rem",
    mt: 0.5,
    ml: 1.5,
};

const NewTasks = () => {
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
            });

            toast.success("Task created successfully");
            resetForm();
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while creating the task");
        }
    };

    return (
        <Container maxWidth="md" component="main" sx={{ py: 4 }}>
            <Card elevation={2} sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 4 }}>
                    <Box display="flex" alignItems="center" mb={4}>
                        <Assignment sx={{ fontSize: 32, color: "primary.main", mr: 2 }} />
                        <Typography variant="h4" component="h1" gutterBottom fontWeight="medium">
                            New Task
                        </Typography>
                    </Box>
                    <Formik

                        initialValues={{
                            title: "",
                            description: "",
                            status: "TODO",
                            priority: "MEDIUM",
                        }}
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
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { TextField, Button, Typography, Grid, Box, Container, Card, CardContent, MenuItem } from "@mui/material";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Folder, SaveAlt, Assignment } from "@mui/icons-material";
import { projectsService } from "../services";

const errorMessageSx = {
    color: "error.main",
    fontSize: "0.75rem",
    mt: 0.5,
    ml: 1.5,
};

const NewProject = () => {
    const navigate = useNavigate();
    const [creating, setCreating] = useState(false);

    const ProjectSchema = Yup.object().shape({
        name: Yup.string().required("Project name is required"),
        description: Yup.string().required("Description is required"),
        status: Yup.string().required("Status is required"),
    });

    const handleProjectSubmit = async (values, { resetForm }) => {
        try {
            setCreating(true);

            const created = await projectsService.create({
                name: values.name,
                description: values.description,
                status: values.status,
                startDate: values.startDate || null,
                endDate: values.endDate || null,
            });

            toast.success("Project created successfully");
            resetForm();

            const projectId = created?.data?.id;
            if (projectId) {
                navigate(`/new-tasks?projectId=${projectId}`);
                return;
            }

            navigate("/projects");
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while creating the project");
        } finally {
            setCreating(false);
        }
    };

    return (
        <Container maxWidth="md" component="main" sx={{ py: 8 }}>
            <Card elevation={10} sx={{ borderRadius: 5 }}>
                <CardContent sx={{ p: 5 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                        <Folder sx={{ fontSize: 32, color: "primary.main", mr: 2 }} />
                        <Typography variant="h4" component="h1" gutterBottom fontWeight="medium">
                            New Project
                        </Typography>
                    </Box>

                    <Formik
                        initialValues={{
                            name: "",
                            description: "",
                            status: "active",
                            startDate: "",
                            endDate: "",
                        }}
                        validationSchema={ProjectSchema}
                        onSubmit={handleProjectSubmit}
                    >
                        {({ handleSubmit, isSubmitting }) => (
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Field name="name" as={TextField} label="Project Name" required fullWidth variant="outlined" />
                                        <ErrorMessage name="name">{(msg) => <Box sx={errorMessageSx}>{msg}</Box>}</ErrorMessage>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Field name="status" as={TextField} select label="Status" required fullWidth variant="outlined">
                                            <MenuItem value="active">Active</MenuItem>
                                            <MenuItem value="planning">Planning</MenuItem>
                                            <MenuItem value="completed">Completed</MenuItem>
                                            <MenuItem value="on_hold">On Hold</MenuItem>
                                        </Field>
                                        <ErrorMessage name="status">{(msg) => <Box sx={errorMessageSx}>{msg}</Box>}</ErrorMessage>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Field
                                            name="description"
                                            as={TextField}
                                            label="Description"
                                            required
                                            fullWidth
                                            multiline
                                            minRows={3}
                                            variant="outlined"
                                        />
                                        <ErrorMessage name="description">{(msg) => <Box sx={errorMessageSx}>{msg}</Box>}</ErrorMessage>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            name="startDate"
                                            as={TextField}
                                            label="Start Date"
                                            type="date"
                                            fullWidth
                                            variant="outlined"
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            name="endDate"
                                            as={TextField}
                                            label="End Date"
                                            type="date"
                                            fullWidth
                                            variant="outlined"
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box
                                            display="flex"
                                            gap={2}
                                            justifyContent="flex-end"
                                            flexWrap={{ xs: "wrap", sm: "nowrap" }}
                                        >
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                size="large"
                                                disabled={isSubmitting || creating}
                                                startIcon={<SaveAlt />}
                                                sx={{ minWidth: 180, py: 1.5, borderRadius: 2, flex: { xs: "1 1 100%", sm: "0 0 180px" } }}
                                            >
                                                Create Project
                                            </Button>

                                            <Button
                                                component={RouterLink}
                                                to="/new-tasks"
                                                variant="outlined"
                                                size="large"
                                                startIcon={<Assignment />}
                                                sx={{ minWidth: 180, py: 1.5, borderRadius: 2, flex: { xs: "1 1 100%", sm: "0 0 180px" } }}
                                            >
                                                Go To New Task
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

export default NewProject;
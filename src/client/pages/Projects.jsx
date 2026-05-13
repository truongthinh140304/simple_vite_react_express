import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  LinearProgress,
  IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Folder as ProjectIcon,
  People as PeopleIcon,
  Assignment as TaskIcon,
} from '@mui/icons-material';
import { useProjects } from '../hooks';
import AppLoading from '../components/AppLoading';

const Projects = () => {
  const { projects, isLoading, deleteProject } = useProjects();

  const statusColors = {
    active: 'success',
    planning: 'warning',
    completed: 'primary',
    on_hold: 'default',
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const calculateProgress = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.status === 'DONE').length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  if (isLoading) {
    return <AppLoading />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          <ProjectIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Projects
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/new-project"
          startIcon={<AddIcon />}
          sx={{
            fontWeight: 600,
            textTransform: 'none',
            px: 3,
            py: 1,
            boxShadow: 2,
            '&:hover': {
              boxShadow: 4,
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          New Project
        </Button>
      </Box>

      {/* Projects Grid */}
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={project.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 450 }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2.5 }}>
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box sx={{ flexGrow: 1, pr: 1 }}>
                    <Typography variant="h6" component="h2" sx={{ lineHeight: 1.3 }}>
                      {project.name}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={0.5}>
                    <IconButton
                      size="small"
                      component={Link}
                      to={`/project/${project.id}`}
                      color="primary"
                    >
                      <EditIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => deleteProject(project.id)}
                    >
                      <DeleteIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                </Box>

                {/* Description */}
                <Box mb={1.5} sx={{ minHeight: 40 }}>
                  {project.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', overflow: 'hidden', textOverflow: 'ellipsis', WebkitLineClamp: 2 }}>
                      {project.description}
                    </Typography>
                  )}
                </Box>

                {/* Status */}
                <Box mb={2}>
                  <Chip
                    label={project.status.replace('_', ' ').toUpperCase()}
                    color={statusColors[project.status] || 'default'}
                    size="small"
                  />
                </Box>

                {/* Stats */}
                <Box display="flex" justifyContent="space-between" mb={2} sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <TaskIcon fontSize="small" />
                    <Typography variant="body2" fontWeight={500}>
                      {project._count?.tasks || 0} tasks
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PeopleIcon fontSize="small" />
                    <Typography variant="body2" fontWeight={500}>
                      {project._count?.members || 0} members
                    </Typography>
                  </Box>
                </Box>

                {/* Progress Bar */}
                <Box mb={2} sx={{ minHeight: 50 }}>
                  {project.tasks && project.tasks.length > 0 ? (
                    <>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" fontWeight={500}>Progress</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {calculateProgress(project.tasks)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={calculateProgress(project.tasks)}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ pt: 1 }}>No tasks yet</Typography>
                  )}
                </Box>

                {/* Team Members */}
                <Box mb={2} sx={{ minHeight: 45, flexGrow: 1 }}>
                  {project.members && project.members.length > 0 ? (
                    <>
                      <Typography variant="body2" fontWeight={500} mb={1}>Team Members</Typography>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {project.members.map((member) => (
                          <Chip
                            key={member.id}
                            label={`${member.contact.firstName} ${member.contact.lastName}`}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">No team members</Typography>
                  )}
                </Box>

                {/* Dates - Sticky at bottom */}
                <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2, mt: 'auto' }}>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Start: {formatDate(project.startDate)}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    End: {formatDate(project.endDate)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {projects.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="text.secondary">
            No projects found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your first project to get started
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Projects;
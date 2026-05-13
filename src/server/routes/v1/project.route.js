import { Router } from 'express';
import * as projectService from '../../services/project.service.js';
import { successResponse, errorResponse } from '../../utils/response.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { projectValidation } from '../../middleware/validate.js';

const router = Router();

// Routes
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    const filters = {};

    if (status) filters.status = status;

    const projects = await projectService.findAll(filters);
    res.json(successResponse(projects, 'Projects retrieved successfully'));
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json(errorResponse('Failed to fetch projects'));
  }
});

router.get('/:id', authMiddleware, projectValidation.byId, async (req, res) => {
  try {
    const project = await projectService.findById(parseInt(req.params.id));
    if (!project) {
      return res.status(404).json(errorResponse('Project not found'));
    }
    res.json(successResponse(project, 'Project retrieved successfully'));
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json(errorResponse('Failed to fetch project'));
  }
});

router.post('/create', authMiddleware, projectValidation.create, async (req, res) => {
  try {
    const project = await projectService.create(req.body);
    res.status(201).json(successResponse(project, 'Project created successfully'));
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json(errorResponse('Failed to create project'));
  }
});

router.put('/:id', authMiddleware, projectValidation.update, async (req, res) => {
  try {
    const project = await projectService.update(parseInt(req.params.id), req.body);
    if (!project) {
      return res.status(404).json(errorResponse('Project not found'));
    }
    res.json(successResponse(project, 'Project updated successfully'));
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json(errorResponse('Failed to update project'));
  }
});

router.delete('/:id', authMiddleware, projectValidation.byId, async (req, res) => {
  try {
    const deleted = await projectService.remove(parseInt(req.params.id));
    if (!deleted) {
      return res.status(404).json(errorResponse('Project not found'));
    }
    res.json(successResponse(null, 'Project deleted successfully'));
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json(errorResponse('Failed to delete project'));
  }
});



export default router;
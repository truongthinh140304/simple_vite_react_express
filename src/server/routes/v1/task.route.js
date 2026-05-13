import { Router } from 'express';
import * as taskService from '../../services/task.service.js';
import { successResponse, errorResponse } from '../../utils/response.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { taskValidation } from '../../middleware/validate.js';

const router = Router();

// Routes
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const { status, priority, assigneeId, projectId } = req.query;
    const filters = {};

    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (assigneeId) filters.assigneeId = parseInt(assigneeId);
    if (projectId) filters.projectId = parseInt(projectId);

    const tasks = await taskService.findAll(filters);
    res.json(successResponse(tasks, 'Tasks retrieved successfully'));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json(errorResponse('Failed to fetch tasks'));
  }
});

router.get('/:id', authMiddleware, taskValidation.byId, async (req, res) => {
  try {
    const task = await taskService.findById(parseInt(req.params.id));
    if (!task) {
      return res.status(404).json(errorResponse('Task not found'));
    }
    res.json(successResponse(task, 'Task retrieved successfully'));
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json(errorResponse('Failed to fetch task'));
  }
});

router.post('/create', authMiddleware, taskValidation.create, async (req, res) => {
  try {
    const task = await taskService.create({
      ...req.body,
      createdByName: req.user?.name || req.user?.email || null,
    });
    res.status(201).json(successResponse(task, 'Task created successfully'));
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json(errorResponse('Failed to create task'));
  }
});

router.put('/:id', authMiddleware, taskValidation.update, async (req, res) => {
  try {
    const task = await taskService.update(parseInt(req.params.id), req.body);
    if (!task) {
      return res.status(404).json(errorResponse('Task not found'));
    }
    res.json(successResponse(task, 'Task updated successfully'));
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json(errorResponse('Failed to update task'));
  }
});

router.delete('/:id', authMiddleware, taskValidation.byId, async (req, res) => {
  try {
    const deleted = await taskService.remove(parseInt(req.params.id));
    if (!deleted) {
      return res.status(404).json(errorResponse('Task not found'));
    }
    res.json(successResponse(null, 'Task deleted successfully'));
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json(errorResponse('Failed to delete task'));
  }
});

// Update task status
router.patch('/:id/status', authMiddleware, taskValidation.updateStatus, async (req, res) => {
  try {
    const task = await taskService.updateStatus(parseInt(req.params.id), req.body.status);
    if (!task) {
      return res.status(404).json(errorResponse('Task not found'));
    }
    res.json(successResponse(task, 'Task status updated successfully'));
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json(errorResponse('Failed to update task status'));
  }
});

export default router;
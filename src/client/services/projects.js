/**
 * Projects Service
 * ==================
 *
 * API methods for project management.
 * Handles project CRUD operations.
 *
 * Usage:
 *   import { projectsService } from '@/client/services';
 *
 *   // Get all projects
 *   const projects = await projectsService.getAll();
 */

import api from "./api";

/**
 * Project data shape (for reference):
 * @typedef {Object} Project
 * @property {number} id - Unique identifier
 * @property {string} name - Project name
 * @property {string} [description] - Project description
 * @property {string} status - Project status (e.g., 'active', 'planning', 'completed')
 * @property {string} startDate - ISO date string
 * @property {string} [endDate] - ISO date string
 * @property {ProjectMember[]} [members] - Team members
 * @property {Task[]} [tasks] - Associated tasks
 * @property {string} createdAt - ISO timestamp
 * @property {string} updatedAt - ISO timestamp
 */

/**
 * ProjectMember data shape:
 * @typedef {Object} ProjectMember
 * @property {number} id - Membership ID
 * @property {string} role - Member's role in project
 * @property {number} contactId - Contact ID
 * @property {number} projectId - Project ID
 * @property {Contact} [contact] - Contact details (when included)
 */

export const projectsService = {
  /**
   * Fetch all projects
   * @returns {Promise<{success: boolean, data: Project[]}>}
   */
  getAll: () => api.get("/project/list"),

  /**
   * Fetch a single project by ID (includes members and tasks)
   * @param {number|string} id - Project ID
   * @returns {Promise<{success: boolean, data: Project}>}
   */
  getById: (id) => api.get(`/project/${id}`),

  /**
   * Create a new project
   * @param {Object} data - Project data
   * @param {string} data.name - Project name (required)
   * @param {string} [data.description] - Project description
   * @param {string} [data.status] - Initial status (default: 'active')
   * @param {string} [data.startDate] - Start date ISO string
   * @param {string} [data.endDate] - End date ISO string
   * @returns {Promise<{success: boolean, data: Project}>}
   */
  create: (data) => api.post("/project/create", data),

  /**
   * Update an existing project
   * @param {number|string} id - Project ID
   * @param {Object} data - Fields to update
   * @returns {Promise<{success: boolean, data: Project}>}
   */
  update: (id, data) => api.put(`/project/${id}`, data),

  /**
   * Delete a project
   * @param {number|string} id - Project ID
   * @returns {Promise<{success: boolean, data: Project}>}
   */
  delete: (id) => api.delete(`/project/${id}`),
};

export default projectsService;

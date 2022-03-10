/**
 * The account router.
 *
 * @author Farzad Fahiminia <ff222cb@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import { ResourceController } from '../../../controllers/api/resource-controller.js'

export const router = express.Router()

const controller = new ResourceController()

// Map HTTP verbs and route paths to controller actions.

router.get('/images', controller.authenticateJWT, controller.getAllImages)

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

router.get('/images', (req, res, next) => controller.authenticateJWT(req, res, next), (req, res, next) => controller.getAllImages(req, res, next))
router.get('/images/:id', (req, res, next) => controller.authenticateJWT(req, res, next), (req, res, next) => controller.getImage(req, res, next))

router.post('/images', (req, res, next) => controller.authenticateJWT(req, res, next), (req, res, next) => controller.addImage(req, res, next))
router.put('/images/:id', (req, res, next) => controller.authenticateJWT(req, res, next), (req, res, next) => controller.putImage(req, res, next))
router.patch('/images/:id', (req, res, next) => controller.authenticateJWT(req, res, next), (req, res, next) => controller.patchImage(req, res, next))
router.delete('/images/:id', (req, res, next) => controller.authenticateJWT(req, res, next), (req, res, next) => controller.deleteImage(req, res, next))

/**
 * API version 1 routes.
 *
 * @author Farzad Fahiminia <ff222cb@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import { router as resourceRouter } from './resource-router.js'

export const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'Yaaay! Welcome to version 1 of this very simple RESTful API!' }))
router.use('/', resourceRouter)

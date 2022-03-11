/**
 * Module for the ResourceController.
 *
 * @author Farzad Fahiminia <ff222cb@student.lnu.se>
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken'
import fetch from 'node-fetch'
import createError from 'http-errors'

/**
 * Encapsulates a controller.
 */
export class ResourceController {
  /**
   * Authenticates requests.
   *
   * If authentication is successful, `req.user`is populated and the
   * request is authorized to continue.
   * If authentication fails, an unauthorized response will be sent.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
authenticateJWT = (req, res, next) => {
  try {
    const publicKey = Buffer.from(process.env.ACCESS_TOKEN_SECRET, 'base64')
    const [authenticationScheme, token] = req.headers.authorization?.split(' ')

    if (authenticationScheme !== 'Bearer') {
      throw new Error('Invalid authentication scheme.')
    }

    const payload = jwt.verify(token, publicKey)
    req.user = {
      username: payload.sub,
      firstName: payload.given_name,
      lastName: payload.family_name,
      email: payload.email,
      id: payload.id
    }

    next()
  } catch (err) {
    const error = createError(401)
    error.cause = err
    next(error)
  }
}

/**
 * Get images.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
async getAllImages (req, res, next) {
  console.log('Halloj där kött och blåbär')
  // console.log(req)
  // const images = await Image.find({ userEmail: req.user }).exec()
  // console.log(images)
  // try {
  //   // if () {

  //   // }
  // } catch (error) {
  //   const err = createError(401)
  //   err.cause = error

  //   next(err)
  // }
}

/**
 * Post images.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
async addImage (req, res, next) {
  console.log('Här postar vi våra bilder!')
  // console.log(req.body)
  // console.log(process.env.IMAGE_RESOURCE_URL)
  try {
    const response = await fetch(process.env.IMAGE_RESOURCE_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-API-Private-Token': process.env.PERSONAL_ACCESS_TOKEN
        },
        body: JSON.stringify(req.body)
      })
    const dataJSON = await response.json()
    // console.log(dataJSON)
    // console.log(res.status(201))
    res
      .status(201)
      .json(dataJSON)
  } catch (error) {
    console.log(error)
    const err = createError(401)
    err.cause = error

    next(err)
  }
}
}

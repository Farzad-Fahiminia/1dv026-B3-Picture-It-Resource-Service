/**
 * Module for the ResourceController.
 *
 * @author Farzad Fahiminia <ff222cb@student.lnu.se>
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken'
import fetch from 'node-fetch'
import createError from 'http-errors'
import { Image } from '../../models/image.js'

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
      next(createError(400, 'The request cannot or will not be processed due to something that is perceived to be a client error (for example, validation error).'))
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
  try {
    const images = await Image.find({ userId: req.user.id })
    if (images !== null) {
      res.status(200).send(images)
    } else {
      res.status(404)
    }
  } catch (error) {
    console.log(error)
    const err = createError(500, 'An unexpected condition was encountered.')
    err.cause = error

    next(err)
  }
}

/**
 * Get specific image.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
async getImage (req, res, next) {
  try {
    const image = await Image.find({ imageId: req.params.id })
    if (req.user.id === image[0].userId) {
      if (image.length > 0 && image !== null) {
        res.status(200).send(image)
      } else {
        next(createError(404, 'The requested resource was not found.'))
      }
    } else {
      next(createError(403, 'The request contained valid data and was understood by the server, but the server is refusing action due to the authenticated user not having the necessary permissions for the resource.'))
    }
  } catch (error) {
    const err = createError(500, 'An unexpected condition was encountered.')
    err.cause = error

    next(err)
  }
}

/**
 * Post images.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
async addImage (req, res, next) {
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

    const imageObj = new Image({
      imageId: dataJSON.id,
      imageUrl: dataJSON.imageUrl,
      contentType: dataJSON.contentType,
      description: req.body.description,
      userId: req.user.id
    })

    res.status(201).json(dataJSON)

    await imageObj.save()
  } catch (error) {
    console.log(error)
    const err = createError(500, 'An unexpected condition was encountered.')
    err.cause = error

    next(err)
  }
}

/**
 * Put specific image.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
async putImage (req, res, next) {
  try {
    const image = await Image.find({ imageId: req.params.id })
    if (req.user.id === image[0].userId) {
      if (image !== null) {
        const imageObj = {
          contentType: req.body.contentType,
          description: req.body.description
        }

        await fetch(process.env.IMAGE_RESOURCE_URL + '/' + req.params.id,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-API-Private-Token': process.env.PERSONAL_ACCESS_TOKEN
            },
            body: JSON.stringify(imageObj)
          })

        const newImageData = await Image.findByIdAndUpdate(image, imageObj, { runValidators: true })
        await newImageData.save()

        res.sendStatus(204)
      } else {
        next(createError(404, 'The requested resource was not found.'))
      }
    } else {
      next(createError(403, 'The request contained valid data and was understood by the server, but the server is refusing action due to the authenticated user not having the necessary permissions for the resource.'))
    }
  } catch (error) {
    const err = createError(500, 'An unexpected condition was encountered.')
    err.cause = error

    next(err)
  }
}

/**
 * Patch specific image.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
async patchImage (req, res, next) {
  try {
    const image = await Image.find({ imageId: req.params.id })
    if (req.user.id === image[0].userId) {
      if (image !== null) {
        const imageObj = {
          contentType: req.body.contentType,
          description: req.body.description
        }

        await fetch(process.env.IMAGE_RESOURCE_URL + '/' + req.params.id,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'x-API-Private-Token': process.env.PERSONAL_ACCESS_TOKEN
            },
            body: JSON.stringify(imageObj)
          })

        const newImageData = await Image.findByIdAndUpdate(image, imageObj, { runValidators: true })
        await newImageData.save()

        res.sendStatus(204)
      } else {
        next(createError(404, 'The requested resource was not found.'))
      }
    } else {
      next(createError(403, 'The request contained valid data and was understood by the server, but the server is refusing action due to the authenticated user not having the necessary permissions for the resource.'))
    }
  } catch (error) {
    const err = createError(500, 'An unexpected condition was encountered.')
    err.cause = error

    next(err)
  }
}

/**
 * Delete specific image.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
async deleteImage (req, res, next) {
  try {
    const image = await Image.find({ imageId: req.params.id })
    if (req.user.id === image[0].userId) {
      if (image !== null) {
        await Image.findByIdAndDelete(image[0])
        res.status(204).send('Image has been deleted!')
      } else {
        next(createError(404, 'The requested resource was not found.'))
      }
    } else {
      next(createError(403, 'The request contained valid data and was understood by the server, but the server is refusing action due to the authenticated user not having the necessary permissions for the resource.'))
    }
  } catch (error) {
    const err = createError(500, 'An unexpected condition was encountered.')
    err.cause = error

    next(err)
  }
}
}

/**
 * Module for the ResourceController.
 *
 * @author Farzad Fahiminia <ff222cb@student.lnu.se>
 * @version 1.0.0
 */

// import createError from 'http-errors'
import jwt from 'jsonwebtoken'
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
      permissionLevel: payload.x_permission_level
    }

    next()
  } catch (err) {
    const error = createError(401)
    error.cause = err
    next(error)
  }
}

/**
 * Authenticates a user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
async getAllImages (req, res, next) {
  console.log('Halloj där kött och blåbär')
  // try {
  // } catch (error) {
  //   const err = createError(401)
  //   err.cause = error

  //   next(err)
  // }
}
}

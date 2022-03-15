/**
 * Mongoose model Image.
 *
 * @author Farzad Fahiminia <ff222cb@student.lnu.se>
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  imageId: {
    type: String,
    required: true,
    immutable: true
  },
  imageUrl: {
    type: String,
    required: true,
    immutable: true
  },
  contentType: {
    type: String,
    required: true,
    enum: ['image/gif', 'image/jpeg', 'image/png']
  },
  description: {
    type: String,
    maxlength: [300, 'The description has a max length of 300 characters.']
  },
  userId: {
    type: String,
    required: true,
    immutable: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true, // ensure virtual fields are serialized
    /**
     * Performs a transformation of the resulting object to remove sensitive information.
     *
     * @param {object} doc - The mongoose document which is being converted.
     * @param {object} ret - The plain object representation which has been converted.
     */
    transform: function (doc, ret) {
      delete ret.__v
      delete ret._id
    }
  }
})

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Create a model using the schema.
export const Image = mongoose.model('Image', schema)

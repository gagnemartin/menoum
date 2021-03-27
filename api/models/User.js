import jwt from 'jsonwebtoken'
import { Model } from './index.js'
import Validator from './Validator.js'

const params = {
  table: 'users'
  // relationships: {
  //   ingredients: {
  //     type: 'many_to_many'
  //   }
  // }
}

class User extends Model {
  constructor(params) {
    super(params)
  }

  validate = async (data) => {
    const validator = new Validator(data, this.table)
    const validatedData = await validator.validate({
      email: {
        required: [true, 'Please provide an email address.'],
        type: ['string', 'The email must be a string.'],
        pattern: ['email', 'The email is not valid.'],
        unique: ['email', 'This email address is already used.']
      },
      password: {
        required: [true, 'Please provide a password.'],
        type: ['string', 'The password must be a string.'],
        minLength: [6, 'The password should be at least 6 characters long.']
      },
      confirm_password: {
        required: [true, 'Please confirm your password.'],
        equalTo: [data.password, 'The password confirmation does not match']
      }
    })

    return validatedData
  }

  transformData = (data) => {
    const transformedData = { ...data }

    if (typeof data.password === 'string') {
      transformedData.password = transformedData.password.trim()
    }

    return transformedData
  }

  generateToken = async (data) => {
    return jwt.sign(data, process.env.JWT_TOKEN, {
      expiresIn: `${process.env.JWT_EXPIRES_IN}m`
    })
  }

  getTokenExpiresAt = () => {
    return new Date(
      new Date().getTime() + process.env.JWT_EXPIRES_IN * 60 * 1000
    )
  }
}

export default new User(params)

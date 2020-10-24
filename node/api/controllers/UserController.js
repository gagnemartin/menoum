import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import { Controller } from './index.js'
import { User } from '../models/index.js'

class UserController extends Controller {
  constructor(model) {
    super(model)
  }

  register = async (req, res, next) => {
    const {
      body: { email, password, confirm_password }
    } = req

    const formData = User.transformData({
      email,
      password,
      confirm_password
    })

    const [isValid, errors] = await User.validate(formData)

    if (isValid) {
      const hashedPassword = await bcrypt.hash(formData.password, 10)

      const data = { email, password: hashedPassword, refresh_token: uuidv4() }
      const expires_at = User.getTokenExpiresAt()
      const user = await User.insert(data, ['uuid', 'email', 'role', 'refresh_token'])

      const token = await User.generateToken(user)

      return res.status(201).json({
        token,
        expires_at
      })
    }

    return next(User.error(400, errors))
  }

  login = async (req, res, next) => {
    const {
      body: { email, password }
    } = req
    const user = await User.select(['email', 'role', 'uuid', 'password', 'refresh_token']).where({ email }).first()

    if (user) {
      const isValid = await bcrypt.compare(password, user.password)

      if (isValid) {
        delete user.password

        const token = await User.generateToken(user)

        // Update refresh token
        const refresh_token = uuidv4()
        const expires_at = User.getTokenExpiresAt()
        await User.updateByUuid(user.uuid, { refresh_token })

        res.cookie('refresh_token', refresh_token, {
          maxAge: process.env.REFRESH_TOKEN_EXPIRES * 60 * 1000, // convert from minute to milliseconds
          httpOnly: true,
          secure: false
        })

        return res.status(200).json({
          token,
          expires_at
        })
      }
    }

    return next(User.error(400))
  }

  logout = (req, res, next) => {
    res.cookie('refresh_token', '', {
      httpOnly: true,
      expires: new Date(0)
    })

    return res.status(200).json({ message: 'OK' })
  }

  refresh = async (req, res, next) => {
    const refresh_token = req.cookies['refresh_token']
    const new_refresh_token = uuidv4()

    if (refresh_token) {
      const user = await User.select(['email', 'role', 'uuid', 'refresh_token'])
        .where({
          refresh_token
        })
        .first()

      if (user) {
        user.refresh_token = new_refresh_token
        const token = await User.generateToken(user)
        const expires_at = User.getTokenExpiresAt()

        await User.updateByUuid(user.uuid, {
          refresh_token: new_refresh_token
        })

        res.cookie('refresh_token', new_refresh_token, {
          maxAge: process.env.REFRESH_TOKEN_EXPIRES * 60 * 1000, // convert from minute to milliseconds
          httpOnly: true,
          secure: false
        })

        return res.status(200).json({
          token,
          expires_at
        })
      }
    }

    return next(User.error(403))
  }
}

export default new UserController(User)

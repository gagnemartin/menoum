import Database from '../database/database.js'

class Validator {
  constructor(data) {
    this.data = data
  }

  betweenLength = (field, [ min, max, message ]) => {
    const value = this.getValue(field)
    const isValid = value.length >= min && value.length <= max
    return this.buildError(isValid, message)
  }

  unique = (field) => {
    const value = this.getValue(field)
    const db = Database.connect().from(table)
  }

  required = (field, [ isRequired, message ]) => {
    if (!isRequired) {
      return this.buildError(true, message)
    }

    const value = this.getValue(field)
    return this.buildError(typeof value !== 'undefined', message)
  }

  type = (field, [ fieldType, message ]) => {
    const value = this.getValue(field)
    const fieldTypeLower = fieldType.toLowerCase()

    if (fieldTypeLower === 'array') {
      return this.buildError(value instanceof Array, message)
    }

    return this.buildError(typeof value === fieldTypeLower, message)
  }

  getValue = field => {
    return this.data[field]
  }

  isRequired = (validation) => {
    if (typeof validation.required !== 'undefined') {
      return validation.required[0]
    }

    return false
  }

  shouldValidate = (field, validation) => {
    const isRequired = this.isRequired(validation)
    const value = this.getValue(field)
    const valueExists = typeof value !== 'undefined'

    if (isRequired) {
      return true
    } else return !isRequired && valueExists
  }

  buildError = (valid, message = 'This field is not valid.') => {
    const error = { valid }

    if (!valid) {
      error.message = message
    }

    return error
  }

  validate = (validations) => {
    const fields = Object.keys(validations)
    const validated = {}

    let overallValid = true

    fields.map(field => {
      const validation = validations[field]
      const functions = Object.keys(validation)
      const shouldValidate = this.shouldValidate(field, validation)

      if (shouldValidate) {

        for (let i = 0; i < functions.length; i++) {
          const functionName = functions[i]
          const args = validation[functionName]

          if (functions.includes('required')) {
            const argsRequired = validation.required
            const requiredError = this.required(field, argsRequired)

            if (!requiredError.valid) {
              if (!validated[field]) {
                validated[field] = requiredError
              }

              validated[field].required = { valid: false }
              overallValid = false
              break
            }
          }

          if (this[functionName]) {
            const error = this[functionName](field, args)

            if (!error.valid) {
              if (!validated[field]) {
                validated[field] = {}
              }

              validated[field][functionName] = error
              overallValid = false
            }
          }
        }
      }
    })

    return [ overallValid, validated ]
  }
}

export default Validator

// validator.js

import chalk from 'chalk'

export function validateNonEmpty (value, errorMessage) {
  return value.length > 0 ? true : chalk.red(errorMessage)
}

export function validateNumberRange ({ value, min = 0, max = Infinity, errorMessage }) {
  const trimmedValue = typeof value === 'string' ? value.trim() : value

  if (trimmedValue === '' || (typeof trimmedValue === 'number' && !isNaN(trimmedValue))) {
    return true
  }

  const parsedValue = parseFloat(trimmedValue)

  return (!isNaN(parsedValue) && parsedValue >= min && parsedValue <= max) ? true : chalk.red(errorMessage)
}

export function validateUPI (value, errorMessage) {
  if (value.trim() === '') {
    return true
  }
  const upiRegex = /^[\w.-]+@[\w.-]+$/

  return upiRegex.test(value) ? true : chalk.red(errorMessage)
}

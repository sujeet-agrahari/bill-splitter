// validation.js

import chalk from 'chalk'

export function validateNonEmpty (value, errorMessage) {
  return value.length > 0 || chalk.red(errorMessage)
}

export function validateNumberRange ({ value, min = 0, max = Infinity, errorMessage }) {
  const trimmedValue = typeof value === 'string' ? value.trim() : value

  if (trimmedValue === '' || (typeof trimmedValue === 'number' && !isNaN(trimmedValue))) {
    return true
  }

  const parsedValue = parseFloat(trimmedValue)

  if (!isNaN(parsedValue) && parsedValue >= min && parsedValue <= max) {
    return true
  }

  return chalk.red(errorMessage)
}

export function validateUPI (value, errorMessage) {
  if (value.trim() === '') {
    return true
  }
  const upiRegex = /([\w.-]*[@][\w]*)/

  return upiRegex.test(value) || chalk.red(errorMessage)
}

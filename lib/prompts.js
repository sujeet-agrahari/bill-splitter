import inquirer from 'inquirer'
import {
  validateNonEmpty,
  validateNumberRange,
  validateUPI
} from './validator.js'
import { errorLog } from './logger.js'
import { readFromPath, writeToPath } from './fileHelper.js'

const customNames = []
const definedNames = [
  'Sujeet',
  'Abhisehsk',
  'Anish',
  'Chethan',
  'Desmond',
  'Deepak',
  'Manoj',
  'Manasa',
  'Pavan',
  'Tharun',
  'Sam',
  'Sid.B',
  'Sid.N'
]
const amountAndSharedPersons = []

async function promptCustomName () {
  while (true) {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: "Enter a person's name:"
      }
    ])

    if (answer.name.trim() === '') {
      // If the entered name is empty, exit the loop
      break
    }
    if (customNames.includes(answer.name)) {
      errorLog('😠 Name already entered')
      continue
    }
    customNames.push(answer.name)
  }
  if (customNames.length < 2) {
    errorLog('😠 Enter at least two persons')
    await promptCustomName()
  }
  return customNames
}

async function promptToSelectNames () {
  const { selectedNames } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedNames',
      message: 'Please select from below 👇',
      choices: definedNames,
      pageSize: 15,
      validate: (value) =>
        validateNonEmpty(value, '😠 Select at least one person!')
    }
  ])
  return selectedNames
}

export async function promptPersonName () {
  const { isOptedSelect } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'isOptedSelect',
      default: true,
      message: 'Do you want to select names from the list?'
    }
  ])

  if (isOptedSelect) {
    return promptToSelectNames()
  }
  return promptCustomName()
}

export async function promptAmountAndSharedPersons (persons) {
  while (true) {
    const { sharedAmount } = await inquirer.prompt([
      {
        type: 'input',
        name: 'sharedAmount',
        message: 'Enter the amount',
        validate: (value) =>
          validateNumberRange({
            value,
            min: 1,
            errorMessage: '😠 Enter a valid amount'
          })
      }
    ])

    if (sharedAmount.trim() === '') {
      // If the entered name is empty, exit the loop
      break
    }

    let { sharedPersons } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'sharedPersons',
        message: 'Select persons who shared:',
        choices: ['All', ...persons],
        validate: (value) =>
          validateNonEmpty(value, '😠 Select at least one person!')
      }
    ])

    if (sharedPersons.includes('All')) {
      sharedPersons = persons
    }

    amountAndSharedPersons.push({
      amount: parseFloat(sharedAmount),
      sharedPersons
    })
  }
  if (!amountAndSharedPersons.length) {
    errorLog('😠 Enter at least one shared amount')
    await promptAmountAndSharedPersons()
  }
  return amountAndSharedPersons
}

export async function promptAdditionalCostAndDeduction () {
  const additionalCostInput = await inquirer.prompt([
    {
      type: 'input',
      name: 'gst',
      message: 'Enter the GST%',
      default: 5,
      validate: (value) =>
        validateNumberRange({
          value,
          max: 100,
          errorMessage: '😠 Enter valid tax paid'
        })
    },
    {
      type: 'input',
      name: 'serviceCharge',
      default: 0,
      message: 'Enter service charge paid',
      validate: (value) =>
        validateNumberRange({ value, errorMessage: '😠 Enter a valid amount' })
    },
    {
      type: 'input',
      name: 'discount',
      default: 0,
      message: 'Enter discount % if any',
      validate: (value) =>
        validateNumberRange({
          value,
          max: 100,
          errorMessage: '😠 Enter valid discount'
        })
    }
  ])

  return {
    gst: parseFloat(additionalCostInput.gst),
    serviceCharge: parseFloat(additionalCostInput.serviceCharge),
    discount: parseFloat(additionalCostInput.discount)
  }
}

export async function promptPayerAndUPI () {
  const savedData = await readFromPath()
  savedData.payDetail = savedData.payDetail || {}
  const payDetail = savedData.payDetail
  const payerAndUPI = await inquirer.prompt([
    {
      type: 'input',
      name: 'payer',
      message: 'Paid by '
    },
    {
      type: 'input',
      name: 'upi',
      message: 'UPI',
      default: (payer) => payDetail[payer.payer.toLowerCase()] || '',
      validate: (value) => validateUPI(value, '😠 Enter a valid upi id')
    }
  ])
  savedData.payDetail[payerAndUPI.payer.toLowerCase()] = payerAndUPI.upi
  await writeToPath(savedData)
  return payerAndUPI
}

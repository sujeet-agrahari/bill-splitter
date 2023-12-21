#!/usr/bin/env node

import figlet from 'figlet'
import Table from 'cli-table3'
import clipboardy from 'clipboardy'
import stripAnsi from 'strip-ansi'
import figures from 'figures'
import { promptAdditionalCostAndDeduction, promptAmountAndSharedPersons, promptPayerAndUPI, promptPersonName } from './lib/prompts.js'

import { excitementLog, headingLog, infoLog, instructionLog, log, successLog, thankYouLog } from './lib/logger.js'
import { calculateAmounts } from './lib/calculation.js'

async function displayWelcomeMessage () {
  await figlet('Bill Splitter', (_err, data) => {
    excitementLog(data + '\n')
  })

  log(
    'Made By: ' +
      '\u001b]8;;https://github.com/sujeet-agrahari\u0007Sujeet Agrahari\u001b]8;;\u0007\n'
  )

  infoLog('🤝 Please follow the prompt and enter the information as asked \n')
}

async function getPersonNames () {
  headingLog(' STEP-1 ')
  instructionLog(
    '👉 Enter the names of people sharing the lunch bill! (press ENTER to finish)'
  )

  const personNames = await promptPersonName()

  return personNames
}

async function getAmountAndSharedPersons (personNames) {
  headingLog(' STEP-2 ')
  instructionLog(
    '👉 Enter the amount followed by the people who shared! (press ENTER to finish)'
  )
  const amountAndSharedPersons = promptAmountAndSharedPersons(personNames)

  return amountAndSharedPersons
}

async function getAdditionalCostAndDeduction () {
  headingLog(' STEP-3 ')
  instructionLog(
    '👉 Enter the additional charges: GST & Service Charge! (press ENTER to skip)'
  )
  return promptAdditionalCostAndDeduction()
}

async function getPaymentDetails () {
  headingLog(' STEP-4 ')
  instructionLog(
    '👉 Enter payment details! (press ENTER to skip)'
  )
  return promptPayerAndUPI()
}

function generatePaymentMessage (payDetail) {
  let payMsg = ''

  if (payDetail.payer || payDetail.upi) {
    payMsg += 'Please pay the amount'

    if (payDetail.payer) {
      payMsg += ` to ${payDetail.payer}`
    }

    if (payDetail.upi) {
      payMsg += ` at UPI ${payDetail.upi}`
    }
  }

  return payMsg
}

function displayResultTable (billDetail, payDetail) {
  const table = new Table({
    head: ['Person', 'Amount'],
    colWidths: [20, 10]
  })

  for (const person in billDetail) {
    table.push([person, billDetail[person]])
  }

  // Display the table
  const tableString = table.toString()
  const payMsg = generatePaymentMessage(payDetail)

  console.log(tableString)
  infoLog(payMsg)

  clipboardy.writeSync(`${stripAnsi(tableString)}\n${payMsg}`)

  // Log success message
  successLog(`\n${figures.tick} Table and Pay Details copied to clipboard! \n`)
}
// Assuming you have a successLog function in your logger module

async function main () {
  await displayWelcomeMessage()
  const personNames = await getPersonNames()
  const amountAndSharedPersons = await getAmountAndSharedPersons(personNames)
  const additionalCostAndDeduction = await getAdditionalCostAndDeduction()
  const billDetail = calculateAmounts(
    amountAndSharedPersons,
    additionalCostAndDeduction,
    personNames
  )
  const payDetail = await getPaymentDetails()
  excitementLog('\n🍻 The bill has been generated! \n')
  displayResultTable(billDetail, payDetail)
  thankYouLog(' Thanks for using Bill Splitter 🤗! \n')
}

main()

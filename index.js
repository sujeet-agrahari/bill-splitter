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
  const data = await new Promise((resolve, reject) => {
    figlet('Bill Splitter', (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
  excitementLog(data + '\n')
  log('Made By: ' + '\u001b]8;;https://github.com/sujeet-agrahari\u0007Sujeet Agrahari\u001b]8;;\u0007\n')
  infoLog('🤝 Please follow the prompt and enter the information as asked \n')
}

async function getPersonNames () {
  headingLog(' STEP-1 ')
  instructionLog('👉 Enter the names of people sharing the lunch bill! (press ENTER to finish)')
  return await promptPersonName()
}

async function getAmountAndSharedPersons (personNames) {
  headingLog(' STEP-2 ')
  instructionLog('👉 Enter the amount followed by the people who shared! (press ENTER to finish)')
  return await promptAmountAndSharedPersons(personNames)
}

async function getAdditionalCostAndDeduction () {
  headingLog(' STEP-3 ')
  instructionLog('👉 Enter the additional charges: GST & Service Charge! (press ENTER to skip)')
  return await promptAdditionalCostAndDeduction()
}

async function getPaymentDetails () {
  headingLog(' STEP-4 ')
  instructionLog('👉 Enter payment details! (press ENTER to skip)')
  return await promptPayerAndUPI()
}

function generatePaymentMessage (payDetail) {
  if (!payDetail.payer && !payDetail.upi) return ''
  let payMsg = 'Please pay the amount'
  if (payDetail.payer) payMsg += ` to ${payDetail.payer}`
  if (payDetail.upi) payMsg += ` at UPI ${payDetail.upi}`
  return payMsg
}

function displayResultTable (billDetail, payDetail) {
  const table = new Table({ head: ['Person', 'Amount'], colWidths: [20, 10] })
  Object.entries(billDetail).forEach(([person, amount]) => table.push([person, amount]))
  const tableString = table.toString()
  const payMsg = generatePaymentMessage(payDetail)
  console.log(tableString)
  infoLog(payMsg)
  clipboardy.writeSync(`${stripAnsi(tableString)}\n${payMsg}`)
  successLog(`\n${figures.tick} Table and Pay Details copied to clipboard! \n`)
}

async function main () {
  await displayWelcomeMessage()
  const personNames = await getPersonNames()
  const amountAndSharedPersons = await getAmountAndSharedPersons(personNames)
  const additionalCostAndDeduction = await getAdditionalCostAndDeduction()
  const billDetail = calculateAmounts(amountAndSharedPersons, additionalCostAndDeduction, personNames)
  const payDetail = await getPaymentDetails()
  excitementLog('\n🍻 The bill has been generated! \n')
  displayResultTable(billDetail, payDetail)
  thankYouLog(' Thanks for using Bill Splitter 🤗! \n')
}

main()

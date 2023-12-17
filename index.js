#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import figlet from 'figlet';
import figures from 'figures';
import Table from 'cli-table';

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
  await figlet(`Bill Splitter`, (err, data) => {
    console.log(gradient.pastel.multiline(data) + '\n');
  });

console.log('Made By: ' + '\u001b]8;;https://github.com/sujeet-agrahari\u0007Sujeet Agrahari\u001b]8;;\u0007');


  console.log(`
    ${chalk.cyanBright(
      '🤝 Please follow the prompt and enter the information as asked'
    )}.
  `);
}

async function askPersons() {
  const answers = await inquirer.prompt({
    name: 'persons',
    type: 'input',
    message: 'What is your name?',
    default() {
      return 'Player';
    },
  });

  playerName = answers.persons;
}

async function getPersonNames() {
  console.log(chalk.bgBlue('STEP-1'));
  console.log(
    chalk.bold.blue(
      `👉 Enter the names of people sharing the lunch bill!(press ENTER to finish)`
    )
  );
  const persons = [];

  while (true) {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: "Enter a person's name:",
      },
    ]);

    if (answer.name.trim() === '') {
      // If the entered name is empty, exit the loop
      break;
    }

    persons.push(answer.name);
  }

  return persons;
}

async function getAmountAndSharedWithPersons(persons) {
  console.log(chalk.bgBlue('STEP-2'));
  console.log(
    chalk.bold.blue(
      `👉 Enter the amount followed by the people who shared!(press ENTER to finish)`
    )
  );
  const amountAndSharedPersons = [];

  while (true) {
    const answerAmount = await inquirer.prompt([
      {
        type: 'input',
        name: 'amount',
        message: 'Enter the amount',
        validate: (value) => {
          const parsedValue = parseFloat(value);
          return (
            (!isNaN(parsedValue) && parsedValue >= 0) || value.trim() !== '' ||
            '😠 Enter a valid positive number'
          );
        },
      },
    ]);

    if (answerAmount.amount.trim() === '') {
      // If the entered name is empty, exit the loop
      break;
    }

    const answerSharedPersons = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'sharedPersons',
        message: 'Select persons who shared:',
        choices: [...persons, 'all'],
        validate: (value) =>
          value.length > 0 || chalk.red('😠 Select at least one person!'),
      },
    ]);

    if (answerSharedPersons.sharedPersons.includes('all')) {
      answerSharedPersons.sharedPersons = persons;
    }

    amountAndSharedPersons.push({
      amount: parseFloat(answerAmount.amount),
      sharedPersons: answerSharedPersons.sharedPersons,
    });
  }

  return amountAndSharedPersons;
}

async function getAdditionalCharges() {
  console.log(chalk.bgBlue('STEP-3'));
  console.log(
    chalk.bold.blue(
      `👉 Enter the addition charges: GST & Service Charge!(press ENTER to skip)`
    )
  );
  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'gst',
      message: 'Enter the GST%',
      validate: (value) =>
        value.length > 0 || chalk.red('😠 Select at least one person!'),
    },
    {
      type: 'input',
      name: 'serviceCharge',
      message: 'Enter service charge paid',
      validate: (value) =>
        value.length > 0 || chalk.red('😠 Select at least one person!'),
    },
  ]);

  return {
    gst: parseFloat(answer.gst),
    serviceCharge: parseFloat(answer.serviceCharge),
  };
}

function logResultTable(result) {
  const table = new Table({
    head: ['Person', 'Amount'],
    colWidths: [20, 10],
  });

  for (const person in result) {
    table.push([person, result[person]]);
  }

  console.log(table.toString());
}

function calculateAmounts(
  sharedData,
  taxPercentage = 0,
  serviceCharge = 0,
  persons
) {
  const result = {};
  const individualServiceCharge = serviceCharge / persons.length;

  sharedData.forEach((item) => {
    const { amount, sharedPersons } = item;
    const individualAmount = amount / sharedPersons.length;

    sharedPersons.forEach((person) => {
      result[person] = (result[person] || 0) + individualAmount;
    });
  });

  // Apply tax to each person's amount
  for (const person in result) {
    const amountWithAdditionalCharge =
      result[person] * (1 + taxPercentage / 100) + individualServiceCharge;
    result[person] = parseFloat(amountWithAdditionalCharge.toFixed(2));
  }

  logResultTable(result);
}

async function main() {
  await welcome();
  const persons = await getPersonNames();
  const amountAndSharedPersons = await getAmountAndSharedWithPersons(persons);
  const { gst, serviceCharge } = await getAdditionalCharges();
  console.log(
    gradient.pastel.multiline(`${figures.tick} The bill has been generated!`) +
      '\n'
  );
  calculateAmounts([], 0, 0, []);
  console.log('\n');
  console.log(chalk.bgMagenta(`Thanks for using Bill Splitter 🤗!`));
}

main();

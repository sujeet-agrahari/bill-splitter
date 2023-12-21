import chalk from 'chalk'
import gradient from 'gradient-string'

export const infoLog = (msg) => console.log(chalk.cyanBright(msg))
export const successLog = (msg) => console.log(chalk.greenBright(msg))
export const errorLog = (msg) => console.error(chalk.redBright(msg))
export const log = (msg) => console.log(msg)
export const headingLog = (msg) => console.log(chalk.bgBlue(msg))
export const instructionLog = (msg) => console.log(chalk.bold.blue(msg))
export const thankYouLog = (msg) => console.log(chalk.bgYellow.black(msg))
export const excitementLog = (msg) => console.log(gradient.pastel.multiline(msg))

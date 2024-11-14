import fs from 'fs/promises'
import path from 'path'

const fileName = '.bill-splitter.json'
const appDataDirectory = process.env.APPDATA ||
  (process.platform === 'darwin' ? path.join(process.env.HOME, 'Library', 'Preferences') : path.join(process.env.HOME, '.local', 'share'))

const filePath = path.join(appDataDirectory, fileName)

async function ensureDirectoryExists (directory) {
  try {
    await fs.access(directory)
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(directory, { recursive: true })
    } else {
      throw error
    }
  }
}

async function writeToPath (data) {
  try {
    await ensureDirectoryExists(appDataDirectory)
    const jsonData = JSON.stringify(data, null, 2)
    await fs.writeFile(filePath, jsonData, 'utf-8')
  } catch (error) {
    console.error(`Error writing to ${filePath}: ${error.message}`)
  }
}

async function readFromPath () {
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(jsonData)
  } catch (error) {
    if (error.code === 'ENOENT') {
      await ensureDirectoryExists(appDataDirectory)
      await fs.writeFile(filePath, '{}', 'utf-8')
      return {}
    }
    console.error(`Error reading from ${filePath}: ${error.message}`)
    return null
  }
}

export { writeToPath, readFromPath }

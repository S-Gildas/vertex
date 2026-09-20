import {mkdir} from 'node:fs/promises'
import {spawn} from 'node:child_process'
import {fileURLToPath} from 'node:url'

const backupDirectory = fileURLToPath(new URL('../../../.backups/', import.meta.url))
const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
const backupPath = fileURLToPath(new URL(`../../../.backups/sanity-production-${timestamp}.tar.gz`, import.meta.url))
const command = process.platform === 'win32' ? (process.env.ComSpec ?? 'cmd.exe') : 'sanity'
const args = process.platform === 'win32'
  ? ['/d', '/s', '/c', 'sanity.cmd', 'datasets', 'export', 'production', backupPath]
  : ['datasets', 'export', 'production', backupPath]

await mkdir(backupDirectory, {recursive: true})

const exitCode = await new Promise((resolve, reject) => {
  const child = spawn(command, args, {
    cwd: fileURLToPath(new URL('../../', import.meta.url)),
    stdio: 'inherit',
  })
  child.once('error', reject)
  child.once('exit', (code) => resolve(code))
})

if (exitCode !== 0) throw new Error(`Sanity dataset export failed with exit code ${exitCode}`)
console.log(`Sanity backup created: ${backupPath}`)

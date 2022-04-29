import { spawn } from 'child_process'

export default (cmd, args) => {
  return new Promise((resolve, reject) => {
    const command_process = spawn(cmd, args)
    let buffer = ''
    let err = ''
    let code
    command_process.stdout.on('data', (data) => {
      buffer += data.toString()
    })
    command_process.stderr.on('data', (data) => {
      err += data.toString()
    })
    command_process.on('close', (code) => {
      resolve(buffer.trim())
    })
    command_process.on('error', (err) => {
      reject(err)
    })
  })

}

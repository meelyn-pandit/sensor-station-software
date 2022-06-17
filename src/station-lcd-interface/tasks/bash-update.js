import { execFile } from 'child_process'

class BashUpdateTask {
  constructor() {
    this.header = "Bash Update Station"
  }
  loading() {
    return [this.header, "Running ..."]
  }
  results() {
    return new Promise((resolve, reject) => {
      console.log('executing bash update')
      execFile('bash-update-station', (error, stdout, stderr) => {
        if (error) {
          resolve('run error')
          return
        }
        console.log(stdout)
        resolve('finished')
      })
    })
  }
}

export { BashUpdateTask }
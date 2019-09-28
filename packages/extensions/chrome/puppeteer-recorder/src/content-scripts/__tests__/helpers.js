import express from 'express'
import path from 'path'

export const waitForAndGetEvents = async function (page, amount) {
  await waitForRecorderEvents(page, amount)
  return getEventLog(page)
}

export const waitForRecorderEvents = function (page, amount) {
  return page.waitForFunction(`window.eventRecorder._getEventLog().length >= ${amount || 1}`)
}

export const getEventLog = function (page) {
  return page.evaluate(() => { return window.eventRecorder._getEventLog() })
}

export const cleanEventLog = function (page) {
  return page.evaluate(() => { return window.eventRecorder._clearEventLog() })
}

export const startServer = function (buildDir, file) {
  return new Promise((resolve, reject) => {
    const app = express()
    app.use('/build', express.static(path.join(__dirname, buildDir)))
    app.get('/', (req, res) => {
      res.status(200).sendFile(file, { root: __dirname })
    })
    const server = app.listen(3000, () => {
      return resolve(server)
    })
  })
}

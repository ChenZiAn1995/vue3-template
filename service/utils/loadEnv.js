'use strict'

const path = require('path')
const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
const { error } = require('./logger')

module.exports = function loadEnv(mode) {
  const basePath = path.resolve(process.cwd(), `.env${mode ? `.${mode}` : ``}`)
  const localPath = `${basePath}.local`

  const load = (envPath) => {
    try {
      const env = dotenv.config({ path: envPath, debug: process.env.DEBUG })
      dotenvExpand(env)
    } catch (err) {
      // only ignore error if file is not found
      if (err.toString().indexOf('ENOENT') < 0) {
        error(err)
      }
    }
  }

  load(localPath)
  load(basePath)

  if (mode) {
    const defaultNodeEnv = mode === 'production' || mode === 'test' ? mode : 'development'
    if (process.env.NODE_ENV == null) {
      process.env.NODE_ENV = defaultNodeEnv
    }
  }
}

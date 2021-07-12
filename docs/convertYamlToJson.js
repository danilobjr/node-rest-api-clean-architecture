/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const stream = require('stream')
const path = require('path')
const Yaml2json = require('@adius/yaml2json')

const openApiYamlFile = path.resolve(__dirname, 'api.yml')
const openApiJsonFile = path.resolve(__dirname, 'api.json')

const jsonIndentation = 2
let outputStream = fs.createWriteStream(openApiJsonFile)

fs
  .createReadStream(openApiYamlFile)
  .pipe(new Yaml2json)
  .pipe(new stream.Transform({
    writableObjectMode: true,
    transform: (chunk, _, done) =>
      done(null, JSON.stringify(chunk, null, jsonIndentation) + '\n')
  }))
  .pipe(outputStream)
  .on('error', console.error)
  .on('finish', () => {
    console.log('[DOCS] File generated at', openApiJsonFile)
    console.log('[DOCS] To view live version of OpenAPI docs, run server and access /vX/docs (where X is the current api version)')
  })
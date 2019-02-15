import lineReader from '@/helpers/lineReader'

import {Sex} from '@/types/helpers'

function generateRandomString() {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  // First character must be a letter
  const possibleLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  text += possibleLetters.charAt(Math.floor(Math.random() * possibleLetters.length))
  for (let i = 0; i < 20; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

function parseArrayFile(array: File, callback: Function, errorFunction: Function) {
  let started = false
  let firstLine = true
  let columns: Array<string> = []
  let lines: Array<any> = []
  let errorMsg = ''
  let foundHeader = false
  lineReader.readSomeLines(array, 1000000, function (line: string) {
    if (!line.startsWith('[Header]')) {
      foundHeader = true
    } else if (line.startsWith('[Data]')) {
      started = true
      if (! foundHeader) {
        errorMsg = 'Provided file is not an array file'
        return false
      }
    } else if (started && firstLine) {
      columns = getColumnsFromLine(line)
      firstLine = false
    } else if (!firstLine) {
      const lineArray: Array<string> = splitLine(line)
      if (lineArray.length > 1) {
        lines.push({
          'chr': lineArray[getIndex(columns, 'chr')],
          'position': lineArray[getIndex(columns, 'position')],
          'BAF': lineArray[getIndex(columns, 'b_allele_freq')]
        })
      }
    }
    return true
  }, function () {
    callback(lines)
  }, function (errorMessage: string) {
    if (errorMsg.length > 0) {
      errorFunction(errorMsg)
    } else {
      errorFunction(errorMessage)
    }
  })
}

function parseEventsFile(events: File, callback: Function, errorFunction: Function) {
  let sex: string = ''
  let columns: Array<string> = []
  let lines: Array<Object> = []
  let firstLine = true
  let errorMsg = ''
  lineReader.readSomeLines(events, 500, function (line: string) {
    if (!line.startsWith('#') && firstLine) {
      errorMsg = 'Provided file is not an events file'
      return false
    } else if (line.startsWith('#Gender')) {
      sex = line.split(' = ')[1]
        .replace(/(\r\n|\n|\r| |\t)/gm, '')
        .toLowerCase()
    } else if (!line.startsWith('#') && firstLine) {
      columns = getColumnsFromLine(line)
      firstLine = false
    } else if (!firstLine) {
      const lineArray: Array<string> = splitLine(line)
      const chrRegion = lineArray[getIndex(columns, 'chromosome_region')]
        .replace(/,|chr/g, '')
        .split(/:|-/)
      lines.push({
        'chromosome': chrRegion[0],
        'start': chrRegion[1],
        'stop': chrRegion[2],
        'event': lineArray[getIndex(columns, 'event')],
        'length': lineArray[getIndex(columns, 'length')],
        'probes': lineArray[getIndex(columns, 'probes')]
      })
    }
    return true
  }, function () {
    callback(sex, lines)
  }, function (errorMessage: string) {
    if (errorMsg.length > 0) {
      errorFunction(errorMsg)
    } else {
      errorFunction(errorMessage)
    }

  })
}

function splitLine(line: string) {
  return line.trim().split('\t')
}
function getColumnsFromLine(line: string) {
  return splitLine(line).map((value) => {
      return value.toLowerCase().replace(/ /g, '_')
    })
}

function getIndex(array: Array<string>, value: string) {
  return array.indexOf(value)
}

function chunks(array: Array<any>, size: number) {
  let results = []
  while (array.length) {
    results.push(array.splice(0, size))
  }
  return results
}

export default {
  generateRandomString,
  parseEventsFile,
  parseArrayFile,
  chunks,
  getIndex,
  getColumnsFromLine,
  splitLine
}
'use strict'

var jsonSafeStringify = require('json-stringify-safe')
var crypto = require('crypto')
var Buffer = require('safe-buffer').Buffer
var { Transform } = require('stream')

var defer = typeof setImmediate === 'undefined'
  ? process.nextTick
  : setImmediate

// Reference: https://github.com/postmanlabs/postman-request/pull/23
//
// function paramsHaveRequestBody (params) {
//   return (
//     params.body ||
//     params.requestBodyStream ||
//     (params.json && typeof params.json !== 'boolean') ||
//     params.multipart
//   )
// }

function safeStringify (obj, replacer) {
  var ret
  try {
    ret = JSON.stringify(obj, replacer)
  } catch (e) {
    ret = jsonSafeStringify(obj, replacer)
  }
  return ret
}

function md5 (str) {
  return crypto.createHash('md5').update(str).digest('hex')
}

function isReadStream (rs) {
  return rs.readable && rs.path && rs.mode
}

function toBase64 (str) {
  return Buffer.from(str || '', 'utf8').toString('base64')
}

function copy (obj) {
  var o = {}
  Object.keys(obj).forEach(function (i) {
    o[i] = obj[i]
  })
  return o
}

function version () {
  var numbers = process.version.replace('v', '').split('.')
  return {
    major: parseInt(numbers[0], 10),
    minor: parseInt(numbers[1], 10),
    patch: parseInt(numbers[2], 10)
  }
}

function now () {
  return performance.now(); // eslint-disable-line
}

class SizeTrackerStream extends Transform {
  constructor (options) {
    super(options)
    this.size = 0
  }

  _transform (chunk, encoding, callback) {
    this.size += chunk.length
    this.push(chunk)
    callback()
  }

  _flush (callback) {
    callback()
  }
}

exports.safeStringify = safeStringify
exports.md5 = md5
exports.isReadStream = isReadStream
exports.toBase64 = toBase64
exports.copy = copy
exports.version = version
exports.defer = defer
exports.SizeTrackerStream = SizeTrackerStream
exports.now = now

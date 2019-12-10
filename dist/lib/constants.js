'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Created by yuanqiangniu on 2018/9/3.
 */
var methodType = exports.methodType = ['post', 'get', 'head', 'put', 'delete', 'options', 'patch'];

var propertyType = exports.propertyType = ['string', 'integer', 'boolean', 'array', 'object', 'ref', 'number'];

var propertyTypeMap = exports.propertyTypeMap = {
  string: 'string',
  integer: 'number',
  boolean: 'boolean',
  array: 'Array',
  object: 'object',
  number: 'number'
};
/**
 * Created by yuanqiangniu on 2018/9/3.
 */
export const methodType = [ 'post', 'get', 'head', 'put', 'delete', 'options', 'patch' ]

export const propertyType =  ['string', 'integer', 'boolean', 'array', 'object', 'ref','number' ]

export const propertyTypeMap = {
  string: 'string',
  integer: 'number',
  boolean: 'boolean',
  array: 'Array',
  object: 'object',
  number: 'number',
}

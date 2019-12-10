/**
 * Created on ${date}
 */

const base: string = '/api.u51.com'
<% data.map(function(item, index) {%>
/**
<% item.comment.map(function(ct, index) {%> * ${ct}<%})%>
 * @type {string}
 */
export const ${item.last}: string = `<%- "${base}" %>${item.path}`<%})%>

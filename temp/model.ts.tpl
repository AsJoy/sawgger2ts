/**
 * Created on ${date}
 */
<% data.map(function(item, index) {%>
// tslint:disable-next-line:interface-name
export interface ${item.interfaceName} {
<% Object.keys(item.item).map(function(property, i)
{%>  ${property}?:<% if (item.item[property].type === 'ref')
{%> ${item.item[property].interfaceName}<%} else if (item.item[property].type === 'Array')
{
   if (item.item[property].innerType)
   {%> ${item.item[property].innerType}[] <%} else
   {%> ${item.item[property].interfaceName}[] <%
   }
} else {%> ${item.item[property].type}<%}%> <% if (item.item[property].summary){ %>// ${item.item[property].summary}<% } %>
<%})%>}
<%})%>

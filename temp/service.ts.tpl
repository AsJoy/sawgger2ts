/**
 * Created on ${date}
 */
import axios from '@/lib/axios'
import {
<% data.map(function(item, index) {%>  ${item.last},
<%})%>} from '${relative}'
<% data.map(function(item, index) {%>
/**
 * ${item.it.summary}
 * @param payload
 */
// tslint:disable-next-line:no-any
export const ${item.name} = async (payload = {}): Promise<any> => {
  const response = await axios(${item.last}, payload, '${item.type}')
  return response
}<%})%>

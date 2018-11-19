# swagger2ts

根据swagger构建ts api与接口请求 同时帮助定义好构建接口返回的Interface，目标是大大减小ts开发成本

### startUp
1. `npm i -g swagger2ts`

2. 配置`config`文件， 默认项目下的 `.swaggerconfig.js` 文件 配置如下
      ```js
    module.exports = {
      controllers: [ // 多个ares路径 多个接口
        {
          root: 'foo.test.env:8080',
          controller: 'foo-controller', // 爬取一个controller下所有接口
          paths: [ // 除了controller外别的接口
            '/foo/index',
          ],
        },
        {
          root: 'bar.test.env:8081',
          controller: 'bar-controller', // 爬取一个controller下所有接口
          paths: [ // 除了controller外别的接口
            '/bar/index',
          ],
        },
      ],
      location: {
        api: './test/api.ts', // 接口地址文件
        service: './test/service.ts', // 生成接口发送文件
        model: './test/model.ts', // 生成interface文件夹
      },
    }

      ```
3. 项目根目录下执行 `swagger2ts` 命令

> ### 生成的目标代码

1. `api.ts`

    ```js
    /**
     * Created on 2018-09-04
     */
    const base: string = '/base.com'
    /**
     * summary 接口的注释
     * @type {string}
     */
    export const summary: string = `${base}/test-controller/summary`
```

2. `service.ts`

```js
    import axios from '@/lib/axios'
    import {
      summary
    } from './api'


    export const fetchsummary = async (payload = {}): Promise<any> => {
      const response = await axios(summary, payload, 'get')
      return response
    }

```

3. Interface.ts

```js
    export interface IActivityProduct {
      aliasName?:string // 奖品别名
      name?: string,
      id?: string,
    }

```

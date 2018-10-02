/**
 * Created by yuanqiangniu on 2018/8/31.
 */
module.exports = {
  controllers: [ // 多个ares路径 多个接口
    {
      root: 'foo.test.51.env:8080',
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

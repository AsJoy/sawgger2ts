/**
 * Created by yuanqiangniu on 2018/8/31.
 */
module.exports = {
  controllers: [ // 多个ares路径 多个接口
    {
      root: 'presettlement2.ops-activity.51.env',
      controller: 'activity-prize-mail-address-controller', // 爬取一个controller下所有接口
    }
  ],
  location: {
    api: './test/api.ts', // 接口地址文件
    service: './test/service.ts', // 生成接口发送文件
    model: './test/model.ts', // 生成interface文件夹
  },
}

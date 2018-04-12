const serverPath = 'http://172.16.2.71:8068/mockjsdata/86/';

export default function post(url, body) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: serverPath + url,    // 拼接完整的url
      data: body,
      method: 'POST',
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        resolve(res.data);  // 把返回的数据传出去
        // resolve(e)  //注意,这里要用resolve,否则前端代码会崩溃
      },
      fail(ret) {
        reject(ret);   // 把错误信息传出去
      },
    });
  });
}

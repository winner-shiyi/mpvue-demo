const serverPath = 'http://172.16.2.71:8068/mockjsdata/116/';

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
                if (res.data.resultCode === '0') {
                    // 如果请求成功(result === '0')，则返回正常数据
                    resolve(res.data.resultData)
                } else {
                    // 如果请求正常，但是code返回非‘0’的状态码，则返回不同的code
                    resolve(res.data.resultCode)
                }
                // resolve(e)  //注意,这里要用resolve,否则前端代码会崩溃
            },
            fail() {
                reject({ error: '网络错误', code: 0 });
            },
        });
    });
}

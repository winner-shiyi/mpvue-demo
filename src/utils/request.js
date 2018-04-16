/**
 * Funciton: 数据请求相关功能
 * Author: zss.
 * Date: 2018-04-15
 */

/**
 * 调用说明
 * import req from 'request'
 * req('user/login', {username: 'zss'})
 * .then((res) => {
 *     // 对应resolve
 *     // request 请求获取的数据处理. 根据 res处理实际的业务逻辑.
 * },(res) => {
 *     // 对应reject
 * }).catch((res) => {
 *     // 对应reject
 *
 * })
 */

/**
 * 获取数据接口
 * https://developers.douban.com/wiki/?title=movie_v2
 * @param  {String} api    api 名称
 * @param  {String} path   请求路径
 * @param  {Objece} params 参数
 * @return {Promise}       包含抓取任务的Promise
 */
export default function post(api, params, method = 'POST') {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${process.env.BASE_URL}/${api}`,
            data: Object.assign({}, params),
            header: {
                'Content-Type': 'json',
                Accept: 'application/json',
            },
            method,
            success: (res) => {
                resolve(res.data);  // 把返回的数据传出去
                // res Object {data, statusCode, header}
                // resolve(res.data.data)
            },
            fail: (res) => {
                reject(res);   // 把错误信息传出去
                // fail调用接口失败
                // reject({error:'网络错误',code:0});
            },
        })
    })
}

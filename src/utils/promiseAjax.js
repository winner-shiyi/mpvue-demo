// import { resolve } from "url";

class PromiseAjax {
  constructor() {
    this.baseUrl = 'http://172.16.2.71:8068/mockjsdata/86/';
    this.headers = {
      'content-type': 'application/json',
      token: wx.getStorageSync('token'),
    };
  }
  ajax(url, params, headers, type) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.baseUrl}${url}`,
        data: params,
        methods: type,
        header: Object.assign({}, this.headers, headers),
        success: (res) => {
          if (res.data.resultCode === '0') {
            resolve(res.data);
          } else {
            reject(res.data.resultDesc);
          }
        },
        fail: (err) => {
          reject(err);
        },
      });
    });
  }
  get(url, params, headers = {}) {
    return this.ajax(url, params, headers, 'GET');
  }
  post(url, params, headers = {}) {
    return this.ajax(url, params, headers, 'POST');
  }

}

export { PromiseAjax };
export default new PromiseAjax();

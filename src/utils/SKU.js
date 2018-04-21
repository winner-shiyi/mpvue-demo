/* eslint-disable */
/**
 * sku处理算法
 * 整体思路：根据服务端数据集合，计算出已有的数据能够产生的所有集合的数量
 * 例如: A B a b 的2*2 矩阵，Aa:1, Ab:2, Ba:1, Bb:3
 * 则产生一个map{A:3, B:4, a:2, b: 5, Aa: 1, Ab: 2, Ba: 1, Bb: 3}
 * 然后根据选择的键查找对应数量
 */

class SKU {
    // static totalMap = {}
    // 求一个数组的所有子集, 返回一个对象，对象的key是以 ',' 分割的字符串
    /**
     * 
     * @param {array} arr 一个s数组，是一个sku的属性组成的数组
     * @param {number} value 该sku对应的数量
     */
    static allChildSet(arr, value) {
        if(Object.prototype.toString.call(arr) !== "[object Array]") throw "arr must be an array."
        let l = arr.length,
            obj = {},
            j,k,strArrr = [],
            i = 1 << l
        arr.sort() 
        for(let a = 0; a < i; a++) {
            strArrr = []
            j = l
            k = 1 << (l - 1)
            while(j) {
                if(a&k) {
                    strArrr.push(arr[l-j])
                }
                k = k >> 1
                j--
            }
            if(strArrr.length !== 0) {
                obj[strArrr.join(',')] = value
            }  
        }
        return obj
    }

    // 统计所有sku的数量
    /**
     * 
     * @param {array<skuObj>} arr sku对象组成的数组
     * skuObj.key 一个字符串，以,分割
     * skuObj.value sku的数量
     * @param {string} valueKey 这里是为了让key可以直接设置一个库存值，或者设置一个对象，库存是该对象中的一个key
     * valueKey 即该key的名字 例如: {'50kg', 20}是50kg的商品的库存为20，或者:{'50kg':{store:20,price:30}}，valueKey传人
     * 一个'store'，让该函数去累加对象上的store属性，否则直接累加商品属性对应的值
     * @return {object} 返回一个对象，包括所有组合以及对应数量
     */
    static allSkuValue(arr, valueKey) {
        if(Object.prototype.toString.call(arr) !== "[object Array]") throw "arr must be an array."
        let totalObj = {}
        let objArr = arr.map(function(item, i) {
            return SKU.allChildSet(item.key.split(','), item.value)
        })

        let key,blankObj

        objArr.forEach(function(item, i) {
            for(key in item) {
 
                if(valueKey) {
                    blankObj = {...item[key]}
                    delete blankObj[valueKey]
                    totalObj[key] = totalObj[key] || blankObj
                    if(!totalObj[key][valueKey]) {
                        totalObj[key][valueKey] = item[key][valueKey]
                    } else {   
                        totalObj[key][valueKey] += item[key][valueKey]
                    }
                } else {
                    if(!totalObj[key]) {
                        totalObj[key] = item[key]
                    } else {
                        totalObj[key] += item[key]
                    }
                }

            }
        })

        return totalObj
        
    }
    

}
export default SKU
// let arr = [
//     {key: '黑色,36,男',value: 3},
//     {key: '黑色,37,男',value: 2},
//     {key: '黑色,38,女',value: 5},
//     {key: '白色,36,男',value: 1},
//     {key: '白色,38,女',value: 5},
//     {key: '黄色,36,女',value: 1},
//     {key: '黄色,37,男',value: 3},
// ]
// console.dir('obj', SKU.allSkuValue(arr))
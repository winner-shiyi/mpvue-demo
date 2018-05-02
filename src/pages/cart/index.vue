<template>
    <view class="cart-container">
        <div class="position-content" v-if="isLogin && cartData.shopList.length">
             <div class="address-box" v-if="isLocateSuccess" @click="goToAddress">
                <div class="left">
                    <image class="location" src="/static/img/cart/location@3x.png"/> 
                    <div class="address">{{current_addr}}</div>
                </div>
                <image class="arrow" src="/static/img/cart/arrow@3x.png"/>
            </div> 
            <div class="err-box" v-if="!isLocateSuccess" @click="goToAddress">
                <div class="left">
                     <image class="location-err" src="/static/img/cart/location_red@3x.png"/>
                     <div class="no-address">{{current_addr}}</div>
                </div>
                <div class="right">
                    <span class="text">完善地址</span>
                    <image class="arrow" src="/static/img/cart/arrow@3x.png"/>
                </div>
            </div> 
        </div>
        <split></split>
        <view class="cart-content" v-if="isLogin">
            <view class="has-goods" v-if="cartData.shopList.length">
                <div class="valid-ul" v-if="validShopList.length">
                    <cart-item 
                        v-for="(validItem, validKey) in validShopList" 
                        :key="validKey"
                        :valid-data="validItem"
                        @addShop="addShopHandler"
                        @removeShop="removeShopHandler"
                        @getartDetail="getartDetailHandler"
                    ></cart-item>
                </div>
                <div class="lose-title" v-if="losedShopList.length">
                    <image class="icon" src="/static/img/detail/line@3x.png"/>
                    <span class="title">失效商品</span>
                    <image class="icon" src="/static/img/detail/line@3x.png"/>
                </div>
                <div class="lose-ul" v-if="losedShopList.length">
                    <lose-item v-for="(losedItem, losedKey) in losedShopList" :key="losedKey" :lose-data="losedItem"></lose-item>
                </div>
            </view>
            <view class="cart-empty" v-if="!cartData.shopList.length">
                <image class="empty" src="https://huotu.oss-cn-shanghai.aliyuncs.com/wxx/cart_empty@3x.png" />
                <div class="txt">购物车还没有商品哦～</div>
                <div class="go-btn" @click="goToIndex">去逛一逛</div>
            </view>
        </view>  
        <!-- <view class="no-login" v-if="!isLogin">没有登录的情况下</view> -->

        <div class="freight-mask" v-if="isLogin && cartAllGoods.length">
            <div class="no-free" v-if="diffPrice > 0" @click="goToIndex">满<span class="red">{{freeDeliveryPrice}}元</span>免运费，还差<span class="red">{{diffPrice}}</span>元，去凑单&gt;&gt;</div>
            <div class="free" v-else>已免运费</div>
        </div>
        <view class="bottom-settle" v-if="isLogin && cartData.shopList.length">
            <div class="settle-box">
                <div class="left">
                    <div class="total">商品合计：<span class="num">￥{{totalPrice}}</span></div>
                    <div class="freight">运费：￥{{freight}}</div>
                </div>
                <div class="right" :class="{disabled: !totalPrice || totalPrice < startingPrice}" @click="cartSubmit">{{payDesc}}</div>
            </div>
        </view>
    </view>
</template>

<script>
import request from '@/utils/request';
import MapUtil from '@/utils/map';
import split from '@/components/split';
import cartItem from './cart-item';
import loseItem from './lose-item';

export default {
    components: {
        split,
        cartItem,
        loseItem,
    },
    data() {
        return {
            current_addr: '定位中...',
            isLocateSuccess: true, // 定位成功
            areaCode: '',
            isLogin: true,
            cartData: {
                shopList: [],
            },
            validShopList: [],
            losedShopList: [],
            totalPrice: 0, // 商品合计
            freight: 0, // 运费
            cartAllGoods: [], // checked的所有商品
            submitLock: false, // 是否正在提交中
            startingPrice: 0, // 起送门槛
            freeDeliveryPrice: 0, // 包邮门槛
            diffPrice: 0, // 差多少包邮
        }
    },
    created() {
        console.log('购物车页面created-------')
        if (this.isLogin) {
            // this.getartDetail()
        } else {
            wx.redirectTo({
                url: '../login/main',
            })
        }
    },
    onShow() {
        console.log('购物车页面onShow-------')
        // 只有登录并且购物车不为空的时候 才去调定位接口
        if (this.isLogin) {
            this.getLocateStatus()
        }
    },
    computed: {
        payDesc() {
            if (this.totalPrice === 0) {
                return `￥${this.startingPrice}元起送`
            } else if (this.totalPrice < this.startingPrice) {
                const diff = this.startingPrice - this.totalPrice
                return `还差￥${diff}元起送`
            }
            return '结算'
        },
    },
    watch: {
        cartAllGoods: {
            deep: true,
            handler() {
                // 动态结算运费和商品合计
                this.getMoneyData()
            },
        },
    },
    methods: {
        setLocationState({ latitude, longitude, errMsg }) {
            console.log(latitude, longitude, '购物车---------------------')
            console.log(!errMsg)
            if (!errMsg) {
                MapUtil.getUserLocationInfo({
                    latitude,
                    longitude,
                }, 0).then((addrInfo) => {
                    console.log(addrInfo, '购物车addrInfo-------------')
                    const formattedAddr = addrInfo.formatted_addresses
                    this.current_addr = formattedAddr.recommend
                    this.areaCode = addrInfo.ad_info.adcode
                    this.getartDetail()
                }).catch((err) => {
                    wx.showToast({
                        title: err,
                        icon: 'none',
                        duration: 2000,
                    });
                })
            } else {
                this.isLocateSuccess = false
                this.current_addr = '未获取配送地址'
                this.getartDetail()
            }
        },
        /**
         * [getLocateStatus 判断定位状态]
         * @return {[type]} [description]
         */
        getLocateStatus() {
            console.log('购物车登录之后的处理啊啊啊------')
            wx.setStorageSync('cartAddress', '三新家园')
            const cartAdcode = wx.getStorageSync('cartAdcode')
            const cartAddress = wx.getStorageSync('cartAddress')
            if (cartAdcode && cartAddress) {
                this.areaCode = cartAdcode
                this.current_addr = cartAddress
                this.isLocateSuccess = true
                this.getartDetail()
            } else {
                MapUtil.getUserLocation(this.setLocationState)
            }
        },
        /**
         * 获取购物车列表数据
         */
        getartDetail() {
            const param = {
                areaCode: this.areaCode,
            }
            request('cartDetail', param).then((data) => {
                // console.log('购物车列表数据----', data)
                this.cartData = data
                // 获取起送价
                this.startingPrice = parseFloat(data.startingPrice / 100)
                this.groupList(this.cartData.shopList)
            })
        },
        addShopHandler(item) {
            this.cartAllGoods.push(item)
        },
        removeShopHandler(item) {
            this.cartAllGoods = this.cartAllGoods.filter(item2 => item2.skuId !== item.skuId)
        },
        getartDetailHandler() {
            // 删除购物车成功后 刷新页面 获取列表数据
            this.getartDetail()
        },
        /**
         * 列表分类
         */
        groupList(shopList) {
            this.validShopList = []
            this.losedShopList = []
            shopList.forEach((item) => {
                let type = 'validShopList'
                if (item.isLose) {
                    type = 'losedShopList'
                }
                this[type].push(item)
            })
        },
        /**
         * 获取总价和运费
         */
        getMoneyData() {
            const param = {
                addressId: '',
                shopList: this.getParams(),
            }
            request('cartConfirm', param).then((data) => {
                // console.log('每次选择商品时候购物车结算----', data)
                // 获取商品合计
                this.totalPrice = parseFloat(data.productAmountTotal / 100)
                // 获取运费
                this.freight = parseFloat(data.logisticsFee / 100)
                // 获取包邮门槛
                this.freeDeliveryPrice = parseFloat(data.freeDeliveryPrice / 100)
                // 计算还差多少元免邮费
                this.diffPrice = parseFloat(
                    (data.freeDeliveryPrice - data.productAmountTotal) / 100)
            }).catch(() => {})
        },
        /**
         * 点击【结算】按钮
         */
        cartSubmit() {
            if (!this.totalPrice || this.submitLock) return

            const param = {
                addressId: '',
                shopList: this.getParams(),
            }
            // console.log(param)
            this.submitLock = true
            request('cartConfirm', param).then((data) => {
                console.log('购物车结算----', data)
                this.submitLock = false
                // 把成功返回的数据 存到storage，商品合计，运费一起存
                wx.setStorageSync('cartData', data)
                wx.navigateTo({
                    url: '../orderConfirm/main',
                })
            }).catch(() => {
                this.submitLock = false
            })
        },
        /**
         * 组装提交的参数
         */
        getParams() {
            const obj = {}
            this.cartAllGoods.forEach((item) => {
                if (!obj[item.shopId]) {
                    obj[item.shopId] = []
                }
                obj[item.shopId].push({
                    number: item.skuNumber,
                    skuId: item.skuId.trim(),
                })
            })

            const resultArr = []
            Object.keys(obj).forEach((prop) => {
                resultArr.push({
                    shopId: prop,
                    skuIdAndCountList: obj[prop],
                })
            })
            return resultArr
        },
        /**
         * 跳转到首页
         */
        goToIndex() {
            wx.switchTab({
                url: '../index/main',
            })
        },
        /**
         * 跳转到地址选择页
         */
        goToAddress() {
            wx.navigateTo({
                url: '../addressManage/main?isCart=true',
            })
        },
    },
    onUnload() {
        wx.removeStorageSync('cartAdcode')
        wx.getStorageSync('cartAddress')
    },
};
</script>

<style>
page {
    background: #f3f5f7;
}
</style>
<style lang="scss" scoped>
$green: #77BA2C;
$orange: #FF7752;
$image: linear-gradient(90deg, #FFE456 0%, #FFC523 100%);
@import "../../style/base/mixin.scss";
.cart-container{
    box-sizing: border-box;
    padding-bottom: 50px;
    .position-content{
        width: 100%;
        height: 60px;
        line-height: 60px;
        background: #fff;
        padding: 0 15px;
        box-sizing: border-box;
        .location, .location-err{
            flex: 0 0 20px;
            width: 20px;
            height: 20px;
            margin-right: 15px;
        }
        .address-box, .err-box{
            display: flex;
            height: 100%;
            justify-content: space-between;
            align-items: center;
        }
        .arrow{
            flex: 0 0 8px;
            width: 8px;
            height: 14px;
            margin-left: 5px;
        }
        .address{
            flex: 1;
            font-size: 14px;
            color: #333;
            @include ellipsisLn(1, 20);
            line-height: 20px;
        }
        .left, .right{
            display: flex;
            align-items: center;
        }
        .no-address{
            font-size: 14px;
            color: $orange;
        }
        .text{
            font-size: 14px;
            color: #333;
        }
    }
    
    .has-goods{
        width: 100%;
        background: #f3f5f7;
    }
    // .valid-ul, .lose-ul{
    //     padding: 10px 14px 0 15px;
    // }
    .lose-title{
        height: 50px;
        line-height: 50px;
        text-align: center;
        background: #f3f5f7;
        .icon{
            width: 20px;
            height: 6px;
        }
        .title{
            font-size: 14px;
            color:#959595;
            margin: 0 6px;
        }
    }
    .bottom-settle{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 49px;
        line-height: 49px;
        z-index: 10;
        .settle-box{
            display: flex;
            .left{
                flex: 1;
                border-top: 1px solid #E5E5E5;
                background: #fff;
                padding-left: 15px;
            }
            .right{
                width: 150px;
                flex: 0 0 150px;
                background-image: $image;
                color: #fff;
                font-size: 16px;
                text-align: center;
                color: #494A4B;
            }
            .disabled{
                background: #E6E6E6;
                color: #B3B3B3; 
            }
            .total{
                font-size: 14px;
                color:#333;
                line-height: 16px;
                margin: 8px 0 3px;
            }
            .num{
                font-weight: bold;
                font-size: 16px;
                color: $orange;
            }
            .freight{
                font-size: 12px;
                color: #959595;
                line-height: 16px;
            }
        }
    }
    .cart-empty{
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        .empty{
            margin-top: 50px;
            width: 150px;
            height: 150px;
        }
        .txt{
            margin: 12px 24px;
            font-size: 14px;
            font-weight: bold;
            color: #888A8F;
        }
        .go-btn{
            width: 200px;
            height: 47px;
            line-height: 47px;
            background-image: $image;
            border-radius: 6px; 
            font-size: 16px;
            color: #494A4B;
        }
    }
    .freight-mask{
        position: fixed;
        bottom: 49px;
        left: 0;
        height: 32px;
        width: 100%;
        line-height: 32px;
        text-align: center;
        font-size: 12px;
        color: #C5921E;
        opacity: 0.85;
        background: #FFF6C9;
        z-index: 10;
        .red{
            color: $orange;
        }
    }
}
</style>


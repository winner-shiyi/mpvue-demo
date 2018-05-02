<template>
    <view class="cart-container">
        <div class="position">近江时代大厦A座</div>
        <split></split>
        <view class="cart-content" v-if="isLogin">
            <view class="has-goods" v-if="cartData.shopList.length">
                <div class="valid-ul">
                    <cart-item v-for="(validItem, validKey) in validShopList" :key="validKey" :valid-data="validItem"></cart-item>
                </div>
                <div class="lose-title">
                    <image class="icon" src="/static/img/detail/line@3x.png"/>
                    <span class="title">失效商品</span>
                    <image class="icon" src="/static/img/detail/line@3x.png"/>
                </div>
                <div class="lose-ul">
                    <lose-item v-for="(losedItem, losedKey) in losedShopList" :key="losedKey" :lose-data="losedItem"></lose-item>
                </div>
            </view>
            <view class="cart-empty" v-if="!cartData.shopList.length">登录并且购物车为空</view>
        </view>  
        <view class="no-login" v-if="!isLogin">没有登录的情况下</view>
        <view class="bottom-settle" v-if="isLogin && cartData.shopList.length">
            <div class="settle-box">
                <div class="left">
                    <div class="total">商品合计：<span class="num">￥{{totalPrice111}}</span></div>
                    <div class="freight">运费：￥10</div>
                </div>
                <div class="right">结算{{test}}</div>
            </div>
        </view>
    </view>
</template>

<script>
import request from '@/utils/request';
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
            isLogin: true,
            cartData: {
                shopList: [],
            },
            test: 0,
            selectGoods: [],
            // validShopList: [],
            // losedShopList: [],
        }
    },
    mounted() {
        console.log('购物车页面')
        this.getAjaxCartDetail()
    },
    watch: {
        // validShopList: {
        //     deep: true,
        //     handler(newList) {
        //         this.test += 1
        //         this.validShopList = newList
        //         this.selectGoods = []
        //         newList.forEach((shopItem) => {
        //             shopItem.skuList.forEach((skuItem) => {
        //                 if (skuItem.isChecked) {
        //                     this.selectGoods.push(skuItem)
        //                 }
        //             })
        //         })
        //     },
        // },
    },
    computed: {
        calcCartData() {
            return this.cartData.shopList.map((item) => {
                const itemTemp = item
                itemTemp.isShopChecked = false
                return itemTemp
            })
        },
        validShopList() {
            return this.cartData.shopList.filter(item => !item.isLose)
        },
        losedShopList() {
            return this.cartData.shopList.filter(item => item.isLose)
        },
        totalPrice111() {
            let total = 0
            this.selectGoods.forEach((item) => {
                total += Number(item.sellingPrice) * Number(item.skuNumber)
            })
            console.log('子组件变化了，total-----', total)
            return total
        },


    },
    methods: {
        getAjaxCartDetail() {
            const param = {
                areaCode: '',
            }
            request('cartDetail', param).then((data) => {
                this.cartData = data;
                // 处理cartData 数据 为啥不能再这里 处理 组装数据？？
                // this.cartData.forEach((item) => {
                //     const itemTemp = item
                //     itemTemp.isShopChecked = false
                // })
                // 传给子组件的数据  在父组件过滤好 还是 子组件过滤???
                // this.validShopList = this.calcCartData.shopList.filter(item => !item.isLose)
                // this.losedShopList = this.calcCartData.shopList.filter(item => item.isLose)
                console.log('cartDetail----', this.cartData);
            })
        },


    },
};
</script>


<style lang="scss" scoped>
$green: #77BA2C;
$orange: #FF6500;
.cart-container{
    padding-bottom: 50px;
    background: #f3f5f7;
    .position{
        width: 100%;
        height: 60px;
        line-height: 60px;
        background: #fff;
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
                width: 100px;
                flex: 0 0 100px;
                background: $green;
                color: #fff;
                font-size: 17px;
                text-align: center;
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
}
</style>


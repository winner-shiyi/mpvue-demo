<template>
    <view class="cart-item-content">
        <div class="shop-name">
            <div
                class="check-icon"
                :class="calcShopClass"
                @click="shopBoxClick"
            >{{validData.isShopChecked}}</div>
            <span class="title">{{validData.shopName}}</span>
            <div class="status">{{validData.shopStatus === '1' ? textMap[validData.shopStatus]: '' }}</div>
        </div>
        <div class="cart-item" v-for="item in calcSkuList" :key="item.skuId">
            <div
                class="check-icon"
                :class="{selected: item.isChecked, unselected: !item.isChecked, lose: validData.shopStatus === '1'}"
                @click="skuBoxClick(item)"
            >{{item.isChecked}}</div>
            <image class="good-img" :src="item.spuImage" @click="goodClick(item.spuId)"/>
            <div class="good-info">
                <div class="good-name" @click="goodClick(item.spuId)">{{item.spuName}}</div>
                <div class="sku">{{item.skuSpecText}}</div>
                <div class="price">￥{{item.sellingPrice}}</div>
                <div class="control-box">
                    <circle-control v-model="item.skuNumber" :max="item.usableNum" :close="calcClose"></circle-control>
                </div>
            </div>
        </div>
    </view>
</template>
<script>
import circleControl from './circle-control'

export default {
    name: 'cart-item',
    components: {
        circleControl,
    },
    props: {
        validData: {
            type: Object,
            default: () => ({}),
        },
        // isShopChecked: {
        //     type: Boolean,
        //     default: false,
        // },
    },
    data() {
        return {
            textMap: { 0: '有效范围', 1: '超出配送范围' },
        }
    },
    mounted() {
        console.log('有效商品----', this.validData)
    },
    computed: {
        calcSkuList() {
            return this.validData.skuList.map((item) => {
                const specArr = []
                const itemTemp = item
                itemTemp.sellingPrice = parseFloat(item.sellingPrice / 100)
                item.skuSpecDesc.forEach((spec) => {
                    specArr.push(spec.specValue)
                })
                itemTemp.skuSpecText = specArr.join('，')
                itemTemp.isChecked = false
                // return item
                return itemTemp
            })
        },
        calcShopClass() {
            let str = ''
            if (this.validData.shopStatus === '0' && !this.validData.isShopChecked) {
                str = 'unselected'
            } else if (this.validData.shopStatus === '0' && this.validData.isShopChecked) {
                str = 'selected'
            } else {
                str = 'lose'
            }
            return str
        },
        calcClose() {
            return this.validData.shopStatus === '0' ? false : 'true'
        },
    },
    methods: {
        shopBoxClick() {
            // 1、如果 超出范围则 点击 无效
            if (this.calcClose) return
            this.validData.isShopChecked = !this.validData.isShopChecked
            // 2、店铺选中与否和每个sku商品选中的联动
            // this.validData.skuList.forEach((item) => {
            this.calcSkuList.forEach((item) => {
                const itemTemp = item
                itemTemp.isChecked = this.validData.isShopChecked
            })
            console.log('当前点击状态的商店名----', this.validData.isShopChecked)
        },
        skuBoxClick(item) {
            // 1、如果 超出范围则 点击 无效
            if (this.calcClose) return
            const itemTemp = item
            itemTemp.isChecked = !itemTemp.isChecked
            // 针对mpvue的hack
            itemTemp.skuId = `${item.skuId} `
            console.log('当前点击状态的购物车商品----', item.isChecked)
            // 2、每个sku商品和店铺选中的联动
            const flag = this.validData.skuList.some(skuItem => skuItem.isChecked)
            console.log('sku商品与店铺联动标志符----', flag)
            if (flag) {
                this.validData.isShopChecked = true
            } else {
                this.validData.isShopChecked = false
            }
        },
        goodClick(spuId) {
            wx.navigateTo({
                url: `../detail/main?shopId=${this.validData.shopId}&spuId=${spuId}`,
            })
        },
    },
}
</script>
<style lang="scss" scoped>
@import "../../style/base/mixin.scss";
$orange: #FF6500;
.cart-item-content{
    margin-bottom: 10px;
    background: #fff;
    padding: 0 14px 0 15px;
    &:last-child{
        margin-bottom: 0;
    }
    .shop-name{
        position: relative;
        display: flex;
        height: 50px;
        align-items: center;
        border-bottom: 1px solid #E5E5E5;
    }
    .title{
        font-size: 16px;
        color: #333;
        font-weight: bold;
        margin-left: 15px;
    }
    .check-icon{
        width: 20px;
        height: 20px;
        background-repeat: no-repeat;
        background-size: contain;
        &.selected{
            background-image: url('../../../static/img/cart/checked@3x.png');
        }
        &.unselected{
            background-image: url('../../../static/img/cart/unchecked@3x.png'); 
        }
        &.lose{
            background-image: url('../../../static/img/cart/lose@3x.png'); 
        }
    }
    .status{
        position: absolute;
        right: 0;
        top: 14px;
        font-size: 12px;
        color: #FA4C4A;
        line-height: 22px;
    }
    .cart-item{
        display: flex;
        box-sizing: border-box;
        height: 130px;
        padding: 20px 0 0 0;
        &:last-child{
            .good-info{
                border:none;
            }
        }
        .check-icon{
            margin-top: 24px;
            flex: 0 0 20px;
        }
    }
    .good-img{
        width: 100px;
        height: 100px;
        flex: 0 0 100px;
        margin: 0 9px 0 10px;
    }
    .good-info{
        position: relative;
        flex: 1;
        border-bottom: 1px solid #E5E5E5;
        .sku{
            font-size: 11px;
            color: #959595;
            margin-top: 4px;
            @include ellipsisLn(1, 16);
            line-height: 16px;
        }
        .price{
            position: absolute;
            left: 0;
            bottom: 10px;
            font-size: 17px;
            font-weight: bold;
            color: $orange;
            line-height: 22px;
        }
    }
    .good-name{
        font-size: 14px;
        color: #333;
        @include ellipsisLn(2, 18);
        line-height: 20px;
    }
    .control-box{
        position: absolute;
        right: 0;
        bottom: 10px;
    }
}
</style>

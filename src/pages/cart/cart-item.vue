<template>
    <view class="cart-item-content">
        <div class="shop-name">
            <div
                class="check-icon"
                :class="isCheckeAll"
                @click="selectAll"
            ></div>
            <span class="title">{{validData.shopName}}</span>
            <div class="status">{{validData.shopStatus === '1' ? textMap[validData.shopStatus]: '' }}</div>
        </div>
        <div class="cart-item-box" v-for="(item, key) in validData.skuList" :key="item.skuId">
            <slide-left  @delete="deleteHandler(item, validData.shopId)">
                <view class="cart-item">
                    <div
                    class="check-icon"
                    :class="{selected: item.isChecked, unselected: !item.isChecked, lose: validData.shopStatus === '1'}"
                    @click="switchShop(item)"
                    ></div>
                    <image class="good-img" :src="item.spuImage" @click="goodClick(item.spuId)"/>
                    <div class="good-info">
                        <div class="good-name" @click="goodClick(item.spuId)">{{item.spuName}}</div>
                        <div class="sku">{{item.skuSpecText}}</div>
                        <div class="price">￥{{item.sellingPrice}}</div>
                        <div class="control-box">
                            <circle-control
                                v-model="item.skuNumber"
                                :max="item.usableNum"
                                :disabled="validData.shopStatus === '0' ? false : 'true'"
                                :itemData="item"
                                :shopid="validData.shopId"
                                @delete="deleteHandler($event, validData.shopId)"
                                @update="updateHandler($event, validData.shopId)"
                            ></circle-control>
                        </div>
                    </div> 
                </view>
            </slide-left>
        </div>
    </view>
</template>
<script>
import request from '@/utils/request'
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
    },
    data() {
        return {
            textMap: { 0: '有效范围', 1: '超出配送范围' },
            selectedList: [],
        }
    },
    created() {
        this.contentSpec(this.validData.skuList)
    },
    computed: {
        isCheckeAll() {
            const { validData } = this
            if (validData.shopStatus === '1') {
                return 'lose'
            }
            if (!this.selectedList.length) {
                return 'unselected'
            }
            return 'selected'
        },
    },
    methods: {
        addShop(item) {
            const currItem = item
            currItem.shopId = this.validData.shopId
            this.selectedList.push(currItem)
            this.$emit('addShop', currItem)
        },
        removeShop(item) {
            this.selectedList = this.selectedList.filter(item2 => item2.skuId !== item.skuId)
            this.$emit('removeShop', item)
        },
        contentSpec(list) {
            list.forEach((item) => {
                const specArr = []
                const currItem = item
                currItem.sellingPrice = parseFloat(item.sellingPrice / 100)
                item.skuSpecDesc.forEach((spec) => {
                    specArr.push(spec.specValue)
                })
                currItem.skuSpecText = specArr.join('，')
                currItem.isChecked = false
            })
        },
        selectAll() {
            const equal = this.selectedList.length === this.validData.skuList.length
            if (this.isCheckeAll === 'selected' && !equal) {
                this.validData.skuList.forEach((item) => {
                    if (!item.isChecked) {
                        this.switchShop(item)
                    }
                })
            } else {
                this.validData.skuList.forEach((item) => {
                    this.switchShop(item)
                })
            }
        },
        switchShop(item) {
            if (this.validData.shopStatus === '1') return
            const currItem = item
            currItem.isChecked = !currItem.isChecked
            // 针对mpvue的hack
            currItem.spuName = `${currItem.spuName.trim()} `
            if (currItem.isChecked) {
                this.addShop(currItem)
            } else {
                this.removeShop(currItem)
            }
        },
        deleteHandler(item, shopId) {
            const param = {
                deleteList: [
                    {
                        skuId: item.skuId,
                        shopId,
                    },
                ],
            }
            request('deleteCartSku', param).then(() => {
                console.log('删除购物车的参数----', param)
                // 告诉首页重新获取列表数据
                this.$emit('getartDetail')
            }).catch(() => {})
        },
        /**
         * 更新购物车sku数量
         */
        updateHandler(item, shopId) {
            // this.$emit('updatesku', item, shopId)
            console.log('更新sku时候的$event--', item)
            const param = {
                skuId: item.skuId,
                shopId,
                skuNumber: item.skuNumber,
            }
            console.log('更新sku时候的提交参数---', param)
            request('updateCartSkuAmount', param).then((data) => {
                console.log('更新购物车sku----', data)
            }).catch(() => {})
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
        height: 130px;
        margin-top: 20px;
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
        // flex: 1;
        flex: 0 0 205px;
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

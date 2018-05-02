<template>
    <view class="lose-item-content">
        <div class="shop-name">
            <div class="check-icon lose"></div>
            <span class="title">{{loseData.shopName}}</span>
        </div>
        <div class="lose-item" v-for="item in calcSkuList" :key="item.skuId">
            <div class="check-icon lose"></div>
            <div class="img-box"  @click="goodClick(item.spuId)">
                <image class="good-img" :src="item.spuImage"/>
                <div class="status">{{textMap[item.invalidStatus]}}</div>
            </div>
            <div class="good-info">
                <div class="good-name" @click="goodClick(item.spuId)">{{item.spuName}}</div>
                <div class="sku">{{item.skuSpecText}}</div>
                <div class="price">￥{{item.sellingPrice}}</div>
            </div>
        </div>
    </view>
</template>
<script>

export default {
    name: 'lose-item',
    props: {
        loseData: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            textMap: { 0: '有效', 1: '已下架', 2: '已售完', 3: '不支持', 4: '失败' },
        }
    },
    mounted() {
        // console.log('无效商品----', this.loseData)
    },
    computed: {
        calcSkuList() {
            return this.loseData.skuList.map((item) => {
                const specArr = []
                const itemTemp = item
                itemTemp.sellingPrice = parseFloat(item.sellingPrice / 100)
                item.skuSpecDesc.forEach((spec) => {
                    specArr.push(spec.specValue)
                })
                itemTemp.skuSpecText = specArr.join('，')
                return item
            })
        },
    },
    methods: {
        goodClick(spuId) {
            wx.navigateTo({
                url: `../detail/main?shopId=${this.loseData.shopId}&spuId=${spuId}`,
            })
        },
    },
}
</script>
<style lang="scss" scoped>
@import "../../style/base/mixin.scss";
$orange: #FF6500;
.lose-item-content{
    margin-bottom: 10px;
    background: #fff;
    padding: 0 14px 0 15px;
    // &:last-child{
    //     margin-bottom: 0;
    // }
    .shop-name{
        position: relative;
        display: flex;
        height: 50px;
        align-items: center;
        border-bottom: 1px solid #E5E5E5;
    }
    .title{
        font-size: 16px;
        color: #959595;
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
    .lose-item{
        display: flex;
        box-sizing: border-box;
        height: 90px;
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
    .img-box{
        position: relative;
        width: 60px;
        height: 60px;
        flex: 0 0 60px;
        margin: 0 9px 0 10px;
        .status{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            width: 40px;
            height: 40px;
            line-height: 40px;
            border-radius: 50%;
            text-align: center;
            color: #fff;
            background: rgba(#000, .4);
        }
    }
    .good-img{
        width: 100%;
        height: 100%;
    }
    .good-info{
        position: relative;
        flex: 1;
        border-bottom: 1px solid #E5E5E5;
        .sku{
            position: absolute;
            left: 0;
            bottom: 15px;
            width: 80%;
            font-size: 11px;
            color: #959595;
            margin-top: 4px;
            @include ellipsisLn(1, 16);
            line-height: 16px;
        }
        .price{
            position: absolute;
            right: 0;
            bottom: 13px;
            font-size: 14px;
            color: #959595;
            line-height: 22px;
        }
    }
    .good-name{
        font-size: 14px;
        color: #959595;
        @include ellipsisLn(2, 18);
        line-height: 20px;
    }
}
</style>

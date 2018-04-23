<template>
    <view class="sku-panel">
        <div class="sku-panel-content" v-show="status">
            <div class="sku-head">
                <div class="img">
                    <image class="sm-img" :src="selectGood.skuImage"/>
                </div>
                <div class="info">
                    <div class="price">￥{{selectGood.price}}</div>
                    <div class="select">已选：{{selectGood.text}}</div>
                </div>
            </div> 
            <div class="sku-content">
                <ul class="sku-ul">
                    <li class="sku-item" v-for="(specItem, specIndex) in specStoreArr" :key="specIndex">
                        <div class="name">{{specItem.specName}}</div>
                        <div class="list">
                            <div class="item"
                                v-for="(valueItem, key) in specItem.valueList"
                                :class="{
                                    'lose': !valueItem.store,
                                    'active': valueItem.active
                                }"
                                :key="key"
                                @click="specItemClick(specItem.valueList, key)"
                            >
                                {{valueItem.specValue}}
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="counter-content">
                    <div class="name">数量</div>
                    <div class="counter">
                        <cartcontrol v-model="initCount" :max="selectGood.store"></cartcontrol>
                    </div>
                </div>
            </div>
            <div class="btn" @click="submitSKU">确认</div>
            <image class="close" src="/static/img/detail/close@3x.png" @click="hidePanel"/>
        </div>
        <div class="mask" @click="hidePanel" v-show="status"></div>
    </view>
</template>
<script>
    import cartcontrol from '@/components/cartcontrol';
    import SKU from '../utils/SKU';

    export default {
        components: {
            cartcontrol,
        },
        props: {
            value: {
                type: Boolean,
                default: false,
            },
            skuList: {
                type: Array,
                default: () => ([]),
            },
            specList: {
                type: Array,
                default: () => ([]),
            },
        },
        data() {
            return {
                status: this.value,
                skuStoreObj: {},
                specStoreArr: this.specList,
                selectGood: {},
                initCount: 1, // 初始化sku数量为1
            }
        },
        watch: {
            value(val) {
                this.status = val
            },
            status(val) {
                this.$emit('input', val)
            },
        },
        created() {
            this.handleSKU();
        },
        methods: {
            hidePanel() {
                this.status = false
                // 关闭后的回调
                this.$emit('close');
            },
            handleSKU() {
                const newSkuList = this.skuList.map(item => ({
                    key: item.skuDesc.split(',').sort().join(','),
                    value: {
                        store: item.quantity,
                        price: item.sellingPrice,
                        productId: item.skuId,
                        skuImage: item.skuImage,
                    },
                }));
                const skuObj = SKU.allSkuValue(newSkuList, 'store');
                this.skuStoreObj = skuObj;
                this.handleSPC()
                console.log('this.skuStoreObj---', this.skuStoreObj)
                this.handleSelectGood()
            },
            handleSPC() {
                this.specList.forEach((item) => {
                    let isActive = false
                    item.valueList.forEach((valueItem) => {
                        const temp = valueItem;
                        temp.store = this.skuStoreObj[temp.specValue].store
                        if (!isActive && temp.store) {
                            temp.active = !!temp.store
                            isActive = true
                        }
                    });
                });
            },
            // 选择某个sku商品时，设置文案、价格、图片、库存
            handleSelectGood() {
                const arr = [];
                this.specList.forEach((item) => {
                    item.valueList.forEach((valueItem) => {
                        if (valueItem.active) {
                            arr.push(valueItem.specValue.trim())
                        }
                    })
                });
                this.selectGood = this.skuStoreObj[arr.join(',')];
                this.selectGood.text = arr.sort().join('，');
                console.log(this.selectGood)
            },
            specItemClick(valueList, key) {
                if (!valueList[key].store) return
                valueList.forEach((item, index) => {
                    const temp = item
                    let status = false
                    if (key === index && temp.store) {
                        status = true
                        // console.log('点击了', temp.specValue.trim())
                    }
                    // 针对mpvue class绑定有稳定的hack，保证class变化的时候一定重新渲染模板
                    temp.specValue = temp.specValue.trim()
                    temp.specValue = `${temp.specValue} `
                    // 设置其他规格值为 非选中状态
                    temp.active = status;
                })
                this.handleSelectGood();
                this.initCount = 1;
            },
            submitSKU() {
                const param = {}
                this.$post('addCart', param).then((data) => {
                    console.log('加入购物车接口----', data);
                    this.$emit('add', this.selectGood.text, this.initCount);
                    this.hidePanel()
                    wx.showToast({
                        title: '加入购物车成功',
                        icon: 'none',
                    });
                });
            },
        },
    };
</script>

<style lang="scss" scoped>
    $green: #77BA2C;
    .sku-panel{
        .sku-panel-content{
            position: fixed;
            bottom: 0;
            left: 0;
            z-index: 20;
            width: 100%;
            padding-bottom: 49px;
            background: #fff;
            .close{
                position: absolute;
                top: 15px;
                right: 15px;
                width: 18px;
                height: 18px;
                padding: 5px;
            }
            .sku-head{
                display: flex;
                position: relative;
                padding: 16px 0;
                margin: 0 15px;
                border-bottom: 1px solid #E5E5E5;
                .img{
                    width: 80px;
                    height: 80px; 
                }
                .sm-img{
                    width: 100%;
                    height: 100%;
                }
                .info{
                    padding-top: 16px;
                    margin-left: 16px;
                    .price{
                        font-size: 24px;
                        color: #FF6500;
                        line-height: 32px;
                    }
                    .select{
                        font-size: 14px;
                        color: #333;
                        line-height: 22px;
                    }
                }
            }
            .sku-content{
                overflow-y: scroll;
                height: 291px;
                padding: 15px;
                box-sizing: border-box;
                .sku-item{
                    padding-bottom: 10px;
                    .list{
                        display: flex;
                    }
                    .item{
                        padding: 5px 15px;
                        border: 1px solid #bbb;
                        border-radius: 4px;
                        font-size: 14px;
                        color: #333;
                        text-align: center;
                        line-height: 20px; 
                        margin: 0 10px 10px 0;
                        cursor: pointer;
                        &.active{
                            border-color: $green;
                            color: $green;
                        }
                        &.lose{
                            color: #ccc;
                            border: none;
                            background: #E5E5E5;
                        }
                    }
                }
                .name{
                    font-size: 12px;
                    color: #959595;
                    line-height: 20px;
                    margin-bottom: 5px;
                }
                // .counter{
                //     display: flex;
                //     width: 138px;
                //     box-sizing: border-box;
                //     height: 30px;
                //     line-height: 30px;
                //     border: 1px solid #bbb;
                //     border-radius: 4px;
                //     font-size: 14px;
                //     color: #333;
                //     .cut,.add{
                //         width: 36px;
                //         flex: 0 0 36px;
                //         text-align: center;
                //         font-size: 22px;
                //     }
                //     .cut{
                //         border-right: 1px solid #bbb;
                //     }
                //     .add{
                //          border-left: 1px solid #bbb;
                //     }
                //     .input{
                //         flex: 1;
                //         text-align: center;
                //     }
                // }
            }
            .btn{
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 49px;
                line-height: 49px;
                text-align: center;
                background: $green;
                font-size: 17px;
                color: #fff;
            }
        }
        .mask{
            position: fixed;
            top: 0;
            left: 0;
            z-index: 10;
            width: 100%;
            height: 100%;
            background:rgba(0,0,0,.5);
        }
    }
</style>

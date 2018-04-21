<template>
    <view class="sku-panel">
        <div class="sku-panel-content" v-show="status">
            <div class="sku-head">
                <div class="img">
                    <image class="sm-img" src="http://res.neosjyx.com/resource/images/photo/7043/20180313/201803131732060.jpg"/>
                </div>
                <div class="info">
                    <div class="price">￥16.9</div>
                    <div class="select">已选：200g，热带水果味</div>
                </div>
            </div> 
            <div class="sku-content">
                <ul class="sku-ul">
                    <li class="sku-item" v-for="(specItem, specIndex) in specList" :key="specIndex">
                        <div class="name">{{specItem.specName}}</div>
                        <div class="list">
                            <template v-for="(valueItem, valueIndex) in specItem.valueList" >
                                <div class="item lose"
                                    v-if="totalSkuNum(valueItem.specValue)"
                                    :key="valueIndex"
                                >
                                    {{valueItem.specValue}}
                                </div>
                                <div class="item"
                                    v-else
                                    :key="valueIndex"
                                >
                                    {{totalSkuNum(valueItem.specValue)}}
                                    {{valueItem.specValue}}
                                </div>
                            </template>
                            <!-- <div class="item">16支装</div>
                            <div class="item lose">32支装</div> -->
                        </div>
                    </li>
                </ul>
                <div class="counter-content">
                    <div class="name">数量</div>
                    <div class="counter">
                        <cartcontrol></cartcontrol>
                    </div>
                </div>
            </div>
            <div class="btn">确认</div>
            <image class="close" src="/static/img/detail/close@3x.png" @click="hidePanel"/>
        </div>
        <div class="mask" @click="hidePanel" v-show="status"></div>
    </view>
</template>
<script>
    import cartcontrol from '@/components/cartcontrol';
    import SKU from '../utils/SKU';

    export default {
        props: {
            value: {
                type: Boolean,
                default: false,
            },
            skuList: {
                type: Array,
                default() {
                    return [
                        {
                            sellingPrice: '',
                            specImage: '',
                            specList: [],
                            quantity: '',
                            skuId: '',
                        },
                    ]
                },
            },
            specList: {
                type: Array,
                default() {
                    return [
                        {
                            specName: '',
                            valueList: [],
                        },
                    ]
                },
            },
        },
        data() {
            return {
                status: this.value,
                skuStoreObj: {},
                specStoreArr: [],
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
        methods: {
            hidePanel() {
                this.status = false
                // 关闭后的回调
                this.$emit('close');
            },
            totalSkuNum(value) { // 比如value = 红
                console.log('value', value)
                const skuArr = [];
                this.skuList.forEach((skuItem) => {
                    skuItem.specList.forEach((specItem) => {
                        if (specItem.specValue === value) {
                            skuArr.push(skuItem);
                        }
                    });
                });

                // skuArr  [{红a}, {红b}, {红c}]
                let specItemTotoal = 0;
                skuArr.forEach((item) => {
                    specItemTotoal = item.quantity + specItemTotoal;
                });
                // console.log('每个spec的库存总量', specItemTotoal);

                // const result = specItemTotoal === 0 ? 'lose' : '';
                // console.log('result', result)
                return 'lose';
            },
            handleSKU() {
                const oldSkuList = this.skuList;

                const newSkuList = oldSkuList.map(item => ({
                    key: item.skuDesc.split(',').sort().join(','),
                    value: {
                        store: item.quantity,
                        price: item.sellingPrice,
                        productId: item.skuId,
                        skuImage: item.skuImage,
                    },
                }));
                const skuObj = SKU.allSkuValue(newSkuList, 'store');
                // 组装skuStoreObj ？?? todo
                this.skuStoreObj = skuObj;
                console.log('this.skuStoreObj---', this.skuStoreObj);
            },
            handleSpec() {
                const oldSpecList = this.specList;
                const newSpecList = oldSpecList.map(item => {
                    // if (this.skuStoreObj[item.specValue].store) {

                    // }
                    console.log('this.specStoreArr---', this.skuStoreObj['8只装'].store);
                    return {
                        ...item,
                        store: this.skuStoreObj[item.specValue] &&
                        this.skuStoreObj[item.specValue].store,
                    }
                });
                this.specStoreArr = newSpecList;

                // console.log('this.specStoreArr---', this.skuStoreObj['8只装'].store);
            },

        },
        mounted() {
            this.handleSKU();
            this.handleSpec();
        },
        computed: {
            calcSpecItemClass() {},
        },
        components: {
            cartcontrol,
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
            // height: 453px;
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

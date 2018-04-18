<template>
    <view class="sku-panel">
        <div class="sku-panel-content" v-show="!fold">
            <div class="sku-head">

            </div> 
            <image class="close" src="/static/img/detail/close@3x.png" @click="hidePanel"/>

        </div>
        <div class="mask" @click="hidePanel" v-show="!fold"></div>
    </view>
</template>
<script>
    export default {
        props: {
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
            fold: { // 规格面板弹是否折叠
                type: Boolean,
                default: true,
            },
        },
        data() {
            return {
            }
        },
        computed: {
        },
        methods: {
            hidePanel() {
                this.$emit('close');
            },
        },

    };
</script>

<style lang="scss" scoped>
    .sku-panel{
        .sku-panel-content{
            position: fixed;
            bottom: 0;
            left: 0;
            z-index: 20;
            width: 100%;
            height: 453px;
            background: #fff;
            .sku-head{
                position: relative;
                padding: 16px 0;
                margin: 0 15px;
                border-bottom: 1px solid #E5E5E5;
            }
            .close{
                position: absolute;
                top: 15px;
                right: 15px;
                width: 18px;
                height: 18px;
                padding: 5px;
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

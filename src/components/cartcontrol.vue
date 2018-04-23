<template>
    <div class="cartcontrol-content">
        <div class="cut" @click="decreaseCart" :class="{disabled: count === 1}">-</div>
        <input type="number" class="input" v-model.number="count" max="999" >
        <div class="add" :class="{'disabled': calcCount}" @click="addCart">+</div>
    </div>
</template>

<script>
    // 常量表示：允许最大输入值
    const MAX = 999;

    export default {
        props: {
            goodInfo: {
                type: Object,
                default: () => ({}),
            },
            initCount: {
                type: Number,
            },

        },
        data() {
            return {
                count: this.initCount || 1,
            }
        },
        watch: {
            count(val) {
                if (val <= 0) {
                    this.count = 1
                }
            },
        },
        methods: {
            decreaseCart() {
                if (this.count === 1) return
                this.count -= 1
            },
            addCart() {
                if (this.canAddCount) {
                    this.count += 1
                }
            },
        },
        computed: {
            canAddCount() {
                return (this.count < MAX) && (this.count < this.goodInfo.store) ? 'true' : false
            },
        },

    }
</script>
<style lang="scss" scoped>
    .cartcontrol-content{
        display: flex;
        width: 138px;
        box-sizing: border-box;
        height: 30px;
        // line-height: 30px;
        font-size: 14px;
        color: #333;
        .cut,.add{
            width: 36px;
            flex: 0 0 36px;
            text-align: center;
            font-size: 22px;
            &.disabled{
                color:#E5E5E5;
                background: #F1F1F1;
                border: 0 solid #e5e5e5;
                
            }
        }
        .cut{
            border-top: 1px solid #bbb;
            border-left: 1px solid #bbb;
            border-bottom: 1px solid #bbb;
            border-radius: 4px 0 0 4px;
        }
        .add{
            border-top: 1px solid #bbb;
            border-right: 1px solid #bbb;
            border-bottom: 1px solid #bbb;
            border-radius: 0 4px 4px 0;
        }
        .input{
            box-sizing: border-box;
            padding: 5px;
            height: 30px;
            line-height: 28px;
            flex: 1;
            text-align: center;
            border: 1px solid #bbb;
        }
    }
</style>

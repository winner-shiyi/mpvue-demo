<template>
    <div class="cartcontrol-content">
        <div class="cut" @click="editHandler(0)" :class="{disabled: isMin}">-</div>
        <input type="number" class="input" v-model.number="count" max="999" >
        <div class="add" :class="{disabled: isMax}" @click="editHandler(1)">+</div>
    </div>
</template>

<script>
    // 常量表示：允许最大输入值
    const DEFAULT_MAX = 999;
    // 默认最小数量
    const DEFAULT_NUM = 1;

    export default {
        props: {
            value: {
                type: Number,
                default: DEFAULT_NUM,
            },
            max: {
                type: Number,
                default: DEFAULT_MAX,
            },
        },
        data() {
            return {
                count: this.value,
            }
        },
        computed: {
            isMin() {
                return this.count <= DEFAULT_NUM
            },
            isMax() {
                return this.count >= this.max
            },
        },
        watch: {
            count(val) {
                if (val <= 0) {
                    this.count = DEFAULT_NUM
                }
                this.$emit('input', val)
            },
            value(val) {
                this.count = val
            },
        },
        methods: {
            /**
             * 加减点击操作
             * @param {Number} type - 1:加, 0: 减
             */
            editHandler(type) {
                if (type === 1 && this.count < this.max) {
                    this.count += 1
                }
                if (type === 0 && this.count > DEFAULT_NUM) {
                    this.count -= 1
                }
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

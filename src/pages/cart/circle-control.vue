<template>
    <view class="circle-control-content">
        <div class="cut" @click="editHandler(0)" :class="{disabled: disabled || isMin}">-</div>
        <input type="number" class="input" v-model.number="count" max="999" @blur="blur" :disabled="disabled">
        <div class="add" :class="{disabled: disabled || isMax}" @click="editHandler(1)">+</div>
    </view>
</template>
<script>
// 常量表示：允许最大输入值
const DEFAULT_MAX = 999;
// 默认最小数量
const DEFAULT_NUM = 1;
export default {
    name: 'circle-control',
    props: {
        value: {
            type: Number,
            default: DEFAULT_NUM,
        },
        max: {
            type: Number,
            default: DEFAULT_MAX,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        itemData: {
            type: Object,
            default: () => ({}),
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
            if (val === 0) {
                this.count = DEFAULT_NUM
            } else if (val > this.max) {
                this.count = this.max
                wx.showToast({
                    title: '商品缺货',
                    icon: 'none',
                });
            } else if (val > DEFAULT_MAX) {
                wx.showToast({
                    title: '一次最多添加999件',
                    icon: 'none',
                });
            }
            this.$emit('input', val)
            this.$emit('update', this.itemData)
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
            if (this.disabled) return
            if (type === 1 && this.count < this.max) {
                this.count += 1
            }
            if (type === 0 && this.count === DEFAULT_NUM) {
                wx.showModal({
                    title: '确认删除此商品',
                    confirmText: '删除',
                    success: (res) => {
                        if (res.confirm) {
                            this.$emit('delete', this.itemData)
                        }
                    },
                })
            }
            if (type === 0 && this.count > DEFAULT_NUM) {
                this.count -= 1
            }
        },
        blur() {
            if (!this.count || this.count < 0) {
                this.count = DEFAULT_NUM
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.circle-control-content{
    display: flex;
    color: #373C43;
    box-sizing: border-box;
    .cut,.add{
        width: 22px;
        height: 22px;
        line-height: 22px;
        border-radius: 50%;
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        background: #F3F4F5;
        &.disabled{
            color:#ccc;
        }
    }
    .input{
        font-size: 14px;
        width: 31px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        min-height: 22px;
        box-sizing: border-box;
        outline: none;
    }
}
</style>


<template>
    <div class="cartcontrol-content">
        <div class="cut">-</div>
        <input type="number" class="input" v-model="selectCount">
        <div class="add">+</div>
    </div>
</template>

<script>
    export default {
        props: {
            skuGood: {
                type: Object,
                default() {
                    return {};
                },
            },
        },
        data() {
            return {
                selectCount: 1,
            }
        },

    }
</script>
<style lang="scss" scoped>
.cartcontrol-content{
    display: flex;
    width: 138px;
    box-sizing: border-box;
    height: 30px;
    line-height: 30px;
    border: 1px solid #bbb;
    border-radius: 4px;
    font-size: 14px;
    color: #333;
    .cut,.add{
        width: 36px;
        flex: 0 0 36px;
        text-align: center;
        font-size: 22px;
    }
    .cut{
        border-right: 1px solid #bbb;
    }
    .add{
            border-left: 1px solid #bbb;
    }
    .input{
        flex: 1;
        text-align: center;
    }
}
</style>

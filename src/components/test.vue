<template>
    <div>
        <ul>
            <li
            v-for="(item, index) in aaa"
            @click="testFn(index)"
            :key="index">
              {{item.name}}
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'test',
    props: {
        list: {
            type: Array,
            deault: () => ([]),
        },
    },
    data() {
        return {
            aaa: this.list,
        }
    },
    methods: {
        testFn(index) {
            this.aaa.forEach((item, i) => {
                const temp = item
                if (i === index) {
                    temp.name = 'eeee'
                } else {
                    temp.name = '1111'
                }
            })
            console.log(this.aaa)
        },
    },
}
</script>
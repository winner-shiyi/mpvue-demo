<template>
  <div>
    <p class="card">
      {{text}}
    </p>
  </div>
</template>

<script>
export default {
    props: ['text'],
    onShow() {
        console.log('card----onShow');
    },
};
</script>

<style>
.card {
  padding: 10px;
}
</style>

<script>
export default {
  name: "Cell",
  props: {
    isDisabled: Boolean,
  },
};
</script>
<template>
  <button
    class="w-16 h-16 bg-gray-200 border border-gray-300"
    :class="{ disabled: isDisabled }"
    :disabled="isDisabled"
    @click="$emit('click')"
  ></button>
</template>

<style scoped>
.player1-cell {
  background-color: rgb(97, 214, 8);
}

.player2-cell {
  background-color: rgb(225, 58, 217);
}

.disabled {
  cursor: not-allowed;
}
</style>

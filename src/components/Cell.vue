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
    class="cell"
    :class="{ disabled: isDisabled }"
    :disabled="isDisabled"
    @click="$emit('click')"
  ></button>
</template>

<style scoped>
.player1-cell {
  background-color: blue;
  color: white;
}

.player2-cell {
  background-color: red;
  color: white;
}

.cell {
  width: 60px;
  height: 60px;
  font-size: 24px;
  border: 1px solid #000;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
}

.cell.disabled {
  cursor: not-allowed;
}
</style>

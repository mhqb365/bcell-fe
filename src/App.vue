<template>
  <div>
    <notifications />
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  async created() {
    this.getPermission()
  },
  methods: {
    ...mapActions(['getPermission'])
  }
}
</script>

<style lang="scss">
// Import Main styles for this application
@import 'styles/style';

.vue-notification {
  // styling
  margin: 0 5px 5px;
  padding: 10px;
  font-size: 16px;
  color: #ffffff;

  // default (blue)
  background: #44a4fc;
  border-left: 5px solid #187fe7;

  // types (green, amber, red)
  &.success {
    background: #68cd86;
    border-left-color: #42a85f;
  }

  &.warn {
    background: #ffb648;
    border-left-color: #f48a06;
  }

  &.error {
    background: #e54d42;
    border-left-color: #b82e24;
  }
}

.vue-pointer {
  cursor: pointer;
}

.custom-table,
.custom-table td {
  padding: 2px;
  border: 1px solid #ddd;
}
</style>

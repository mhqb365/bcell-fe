<template>
  <CListGroup>
    <CListGroupItem v-for=" log in logs">{{ log }}</CListGroupItem>
  </CListGroup>
</template>
<script>
export default {
  props: {
    logs: Array
  },
}
</script>
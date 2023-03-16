<template>
  <CHeader position="sticky">
    <CContainer fluid>
      <CHeaderToggler class="ps-1" @click="$store.commit('toggleSidebar')">
        <CIcon icon="cil-menu" size="lg" />
      </CHeaderToggler>
      <CHeaderBrand class="mx-auto d-lg-none" to="/">
        BCell
      </CHeaderBrand>
    </CContainer>
  </CHeader>
</template>

<script>
export default {

}
</script>

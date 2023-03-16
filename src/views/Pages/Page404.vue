<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="6">
          <h1>Lỗi 404 - không tìm thấy trang</h1>
          Tự quay về trang chủ sau {{ s }}s
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      s: 3,
    }
  },
  created() {
    setInterval(() => {
      if (this.s == 0) {
        window.location.href = '/'
      } else this.s--
    }, 1e3)
  },
}
</script>

<template>
  <div>
    <CFormInput v-model="provider.name" label="Tên nhà cung cấp" class="mb-2" />
    <CFormInput type="number" v-model="provider.phoneNumber" label="Số điện thoại" class="mb-2" />
    <CFormInput type="email" v-model="provider.email" label="Email" class="mb-2" />
    <CFormInput v-model="provider.companyAddress" label="Địa chỉ công ty" class="mb-2" />
    <CFormInput type="number" v-model="provider.taxNumber" label="Mã số thuế" class="mb-2" />
    <CButton color="primary" @click="createProvider" :disabled="isLoading">Lưu</CButton>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      isLoading: false,
      provider: {
        phoneNumber: '',
        name: '',
        email: '',
        companyAddress: '',
        taxNumber: ''
      }
    }
  },
  methods: {
    async createProvider() {
      try {
        if (!this.provider.name) return this.$notify({
          text: 'Điền tên nhà cung cấp vào',
          type: 'error'
        })
        this.isLoading = true
        const { data } = await axios.post('/product/provider', {
          provider: { ...this.provider }
        })
        console.log(data)
        this.isLoading = false
        this.$notify({
          text: 'Đã thêm nhà cung cấp mới'
        })
      }
      catch (error) {
        console.error(error)
        this.isLoading = false
        this.$notify({
          text: error.response.data.message,
          type: 'error'
        })
      }
    }
  }
}
</script>
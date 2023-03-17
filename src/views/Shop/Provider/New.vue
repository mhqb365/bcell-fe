<template>
  <div class="small">
    <CRow class="justify-content-md-center">
      <CCol :md="6" :sm="12">
        <CCard class="mb-3">
          <CCardBody>
            <CFormInput v-model="provider.name" label="Tên nhà cung cấp" class="mb-2" />
            <label>Số điện thoại</label>
            <CInputGroup class="mb-2">
              <CFormInput type="number" v-model="provider.phoneNumber" />
              <CButton color="secondary" @click="() => { name = '', phoneNumber = '' }">
                <CIcon name="cil-backspace" />
              </CButton>
            </CInputGroup>
            <CFormInput v-model="provider.email" label="Email" class="mb-2" />
            <CFormInput v-model="provider.company" label="Tên công ty" class="mb-2" />
            <CFormInput v-model="provider.companyAddress" label="Địa chỉ công ty" class="mb-2" />
            <CFormInput v-model="provider.taxNumber" label="Mã số thuế" class="mb-2" />
            <CButton color="primary" @click="createProvider">Lưu</CButton>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      provider: {
        phoneNumber: '',
        name: '',
        email: '',
        company: '',
        companyAddress: '',
        taxNumber: ''
      }
    }
  },
  methods: {
    async createProvider() {
      try {
        const { data } = await axios.post('/product/provider', {
          provider: { ...this.provider }
        });
        console.log(data)
      }
      catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
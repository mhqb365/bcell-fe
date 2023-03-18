<template>
  <div class="small">
    <CCard v-if="visibleEditProvider" class="mb-3">
      <CCardBody>
        <CFormInput v-model="docForEdit.name" label="Tên nhà cung cấp" class="mb-2" />
        <CFormInput type="number" v-model="docForEdit.phoneNumber" label="Số điện thoại" class="mb-2" />
        <CFormInput type="email" v-model="docForEdit.email" label="Email" class="mb-2" />
        <CFormInput v-model="docForEdit.company" label="Tên công ty" class="mb-2" />
        <CFormInput v-model="docForEdit.companyAddress" label="Địa chỉ công ty" class="mb-2" />
        <CFormInput type="number" v-model="docForEdit.taxNumber" label="Mã số thuế" class="mb-2" />
        <CButton color="primary" @click="updateProvider" :disabled="updateProviderLoading" class="mx-2">Lưu</CButton>
        <CButton color="danger" class="mx-2 text-white" @click="() => { docForEdit = null, visibleEditProvider = false }">
          Hủy
        </CButton>
      </CCardBody>
    </CCard>

    <CRow v-else>
      <CCol :md="12">
        <CCard class="mb-3">
          <CCardBody>
            <CButton color="success" @click="() => { visibleCreateProvider = true }" class="text-white mb-2">
              + Thêm mới
            </CButton>

            <CTable striped bordered responsive class="m-0">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Tên</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Số điện thoại</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Mã số thuế</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Địa chỉ</CTableHeaderCell>
                  <CTableHeaderCell scope="col"></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="doc in docs">
                  <CTableDataCell>
                    {{ doc.name }}
                  </CTableDataCell>
                  <CTableDataCell>
                    {{ doc.phoneNumber }}
                  </CTableDataCell>
                  <CTableDataCell>
                    {{ doc.email }}
                  </CTableDataCell>
                  <CTableDataCell>
                    {{ doc.taxNumber }}
                  </CTableDataCell>
                  <CTableDataCell>
                    {{ doc.companyAddress }}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="warning" @click="() => { docForEdit = doc, visibleEditProvider = true }" size="sm"
                      class="text-white">
                      <CIcon name="cil-pencil" />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <CModal alignment="center" :visible="visibleCreateProvider" @close="() => { visibleCreateProvider = false }">
      <CModalHeader>
        <CModalTitle>Thêm nhà cung cấp mới</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormInput v-model="provider.name" label="Tên nhà cung cấp" class="mb-2" />
        <CFormInput type="number" v-model="provider.phoneNumber" label="Số điện thoại" class="mb-2" />
        <CFormInput type="email" v-model="provider.email" label="Email" class="mb-2" />
        <CFormInput v-model="provider.companyAddress" label="Địa chỉ công ty" class="mb-2" />
        <CFormInput type="number" v-model="provider.taxNumber" label="Mã số thuế" class="mb-2" />
        <CButton color="primary" @click="createProvider" :disabled="createProviderLoading">Lưu</CButton>
      </CModalBody>
    </CModal>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      docs: [],
      totalDocs: 0,
      totalPages: null,
      prevPage: null,
      page: 1,
      nextPage: null,
      visibleCreateProvider: false,
      visibleEditProvider: false,
      docForEdit: {},
      createProviderLoading: false,
      updateProviderLoading: false,
      provider: {
        phoneNumber: '',
        name: '',
        email: '',
        companyAddress: '',
        taxNumber: ''
      }
    }
  },
  created() {
    this.getProvider()
  },
  methods: {
    async getProvider() {
      try {
        const { data } = await axios.get('/product/provider');
        console.log(data)
        this.docs = data
      }
      catch (error) {
        console.error(error)
      }
    },
    async createProvider() {
      try {
        if (!this.provider.name) return this.$notify({
          text: 'Điền tên nhà cung cấp vào',
          type: 'error'
        })
        this.createProviderLoading = true
        const { data } = await axios.post('/product/provider', {
          provider: { ...this.provider }
        })
        console.log(data)
        this.visibleCreateProvider = false
        this.createProviderLoading = false
        this.getProvider()
        this.$notify({
          text: 'Đã thêm nhà cung cấp mới'
        })
      }
      catch (error) {
        console.error(error)
        this.createProviderLoading = false
        this.$notify({
          text: error.response.data.message,
          type: 'error'
        })
      }
    },
    async updateProvider() {
      try {
        this.updateProviderLoading = true
        const { data } = await axios.put('/product/provider/' + this.docForEdit._id, {
          provider: { ...this.docForEdit }
        })
        console.log(data)
        this.visibleEditProvider = false
        this.updateProviderLoading = false
      }
      catch (error) {
        console.error(error)
        this.updateProviderLoading = false
      }
    }
  }
}
</script>
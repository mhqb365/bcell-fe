<template>
  <div class="small">
    <CCard v-if="visibleEdit">
      <CCardBody>
        <CFormInput v-model="docForEdit.fullname" label="Tên đầy đủ *" class="mb-2" />
        <CFormInput v-model="docForEdit.username" label="Tên đăng nhập *" class="mb-2" />
        <CFormInput v-model="docForEdit.password" label="Mật khẩu *" class="mb-2" />
        <CButton color="primary" class="mx-2" @click="updateMember" :disabled="updateLoading">
          Lưu
        </CButton>
        <CButton color="danger" class="mx-2 text-white" @click="() => { docForEdit = null, visibleEdit = false }">
          Hủy
        </CButton>
      </CCardBody>
    </CCard>

    <CCard v-else>
      <CCardBody>
        <!-- <CCard>
          <CCardBody>
            <h4>Thêm thành viên mới</h4>
            <CForm @submit="createNewUser">
              <CFormSelect v-model="store" :options="stores" :disabled="storeLoading" class="mb-2" />
              <CFormInput v-model="username" label="Tên đăng nhập *" class="mb-2" />
              <CFormInput v-model="password" label="Mật khẩu *" class="mb-2" />
              <CFormInput v-model="fullname" label="Tên đầy đủ *" class="mb-2" />
              <CFormSelect v-model="permission" :options="permissions" label="Phân quyền" />
              <CButton type="submit" :disabled="createUserLoading" color="primary" @click="createNewUser" class="mt-3">
                Thêm
              </CButton>
            </CForm>
          </CCardBody>
        </CCard> -->

        <div class="mb-2">
          * Cơ bản: chỉ được xem phiếu tại chi nhánh<br />
          * Quản trị cấp 1: thêm, sửa, xem phiếu tại chi nhánh; xem tất cả phiếu; xem thành viên<br />
          * Quản trị cấp 2: ∞
        </div>

        <h4>Danh sách thành viên</h4>
        <CTable striped bordered responsive class="m-0">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Chi nhánh</CTableHeaderCell>
              <CTableHeaderCell scope="col">Tên đầy đủ</CTableHeaderCell>
              <CTableHeaderCell scope="col">Tên đăng nhập</CTableHeaderCell>
              <CTableHeaderCell scope="col">Phân quyền</CTableHeaderCell>
              <CTableHeaderCell scope="col"></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow v-for="doc in docs">
              <CTableDataCell>
                {{ doc.store.name }}
              </CTableDataCell>
              <CTableDataCell>
                {{ doc.fullname }}
              </CTableDataCell>
              <CTableDataCell>
                {{ doc.username }}
              </CTableDataCell>
              <CTableDataCell>
                {{ getPermission(doc.permission) }}
              </CTableDataCell>
              <CTableDataCell>
                <CButton color="warning" @click="() => { docForEdit = doc, visibleEdit = true }" size="sm"
                  class="text-white">
                  <CIcon name="cil-pencil" />
                </CButton>
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      stores: [{ label: 'Chọn chi nhánh làm việc *', disabled: true }],
      storeLoading: false,
      memberLoading: false,
      store: 'Chọn chi nhánh làm việc *',
      username: '',
      password: '',
      fullname: '',
      permissions: [{ label: 'Cơ bản', value: '0' }, { label: 'Quản trị cấp 1', value: '1' }, { label: 'Quản trị cấp 2', value: '2' }],
      permission: '0',
      createUserLoading: false,
      docs: [],
      docForEdit: null,
      visibleEdit: false,
      updateLoading: false
    }
  },
  created() {
    this.store !== null ? (this.getMembers()) : this.$notify({ text: 'Đăng nhập để sử dụng', type: 'error' })
  },
  methods: {
    getPermission(p) {
      if (p == 0) return 'Cơ bản'
      if (p == 1) return 'Quản trị cấp 1'
      if (p == 2) return 'Quản trị cấp 2'
    },
    async getStore() {
      try {
        this.storeLoading = true
        const { data } = await axios.get('/store')
        // console.log(data)
        this.storeLoading = false
        data.map(item => {
          this.stores.push({
            label: item.name,
            value: item._id
          })
        })
      }
      catch (error) {
        // console.error(error)
        this.storeLoading = false
        this.$notify({
          text: error.response.data.message,
          type: 'error'
        })
      }
    },
    async getMembers() {
      try {
        this.memberLoading = true
        const { data } = await axios.get('/member')
        // console.log(data)
        let members = []
        for (const index in data) {
          // console.log(data[index])
          if (data[index].username !== 'default-1' && data[index].username !== 'default-2') members.push(data[index])
        }
        // console.log(this.docs)
        this.docs = members
        this.memberLoading = false
      }
      catch (error) {
        // console.error(error)
        this.memberLoading = false
        this.$notify({
          text: error.response.data.message,
          type: 'error'
        })
      }
    },
    async createNewUser(e) {
      try {
        e.preventDefault()
        if (this.store === 'Chọn chi nhánh làm việc *' || !this.username || !this.password || !this.fullname) return this.$notify({
          text: 'Nhập đầy đủ các ô có dấu *',
          type: 'error'
        });
        this.createUserLoading = true
        const { data } = await axios.post('/member/create', {
          username: this.username,
          password: this.password,
          fullname: this.fullname,
          store: this.store,
          permission: this.permission
        })
        // console.log(data)
        this.createUserLoading = false
        this.getMembers()
        this.$notify({
          text: data,
        });
      }
      catch (error) {
        // console.error(error)
        this.createUserLoading = false
        this.$notify({
          text: error.response.data.message,
          type: 'error'
        });
      }
    },
    async updateMember() {
      try {
        this.updateLoading = true
        const { data } = await axios.put('/member/' + this.docForEdit._id, {
          username: this.docForEdit.username,
          password: this.docForEdit.password,
          fullname: this.docForEdit.fullname
        })
        // console.log(data)
        this.updateLoading = false
        this.getMembers()
        this.$notify({
          text: data,
        });
      } catch (error) {
        // console.error(error)
        this.updateLoading = false
        this.$notify({
          text: error.response.data.message,
          type: 'error'
        });
      }
    }
  },
}
</script>
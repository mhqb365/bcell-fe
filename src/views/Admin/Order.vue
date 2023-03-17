<template>
  <div class="small">
    <CRow>
      <CCol :md="12">
        <CCard>
          <CCardBody>
            <CRow class="mb-2">
              <CCol :md="3">
                <CForm @submit="findOrder">
                  <label>Tên hoặc số điện thoại cần tìm</label>
                  <CInputGroup>
                    <CFormInput type="number" v-model="filterKeyword" />
                    <CButton color="secondary" @click="() => { filterKeyword = '', findOrder(null, 1) }">
                      <CIcon name="cil-backspace" />
                    </CButton>
                  </CInputGroup>
                </CForm>
              </CCol>
              <CCol :md="2">
                <label>Chi nhánh</label>
                <CFormSelect v-model="storeFilter" :options="stores" class="mb-2" />
              </CCol>
              <CCol :md="2">
                <label>Trạng thái</label>
                <CFormSelect v-model="stateFilter"
                  :options="['Đang xử lý', 'Đã giao', 'Tất cả', 'Sửa được', 'Không sửa được']" class="mb-2" />
              </CCol>
              <CCol :md="3">
                <label>Khoảng thời gian</label>
                <VueDatePicker v-model="dateFilter" range locale="vi" cancel-text="Hủy" select-text="Chọn"
                  :day-names="['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']" size="sm" class="p-0" />
              </CCol>
              <CCol :md="2" class="pt-1">
                <CButton color="primary" :disabled="orderLoading" @click="findOrder(null, 1)" class="mt-3 w-100">
                  <CIcon name="cil-sync" />
                  Lọc kết quả
                </CButton>
              </CCol>
            </CRow>

            <nav v-if="totalPages > 1">
              <ul class="pagination">
                <li v-if="prevPage" class="page-item vue-pointer">
                  <a class="page-link button" @click="findOrder(null, prevPage)">
                    Trang trước
                  </a>
                </li>
                <li class="page-item active">
                  <a class="page-link button">
                    {{ page }}{{ totalPages ? '/' + totalPages : '' }}
                  </a>
                </li>
                <li v-if="nextPage" class="page-item vue-pointer">
                  <a class="page-link button" @click="findOrder(null, nextPage)">
                    Trang sau
                  </a>
                </li>
              </ul>
            </nav>

            <CRow class="mb-2">
              <CCol :md="6">
                Có <strong>{{ totalDocs }}</strong> máy
              </CCol>
            </CRow>

            <CTable striped bordered responsive class="m-0">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Chi nhánh</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Khách hàng</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Thiết bị</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Người xử lý</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Thời gian xử lý</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Ngày nhận</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Ngày giao</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Thanh toán</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Trạng thái</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="doc in docs">
                  <CTableDataCell>
                    {{ doc.store.name }}
                  </CTableDataCell>
                  <CTableDataCell>
                    {{ doc.name }} <br /> {{ doc.phoneNumber }}
                  </CTableDataCell>
                  <CTableDataCell width="35%" class="p-1">
                    <CRow :xs="{ gutter: 0 }">
                      <CCol sm="6" md="8">
                        Model máy: {{ doc.model }}<br />
                        SN/ST: {{ doc.serialNumber }}
                      </CCol>
                      <CCol xs="6" md="4">
                        Số phiếu: {{ doc.ticketNumber }}<br />
                        Yêu cầu: <CBadge :color="getColorType(doc.type)">{{ doc.type }}</CBadge>
                      </CCol>
                    </CRow>
                    <div>
                      Mô tả: {{ doc.description }}
                    </div>
                    <div>
                      Chi phí: {{ Number(doc.cost).toLocaleString('vi-VN') }}
                    </div>
                    <table style="width:100%" class="custom-table">
                      <tr v-for="problem in doc.problems">
                        <td class="px-2" style="width: 60%">{{ problem.name }}</td>
                        <td class="px-2" style="width: 20%;">{{ Number(problem.cost).toLocaleString('vi-VN') }}</td>
                        <td class="px-2">BH{{ problem.warranty ? problem.warranty : 0 }}T</td>
                      </tr>
                    </table>
                    <div>
                      <CBadge color="info" @click="() => { docForEdit = doc, visibleConfiguration = true }"
                        class="mx-2 vue-pointer">
                        Cấu hình
                      </CBadge>
                      <CBadge color="info" @click="() => { docForEdit = doc, visibleLogs = true }"
                        class="mx-2 vue-pointer">
                        Lịch sử thay đổi
                      </CBadge>
                      <CBadge color="info" @click="() => { docForEdit = doc, visiblePrint = true }"
                        class="mx-2 vue-pointer">
                        In phiếu
                      </CBadge>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    {{ doc.handler.fullname }}
                  </CTableDataCell>
                  <CTableDataCell>
                    {{ doc.time }}
                  </CTableDataCell>
                  <CTableDataCell>
                    {{ $options.moment(doc.createdAt).format('DD/MM/YYYY HH:mm') }}<br />
                    {{ doc.reciever.fullname }}
                  </CTableDataCell>
                  <CTableDataCell>
                    <span v-if="doc.returnedAt">
                      {{ $options.moment(doc.returnedAt).format('DD/MM/YYYY HH:mm') }}<br />
                      {{ doc.giver ? doc.giver.fullname : '' }}
                    </span>
                    <span v-else>Chưa giao</span>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div class="mb-1">
                      {{ Number(doc.payment.amount).toLocaleString('vi-VN') }}<br />
                      {{ doc.payment.method }}
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton :color="getStateColor(doc.state)" size="sm" class="text-white">
                      {{ doc.state }}
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <CModal alignment="center" :visible="visibleConfiguration" @close="() => { visibleConfiguration = false }">
      <CModalHeader>
        <CModalTitle>Cấu hình & phụ kiện</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <ConfigAccess :configuration="docForEdit.configuration" :accessory="docForEdit.accessory" />
      </CModalBody>
    </CModal>

    <CModal alignment="center" size="lg" :scrollable="true" :visible="visibleLogs" @close="() => { visibleLogs = false }">
      <CModalHeader>
        <CModalTitle>Lịch sử thay đổi</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <Log :logs="docForEdit.logs" />
      </CModalBody>
    </CModal>

    <CModal alignment="center" size="lg" :scrollable="true" :visible="visiblePrint"
      @close="() => { visiblePrint = false }">
      <CModalHeader>
        <CModalTitle>In phiếu nhận</CModalTitle>
      </CModalHeader>
      <CModalBody id="printPage">
        <PrintPage :printInfo="docForEdit" :address="docForEdit.store.address" />
      </CModalBody>
      <CModalFooter>
        <CButton v-print="printObject" color="primary">IN PHIẾU</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import ConfigAccess from '@/components/Order/ConfigAccessModal.vue';
import Log from '@/components/Order/Log.vue';
import PrintPage from '@/components/Order/PrintPage.vue';

export default {
  moment,
  components: { VueDatePicker, ConfigAccess, Log, PrintPage },
  data() {
    return {
      filterKeyword: '',
      storeFilter: 'Tất cả',
      stateFilter: 'Tất cả',
      dateFilter: null,
      filterFrom: null,
      filterTo: null,
      orderLoading: true,
      updateOrderLoading: false,
      docs: [],
      totalDocs: 0,
      prevPage: null,
      page: 1,
      totalPages: null,
      nextPage: null,
      docForEdit: {},
      visibleConfiguration: false,
      visibleLogs: false,
      visiblePrint: false,
      visibleUpdateOrder: false,
      handlers: [],
      types: ['Sửa chữa', 'Bảo hành', 'Hỗ trợ'],
      times: ['Trong ngày', '2-3 ngày', '3-5 ngày', 'Hơn 5 ngày'],
      states: ['Mới nhận', 'Đang xử lý', 'Chờ linh kiện', 'Hoàn thành', 'Không sửa được', 'Chưa gọi được khách', 'Chờ khách báo lại', 'Chờ khách lấy', 'Đã giao', 'Hủy bỏ'],
      printObject: {
        id: 'printPage',
        popTitle: '',
      },
      stores: ['Tất cả']
    };
  },
  async created() {
    window.localStorage.getItem('token') ? this.findOrder(null, 1) : this.$notify({ text: 'Đăng nhập để sử dụng', type: 'error' })
    this.getStore()
  },
  methods: {
    getColorType(type) {
      if (type === 'Sửa chữa') return 'success'
      if (type === 'Bảo hành') return 'danger'
      if (type === 'Hỗ trợ') return 'warning'
    },
    getStateColor(state) {
      if (state === 'Mới nhận' || state === 'Đang xử lý')
        return 'primary'
      if (state === 'Chờ linh kiện' || state === 'Chưa gọi được khách' || state === 'Chờ khách báo lại')
        return 'warning'
      if (state === 'Hoàn thành' || state === 'Chờ khách lấy')
        return 'info'
      if (state === 'Không sửa được' || state === 'Hủy bỏ')
        return 'danger'
      if (state === 'Đã giao')
        return 'success'
    },
    async getStore() {
      try {
        const { data } = await axios.get('/store')
        // console.log(data)
        let arr = []
        for (const index in data) {
          // console.log(data[index])
          arr.push({
            label: data[index].name,
            value: data[index]._id,
          })
        }
        // console.log(arr)
        this.stores = this.stores.concat(arr)
      }
      catch (error) {
        // console.error(error)
        this.$notify({
          text: error.response.data.message,
          type: 'error'
        })
      }
    },
    async findOrder(e, page) {
      try {
        // console.log(e, page)
        if (e) e.preventDefault()
        this.orderLoading = true
        // console.log(this.stateFilter)
        const from = this.dateFilter ? this.dateFilter[0] : null
        const to = this.dateFilter ? this.dateFilter[1] : null
        const { data } = await axios.get('/order/page/' + page + '?store=' + this.storeFilter + '&state=' + this.stateFilter + '&from=' + from + '&to=' + to + '&keyword=' + this.filterKeyword)
        // console.log(data)
        this.docs = data.docs
        this.totalDocs = data.totalDocs
        this.totalPages = data.totalPages
        this.nextPage = data.nextPage
        this.page = data.page
        this.prevPage = data.prevPage
        this.orderLoading = false
      }
      catch (error) {
        console.error(error)
        this.orderLoading = false
        this.$notify({
          text: error.response.data.message,
          type: 'error'
        })
      }
    },
    async findUserByPhoneNumber(e) {
      try {
        e.preventDefault()
        if (!this.docForEdit.phoneNumber) return this.$notify({
          text: 'Nhập số điện thoại vào mới tìm được chớ',
          type: 'error'
        })
        const { data } = await axios.get('/user?phoneNumber=' + this.docForEdit.phoneNumber)
        // console.log(data)
        if (!data) return this.$notify({
          text: 'Khách hàng chưa có trong hệ thống, nhập phiếu mới vào hệ thống sẽ tự lưu thông tin khách hàng',
          type: 'warn'
        })
        this.docForEdit.name = data.name
      } catch (error) {
        // console.log(error)
      }
    },
    async updateOrder() {
      try {
        this.updateOrderLoading = true
        const newCost = { cost: this.cost }
        const { data } = await axios.put('/order/update/' + this.docForEdit._id, {
          order: { ...this.docForEdit, ...newCost }
        })
        // console.log(data)
        this.updateOrderLoading = false
        this.$notify({
          text: data
        })
        this.findOrder(null, this.page)
        this.visibleUpdateOrder = false
      } catch (error) {
        // console.error(error)
        this.updateOrderLoading = false
        if (error.response)
          this.$notify({
            text: error.response.data.message,
            type: 'error'
          })
      }
    }
  }
}
</script>
<template>
  <CRow>
    <CCol :md="3">
      <CForm @submit="findUserByPhoneNumber">
        <label class="mb-2">Số điện thoại</label>
        <CInputGroup class="mb-2">
          <CFormInput type="number" v-model="user.phoneNumber" />
          <CButton color="secondary" @click="() => { user.name = '', user.phoneNumber = '' }">
            <CIcon name="cil-backspace" />
          </CButton>
        </CInputGroup>
      </CForm>
      <CFormInput v-model="user.name" label="Tên khách hàng *" class="mb-2" />
      <div class="mb-2">
        <label class="mb-2">Ngày nhận</label>
        <VueDatePicker v-model="order.createdAt" locale="vi" cancel-text="Hủy" select-text="Chọn"
          :day-names="['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']"></VueDatePicker>
      </div>
      <CFormSelect label="Thời gian" v-model="order.time" :options="times" class="mb-2" />
      <label class="mb-2">Báo giá</label>
      <h3 class="mb-2 mt-1">{{ Number(cost).toLocaleString('vi-VN') }}</h3>
    </CCol>

    <CCol :md="4">
      <CFormInput label="Số phiếu" v-model="order.ticketNumber" class="mb-2" />
      <CFormInput label="Model máy *" v-model="order.model" class="mb-2" />
      <CFormInput label="Serial number/Service tag" v-model="order.serialNumber" class="mb-2" />
      <div class="mb-2">
        <label class="mb-2">Cấu hình máy</label>
        <CRow>
          <CCol :md="6">
            <CInputGroup size="sm" class="mb-1">
              <CInputGroupText>CPU</CInputGroupText>
              <CFormInput v-model="order.configuration.cpu" />
            </CInputGroup>
          </CCol>
          <CCol :md="6">
            <CInputGroup size="sm" class="mb-1">
              <CInputGroupText>RAM</CInputGroupText>
              <CFormInput v-model="order.configuration.ram" />
            </CInputGroup>
          </CCol>
          <CCol :md="6">
            <CInputGroup size="sm" class="mb-1">
              <CInputGroupText>Ổ cứng</CInputGroupText>
              <CFormInput v-model="order.configuration.harddrive" />
            </CInputGroup>
          </CCol>
          <CCol :md="6">
            <CInputGroup size="sm">
              <CInputGroupText>Khác</CInputGroupText>
              <CFormInput v-model="order.configuration.other" />
            </CInputGroup>
          </CCol>
        </CRow>
      </div>

      <div class="mb-2">
        <label class="mb-2">Phụ kiện</label>
        <CRow class="mb-2">
          <CCol :md="6">
            <CInputGroup size="sm" class="mb-1">
              <CInputGroupText>Pin</CInputGroupText>
              <CFormInput v-model="order.accessory.battery" />
            </CInputGroup>
          </CCol>
          <CCol :md="6">
            <CInputGroup size="sm" class="mb-1">
              <CInputGroupText>Sạc</CInputGroupText>
              <CFormInput v-model="order.accessory.adapter" />
            </CInputGroup>
          </CCol>
          <CCol :md="6">
            <CInputGroup size="sm" class="mb-1">
              <CInputGroupText>Túi</CInputGroupText>
              <CFormInput v-model="order.accessory.bag" />
            </CInputGroup>
          </CCol>
          <CCol :md="6">
            <CInputGroup size="sm">
              <CInputGroupText>Khác</CInputGroupText>
              <CFormInput v-model="order.accessory.other" />
            </CInputGroup>
          </CCol>
        </CRow>
      </div>
    </CCol>

    <CCol :md="5">
      <CFormSelect label="Yêu cầu" v-model="order.type" :options="types" class="mb-2" />
      <CFormTextarea label="Tình trạng máy & ghi chú" v-model="order.description" rows="4" />
      <label class="mt-2 mb-2">Hướng sửa chữa | Chi phí | Thời gian bảo hành</label>
      <div v-for="[key, problem] in Object.entries(order.problems)" class="mb-1">
        <CInputGroup size="sm">
          <CFormInput v-model="problem.name" style="width: 40%" />
          <CFormInput v-model="problem.cost" style="width: 20%;" />
          <CFormInput v-model="problem.warranty" />
          <CButton color="secondary" class="text-white" @click="() => { order.problems.splice(key, 1) }">
            -
          </CButton>
        </CInputGroup>
      </div>
      <div class="mb-2">
        <CBadge color="secondary" @click="() => { order.problems.push({ name: '', cost: 0, warranty: 0 }) }"
          class="vue-pointer">
          + sửa chữa
        </CBadge>
      </div>
    </CCol>

    <CCol :md="12">
      <CButton color="primary" size="lg" @click="addNewOrder" :disabled="isDisabledButton">
        TẠO PHIẾU
      </CButton>
    </CCol>
  </CRow>


  <CModal alignment="center" size="lg" :scrollable="true" :visible="visiblePrint" @close="() => { visiblePrint = false }">
    <CModalHeader>
      <CModalTitle>In phiếu nhận</CModalTitle>
    </CModalHeader>
    <CModalBody id="printPage">
      <PrintPage :printInfo="newTicket" :address="storeAddress" />
    </CModalBody>
    <CModalFooter>
      <CButton v-print="printObject" color="primary">IN PHIẾU</CButton>
    </CModalFooter>
  </CModal>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import PrintPage from '@/components/Order/PrintPage.vue';

export default {
  moment,
  components: { VueDatePicker, PrintPage },
  computed: {
    cost() {
      let c = 0
      this.order.problems.map(item => c += Number(item.cost))
      return c
    }
  },
  data() {
    return {
      tabPaneActive: 1,
      visiblePrint: false,
      printObject: {
        id: "printPage",
        popTitle: '',
      },
      newTicket: null,
      store: localStorage.getItem('store'),
      storeAddress: null,
      reciever: localStorage.getItem('id'),
      isDisabledButton: false,
      types: ['Sửa chữa', 'Bảo hành', 'Hỗ trợ'],
      times: ['Trong ngày', '2-3 ngày', '3-5 ngày', 'Hơn 5 ngày'],
      user: {
        name: '',
        phoneNumber: '',
      },
      order: {
        ticketNumber: '',
        model: '',
        serialNumber: '',
        type: 'Sửa chữa',
        configuration: {
          cpu: '',
          ram: '',
          harddrive: '',
          other: ''
        },
        accessory: {
          battery: 'Có',
          adapter: 'Không',
          bag: 'Không',
          other: ''
        },
        description: '',
        problems: [
          {
            name: '',
            cost: 0,
            warranty: 0,
          }
        ],
        time: 'Trong ngày',
        state: 'Mới nhận',
        handler: '',
        payment: {
          method: '',
          amount: 0,
        },
        createdAt: Date.now()
      },
    };
  },
  async created() {
    this.store !== null ? (await this.findMember(), this.findStoreById()) : this.$notify({ text: 'Đăng nhập để sử dụng', type: 'error' })
    // document.addEventListener('visibilitychange', () => {
    //   if (!document.hidden) this.order.createdAt = Date.now()
    // });
  },
  methods: {
    async findMember() {
      try {
        this.isDisabledButton = true
        const { data } = await axios.get('/member/?store=' + this.store)
        // console.log(data)
        this.isDisabledButton = false
        for (const i in data) {
          // console.log(i)
          // console.log(data[i])
          if (data[i].fullname === 'Chưa gán') this.order.handler = data[i]._id
        }
      } catch (error) {
        // console.error(error)
        this.isDisabledButton = false
        this.$notify({
          text: error.response.data.message,
          type: 'error'
        })
      }
    },
    async findStoreById() {
      try {
        const { data } = await axios.get('/store/find/' + this.store)
        // console.log(data)
        this.storeAddress = data.address
      } catch (error) {
        // console.error(error)
        this.$notify({
          text: error.response.data.message,
          type: 'error'
        })
      }
    },
    async addNewOrder() {
      try {
        if (!this.user.name || !this.order.model) return this.$notify({
          text: 'Nhập đầy đủ các ô có dấu *',
          type: 'error'
        })
        this.isDisabledButton = true
        const payload = {
          ticketNumber: this.order.ticketNumber,
          name: this.user.name,
          phoneNumber: this.user.phoneNumber,
          model: this.order.model,
          serialNumber: this.order.serialNumber,
          type: this.order.type,
          configuration: this.order.configuration,
          accessory: this.order.accessory,
          description: this.order.description,
          problems: this.order.problems,
          cost: this.cost,
          time: this.order.time,
          state: this.order.state,
          store: this.store,
          reciever: this.reciever,
          handler: this.order.handler,
          payment: this.order.payment,
          createdAt: this.order.createdAt,
        }
        this.newTicket = payload
        const { data } = await axios.post("/order", payload)
        // console.log(data)
        this.isDisabledButton = false
        this.$notify({
          text: data,
        })
        this.visiblePrint = true
        // this.user.name = ''
        // this.user.phoneNumber = ''
        this.order.ticketNumber = ''
        this.order.model = ''
        this.order.serialNumber = ''
        this.order.configuration = {
          cpu: '',
          ram: '',
          harddrive: '',
          other: ''
        }
        this.order.accessory = {
          battery: 'Có',
          adapter: 'Không',
          bag: 'Không',
          other: ''
        }
        this.order.description = ''
        this.order.problems = [{ name: '', cost: 0 }]
        this.order.type = 'Sửa chữa'
        this.order.time = 'Trong ngày'
      } catch (error) {
        // console.error(error)
        this.isDisabledButton = false
        this.$notify({
          text: error.response.data.message,
          type: "error"
        })
      }
    },
    async findUserByPhoneNumber(e) {
      try {
        e.preventDefault()
        if (!this.user.phoneNumber) return this.$notify({
          text: 'Nhập số điện thoại vào mới tìm được chớ',
          type: "error"
        })
        const { data } = await axios.get("/user?phoneNumber=" + this.user.phoneNumber)
        // console.log(data)
        if (!data) return this.$notify({
          text: 'Khách hàng chưa có trong hệ thống, nhập phiếu mới vào hệ thống sẽ tự lưu thông tin khách hàng',
          type: "warn"
        })
        this.user.name = data.name
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped>
table,
th,
td {
  padding: 2px;
  border: 1px solid #ddd;
}
</style>
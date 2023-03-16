<template>
  <div class="print-page p-5">
    <div class="row">
      <div class="col-6">
        <h4><span class="text-danger">DOCTOR</span> <span class="text-primary">LAPTOP</span></h4>
        CN: {{ address }}<br />
        drlaptop.vn - linhkienlaptop.net
      </div>
      <div class="col-6 mb-2">
        <h5 class="text-primary">PHIẾU NHẬN<br />SỬA CHỮA/BẢO HÀNH</h5>
        Số phiếu: {{ printInfo.ticketNumber }}<br />
        Ngày nhận: {{ $options.moment(printInfo.createdAt).format('DD/MM/YYYY HH:mm') }}
      </div>
      <div class="col-12 mb-2">
        <div class="row">
          <div class="col-6">
            Khách hàng: {{ printInfo.name }}<br />
            Model máy: {{ printInfo.model }}<br />
            SN/ST: {{ printInfo.serialNumber }}
          </div>
          <div class="col-6">
            Số điện thoại: {{ printInfo.phoneNumber }}<br />
            Yêu cầu: {{ printInfo.type }}
          </div>
        </div>
      </div>
      <div class="col-12 mb-2">
        <div class="row">
          <div class="col-6">
            Cấu hình<br />
            CPU: {{ printInfo.configuration.cpu }}<br />
            RAM: {{ printInfo.configuration.ram }}<br />
            Ổ cứng: {{ printInfo.configuration.harddrive }}<br />
            Khác: {{ printInfo.configuration.other }}
          </div>
          <div class="col-6">
            Phụ kiện<br />
            Pin: {{ printInfo.accessory.battery }}<br />
            Sạc: {{ printInfo.accessory.adapter }}<br />
            Túi: {{ printInfo.accessory.bag }}<br />
            Khác: {{ printInfo.accessory.other }}
          </div>
        </div>
      </div>
      <div class="col-12 mb-3">
        Tình trạng máy & ghi chú: {{ printInfo.description }}<br />
        Thời gian dự kiến: {{ printInfo.time }}<br />
        Chi phí dự kiến: {{ Number(printInfo.cost).toLocaleString('vi-VN') }}
        <table style="width:100%" class="custom-table">
          <tr v-for="problem in printInfo.problems">
            <td class="px-2" style="width: 60%;">{{ problem.name }}</td>
            <td class="px-2" style="width: 20%;">{{ Number(problem.cost).toLocaleString('vi-VN') }}</td>
            <td class="px-2">BH{{ problem.warranty ? problem.warranty : 0 }}T</td>
          </tr>
        </table>
      </div>
      <div class="col-12">
        Lưu ý:<br />
        - Khi đến nhận máy phải có phiếu nhận máy sửa chữa/bảo hành<br />
        - Chúng tôi không chịu trách nhiệm về dữ liệu trong quá trình sửa chữa/bảo hành<br />
        - Phiếu nhận máy sửa chữa/bảo hành có giá trị trong 30 ngày
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  moment,
  props: {
    printInfo: Object,
    address: String,
  },
}
</script>

<style>
.print-page {
  font-family: 'Times New Roman', serif;
  font-size: small;
}
</style>
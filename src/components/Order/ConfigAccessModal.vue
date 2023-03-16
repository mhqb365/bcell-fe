<template>
  <CListGroup class="mb-2">
    <CListGroup class="mb-2">
      <CListGroupItem>
        CPU: {{ configuration.cpu }}
      </CListGroupItem>
      <CListGroupItem>
        RAM: {{ configuration.ram }}
      </CListGroupItem>
      <CListGroupItem>
        Ổ cứng: {{ configuration.harddrive }}
      </CListGroupItem>
      <CListGroupItem>
        Khác: {{ configuration.other }}
      </CListGroupItem>
    </CListGroup>
    <CListGroup>
      <CListGroupItem>
        Pin: {{ accessory.battery }}
      </CListGroupItem>
      <CListGroupItem>
        Sạc: {{ accessory.adapter }}
      </CListGroupItem>
      <CListGroupItem>
        Túi: {{ accessory.bag }}
      </CListGroupItem>
      <CListGroupItem>
        Khác: {{ accessory.other }}
      </CListGroupItem>
    </CListGroup>
  </CListGroup>
</template>
<script>

export default {
  props: {
    configuration: Object,
    accessory: Object
  },
}
</script>
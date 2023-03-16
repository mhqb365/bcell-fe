<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="9" :lg="7" :xl="6">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <h1 class="mb-4">Đăng nhập</h1>
                <CForm @submit="login">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput v-model="username" placeholder="Tên đăng nhập" />
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput v-model="password" type="password" placeholder="Mật khẩu" />
                  </CInputGroup>
                  <div class="d-grid">
                    <CButton type="submit" :disabled="loginLoading" @click="login" color="primary"> ĐĂNG NHẬP </CButton>
                  </div>
                </CForm>
                <p class="pt-4 mb-0">
                  <RouterLink to="/">Trở lại</RouterLink>
                </p>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      loginLoading: false,
      username: '',
      password: '',
    }
  },
  methods: {
    async login(e) {
      try {
        e.preventDefault()
        if (!this.username || !this.password) return this.$notify({
          text: 'Nhập đầy đủ thông tin',
          type: "error"
        })
        this.loginLoading = true
        // console.log(payload)
        const { data } = await axios.post('/member/login', {
          username: this.username,
          password: this.password
        })
        // console.log(data)
        this.loginLoading = false
        localStorage.setItem('id', data._id)
        localStorage.setItem('username', data.username)
        localStorage.setItem('store', data.store)
        localStorage.setItem('permission', data.permission)
        localStorage.setItem('token', data.token)
        this.$notify({
          text: 'Đăng nhập thành công',
        })
        setTimeout(() => {
          window.location.href = '/'
        }, 1e3)
      }
      catch (error) {
        // console.error(error)
        this.loginLoading = false
        this.$notify({
          text: error.response.data.message,
          type: "error"
        })
      }
    }
  }
}
</script>

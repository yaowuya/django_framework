<template>
  <div class="logo-set center">
    <div>
      <Card class="logo-card">
        <div slot="title" class="text-center">
          <h3 class="fs-20">Logo设置</h3>
        </div>
        <div style="text-align:center">
          <div class="logo-img">
            <img :key="logo" :src="logo" alt="嘉为蓝鲸">
          </div>
          <Upload
            ref="upload"
            type="drag"
            name="file"
            :action="uploadUrl"
            :format="['jpg','jpeg','png']"
            accept="jpg,jpeg,png"
            :on-success="handleSuccess"
            with-credentials
            :headers="headers"
            class="mt-20"
          >
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff" />
              <p>点击或者拖拽图片到此</p>
            </div>
          </Upload>
          <p class="text-red fs-12">仅支持png、jpg或jpeg图片</p>
          <Button class="mt-15" long @click="resetLogo">恢复默认</Button>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { parseUrl } from '@/utils/util'

export default {
  name: 'LogoSet',
  data() {
    return {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  },
  computed: {
    ...mapGetters([
      'logo'
    ]),
    uploadUrl() {
      return parseUrl('sys/upload_logo')
    }
  },
  methods: {
    ...mapActions('user', [
      'getLogo'
    ]),
    handleSuccess(res, file) {
      this.getLogo()
    },
    async resetLogo() {
      try {
        this.$Spin.show()
        const res = await this.$api.sys.setDefaultLogo()
        this.$Spin.hide()
        if (res.result) {
          this.getLogo()
          this.$CwMessage('success', '恢复成功')
        } else {
          this.$CwMessage('error', res.message)
        }
      } catch (e) {
        this.$CwMessage('error', e)
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .logo-set {
    background-color: #f5f7f9;
    margin: -20px;
    height: calc(100vh - 110px);

    .logo-card {
      width: 30vw;
    }
  }

  .logo-img {
    width: 100%;
    border: 1px solid #e3e5e8;
    border-radius: 4px;
    padding: 10px;

    img {
      width: 100%;
    }
  }
</style>

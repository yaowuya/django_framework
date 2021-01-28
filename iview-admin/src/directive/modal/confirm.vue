<template>
  <div id="confirm">
    <Modal
      v-model="modalShow"
      class="cw-message-modal"
      width="300"
      :mask-closable="false"
    >
      <div class="text-center">
        <div class="cw-modal-title">
          <span>{{ title }}</span>
        </div>
        <div class="mt-10">{{ content }}</div>
        <div class="mt-25">
          <Button style="margin-right: 8px" @click="handleAction()">{{ cancelText }}</Button>
          <Button
            :type="type"
            @click="handleAction('yes')"
          >
            {{ okText }}
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  /**
         * 参考: https://www.iviewui.com/components/modal
         * @param {string|number} title 弹框标题
         * @param {string|number} content 弹框内容
         * @param {string} type 弹出框类型 可选值有：'edit'、'del'
         * @param {string} okText 确认按钮文字内容
         * @param {string} cancelText 取消按钮文字内容
         * @param promiseStatus 构造promise函数，释放两个出口
         */
  name: 'Confirm',
  data() {
    return {
      modalShow: false,
      title: '欢迎',
      content: '欢迎使用普通对话弹窗',
      type: 'edit',
      okText: '确定',
      cancelText: '取消',
      promiseStatus: null
    }
  },
  mounted() {
  },
  methods: {
    confirm() {
      const _this = this
      this.modalShow = true
      return new Promise(function(resolve, reject) {
        _this.promiseStatus = { resolve, reject }
      })
    },
    handleAction(action) {
      this.modalShow = false
      if (action === 'yes') {
        this.promiseStatus && this.promiseStatus.resolve()
      } else {
        this.promiseStatus && this.promiseStatus.reject()
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .cw-message-modal{

    /deep/.ivu-modal {
      top: 60px;
    }

    /deep/.ivu-modal-close {
      right: 8px;
    }

    /deep/.ivu-modal-footer {
      display: none;
    }
  }
  .cw-modal-title {
    font-size: 20px;
    font-weight: bold;
  }
</style>

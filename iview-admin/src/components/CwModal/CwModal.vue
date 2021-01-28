<template>
  <section class="ex-modal">
    <Modal
      v-model="modalShow"
      class="cw-message-modal"
      width="300"
      :mask-closable="false"
      :transfer="transfer"
    >
      <div class="text-center">
        <div class="cw-modal-title">
          <span>{{ title }}</span>
        </div>
        <div class="mt-10">{{ content }}</div>
        <div class="mt-25">
          <Button style="margin-right: 8px" @click="handleAction('cancel')">{{ cancelText }}</Button>
          <Button :type="btnType" @click="handleAction('yes')">
            {{ okText }}
          </Button>
        </div>
      </div>
    </Modal>
  </section>
</template>

<script>
export default {
  name: 'CwModal',
  props: {
    modalShow: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    transfer: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    content: {
      type: String,
      default: () => {
        return '欢迎使用普通对话弹窗'
      }
    },
    title: {
      type: String,
      default: () => {
        return '欢迎'
      }
    },
    btnType: {
      type: String,
      default: () => {
        return 'default'
      }
    },
    okText: {
      type: String,
      default: () => {
        return '确定'
      }
    },
    cancelText: {
      type: String,
      default: () => {
        return '取消'
      }
    }
  },
  methods: {
    handleAction(action) {
      this.$emit('close-modal', action)
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

<template>
  <div class="copy-content">
    <!-- 复制按钮 -->
    <div
      class="copy-btn code-data-copy"
      data-clipboard-action="copy"
      :data-clipboard-text="code"
      @click="copyMessage"
    >
      <i class="el-icon-document-copy myicon" />
    </div>
    <!-- <div v-if="success" class="copy-success-text">copied!</div> -->
  </div>
</template>

<script>
// import clipboard from 'clipboard'
export default {
  data() {
    return {
      code: null,
      success: false
    }
  },
  methods: {
    copyMessage(value) {
      const _this = this
      _this.success = false
      const clipboard = new this.ClipBoard('.code-data-copy')
      clipboard.on('success', function(e) {
        _this.success = true
        _this.$notify({ title: '成功', message: '复制成功', type: 'success' })
        clipboard.destroy() // 销毁,避免多次点击重复出现
      })
      clipboard.on('error', function() {
        _this.$message.error('複製失敗')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.copy-content {
  height: 0px;
}
.icon {
  width: 0.8rem;
  height: 0.8rem;
  fill: rgb(231, 32, 32);
}
.myicon {
  font-size: 14px;
   color: #c0c4cc;
  &:hover {
    color: black;
  }
}
.copy-btn {
  user-select: none;
  opacity: 1;
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
  border-radius: 3px;
  transition: 0.3s;
  background: rgba(255, 255, 255, 0.2);
  &:active {
    background: rgba(253, 253, 253, 0.575);
  }
}
.copy-success-text {
  font-family: "微软雅黑";
  color: green;
  position: absolute;
  font-size: 12px;
  top: 12px;
  right: 28px;
  font-weight: 500;
  animation: successCopy 0.6s ease both 1;
}

</style>

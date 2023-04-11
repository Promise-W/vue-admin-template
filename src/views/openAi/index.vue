<template>
  <div class="open-ai-c">
    <div class="title">与Ai对话，请描述您的需求-支持中文、英语、日本语等</div>

    <div class="content">
      <el-input v-model="prompt" class="promptInput" type="textarea" :rows="5" placeholder="输入描述" />
      <div class="repeat-btn">
        <el-button :loading="loading" type="primary" @click="handleAIRepeat">AI回答</el-button>
      </div>
      <el-input
        v-model="repeat"
        class="repeatInput"
        type="textarea"
        readonly
        placeholder="请耐心等待回答 Ai生成它很快，但是由于网络问题我们需要等待，通常内容越长等待越久 如果长时间没反应请刷新页面重试"
      />
    </div>
  </div>
</template>

<script>
import { getAiData } from '@/api/openAi'

export default {
  data() {
    return {
      loading: false,
      prompt: '',
      repeat: ''
    }
  },
  methods: {
    handleAIRepeat() {
      this.repeat = ''
      if (!this.prompt) return

      this.loading = true
      getAiData({ prompt: this.prompt }).then(({ data }) => {
        this.loading = false
        const message = data && data.aiData || ''
        let index = 0

        const interval = setInterval(() => {
          this.repeat += message[index]
          index++

          // 当打印完成时，清除定时器
          if (index >= message.length) {
            clearInterval(interval)
          }
        }, 50)
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
.open-ai-c {
  padding: 20px;

  .title {
    text-align: center;
    font-size: 18px;
    margin-bottom: 20px;
    font-weight: 700;
  }

  .content {
    .repeat-btn {
      margin: 20px 0;
      text-align: center;
    }

    .repeatInput {
      background-color: #f4f4f4;
      color: #333;

      textarea { height: calc(100vh - 350px); }
    }
  }
}
</style>

<template>
  <div class="open-ai-c">
    <div class="title">与Ai对话，请描述您的需求-支持中文、英语、日本语等</div>

    <div class="error-c">
      <div class="err-tip">本站使用的版本是gpt3.5，额度有限，本站正在加急想办法处理 o(╥﹏╥)o</div>
      <div class="err-tip">ps: 想使用gpt4版本的好心小伙伴可以支持一波(一毛也是爱❤)</div>
    </div>

    <div class="pay-img-c">
      <el-image class="pay-img" :src="payImg" fit="fill" />
    </div>

    <div class="content">
      <div class="mb20">
        <el-select v-model="aiType" placeholder="请选择ai模型" size="medium" clearable>
          <el-option label="GPT-3.5-Turbo" :value="1" />
          <el-option label="通义千问" :value="2" />
        </el-select>
        <span class="ai-type-tip">若请求超时，可切换ai模型后重试</span>
      </div>
      <el-input v-model="prompt" class="promptInput" type="textarea" :rows="5" placeholder="输入描述" maxlength="300" show-word-limit clearable />
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
      payImg: require('@/assets/images/payWx.jpg'),
      loading: false,
      aiType: 1, // ai模型
      prompt: '',
      repeat: ''
    }
  },
  methods: {
    handleAIRepeat() {
      this.repeat = ''
      if (!this.aiType) return this.$message.error('请选择ai模型')
      if (!this.prompt) return this.$message.error('请输入描述')

      this.loading = true
      getAiData({ prompt: this.prompt, aiType: this.aiType }).then(({ data }) => {
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
    .ai-type-tip {
      margin-left: 10px;
      font-size: 14px;
      color: rgb(191, 203, 217);
      font-weight: 500;
    }
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

  .error-c {
    .err-tip {
      text-align: center;
      margin-bottom: 20px;
      color: red;
    }
  }

  .pay-img-c {
    text-align: center;

    .pay-img {
      height: 300px;
    }
  }
}
</style>

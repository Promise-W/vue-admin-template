<template>
  <div class="open-ai-c">
    <div class="title">与Ai对话，请描述您的需求-支持多语言</div>

    <!-- <div class="error-c">
      <div class="err-tip">ps: 想使用gpt4版本的好心小伙伴可以支持一波(一毛也是爱❤)</div>
    </div> -->

    <div class="content">
      <div class="ai-repeat-c mb20">
        <div v-if="repeat" class="markdown-body"><VueMarkdown v-highlight :source="repeat" /></div>
        <div v-else class="no-repeat-tip">
          请耐心等待回答 Ai生成它很快，但是由于网络问题我们需要等待，通常内容越长等待越久 如果长时间没反应请刷新页面重试
        </div>
      </div>

      <div class="mb10">
        <el-select v-model="aiType" placeholder="请选择ai模型" size="medium" clearable>
          <el-option label="科大讯飞" value="keDa" />
          <el-option label="通义千问" value="ali" />
          <el-option label="GPT-3" value="gpt" />
        </el-select>
        <span class="ai-type-tip">若请求超时或答案不满意，可切换ai模型后重试</span>
      </div>
      <el-input v-model="prompt" class="promptInput" type="textarea" :rows="5" placeholder="输入描述" maxlength="300" show-word-limit :clearable="true" />
      <div class="repeat-btn">
        <el-button :loading="loading" type="primary" @click="handleAIRepeat">AI回答</el-button>
        <el-button type="danger" @click="prompt=''">清除描述</el-button>
      </div>
    </div>

    <div class="donate-c">
      <el-button type="text" size="small" @click="isVisitedDonateDlg=true">❤️ 爱心支持</el-button>
    </div>
    <el-dialog class="donateDlg" title="急需老板的爱❤️☺" :visible.sync="isVisitedDonateDlg">
      <div class="pay-img-c">
        <el-image class="pay-img" :src="payImg" fit="fill" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import 'github-markdown-css/github-markdown.css'
import VueMarkdown from 'vue-markdown'
import CodeCopy from '@/components/CodeCopy'
import { getAiData } from '@/api/openAi'

export default {
  components: { VueMarkdown },
  data() {
    return {
      payImg: require('@/assets/images/payWx.jpg'),
      isVisitedDonateDlg: false,
      loading: false,
      interval: null, // 定时器
      aiType: 'keDa', // ai模型
      prompt: '',
      repeat: ''
    }
  },
  methods: {
    handleAIRepeat() {
      this.repeat = ''
      if (!this.aiType) return this.$message.error('请选择ai模型')
      if (!this.prompt) return this.$message.error('请输入描述')

      this.interval && clearInterval(this.interval) // 每次新的问答都要先清理定时器

      this.loading = true

      getAiData({ prompt: this.prompt, aiType: this.aiType }).then(({ data }) => {
        this.repeat = data && data.aiData || ''
        this.renderCodeCopy() // 渲染copy

        /* 隐藏定时器
        const message = data && data.aiData || ''
        let index = 0

        this.interval = setInterval(() => {
          this.repeat += message[index]
          index++

          // 当打印完成时，清除定时器
          if (index >= message.length) {
            clearInterval(this.interval)
          }
        }, 50)
        */
      }).finally(() => {
        this.loading = false
      })
    },
    renderCodeCopy() {
      setTimeout(() => {
        // 给每一个 markdown-body  加上复制按钮，具体样式可以自己调整
        document.querySelectorAll('.markdown-body pre').forEach((el) => {
          if (el.classList.contains('code-copy-added')) return
          const ComponentClass = Vue.extend(CodeCopy)
          const instance = new ComponentClass()
          instance.code = el.innerText
          instance.parent = el
          /* 手动挂载 */
          instance.$mount()
          el.classList.add('code-copy-added')
          el.appendChild(instance.$el)
        })
      }, 100)
    }
  }
}
</script>

<style lang="scss">
.open-ai-c {
  position: relative;
  margin: 20px;
  padding: 20px;
  background-image: linear-gradient(to bottom right,#ddebfe,#f2f2fe);

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
      margin-top: 20px;
      text-align: center;
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

  .ai-repeat-c {
    color: #1e1f24;
    text-align: justify;
    line-height: .26rem;
    box-sizing: border-box;
    padding: 20px;
    border-radius: 5px;
    background-color: #fff;
    position: relative;
    height: calc(100vh - 450px);
    overflow-y: auto;

    .no-repeat-tip {
      padding: 10px;
      color: #bfcbd9;
    }
  }

  .donate-c {
    position: absolute;
    top: 15px;
    right: 20px;
  }
}
</style>

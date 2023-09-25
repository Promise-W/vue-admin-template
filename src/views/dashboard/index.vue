<template>
  <div class="open-ai-c">
    <div class="header-c">
      <div class="title">与Ai对话(支持多语言)</div>
      <div class="donate-c">
        <el-button type="text" size="small" @click="isVisitedDonateDlg=true">❤️ 爱心支持</el-button>
      </div>
    </div>

    <div class="content">
      <div id="ai-repeat-c">
        <div v-if="repeat" class="markdown-body">
          <VueMarkdown v-highlight :source="repeat" />
        </div>
        <div v-else class="no-repeat-tip">
          请耐心等待回答 Ai生成它很快，但是由于网络问题我们需要等待，通常内容越长等待越久 如果长时间没反应请刷新页面重试
        </div>
      </div>

      <div class="mb10">
        <el-select v-model="aiType" placeholder="请选择ai模型" size="medium" clearable>
          <el-option label="科大讯飞" value="keDa" />
          <el-option label="通义千问" value="ali" />
          <el-option label="文心一言" value="baidu" />
          <el-option label="GPT-3" value="gpt" />
        </el-select>
        <span class="ai-type-tip">若请求超时或答案不满意，可切换ai模型后重试</span>
      </div>
      <el-input v-model="prompt" class="promptInput" type="textarea" :rows="5" placeholder="请输入描述，Enter键直接搜索，Shift+Enter键换行" maxlength="2000" show-word-limit :clearable="true" @keydown.enter.native="handleEnter" />
      <div class="repeat-btn">
        <el-button :loading="loading" type="primary" @click="handleAIRepeat">AI回答</el-button>
        <el-button type="danger" @click="prompt=''">清除描述</el-button>
      </div>
    </div>

    <el-dialog class="donate-dlg" title="急需老板的爱❤️☺" width="300px" :visible.sync="isVisitedDonateDlg">
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
    handleEnter(event) { // 输入法的enter忽略，输入框内的shift+enter换行、单独enter触发AI请求
      if (event.code === 'Enter' && !event.shiftKey && !event.isComposing) {
        event.cancelBubble = true // ie阻止冒泡行为
        event.stopPropagation()// Firefox阻止冒泡行为
        event.preventDefault() // 取消事件的默认动作*换行
        this.handleAIRepeat()
      }
    },
    handleAIRepeat() {
      if (!this.aiType) return this.$message.error('请选择ai模型')
      if (!this.prompt) return this.$message.error('请输入描述')

      this.repeat += `  \n<div class="prompt-c"><span>${this.prompt}</span></div>   \n`
      this.scrollToBottom()

      this.interval && clearInterval(this.interval) // 每次新的问答都要先清理定时器

      this.loading = true

      getAiData({ prompt: this.prompt, aiType: this.aiType }).then(({ data }) => {
        this.repeat += `<div class="res-c">${data && data.aiData || ''}  \n</div>   \n`
        this.renderCodeCopy() // 渲染copy
        this.scrollToBottom()

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
    // 渲染代码的复制按钮
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
          const lang = this.getCodeLang(el)
          if (lang && instance.$el) {
            const elLang = document.createElement('span')
            elLang.classList = ['code-lang']
            elLang.innerHTML = `${lang} `
            const elIcon = instance.$el.getElementsByClassName('el-icon-document-copy')[0]
            elIcon && elIcon.before(elLang)
          }
          el.classList.add('code-copy-added')
          el.appendChild(instance.$el)
        })
      }, 100)
    },
    // 滚到底部
    scrollToBottom() {
      setTimeout(() => {
        const elAiC = document.getElementById('ai-repeat-c')
        elAiC.scrollTop = elAiC.scrollHeight
      }, 500)
    },
    // 获取code的类型
    getCodeLang(elPre) {
      let lang = ''
      if (!elPre) return lang
      const elCode = elPre.getElementsByTagName('code')[0]
      if (elCode) {
        elCode.classList.forEach(cl => {
          if (String(cl || '').indexOf('language-') !== -1) {
            lang = cl.split('-')[1] || ''
          }
        })
      }
      return lang
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

  .header-c {
    text-align: center;

    .title {
      font-size: 18px;
      font-weight: 700;
    }
  }

  .content {
    #ai-repeat-c {
      margin-bottom: 10px;
      color: #1e1f24;
      text-align: justify;
      line-height: .26rem;
      box-sizing: border-box;
      padding: 15px;
      border-radius: 5px;
      background-color: #fff;
      position: relative;
      min-height: 100px;
      height: calc(100vh - 450px);
      overflow-y: auto;

      .no-repeat-tip {
        padding: 10px;
        color: #bfcbd9;
        line-height: 22px;
      }

      .prompt-c {
        text-align: right;
        width: 100%;
        margin-bottom: 20px;

        span {
          display: inline-block;
          border-radius: 16px;
          padding: 12px 16px;
          background: #7365ff;
          color: #fff;
        }
      }

      .res-c {
        border-radius: 16px;
        padding: 12px 16px;
        background: #eee;
        width: 100%;
        margin-bottom: 20px
      }
    }

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

  .donate-dlg {
    .pay-img-c {
      text-align: center;

      .pay-img {
        height: 300px;
      }
    }
  }

  .code-lang {
    font-size: 12px;
    color: #bda6a6;
    font-weight: 600;
  }
}
</style>

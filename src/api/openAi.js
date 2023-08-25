import request from '@/utils/request'

export function getAiData(data) {
  return request({
    url: '/openAi/getData',
    method: 'post',
    data
  })
}

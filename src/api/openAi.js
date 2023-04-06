import request from '@/utils/request'

export function getAiData(params) {
  return request({
    url: '/openAi/getData',
    method: 'get',
    params
  })
}

import request from '@/utils/request'

export function getImage() {
  return request({
    url: '/experimentalimg/getImage',
    method: 'get'
  })
}
import request from '@/utils/request'

// 预测图片
export function predictImgApi(img) {
  return request({
    url: '/deeplearning/predictImg',
    method: 'post',
    data: img
  })
}

// 获取图片列表
export function getImgList() {
  return request({
    url: '/deeplearning/getImgList',
    method: 'post'
  })
}
import request from '@/utils/request'

// 获取图片列表
export function getImageList(date) {
  return request({
    url: '/experimentalimg/getImage',
    method: 'post',
    data: date
  })
}

// 获取dep图片
export function getDepList(date) {
  return request({
    url: '/experimentalimg/getDep',
    method: 'post',
    data: date
  })
}

// 检索压缩包
export function getZip(date) {
  return request({
    url: '/experimentalimg/getZip',
    method: 'post',
    data: date
  })
}

// 删除img
export function deleteImg(imgId) {
  return request({
    url: '/experimentalimg/deleteImg',
    method: 'post',
    data: {
      id: imgId
    }
  })
}

// 删除dep
export function deleteDep(depId) {
  return request({
    url: '/experimentalimg/deleteDep',
    method: 'post',
    data: {
      id: depId
    }
  })
}
import request from '@/utils/request';

export function getImagesBynodeId(treeId) {
  return request({
    url: 'system/picture/list',
    method: 'get',
    params: {
      treeId
    }
  });
}

// 根据图片进行超绿检测
export function getCheckedGreenImgByImg(pictureUrl) {
  return request({
    url: '/python/checkGreen',
    method: 'get',
    params: {
      fileUrl: pictureUrl
    },
    timeout: 1000*60
  })
}

// 根据图片进行穴孔检测
export function getCheckedHoleImgByImg(pictureUrl) {
  return request({
    url: '/python/checkHole',
    method: 'get',
    params: {
      fileUrl: pictureUrl
    },
    timeout: 1000*60
  })
}


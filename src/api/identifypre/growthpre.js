import request from '@/utils/request'

// 获取表格数据
export function getTableData(nodeId) {
  return request({
    url: '/identifypre/getTableData',
    method: 'get'
  })
}

// 下载预测结果
export function downloadResult() {

}

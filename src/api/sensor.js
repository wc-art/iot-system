import request from '@/utils/request'

// 分页条件查询
export function getsensorList(data) {
    if (data.sensorName === '' && data.baseName === '') {
        return request({
            url: `/sensor/page?date=${new Date().getTime()}`,
            method: 'get'
        })
    }
    if (data.baseName === '') {
        return request({
            url: `/sensor/page?sensorName=${data.sensorName}&limit=${data.limit}&page=${data.page}&date=${new Date().getTime()}`,
            method: 'get'
        })
    }
    if (data.baseName !== '') {
        return request({
            url: `/sensor/page?sensorName=${data.sensorName}&baseName=${data.baseName}&limit=${data.limit}&page=${data.page}&date=${new Date().getTime()}`,
            method: 'get'
        })
    }
}

// 新增
export function addsensorList(data) {
    return request({
        url: '/sensor/insert',
        method: 'post',
        data
    })
}

// 删除
export function deletesensorList(data) {
    return request({
        url: `/sensor/deleteONe/${data.sensorId.toString()}`,
        method: 'post'
    })
}

// 批量删除
export function deletesensorLists(data) {
    return request({
        url: `/sensor/deleteList?ids%5B%5D=${data.item}`,
        method: 'post'
    })
}

// 更新数据
export function updatesensorList(data) {
    return request({
        url: '/sensor/update',
        method: 'post',
        data
    })
}

export function uploadsensorList(data) {
    return request({
        url: `/sensor/uploadFile`,
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: data
    })
}
// 获取所有传感器数据
export function getAllsensorData() {
    return request({
        url: `/sensorData/indexSensorData?date=${new Date().getTime()}`,
        method: 'get'
    })
}

// 查询区域
export function getSensorRegion(data) {
    return request({
        url: `/sensorData/getRegionById?date=${new Date().getTime()}`,
        method: 'get',
        params: {
            id: data.Id,
            role: data.role
        }
    })
}

// 查询某区域下的网关
export function getSensorGateway(data) {
    return request({
        url: `/sensorData/getGatewayByRegion/${data}?date=${new Date().getTime()}`,
        method: 'get'
    })
}

// 查询某网关地址的传感器数据
export function getSensorGatewayData(data) {
    return request({
        url: `/sensorData/getOneNowGatewayDate/${data}?date=${new Date().getTime()}`,
        method: 'get'
    })
}

// 查询某网关地址历史数据----时间戳
export function getSensorGatewayHistoryByTime(data) {
    return request({
        url: `/sensorData/getGatewayDataByHours?date=${new Date().getTime()}`,
        method: 'get',
        params: {
            hours: data.hours,
            gatewayAddress: data.gatewayAddress,
            limit: data.limit,
            page: data.page

        }
    })
}

// 查询某网关地址历史数据----时间段
export function getSensorGatewayHistoryByDate(data) {
    return request({
        url: `/sensorData/getOneGatewayHistoryData?date=${new Date().getTime()}`,
        method: 'get',
        params: {
            endTime: data.endTime,
            startTime: data.startTime,
            gatewayAdress: data.gatewayAdress,
            limit: data.limit,
            page: data.page
        }
    })
}

// 查询某网关传感器历史数据----时间戳
export function getSensorHistoryByTime(data) {
    return request({
        url: `/sensorData/getSensorDataByHours?date=${new Date().getTime()}`,
        method: 'get',
        params: {
            hours: data.hours,
            gatewayAddress: data.gatewayAddress,
            sensorName: data.sensorName
        }
    })
}

// 查询某网关传感器历史数据----时间段
export function getSensorHistoryByDate(data) {
    return request({
        url: `/sensorData/getOneSensorHistoryData?date=${new Date().getTime()}`,
        method: 'get',
        params: data
    })
}

// 导出网关历史数据----按小时
export function exportReportDataByTime(data) {
    return request({
        url: `/sensorData/exportGatewayDataByHours?date=${new Date().getTime()}`,
        method: 'get',
        responseType: 'blob',
        params: data
    })
}

// 导出网关历史数据----按时间段
export function exportReportDataByDate(data) {
    return request({
        url: `/sensorData/exportSensorData?date=${new Date().getTime()}`,
        method: 'get',
        responseType: 'blob',
        params: data
    })
}
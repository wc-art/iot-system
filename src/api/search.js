import request from '@/utils/request'

export function simpleFind(data) {
    return request({
        url: encodeURI(`/dataCenterFile/simpleFind?fileType=${data.type}&keyword=${data.keyword}`),
        method: 'post' // query
    })
}

export function advancedFind(data) {
    if (data.nodeNames && !data.tags && !data.years && !data.columns) {
        return request({
            url: encodeURI(`/dataCenterFile/advancedFind?columns=${data.columns}&fileType=${data.fileType}`),
            method: 'post' // query
        })
    } else if (data.nodeNames && data.tags && !data.years && !data.columns) {
        return request({
            url: encodeURI(`/dataCenterFile/advancedFind?tags=${data.tags}&columns=${data.columns}&fileType=${data.fileType}&tags=${data.tags}`),
            method: 'post' // query
        })
    } else {
        return request({
            url: encodeURI(`/dataCenterFile/advancedFind?&tags=${data.tags}&nodeNames=${data.nodeNames}&fileType=${data.fileType}&years=${data.years}&columns=${data.columns}`),
            method: 'post' // query
        })
    }



}
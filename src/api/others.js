/*
 * @Author: your name
 * @Date: 2020-12-05 17:12:51
 * @LastEditTime: 2020-12-05 17:37:08
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /IOT/internet/src/api/others.js
 */
import request from '@/utils/request'

// 名字分页模糊查询
export function getOthersList(data) {
    return request({
        url: `/user/page?userName=${data.keyword}&limit=${data.limit}&page=${data.page}&date=${new Date().getTime()}`,
        method: 'get'
    })
}

// 添加
export function addOthersList(data) {
    return request({
        url: '/user/addUser',
        method: 'post',
        data
    })
}

// 文件导入
export function uploadUserList(data) {
    return request({
        url: `/user/addByFile`,
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: data
    })
}

// 删除老师
export function deleOthersList(data) {
    return request({
        url: `/user/deteleUser?userId=${data.userId}`,
        method: 'post'
    })
}

// 批量删除
export function deleOthersLists(data) {
    return request({
        url: `/user/deleteUser?userIds=${data.item}`,
        method: 'post'
    })
}

// 更新老师
export function updateOthersList(data) {
    return request({
        url: '/user/updateUserBackstage',
        method: 'post',
        data
    })
}
// 更新用户
export function updateUserAccount(data) {
    return request({
        url: '/user/updateUserAccount',
        method: 'post',
        data
    })
}
// 查询所有角色
export function getRoles() {
    return request({
        url: `/roleManage/selectRoles?date=${new Date().getTime()}`,
        method: 'get'
    })
}

// export function updateteacheraccount(data) {
//     return request({
//         url: '/teacher/updateTeacherAccount',
//         method: 'post',
//         data
//     })
// }
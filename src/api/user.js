import request from '@/utils/request'

export function login(data) {
    return request({
        url: `/login?password=${data.password}&username=${data.username}&date=${new Date().getTime()}`,
        method: 'post',
    })
}

export function logout(data) {
    return request({
        url: `/logout?username=${data.username}&date=${new Date().getTime()}`,
        method: 'get'
    })
}

export function addTeacher(data) {
    return request({
        url: '/teacher/addTeacher',
        method: 'post',
        data
    })
}

export function addStudent(data) {
    return request({
        url: '/student/addStudent',
        method: 'post',
        data
    })
}
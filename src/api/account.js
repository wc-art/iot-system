import request from '@/utils/request'

export function updateaccount(data) {
    console.log(data);
    if (data.get('studentId')) {
        return request({
            url: '/student/updateStudentAccount',
            method: 'post',
            data
        })
    } else {
        return request({
            url: '/teacher/updateTeacherAccount',
            method: 'post',
            data
        })
    }

}
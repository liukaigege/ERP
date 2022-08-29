import request from '@/api/request.js'

export function progressInfo (uuid) {
  return request({
    url: 'basic/progress',
    method: 'post',
    data: {
      uuid
    }
  })
}
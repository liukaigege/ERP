import request from '@/api/request.js'

export function pageQuery(data){ // 列表
  return request({
    url:'goods/v1/goods/achievement/pageQuery',
    method:'post',
    data,
  })
}

export function addOrUpdate(data){ // 新增修改绩效
  return request({
    url:'goods/v1/goods/achievement/addOrUpdate',
    method:'post',
    data
  })
}

export function deleteAchievement(data){ // 删除绩效
  return request({
    url:'goods/v1/goods/achievement/delete',
    method:'post',
    data
  })
}

export function getAchievementById(data){ // 查询绩效详情
  return request({
    url:'goods/v1/goods/achievement/delete',
    method:'post',
    data
  })
}
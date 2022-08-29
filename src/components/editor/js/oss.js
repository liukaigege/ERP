import OSS from 'ali-oss'
export let client = new OSS({
  region: import.meta.env.VITE_PROJECT_ENV === 'production' ? 'oss-cn-beijing' : 'oss-cn-hangzhou',
  accessKeyId: 'Jy6PO9aZI82pJzYh',
  accessKeySecret: 'pqhJx2AJineLcJpguU1SPImdB7ZLuv',
  bucket: import.meta.env.VITE_PROJECT_ENV === 'production' ? 'vango-erp-prod' : 'vango-erp-test'
})
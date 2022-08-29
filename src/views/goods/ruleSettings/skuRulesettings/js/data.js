
export const data = {
    addList: {
        shopform: {
            key: 1,
            value: { name: '【商品形式】', single: '', combination: "" },
            max: 1
        },
        shoptype: {
            key: 2,
            value: { name: '【商品类型】', ordinary: '', customize: ''},
            max: 1
        },
        sourceChannel: {
            key: 3,
            value: { name: '【货源渠道】', value: '【货源渠道】' },
            max: 1
        },
        separator: {
            key: 4,
            value: { name: '分隔符', value: '-'},
            max: 10
        },
        categorycode: {
            key: 5,
            disabled: false,
            value: { name: '【子级品类编码】', type: 'sub'}, 
            max: 2
        },
        date: {
            key: 6,
            disabled: false,
            value: { name: '【日期】', type: '开品日期', format: 'yyMMdd' }, 
            max: 2
        },
        staffcode: {
            key: 7,
            disabled: false,
            value: { name: '【员工编号】', type: '开发员工' }, 
            max: 2
        },
        random: {
            key: 8,
            value: { name: '【随机数】', length: "4" },//默认4位随机数
            max: 5
        },
        sincenumber: {
            key: 9,
            value: { name: '【自增长数】', startNum: '0001',reset:'none', type: '统计型'}, 
            max: 6
        }
    },
    separator: [
        { value: '-', lable: '-' },
        { value: '~', lable: '~' },
        { value: '_', lable: '_' },
        { value: ',', lable: ',' }], //分隔符
    timeDate: [
        { value: 'yyMMdd', lable: 'yyMMdd' },
        { value: 'yyMM', lable: 'yyMM' },
        { value: 'MMyy', lable: 'MMyy' },
        { value: 'MMdd', lable: 'MMdd' },
        { value: 'ddMM', lable: 'ddMM' },
        { value: 'MMddyy', lable: 'MMddyy' },
        { value: 'yyyyMMdd', lable: 'yyyyMMdd' }],
    randomData: [
        { value: 2, label: 2 },
        { value: 3, label: 3 },
        { value: 4, label: 4 },
        { value: 5, label: 5 },
        { value: 6, label: 6 },
        { value: 7, label: 7 },
        { value: 8, label: 8 },
        { value: 9, label: 9 },
    ]
}

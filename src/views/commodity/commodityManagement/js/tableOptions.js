
const commonOpt = {
    align: "center",
    border: true,
    scrollY: {gt:50, oSize: 20 },
    sortConfig:{remote:true}
}

function spanMethod({ row, _columnIndex, columnIndex }) {
    if (row.rowType == 'title') {
        if (_columnIndex == 1) {
            return { rowspan: 1, colspan: 15 }
        } else {
            return { rowspan: 0, colspan: 0 }
        }
    }
    if (row.rowType == 'parent') {
        if (row.goodsId) {
            if (columnIndex != 0) {
                return { rowspan: 2, colspan: 1 }
            }

        } else {
            if (columnIndex != 0) {
                return { rowspan: 0, colspan: 0 }
            }
        }
    }
}

export const tableOptions = {
    spanMethod: spanMethod,
    ...commonOpt
}

export const data = [{
    "skuList": [{
        "skuId": "",
        "sku": "sku规格编码",
        "sevenAverageSales": "七日均销",
        "monthTotalSales": "当月总销",
        "stockOnPassage": "在途库存",
        "stockInWarehouse": "在仓库存",
        "totalStockCount": "总库存",
        "stockoutToday": "今日缺货",
        "warehouseAge": "库龄",
        "stockTurnoverDays": "库存周转天数",
        "source": "商品来源（平台采集1688、独立站采集-店匠）",
        "supplierName": "默认供应商",
        "purchasePrice": "默认采购价",
        "purchaseUsername": "采购人员",
        "商品配对链接": "",
        "供应商网址链接": "",
        "规格值": ""
    }],
    "goodsId": "商品编码",
    "mainImageUrl": "商品主图地址",
    "nameCn": "商品中文名称",
    "nameEn": "商品英文名称",
    "code": "商品SPU",
    "tortStatus": "侵权状态 1未侵权 2侵权可用",
    "labels": "标签",
    "remarkType": [{
        "id": "备注类型id",
        "color": "图标颜色",
        "word": "图标文字"
    }],
    "categoryName": "品类",
    "sevenAverageSales": "七日均销",
    "monthTotalSales": "当月总销",
    "stockOnPassage": "在途库存",
    "stockInWarehouse": "在仓库存",
    "totalStockCount": "总库存",
    "stockoutToday": "今日缺货"
}]

export const tableHeade = [
    { label: '商品信息', width: '240px', check: true },
    { label: '品类', width: '102px', check: false },
    { label: '默认供应商', width: '110px', check: false },
    { label: '默认采购价(CNY)', width: '100px', check: false },
    { label: '采购人员', width: '100px', check: false },
    { label: '近7日均销', width: '102px', check: false },
    { label: '预计7天总销', width: '102px', check: false },
    { label: '当月总销', width: '102px', check: false },
    { label: '在途库存', width: '102px', check: false },
    { label: '总库存', width: '102px', check: false },
    { label: '库龄(天)', width: '75px', check: false },
    { label: '今日缺货', width: '80px', check: false },
    { label: '库存周转天数', width: '110px', check: false },
    { label: '未来5天库存', width: '102px', check: false },
    { label: '操作', width: '60px', check: false },
]

export const selectData = {
    searchSelect: [
        { label: "商品名", value: 1 },
        { label: "商品编码", value: 2 },
        { label: "商品SPU", value: 3 },
        { label: "商品SKU", value: 4 },
        { label: "商品标签", value: 5 },
        { label: "默认供应商", value: 6 },
        { label: "采购人员", value: 7 }
    ],
    shopAttr: [
        { label: '全部', value: null },
        { label: '含电', value: null },
        { label: '含非液体化妆品', value: null },
        { label: '液体', value: null },
        { label: '膏体', value: null },
        { label: '特货(敏感货)', value: null },
        { label: '带磁', value: null },
        { label: '含粉体', value: null },
        { label: '之物', value: null },
    ],
    tort: [
        { label: "全部", value: null },
        { label: "侵权可用", value: null },
        { label: "为侵权", value: null }
    ]
}

export const htmlData = {
    "goodsSpu": {
        "goodsNum": "609064030216",
        "goodsName": "打底裤女秋冬加绒棉裤女外穿紧身保暖裤加厚羊羔绒一体裤高腰裤子",
        "mainImg": "https://cbu01.alicdn.com/img/ibank/2019/225/020/12739020522_954438736.jpg",
        "brief": "",
        "description": "   ",
        "commentScore": "5",
        "defaultPrice": "35.00",
        "priceCurrency": 1,
        "shelfTime": "",
        "updateTime": "2021-11-18 14:17:41",
        "purchaseMin": 2,
        "purchaseMax": 64841,
        "sales": 21,
        "visitNum": 1649,
        "collection": 564,
        "topCategoryId": "10166",
        "postCategoryId": "1037024",
        "offerUnit": "条",
        "businessType": "default"
    },
    "goodsResources": [
        {
            "type": 2,
            "url": "https://cloud.video.taobao.com/play/u/2881884531/p/2/e/6/t/1/245877430884.mp4"
        },
        {
            "type": 1,
            "url": "https://cbu01.alicdn.com/img/ibank/2019/225/020/12739020522_954438736.jpg"
        },
        {
            "type": 1,
            "url": "https://cbu01.alicdn.com/img/ibank/2019/985/176/12776671589_954438736.jpg"
        },
        {
            "type": 1,
            "url": "https://cbu01.alicdn.com/img/ibank/2019/664/620/12739026466_954438736.jpg"
        },
        {
            "type": 1,
            "url": "https://cbu01.alicdn.com/img/ibank/2019/965/110/12739011569_954438736.jpg"
        },
        {
            "type": 1,
            "url": "https://cbu01.alicdn.com/img/ibank/2019/095/800/12739008590_954438736.jpg"
        },
        {
            "type": 1,
            "url": "https://cbu01.alicdn.com/img/ibank/O1CN018lp0jo1jLFHKFwBPb_!!2881884531-0-cib.jpg"
        },
        {
            "type": 1,
            "url": "https://cbu01.alicdn.com/img/ibank/2019/260/098/12776890062_954438736.jpg"
        },
        {
            "type": 1,
            "url": "https://cbu01.alicdn.com/img/ibank/O1CN01e9VlK61jLFHBN2Jgs_!!2881884531-0-cib.jpg"
        },
        {
            "type": 1,
            "url": "https://cbu01.alicdn.com/img/ibank/O1CN016HUv501jLFHEe0TNk_!!2881884531-0-cib.jpg"
        }
    ],
    "goodsOptions": [
        {
            "main": 1,
            "field": "颜色",
            "type": 2,
            "values": [
                {
                    "value": "https://cbu01.alicdn.com/img/ibank/2019/260/098/12776890062_954438736.jpg",
                    "price": 0,
                    "type": 2,
                    "tips": "A#加绒黑色(无口袋)"
                },
                {
                    "value": "https://cbu01.alicdn.com/img/ibank/2019/517/703/12817307715_954438736.jpg",
                    "price": 0,
                    "type": 2,
                    "tips": "A#加绒灰色(无口袋)"
                },
                {
                    "value": "https://cbu01.alicdn.com/img/ibank/2019/211/823/12817328112_954438736.jpg",
                    "price": 0,
                    "type": 2,
                    "tips": "B#加绒黑色(有口袋)"
                },
                {
                    "value": "https://cbu01.alicdn.com/img/ibank/O1CN016HUv501jLFHEe0TNk_!!2881884531-0-cib.jpg",
                    "price": 0,
                    "type": 2,
                    "tips": "C#加绒黑色(小猫咪)"
                },
                {
                    "value": "https://cbu01.alicdn.com/img/ibank/O1CN018lp0jo1jLFHKFwBPb_!!2881884531-0-cib.jpg",
                    "price": 0,
                    "type": 2,
                    "tips": "C#加绒灰色(小猫咪)"
                },
                {
                    "value": "https://cbu01.alicdn.com/img/ibank/O1CN01e9VlK61jLFHBN2Jgs_!!2881884531-0-cib.jpg",
                    "price": 0,
                    "type": 2,
                    "tips": "D#加绒黑色（纯色）"
                },
                {
                    "value": "https://cbu01.alicdn.com/img/ibank/O1CN01MJqJI31jLFHBw0QWy_!!2881884531-0-cib.jpg",
                    "price": 0,
                    "type": 2,
                    "tips": "D#加绒灰色（纯色）"
                },
                {
                    "value": "https://cbu01.alicdn.com/img/ibank/2020/099/320/23193023990_954438736.jpg",
                    "price": 0,
                    "type": 2,
                    "tips": "E#绿绒黑色（无口袋）"
                }
            ]
        },
        {
            "main": 1,
            "field": "尺码",
            "type": 1,
            "values": [
                {
                    "value": "S",
                    "price": 0,
                    "type": 1,
                    "tips": ""
                },
                {
                    "value": "M",
                    "price": 0,
                    "type": 1,
                    "tips": ""
                },
                {
                    "value": "L",
                    "price": 0,
                    "type": 1,
                    "tips": ""
                },
                {
                    "value": "XL",
                    "price": 0,
                    "type": 1,
                    "tips": ""
                },
                {
                    "value": "XXL",
                    "price": 0,
                    "type": 1,
                    "tips": ""
                },
                {
                    "value": "3XL",
                    "price": 0,
                    "type": 1,
                    "tips": ""
                },
                {
                    "value": "4XL",
                    "price": 0,
                    "type": 1,
                    "tips": ""
                },
                {
                    "value": "5XL",
                    "price": 0,
                    "type": 1,
                    "tips": ""
                },
                {
                    "value": "6XL",
                    "price": 0,
                    "type": 1,
                    "tips": ""
                }
            ]
        }
    ],
    "skuList": [
        {
            "skuPropertyName": "颜色",
            "skuPropertyValues": [
                {
                    "propertyValueDisplayName": "A#加绒黑色(无口袋)",
                    "skuPropertyImagePath": "https://cbu01.alicdn.com/img/ibank/2019/260/098/12776890062_954438736.jpg"
                },
                {
                    "propertyValueDisplayName": "A#加绒灰色(无口袋)",
                    "skuPropertyImagePath": "https://cbu01.alicdn.com/img/ibank/2019/517/703/12817307715_954438736.jpg"
                },
                {
                    "propertyValueDisplayName": "B#加绒黑色(有口袋)",
                    "skuPropertyImagePath": "https://cbu01.alicdn.com/img/ibank/2019/211/823/12817328112_954438736.jpg"
                },
                {
                    "propertyValueDisplayName": "C#加绒黑色(小猫咪)",
                    "skuPropertyImagePath": "https://cbu01.alicdn.com/img/ibank/O1CN016HUv501jLFHEe0TNk_!!2881884531-0-cib.jpg"
                },
                {
                    "propertyValueDisplayName": "C#加绒灰色(小猫咪)",
                    "skuPropertyImagePath": "https://cbu01.alicdn.com/img/ibank/O1CN018lp0jo1jLFHKFwBPb_!!2881884531-0-cib.jpg"
                },
                {
                    "propertyValueDisplayName": "D#加绒黑色（纯色）",
                    "skuPropertyImagePath": "https://cbu01.alicdn.com/img/ibank/O1CN01e9VlK61jLFHBN2Jgs_!!2881884531-0-cib.jpg"
                },
                {
                    "propertyValueDisplayName": "D#加绒灰色（纯色）",
                    "skuPropertyImagePath": "https://cbu01.alicdn.com/img/ibank/O1CN01MJqJI31jLFHBw0QWy_!!2881884531-0-cib.jpg"
                },
                {
                    "propertyValueDisplayName": "E#绿绒黑色（无口袋）",
                    "skuPropertyImagePath": "https://cbu01.alicdn.com/img/ibank/2020/099/320/23193023990_954438736.jpg"
                }
            ]
        },
        {
            "skuPropertyName": "尺码",
            "skuPropertyValues": [
                {
                    "propertyValueDisplayName": "S"
                },
                {
                    "propertyValueDisplayName": "M"
                },
                {
                    "propertyValueDisplayName": "L"
                },
                {
                    "propertyValueDisplayName": "XL"
                },
                {
                    "propertyValueDisplayName": "XXL"
                },
                {
                    "propertyValueDisplayName": "3XL"
                },
                {
                    "propertyValueDisplayName": "4XL"
                },
                {
                    "propertyValueDisplayName": "5XL"
                },
                {
                    "propertyValueDisplayName": "6XL"
                }
            ]
        }
    ],
    "shopInfo": {
        "sellerUserId": "2881884531",
        "companyName": "东莞市拓萌语服饰有限公司",
        "sellerLoginId": "拓萌语",
        "sellerMemberId": "b2b-2881884531d1e5f"
    },
    "goodsSku": {
        "skuProps": [
            {
                "prop": "颜色",
                "value": [
                    {
                        "imageUrl": "https://cbu01.alicdn.com/img/ibank/2019/260/098/12776890062_954438736.jpg",
                        "name": "A#加绒黑色(无口袋)"
                    },
                    {
                        "imageUrl": "https://cbu01.alicdn.com/img/ibank/2019/517/703/12817307715_954438736.jpg",
                        "name": "A#加绒灰色(无口袋)"
                    },
                    {
                        "imageUrl": "https://cbu01.alicdn.com/img/ibank/2019/211/823/12817328112_954438736.jpg",
                        "name": "B#加绒黑色(有口袋)"
                    },
                    {
                        "imageUrl": "https://cbu01.alicdn.com/img/ibank/O1CN016HUv501jLFHEe0TNk_!!2881884531-0-cib.jpg",
                        "name": "C#加绒黑色(小猫咪)"
                    },
                    {
                        "imageUrl": "https://cbu01.alicdn.com/img/ibank/O1CN018lp0jo1jLFHKFwBPb_!!2881884531-0-cib.jpg",
                        "name": "C#加绒灰色(小猫咪)"
                    },
                    {
                        "imageUrl": "https://cbu01.alicdn.com/img/ibank/O1CN01e9VlK61jLFHBN2Jgs_!!2881884531-0-cib.jpg",
                        "name": "D#加绒黑色（纯色）"
                    },
                    {
                        "imageUrl": "https://cbu01.alicdn.com/img/ibank/O1CN01MJqJI31jLFHBw0QWy_!!2881884531-0-cib.jpg",
                        "name": "D#加绒灰色（纯色）"
                    },
                    {
                        "imageUrl": "https://cbu01.alicdn.com/img/ibank/2020/099/320/23193023990_954438736.jpg",
                        "name": "E#绿绒黑色（无口袋）"
                    }
                ]
            },
            {
                "prop": "尺码",
                "value": [
                    {
                        "name": "S"
                    },
                    {
                        "name": "M"
                    },
                    {
                        "name": "L"
                    },
                    {
                        "name": "XL"
                    },
                    {
                        "name": "XXL"
                    },
                    {
                        "name": "3XL"
                    },
                    {
                        "name": "4XL"
                    },
                    {
                        "name": "5XL"
                    },
                    {
                        "name": "6XL"
                    }
                ]
            }
        ],
        "skuInfoMap": {
            "A#加绒灰色(无口袋)>M": {
                "specId": "f874dcb2a258a084c2f65cf955eacf36",
                "specAttrs": "A#加绒灰色(无口袋)>M",
                "saleCount": 126,
                "canBookCount": 870,
                "skuId": 4450047039404,
                "isPromotionSku": false
            },
            "A#加绒灰色(无口袋)>L": {
                "specId": "84d35ae2423bc48a8f25a312caaff219",
                "specAttrs": "A#加绒灰色(无口袋)>L",
                "saleCount": 156,
                "canBookCount": 838,
                "skuId": 4450047039405,
                "isPromotionSku": false
            },
            "C#加绒黑色(小猫咪)>M": {
                "specId": "b1830bd3902174e582f2af4aa70980b5",
                "specAttrs": "C#加绒黑色(小猫咪)>M",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899779643778,
                "isPromotionSku": false
            },
            "A#加绒灰色(无口袋)>XL": {
                "specId": "8c00b03c7f9a43e1c5a9eed9130d9b9e",
                "specAttrs": "A#加绒灰色(无口袋)>XL",
                "saleCount": 89,
                "canBookCount": 906,
                "skuId": 4450047039406,
                "isPromotionSku": false
            },
            "C#加绒黑色(小猫咪)>L": {
                "specId": "0a9f90d6935a78eee0edf6b28497b1b8",
                "specAttrs": "C#加绒黑色(小猫咪)>L",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899779643782,
                "isPromotionSku": false
            },
            "C#加绒黑色(小猫咪)>S": {
                "specId": "fa1f8fb5536661bf08171dfbb0aa4050",
                "specAttrs": "C#加绒黑色(小猫咪)>S",
                "saleCount": 1,
                "canBookCount": 999,
                "skuId": 4899779643774,
                "isPromotionSku": false
            },
            "B#加绒黑色(有口袋)>L": {
                "specId": "1ae13f5f40f18be31654332afa9fda96",
                "specAttrs": "B#加绒黑色(有口袋)>L",
                "saleCount": 74,
                "canBookCount": 1000,
                "skuId": 4450047039414,
                "isPromotionSku": false
            },
            "A#加绒黑色(无口袋)>M": {
                "specId": "480ae8d8503b79903eef9f0f7c66d8d3",
                "specAttrs": "A#加绒黑色(无口袋)>M",
                "saleCount": 392,
                "canBookCount": 598,
                "skuId": 4450047039395,
                "isPromotionSku": false
            },
            "B#加绒黑色(有口袋)>M": {
                "specId": "24e80deafec022ebfa4ae42d7afd3608",
                "specAttrs": "B#加绒黑色(有口袋)>M",
                "saleCount": 76,
                "canBookCount": 996,
                "skuId": 4450047039413,
                "isPromotionSku": false
            },
            "A#加绒黑色(无口袋)>L": {
                "specId": "2e5f74ded8a08f33e8547223089b8bff",
                "specAttrs": "A#加绒黑色(无口袋)>L",
                "saleCount": 317,
                "canBookCount": 676,
                "skuId": 4450047039396,
                "isPromotionSku": false
            },
            "A#加绒灰色(无口袋)>S": {
                "specId": "09196bed9b07de598efb8685aba493a6",
                "specAttrs": "A#加绒灰色(无口袋)>S",
                "saleCount": 72,
                "canBookCount": 923,
                "skuId": 4450047039403,
                "isPromotionSku": false
            },
            "A#加绒黑色(无口袋)>3XL": {
                "specId": "923d5040e9c71a0ca42624bf966a85b0",
                "specAttrs": "A#加绒黑色(无口袋)>3XL",
                "saleCount": 83,
                "canBookCount": 912,
                "skuId": 4450047039399,
                "isPromotionSku": false
            },
            "A#加绒灰色(无口袋)>XXL": {
                "specId": "38a4faba45cfc36bcc11f121503c0f89",
                "specAttrs": "A#加绒灰色(无口袋)>XXL",
                "saleCount": 45,
                "canBookCount": 954,
                "skuId": 4450047039407,
                "isPromotionSku": false
            },
            "A#加绒黑色(无口袋)>5XL": {
                "specId": "d22fefed792b5c2f20978e40c3bd0676",
                "specAttrs": "A#加绒黑色(无口袋)>5XL",
                "saleCount": 28,
                "canBookCount": 970,
                "skuId": 4450047039401,
                "isPromotionSku": false
            },
            "A#加绒黑色(无口袋)>S": {
                "specId": "af8578bfc4b0282d779c3f11df063b9a",
                "specAttrs": "A#加绒黑色(无口袋)>S",
                "saleCount": 306,
                "canBookCount": 683,
                "skuId": 4450047039394,
                "isPromotionSku": false
            },
            "B#加绒黑色(有口袋)>S": {
                "specId": "21370642fe8ae0981884462f537bfd24",
                "specAttrs": "B#加绒黑色(有口袋)>S",
                "saleCount": 36,
                "canBookCount": 1000,
                "skuId": 4450047039412,
                "isPromotionSku": false
            },
            "D#加绒灰色（纯色）>4XL": {
                "specId": "70c9fff34e40617329a98597336705a8",
                "specAttrs": "D#加绒灰色（纯色）>4XL",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899779643792,
                "isPromotionSku": false
            },
            "C#加绒灰色(小猫咪)>S": {
                "specId": "40c91fb80e4e6fcdd8380907ab509861",
                "specAttrs": "C#加绒灰色(小猫咪)>S",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899779643771,
                "isPromotionSku": false
            },
            "D#加绒灰色（纯色）>6XL": {
                "specId": "7796ce460d28421f3ae04aaf4bb37196",
                "specAttrs": "D#加绒灰色（纯色）>6XL",
                "saleCount": 0,
                "canBookCount": 999,
                "skuId": 4899779643768,
                "isPromotionSku": false
            },
            "D#加绒灰色（纯色）>XL": {
                "specId": "aad63fc2ac43e7876d15bccc2b702f28",
                "specAttrs": "D#加绒灰色（纯色）>XL",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899779643784,
                "isPromotionSku": false
            },
            "E#绿绒黑色（无口袋）>3XL": {
                "specId": "43caeac641d686f5ba5c4c3f2131822d",
                "specAttrs": "E#绿绒黑色（无口袋）>3XL",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899790223281,
                "isPromotionSku": false
            },
            "D#加绒黑色（纯色）>L": {
                "specId": "662abd0eeb65d6b290378844988ad5dc",
                "specAttrs": "D#加绒黑色（纯色）>L",
                "saleCount": 1,
                "canBookCount": 999,
                "skuId": 4899779643781,
                "isPromotionSku": false
            },
            "E#绿绒黑色（无口袋）>5XL": {
                "specId": "0b46b849f7bc65db02cc2e76c87acccb",
                "specAttrs": "E#绿绒黑色（无口袋）>5XL",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899790223289,
                "isPromotionSku": false
            },
            "D#加绒黑色（纯色）>M": {
                "specId": "32a5db8fe344c4ec016c771c35f52e5d",
                "specAttrs": "D#加绒黑色（纯色）>M",
                "saleCount": 1,
                "canBookCount": 999,
                "skuId": 4899779643777,
                "isPromotionSku": false
            },
            "D#加绒黑色（纯色）>S": {
                "specId": "0d0e2658e4ad9415a116cd8b7b114a36",
                "specAttrs": "D#加绒黑色（纯色）>S",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899779643773,
                "isPromotionSku": false
            },
            "C#加绒灰色(小猫咪)>L": {
                "specId": "5faf8fb2d5372358f43222d146f6b53a",
                "specAttrs": "C#加绒灰色(小猫咪)>L",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899779643779,
                "isPromotionSku": false
            },
            "C#加绒灰色(小猫咪)>M": {
                "specId": "ea6cd63fb3e28a94361465644e8d878e",
                "specAttrs": "C#加绒灰色(小猫咪)>M",
                "saleCount": 2,
                "canBookCount": 998,
                "skuId": 4899779643775,
                "isPromotionSku": false
            },
            "B#加绒黑色(有口袋)>XXL": {
                "specId": "76ea7df8aca7287ae19d7fdffa04a41e",
                "specAttrs": "B#加绒黑色(有口袋)>XXL",
                "saleCount": 58,
                "canBookCount": 0,
                "skuId": 4450047039416,
                "isPromotionSku": false
            },
            "D#加绒黑色（纯色）>5XL": {
                "specId": "6481b382f130e56a5e310cbcf5c31f7c",
                "specAttrs": "D#加绒黑色（纯色）>5XL",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899779643797,
                "isPromotionSku": false
            },
            "C#加绒灰色(小猫咪)>5XL": {
                "specId": "5af3f9bc4b57fc71c64c7250755cef40",
                "specAttrs": "C#加绒灰色(小猫咪)>5XL",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899779643795,
                "isPromotionSku": false
            },
            "C#加绒灰色(小猫咪)>3XL": {
                "specId": "bbae38bca0ace49c4853225b5fc26ac2",
                "specAttrs": "C#加绒灰色(小猫咪)>3XL",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899779643763,
                "isPromotionSku": false
            },
            "C#加绒黑色(小猫咪)>5XL": {
                "specId": "01e06e8c952ab2d0a0cb96e5a45db169",
                "specAttrs": "C#加绒黑色(小猫咪)>5XL",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899779643798,
                "isPromotionSku": false
            },
            "D#加绒黑色（纯色）>XL": {
                "specId": "2674c9ea1f520ceb16baf4a512bbb8d7",
                "specAttrs": "D#加绒黑色（纯色）>XL",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899779643785,
                "isPromotionSku": false
            },
            "A#加绒灰色(无口袋)>4XL": {
                "specId": "b892fc359b4a74f4716f7dbf8535fc08",
                "specAttrs": "A#加绒灰色(无口袋)>4XL",
                "saleCount": 9,
                "canBookCount": 991,
                "skuId": 4450047039409,
                "isPromotionSku": false
            },
            "B#加绒黑色(有口袋)>6XL": {
                "specId": "ddc85883a5345b478fa3a9ecc9545edb",
                "specAttrs": "B#加绒黑色(有口袋)>6XL",
                "saleCount": 0,
                "canBookCount": 0,
                "skuId": 4450047039420,
                "isPromotionSku": false
            },
            "C#加绒黑色(小猫咪)>3XL": {
                "specId": "62070ec04536995318b9e1ffe0ccbd67",
                "specAttrs": "C#加绒黑色(小猫咪)>3XL",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899779643766,
                "isPromotionSku": false
            },
            "B#加绒黑色(有口袋)>4XL": {
                "specId": "db7128818d9af7d3611556b4407b290d",
                "specAttrs": "B#加绒黑色(有口袋)>4XL",
                "saleCount": 14,
                "canBookCount": 0,
                "skuId": 4450047039418,
                "isPromotionSku": false
            },
            "A#加绒灰色(无口袋)>6XL": {
                "specId": "73d6f51d5d86c8899cf93291047467c5",
                "specAttrs": "A#加绒灰色(无口袋)>6XL",
                "saleCount": 10,
                "canBookCount": 990,
                "skuId": 4450047039411,
                "isPromotionSku": false
            },
            "C#加绒黑色(小猫咪)>XL": {
                "specId": "1534ec1230bf772f3e3534817e917238",
                "specAttrs": "C#加绒黑色(小猫咪)>XL",
                "saleCount": 1,
                "canBookCount": 999,
                "skuId": 4899779643786,
                "isPromotionSku": false
            },
            "D#加绒黑色（纯色）>3XL": {
                "specId": "412b1dff52843b13ae4fc8d72b46dc36",
                "specAttrs": "D#加绒黑色（纯色）>3XL",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899779643765,
                "isPromotionSku": false
            },
            "D#加绒灰色（纯色）>S": {
                "specId": "ce28dbbf7a7124c7cf3dd91cedb774e9",
                "specAttrs": "D#加绒灰色（纯色）>S",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899779643772,
                "isPromotionSku": false
            },
            "D#加绒黑色（纯色）>XXL": {
                "specId": "3f8e24a965b4ac4dced2a941ddc99f7d",
                "specAttrs": "D#加绒黑色（纯色）>XXL",
                "saleCount": 1,
                "canBookCount": 999,
                "skuId": 4899779643789,
                "isPromotionSku": false
            },
            "D#加绒灰色（纯色）>L": {
                "specId": "ccc8eed7bdab1a554a5e9f7825efe79f",
                "specAttrs": "D#加绒灰色（纯色）>L",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899779643780,
                "isPromotionSku": false
            },
            "C#加绒黑色(小猫咪)>XXL": {
                "specId": "44317aa36cf9bfde63acbc0136147ec7",
                "specAttrs": "C#加绒黑色(小猫咪)>XXL",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899779643790,
                "isPromotionSku": false
            },
            "E#绿绒黑色（无口袋）>L": {
                "specId": "4fcc71d8b0a14eae4cae8ed65b8ee343",
                "specAttrs": "E#绿绒黑色（无口袋）>L",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899790223285,
                "isPromotionSku": false
            },
            "A#加绒黑色(无口袋)>4XL": {
                "specId": "c79c04b5715104edfe4268830586dead",
                "specAttrs": "A#加绒黑色(无口袋)>4XL",
                "saleCount": 40,
                "canBookCount": 960,
                "skuId": 4450047039400,
                "isPromotionSku": false
            },
            "D#加绒灰色（纯色）>3XL": {
                "specId": "79b777fb504d0a2ded7a6fbc9ebc4856",
                "specAttrs": "D#加绒灰色（纯色）>3XL",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899779643764,
                "isPromotionSku": false
            },
            "C#加绒灰色(小猫咪)>XXL": {
                "specId": "46f3c51cbfb122401102b125bbb9d0af",
                "specAttrs": "C#加绒灰色(小猫咪)>XXL",
                "saleCount": 1,
                "canBookCount": 999,
                "skuId": 4899779643787,
                "isPromotionSku": false
            },
            "D#加绒灰色（纯色）>M": {
                "specId": "537c2f2778ac22b960d2d8d5a987999d",
                "specAttrs": "D#加绒灰色（纯色）>M",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899779643776,
                "isPromotionSku": false
            },
            "C#加绒灰色(小猫咪)>XL": {
                "specId": "9b77260feda3e18e5074b966c37ac82d",
                "specAttrs": "C#加绒灰色(小猫咪)>XL",
                "saleCount": 1,
                "canBookCount": 999,
                "skuId": 4899779643783,
                "isPromotionSku": false
            },
            "E#绿绒黑色（无口袋）>M": {
                "specId": "cac1a430c81257f69bc7a0660b85ee25",
                "specAttrs": "E#绿绒黑色（无口袋）>M",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899790223284,
                "isPromotionSku": false
            },
            "A#加绒黑色(无口袋)>6XL": {
                "specId": "5c916a9e7466c9f4768e0189ba52568f",
                "specAttrs": "A#加绒黑色(无口袋)>6XL",
                "saleCount": 28,
                "canBookCount": 971,
                "skuId": 4450047039402,
                "isPromotionSku": false
            },
            "D#加绒灰色（纯色）>5XL": {
                "specId": "f26759cdd490ff3daa4c9b61bbcede18",
                "specAttrs": "D#加绒灰色（纯色）>5XL",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899779643796,
                "isPromotionSku": false
            },
            "E#绿绒黑色（无口袋）>4XL": {
                "specId": "f82e1f1626ff816c68dfde6f789f8978",
                "specAttrs": "E#绿绒黑色（无口袋）>4XL",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899790223288,
                "isPromotionSku": false
            },
            "E#绿绒黑色（无口袋）>S": {
                "specId": "cc632cdb599364ba44f755b9c7834e3c",
                "specAttrs": "E#绿绒黑色（无口袋）>S",
                "saleCount": 1,
                "canBookCount": 999,
                "skuId": 4899790223283,
                "isPromotionSku": false
            },
            "E#绿绒黑色（无口袋）>6XL": {
                "specId": "0acf46402796d95c0c8d60ad7dcc4cbe",
                "specAttrs": "E#绿绒黑色（无口袋）>6XL",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899790223282,
                "isPromotionSku": false
            },
            "B#加绒黑色(有口袋)>XL": {
                "specId": "80834346248020996e6c6f3e0107840a",
                "specAttrs": "B#加绒黑色(有口袋)>XL",
                "saleCount": 61,
                "canBookCount": 999,
                "skuId": 4450047039415,
                "isPromotionSku": false
            },
            "D#加绒黑色（纯色）>4XL": {
                "specId": "adf6949894b9036cd1af87e2677e2771",
                "specAttrs": "D#加绒黑色（纯色）>4XL",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899779643793,
                "isPromotionSku": false
            },
            "D#加绒黑色（纯色）>6XL": {
                "specId": "c9c53747363790e3f1941c293d301fa1",
                "specAttrs": "D#加绒黑色（纯色）>6XL",
                "saleCount": 0,
                "canBookCount": 999,
                "skuId": 4899779643769,
                "isPromotionSku": false
            },
            "C#加绒灰色(小猫咪)>6XL": {
                "specId": "6a5987bbd4aee071d00347e326c2e47e",
                "specAttrs": "C#加绒灰色(小猫咪)>6XL",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899779643767,
                "isPromotionSku": false
            },
            "A#加绒黑色(无口袋)>XL": {
                "specId": "ca41eff19df446e8cdea75b8a45e9f42",
                "specAttrs": "A#加绒黑色(无口袋)>XL",
                "saleCount": 203,
                "canBookCount": 788,
                "skuId": 4450047039397,
                "isPromotionSku": false
            },
            "C#加绒灰色(小猫咪)>4XL": {
                "specId": "a070e7a21523de4682f4d7fefd2cb3b7",
                "specAttrs": "C#加绒灰色(小猫咪)>4XL",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899779643791,
                "isPromotionSku": false
            },
            "C#加绒黑色(小猫咪)>6XL": {
                "specId": "25c28c601c026d4979ac8244de557c09",
                "specAttrs": "C#加绒黑色(小猫咪)>6XL",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899779643770,
                "isPromotionSku": false
            },
            "C#加绒黑色(小猫咪)>4XL": {
                "specId": "9ef3ef3dacd38fa1492fc6ddc7982fe1",
                "specAttrs": "C#加绒黑色(小猫咪)>4XL",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899779643794,
                "isPromotionSku": false
            },
            "A#加绒灰色(无口袋)>3XL": {
                "specId": "3f8d057f9202cfeb3b7bbe76bc3cd428",
                "specAttrs": "A#加绒灰色(无口袋)>3XL",
                "saleCount": 28,
                "canBookCount": 969,
                "skuId": 4450047039408,
                "isPromotionSku": false
            },
            "A#加绒黑色(无口袋)>XXL": {
                "specId": "b1578f53cef0dceb3e11eeee6186a85b",
                "specAttrs": "A#加绒黑色(无口袋)>XXL",
                "saleCount": 127,
                "canBookCount": 867,
                "skuId": 4450047039398,
                "isPromotionSku": false
            },
            "D#加绒灰色（纯色）>XXL": {
                "specId": "fe42caacb33bdebab18d0e7e8ac5408d",
                "specAttrs": "D#加绒灰色（纯色）>XXL",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899779643788,
                "isPromotionSku": false
            },
            "E#绿绒黑色（无口袋）>XXL": {
                "specId": "43fb59cc934f71a62fd646c8599779d4",
                "specAttrs": "E#绿绒黑色（无口袋）>XXL",
                "saleCount": 1,
                "canBookCount": 999,
                "skuId": 4899790223287,
                "isPromotionSku": false
            },
            "B#加绒黑色(有口袋)>5XL": {
                "specId": "b12fb9ac74ffe99044d5e90a53f7d56b",
                "specAttrs": "B#加绒黑色(有口袋)>5XL",
                "saleCount": 17,
                "canBookCount": 0,
                "skuId": 4450047039419,
                "isPromotionSku": false
            },
            "A#加绒灰色(无口袋)>5XL": {
                "specId": "5f67cd22c62313a50c0a1eb4534e99e8",
                "specAttrs": "A#加绒灰色(无口袋)>5XL",
                "saleCount": 6,
                "canBookCount": 993,
                "skuId": 4450047039410,
                "isPromotionSku": false
            },
            "E#绿绒黑色（无口袋）>XL": {
                "specId": "db4a046c029a90b2da52e10e25a92c71",
                "specAttrs": "E#绿绒黑色（无口袋）>XL",
                "saleCount": 0,
                "canBookCount": 1000,
                "skuId": 4899790223286,
                "isPromotionSku": false
            },
            "B#加绒黑色(有口袋)>3XL": {
                "specId": "7dab61a3d24c8a4c5cffbc3ad2086bc5",
                "specAttrs": "B#加绒黑色(有口袋)>3XL",
                "saleCount": 29,
                "canBookCount": 0,
                "skuId": 4450047039417,
                "isPromotionSku": false
            }
        }
    },
    "orderParam": {
        "canBookedAmount": 64841,
        "skuParam": {
            "skuPriceType": "rangePrice",
            "skuRangePrices": [
                {
                    "price": "35.00",
                    "beginAmount": "2"
                },
                {
                    "price": "33.00",
                    "beginAmount": "5000"
                },
                {
                    "price": "32.00",
                    "beginAmount": "10000"
                }
            ]
        },
        "addCartParam": {
            "cartType": ""
        },
        "mixParam": {
            "supportMix": true,
            "mixNum": 1,
            "mixBegin": 0,
            "shopMixNum": 2147483647,
            "mixAmount": 20
        },
        "beginNum": 2,
        "saledCount": 21,
        "flow": "general"
    },
    "source": "1688"
}
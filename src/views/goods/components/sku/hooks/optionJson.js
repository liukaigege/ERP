import {
	add,
	info,
	update,
	publishInfo,
	publishUpdate
} from '../../../../../api/goods/addGoods.js'
import {
	updateDetail,
	goodsInfo
} from '../../../../../api/goods/quotedPrice.js'
const optionJson = {
	addGoods: {
		single: false, // 单规格
		disabled: false,
		showHead: true,
		fun: {
			add,
			info,
			update
		},
		multi: {
			columns: [
				// 'skuCode',
				'url', //图片
				'expectPrice', //期待售价
				// 'skuSwitch', //状态
				'costPrice' //成本价
			],
			disabled: [],
			setSkuItem: {
				cn: true,
				en: true,
				skuCode: true,
				commonSpe: true,
				add: true
			}, // 新增skuItem
			editAll: {
				url: {
					switch: false,
					value: {
						url: null,
						pictureId: null
					}
				},
				expectPrice: {
					switch: false,
					value: Number()
				},
				costPrice: {
					switch: false,
					value: Number()
				}
			},
			add: true, // 新增
			del: true, // 删除
			switchAll: false,
			editAllBtn: true, //批量修改

			drag: true
		}, // 多规格
		coustom: {
			columns: [
				'nameCn', //定制规格中文名
				'nameEn', //定制规格英文名
				'customType', //定制规格类型 1
				'required', //是否必选
				'showType', //展示样式
				'plusPrice' //加价
			],
			disabled: []
		}, //定制规格
		imgInfo: {
			add: true
		},
		add: true,
		del: true
	}, // 新增商品
	detNewSpes: {
		single: false, // 单规格
		disabled: false,
		showHead: true,
		fun: {
			add,
			info,
			update
		},
		multi: {
			columns: [
				// 'skuCode',
				'url', //图片
				'expectPrice', //期待售价
				// 'skuSwitch', //状态
				'costPrice', //成本价
				'isAdd',
				'relation'
			],
			disabled: [
				'relation'
				// 'url',
				// 'commonSpeId', //多规格新增常用规格
				// 'name', //新增规格名称
				// 'isPhoto',//新增规格的显示图片
				// 'showType',//新增规格的展示样式
				// 'itemName',// 新增规格参数名称
				// 'dragItem',//拖拽
			],
			editAll: {
				url: {
					switch: false,
					value: {
						url: null,
						pictureId: null
					}
				},
				expectPrice: {
					switch: false,
					value: Number()
				},
				costPrice: {
					switch: false,
					value: Number()
				}
			},
			setSkuItem: {
				cn: true,
				en: true,
				skuCode: true,
				commonSpe: true,
				add: true
			}, // 新增skuItem
			add: true, // 新增规格
			del: true, // 删除，
			editAllBtn: true, //批量修改

			switchAll: false,
			drag: true
		}, // 多规格
		coustom: {
			columns: [
				'nameCn', //定制规格中文名
				'nameEn', //定制规格英文名
				'customType', //定制规格类型 1
				'required', //是否必选
				'showType', //展示样式
				'plusPrice', //加价
				'isAdd' //新加的规格标识
			],
			disabled: []
		}, //定制规格
		add: true,
		del: true,
		switchAll: false
	}, // // 已报价商品详情
	AddGroupgoods:{
		single: false, // 单规格
		disabled: false,
		showHead: true,
		fun: {
			add,
			info,
			update
		},
		multi: {
			columns: [
				// 'skuCode',
				'url', //图片
				'expectPrice', //期待售价
				// 'skuSwitch', //状态
				// 'costPrice', //成本价
				'relation',

			],
			disabled: [
				// 'url',
				// 'commonSpeId', //多规格新增常用规格
				// 'name', //新增规格名称
				// 'isPhoto',//新增规格的显示图片
				// 'showType',//新增规格的展示样式
				// 'itemName',// 新增规格参数名称
				// 'dragItem',//拖拽
			],
			editAll: {
				url: {
					switch: false,
					value: {
						url: null,
						pictureId: null
					}
				},
				expectPrice: {
					switch: false,
					value: Number()
				},
				// costPrice: {
				// 	switch: false,
				// 	value: Number()
				// }
			},
			setSkuItem: {
				cn: true,
				en: true,
				skuCode: true,
				commonSpe: true,
				add: true
			}, // 新增skuItem
			add: true, // 新增规格
			del: true, // 删除，
			editAllBtn: true, //批量修改

			switchAll: false,
			drag: true
		}, // 多规格
		coustom: {
			columns: [
				'nameCn', //定制规格中文名
				'nameEn', //定制规格英文名
				'customType', //定制规格类型 1
				'required', //是否必选
				'showType', //展示样式
				'plusPrice', //加价
				'isAdd' //新加的规格标识
			],
			disabled: []
		}, //定制规格
		add: true,
		del: true,
		switchAll: false
	}, // 新增组合品
	goodsPublishDeatil: {
		single: true, // 单规格
		disabled: true,
		showHead: true,
		fun: {
			add: null,
			info: publishInfo,
			update: publishUpdate
		},
		multi: {
			columns: [
				'skuCode',
				'url', //图片
				'expectPrice', //期待售价
				'originalPrice', // 原价
				// 'skuSwitch', //状态
				'costPrice', //成本价
				'weight', //重量
				'lwh', //体积（长宽高）
				'publishStatus'
			],
			disabled: ['costPrice'],
			setSkuItem: {
				cn: false,
				en: true,
				skuCode: false,
				commonSpe: false
			},
			editAll: {
				url: {
					switch: false,
					value: {
						url: null,
						pictureId: null
					}
				},
				expectPrice: {
					switch: false,
					value: Number()
				},
				originalPrice: {
					switch: false,
					value: Number()
				}
			},
			add: false,
			del: true,
			editAllBtn: true, //批量修改
			switchAll: false,
			drag: true
		}, // 多规格
		coustom: {
			columns: [
				// 'nameCn', //定制规格中文名
				'nameEn', //定制规格英文名
				// 'customType', //定制规格类型 1
				'required', //是否必选
				'showType', //展示样式
				'plusPrice', //加价
				'status'
				// 'weight', //重量
				// 'lwh', //体积（长宽高）
			],
			disabled: ['customType', 'required'],
			add: false,
			del: false
		}, //定制规格
		imgInfo: {
			add: false
		},
		add: false,
		del: false,
		switchAll: false,
		publishSwtichAll: true
	}, // 商品刊登详情
	EditDetail: {
		single: false, // 单规格
		disabled: false,
		showHead: true,
		fun: {
			add,
			info,
			update
		},
		multi: {
			columns: [
				// 'skuCode',
				'url', //图片
				'expectPrice', //期待售价
				// 'skuSwitch', //状态
				'costPrice', //成本价
				'relation'
			],
			disabled: [],
			setSkuItem: {
				cn: true,
				en: true,
				skuCode: true,
				commonSpe: true,
				add: true
			}, // 新增skuItem
			editAll: {
				url: {
					switch: false,
					value: {
						url: null,
						pictureId: null
					}
				},
				expectPrice: {
					switch: false,
					value: Number()
				},
				costPrice: {
					switch: false,
					value: Number()
				}
			},
			add: true, // 新增
			del: true, // 删除
			editAllBtn: true, //批量修改

			switchAll: false,
			drag: true
		}, // 多规格
		coustom: {
			columns: [
				'nameCn', //定制规格中文名
				'nameEn', //定制规格英文名
				'customType', //定制规格类型 1
				'required', //是否必选
				'showType', //展示样式
				'plusPrice' //加价
			],
			disabled: []
		}, //定制规格
		imgInfo: {
			add: true
		},
		add: true,
		del: true
	}, // 未报价 待申请
	setPriceDetail: {
		single: false, // 单规格
		disabled: false,
		showHead: true,
		fun: {
			add,
			info,
			update
		},
		multi: {
			columns: [
				'skuCode',
				'url', //图片
				'expectPrice', //期待售价
				// 'skuSwitch', //状态
				'costPrice', //成本价
				'isAdd'
			],
			disabled: [
				'url',
				'commonSpeId', //多规格新增常用规格
				'name', //新增规格名称
				'isPhoto', //新增规格的显示图片
				'showType', //新增规格的展示样式
				'itemName', // 新增规格参数名称
				'dragItem' //拖拽
			],
			setSkuItem: {
				cn: true,
				en: true,
				skuCode: true,
				commonSpe: true,
				add: true
			}, // 新增skuItem
			editAll: {
				url: {
					switch: false,
					value: {
						url: null,
						pictureId: null
					}
				},
				expectPrice: {
					switch: false,
					value: Number()
				},
				costPrice: {
					switch: false,
					value: Number()
				}
			},
			add: false, // 新增
			del: false, // 删除
			editAllBtn: false, //批量修改

			switchAll: false,
			drag: true //拖拽
		}, // 多规格
		coustom: {
			columns: [
				'nameCn', //定制规格中文名
				'nameEn', //定制规格英文名
				'customType', //定制规格类型 1
				'required', //是否必选
				'showType', //展示样式
				'plusPrice' //加价
			],
			disabled: []
		}, //定制规格
		imgInfo: {
			add: true
		},
		add: true,
		del: true
	}, // 已报价商品详情外
	ApplyGoodsDetail: {
		single: false, // 单规格
		disabled: true,
		showHead: true,
		fun: {
			add,
			info,
			update
		},
		multi: {
			columns: [
				// 'skuCode',
				'url', //图片
				'expectPrice', //期待售价
				// 'skuSwitch', //状态
				'costPrice', //成本价
				'relation',// 查看关联
			],
			disabled: [
				'url',
				'commonSpeId', //多规格新增常用规格
				'name', //新增规格名称
				'isPhoto', //新增规格的显示图片
				'showType', //新增规格的展示样式
				'itemName', // 新增规格参数名称
				'dragItem', //拖拽

				'costPrice',
				'expectPrice'
			],
			setSkuItem: {
				cn: true,
				en: true,
				skuCode: true,
				commonSpe: true,
				add: false
			}, // 新增skuItem
			editAll: {
				url: {
					switch: false,
					value: {
						url: null,
						pictureId: null
					}
				},
				expectPrice: {
					switch: false,
					value: Number()
				},
				costPrice: {
					switch: false,
					value: Number()
				}
			},
			add: false, // 新增
			del: false, // 删除
			switchAll: false,
			editAllBtn: false, //批量修改

			drag: false
		}, // 多规格
		coustom: {
			columns: [
				'nameCn', //定制规格中文名
				'nameEn', //定制规格英文名
				'customType', //定制规格类型 1
				'required', //是否必选
				'showType', //展示样式
				'plusPrice' //加价
			],
			disabled: [
				'nameEn',
				'nameCn',
				'customType',
				'showType',
				'length',
				'required',
				'plusPrice',
				'url',
				'dragItem' //拖拽
			]
		}, //定制规格
		imgInfo: {
			add: false
		},
		add: false,
		del: false,
		drag: false
	}, // 待报价申请人
	ConfirmNewSpe: {
		single: false, // 单规格
		disabled: true,
		showHead: true,
		fun: {
			add,
			info,
			update
		},
		multi: {
			columns: [
				// 'skuCode',
				'url', //图片
				'expectPrice', //期待售价
				// 'skuSwitch', //状态
				'costPrice', //成本价
				'relation',// 查看关联
			],
			disabled: [
				'url',
				'commonSpeId', //多规格新增常用规格
				'name', //新增规格名称
				'isPhoto', //新增规格的显示图片
				'showType', //新增规格的展示样式
				'itemName', // 新增规格参数名称
				'dragItem', //拖拽

				'costPrice',
				'expectPrice'
			],
			setSkuItem: {
				cn: true,
				en: true,
				skuCode: true,
				commonSpe: true,
				add: false
			}, // 新增skuItem
			editAll: {
				url: {
					switch: false,
					value: {
						url: null,
						pictureId: null
					}
				},
				expectPrice: {
					switch: false,
					value: Number()
				},
				costPrice: {
					switch: false,
					value: Number()
				}
			},
			add: false, // 新增
			del: false, // 删除
			switchAll: false,
			editAllBtn: false, //批量修改

			drag: false
		}, // 多规格
		coustom: {
			columns: [
				'nameCn', //定制规格中文名
				'nameEn', //定制规格英文名
				'customType', //定制规格类型 1
				'required', //是否必选
				'showType', //展示样式
				'plusPrice' //加价
			],
			disabled: [
				'nameEn',
				'nameCn',
				'customType',
				'showType',
				'length',
				'required',
				'plusPrice',
				'url',
				'dragItem' //拖拽
			]
		}, //定制规格
		imgInfo: {
			add: false
		},
		add: false,
		del: false,
		drag: false
	},//待报价更改类型
}

export default optionJson

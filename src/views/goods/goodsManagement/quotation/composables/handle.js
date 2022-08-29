export function batchSet(command, info) {
	let {
		freightUsa,
		freightCan,
		freightEur,
		freightEatus,
		nameCn,
		nameEn,
		price,
		material,
		purpose,
		customsCode,
		isElectric,
		electricType,
		isLiquid,
		isSpecial
	} = command.row


	let fillFieldFreight = {  // 运费信息 FreightInfo.vue文件
		freightUsa,
		freightCan,
		freightEur,
		freightEatus
	}

	let fillFieldDeclare = { // 报关信息 DeclareInfo.vue文件
		nameCn,
		nameEn,
		price,
		material,
		purpose,
		customsCode,
		isElectric,
		electricType,
		isLiquid,
		isSpecial
	}


	let attrObj = {
		isLiquid: '含非液体化妆品',
		isSpecial: '特货(敏感货)'
	}
	if (command.type === 1 || command.type === 4) {
		// 同一商品
		let item = info.find(item => {
			return item.skus.some(sku => sku.skuId === command.row.skuId)
		})
		item.skus.forEach(sku => {
			if (sku.lgtSwitch === 1 && sku.lgtStatch !== 1) {
				Object.assign(
					sku,
					command.type === 1 ? fillFieldFreight : fillFieldDeclare
				)
				let attrs = [
					sku.isLiquid ? attrObj.isLiquid : '',
					sku.isSpecial ? attrObj.isSpecial : '',
					sku.isElectric && sku.electricType ? sku.electricType : ''
				]
				sku.attr = attrs.filter(attr => attr).join(',')
			}
		})
	} else if (command.type === 2 || command.type === 5) {
		// 所有商品
		info.forEach(item => {
			item.skus.forEach(sku => {
				if (sku.lgtSwitch === 1 && sku.lgtStatch !== 1) {
					Object.assign(
						sku,
						command.type === 2 ? fillFieldFreight : fillFieldDeclare
					)
					let attrs = [
						sku.isLiquid ? attrObj.isLiquid : '',
						sku.isSpecial ? attrObj.isSpecial : '',
						sku.isElectric && sku.electricType ? sku.electricType : ''
					]
					sku.attr = attrs.filter(attr => attr).join(',')
				}
			})
		})
	} else {
		// 同一参数
		let { purchaseLength, purchaseHeight, purchaseWidth, purchaseWeight } =
			command.row
		info.forEach(item => {
			item.skus.forEach(sku => {
				if (sku.lgtSwitch === 1 && sku.lgtStatch !== 1) {
					if (
						sku.purchaseLength === purchaseLength &&
						sku.purchaseHeight === purchaseHeight &&
						sku.purchaseWidth === purchaseWidth &&
						sku.purchaseWeight === purchaseWeight
					) {
						Object.assign(sku, fillFieldFreight)
						let attrs = [
							sku.isLiquid ? attrObj.isLiquid : '',
							sku.isSpecial ? attrObj.isSpecial : '',
							sku.isElectric && sku.electricType ? sku.electricType : ''
						]
						sku.attr = attrs.filter(attr => attr).join(',')
					}
				}
			})
		})
	}
}

// 采购报价处理特殊属性的回显
export function handleAttr(attr) {
	const obj = {
		electronic: 'empty', // 含电
		electronicType: null, // 内电 / 纯电
		noLiquid: 'empty', // 非液体化妆品
		liquid: 'empty', // 液体
		paste: 'empty', // 膏体
		plant: 'empty', // 植物
		special: 'empty', // 特货
		magnet: 'empty', // 带磁
		powder: 'empty' // 含粉末
	}
	if (!attr) {
		return obj
	} else {
		const arr = attr.split(',')
		if (arr.indexOf('含电纯电') !== -1) {
			obj.electronic = '含电'
			obj.electronicType = '含电纯电'
		}
		if (arr.indexOf('含电内电') !== -1) {
			obj.electronic = '含电'
			obj.electronicType = '含电内电'
		}
		if (arr.indexOf('含非液体化妆品') !== -1) obj.noLiquid = '含非液体化妆品'
		if (arr.indexOf('液体') !== -1) obj.liquid = '液体'
		if (arr.indexOf('膏体') !== -1) obj.paste = '膏体'
		if (arr.indexOf('植物') !== -1) obj.plant = '植物'
		if (arr.indexOf('特货（敏感货）') !== -1) obj.special = '特货（敏感货）'
		if (arr.indexOf('带磁') !== -1) obj.magnet = '带磁'
		if (arr.indexOf('含粉末') !== -1) obj.powder = '含粉末'
		if (arr.indexOf('木质') !== -1) obj.powder = '木质'
		return obj
	}
}

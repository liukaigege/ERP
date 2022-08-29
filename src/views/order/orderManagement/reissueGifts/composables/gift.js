export function dataTool(data) {
	const {
		orderId,
		packageId,
		tempDomain,
		type,
		name,
		firstName,
		lastName,
		email,
		phone,
		postcode,
		countryCn,
		countryEn,
		city,
		company,
		taxNum,
		street1,
		street2,
		source
	} = data
	const province = data.state
	//订单信息
	const orderData = {
		orderId,
		packageId,
		tempDomain,
		type,
		typeName: '补发赠品',
		source
	}
	// 客户信息
	const customData = {
		name,
		firstName,
		lastName,
		email,
		phone,
		postcode,
		countryCn,
		countryEn,
		city,
		company,
		taxNum,
		street1,
		street2,
		state: province
	}
	return {
		orderData,
		customData
	}
}

//计算总价格
export function computedTotalPrice(data) {
	let totalPrice = 0
	if (data) {
		data.forEach(v => {
			totalPrice += (v.declareAmount - 0) * (v.goodsQuantity - 0)
		})
	}
	return totalPrice
}

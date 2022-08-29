
import { reactive } from 'vue'

export default function batchAbles(isChecked) {
  let freightState = reactive({
    freightUsa: { status: isChecked, value: '' },
    freightCan: { status: isChecked, value: '' },
    freightEur: { status: isChecked, value: '' },
    freightEatus: { status: isChecked, value: '' },
  })
  let declareState = reactive({
    nameEn: { status: isChecked, value: '' },
    nameCn: { status: isChecked, value: '' },
    weight: { status: false, value: '' },
    price: { status: isChecked, value: '' },
    material: { status: isChecked, value: '' },
    purpose: { status: isChecked, value: '' },
    customsCode: { status: isChecked, value: '' },
    attr: {
      status: isChecked, value: {
        isElectric: false,
        electricType: '',
        isLiquid: false,
        isSpecial: false
      }
    },
  })
  return {
    freightState, declareState
  }
}

function applyCharge (type = 'percent', amount, percentValue) {
  if (type === 'percent') {
    return amount * (1 + percentValue / 100)
  } if (type === 'flat') {
    return amount + percentValue
  }
  throw new Error('Invalid charge type. Must be "percent" or "flat".')
}

function applyDeduction (type = 'percent', amount, deductionValue) {
  if (type === 'percent') {
    return amount * (1 - deductionValue / 100)
  } if (type === 'flat') {
    return amount - deductionValue
  }
  throw new Error('Invalid deduction type. Must be "percent" or "flat".')
}

export function calculateAmounts (sharedData, additionalCostAndDeduction, personNames) {
  const result = {}
  const individualServiceCharge = additionalCostAndDeduction.serviceCharge / personNames.length

  sharedData.forEach((item) => {
    const { amount, sharedPersons } = item
    const individualAmount = amount / sharedPersons.length

    sharedPersons.forEach((person) => {
      result[person] = (result[person] || 0) + individualAmount
    })
  })

  // Apply tax and discount to each person's amount and Total
  for (const person in result) {
    result[person] = applyCharge('percent', result[person], additionalCostAndDeduction.gst)
    result[person] = applyDeduction('percent', result[person], additionalCostAndDeduction.discount)
    result[person] = applyCharge('flat', result[person], individualServiceCharge)
  }
  // Calculate total
  result.Total = Object.values(result).reduce((sum, amount) => sum + amount, 0)
  // Round all the value
  return Object.fromEntries(Object.entries(result).map(([key, value]) => [key, Math.round(value)]))
}

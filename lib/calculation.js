// Create the interface using Object.freeze
const AdjustmentType = Object.freeze({
  PERCENT: 'percent',
  FLAT: 'flat'
})

function applyAdjustment (type, amount, adjustmentValue) {
  switch (type) {
    case AdjustmentType.PERCENT:
      return amount * (1 + (adjustmentValue / 100))
    case AdjustmentType.FLAT:
      return amount + adjustmentValue
    default:
      throw new Error('Invalid adjustment type. Must be "percent" or "flat".')
  }
}

export function calculateAmounts (sharedData, additionalCostsAndDeductions, personNames) {
  const result = {}
  const individualServiceCharge = additionalCostsAndDeductions.serviceCharge / personNames.length

  sharedData.forEach((item) => {
    const { amount, sharedPersons } = item
    const individualAmount = amount / sharedPersons.length

    sharedPersons.forEach((person) => {
      result[person] = (result[person] || 0) + individualAmount
    })
  })

  // Apply adjustments to each person's amount and Total
  for (const person in result) {
  // Apply discount as negative adjustment
    result[person] = applyAdjustment(AdjustmentType.PERCENT, result[person], -additionalCostsAndDeductions.discount)

    // Apply GST as a percentage adjustment
    result[person] = applyAdjustment(AdjustmentType.PERCENT, result[person], additionalCostsAndDeductions.gst)

    // Apply individual service charge as a flat adjustment
    result[person] = applyAdjustment(AdjustmentType.FLAT, result[person], individualServiceCharge)

    // Round the individual amount
    result[person] = Math.round(result[person])
  }

  // Calculate total
  result.Total = Object.values(result).reduce((sum, amount) => sum + amount, 0)

  return result
}

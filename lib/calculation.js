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

function applyAdjustments (amount, adjustments) {
  let adjustedAmount = amount
  adjustedAmount = applyAdjustment(AdjustmentType.PERCENT, adjustedAmount, -adjustments.discount)
  adjustedAmount = applyAdjustment(AdjustmentType.PERCENT, adjustedAmount, adjustments.gst)
  adjustedAmount = applyAdjustment(AdjustmentType.FLAT, adjustedAmount, adjustments.serviceCharge)
  return Math.round(adjustedAmount)
}

/**
 * Calculates the amounts each person needs to pay based on shared data and additional costs and deductions.
 *
 * @param {Array} sharedAmounts - An array of objects containing the amount and the persons sharing that amount.
 * @param {Object} additionalCostsAndDeductions - An object containing additional costs and deductions.
 * @param {number} additionalCostsAndDeductions.serviceCharge - The total service charge to be divided among persons.
 * @param {number} additionalCostsAndDeductions.discount - The discount to be applied to each person's amount.
 * @param {number} additionalCostsAndDeductions.gst - The GST to be applied to each person's amount.
 * @param {Array} personNames - An array of person names involved in the calculation.
 * @returns {Object} An object where keys are person names and values are the amounts they need to pay, including a 'Total' key for the total amount.
 */
export function calculateAmounts (sharedAmounts, additionalCostsAndDeductions, personNames) {
  const amountsPerPerson = {}
  const individualServiceCharge = additionalCostsAndDeductions.serviceCharge / personNames.length

  sharedAmounts.forEach(({ amount, sharedPersons }) => {
    const individualShare = amount / sharedPersons.length
    sharedPersons.forEach(person => {
      amountsPerPerson[person] = (amountsPerPerson[person] || 0) + individualShare
    })
  })

  for (const person in amountsPerPerson) {
    amountsPerPerson[person] = applyAdjustments(amountsPerPerson[person], {
      discount: additionalCostsAndDeductions.discount,
      gst: additionalCostsAndDeductions.gst,
      serviceCharge: individualServiceCharge
    })
  }

  amountsPerPerson.Total = Object.values(amountsPerPerson).reduce((sum, amount) => sum + amount, 0)

  return amountsPerPerson
}

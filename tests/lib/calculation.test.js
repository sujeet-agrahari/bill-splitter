import { calculateAmounts } from '../../lib/calculation.js'
import { describe, test } from 'node:test'
import assert from 'node:assert'

describe('calculateAmounts', () => {
  test('should correctly calculate amounts for each person', () => {
    const sharedData = [
      { amount: 100, sharedPersons: ['Alice', 'Bob'] },
      { amount: 200, sharedPersons: ['Alice', 'Charlie'] }
    ]
    const additionalCostsAndDeductions = {
      serviceCharge: 30,
      discount: 10,
      gst: 5
    }
    const personNames = ['Alice', 'Bob', 'Charlie']

    const result = calculateAmounts(sharedData, additionalCostsAndDeductions, personNames)

    assert.deepStrictEqual(result, {
      Alice: 162,
      Bob: 54,
      Charlie: 108,
      Total: 324
    })
  })

  test('should handle no additional costs and deductions', () => {
    const sharedData = [
      { amount: 100, sharedPersons: ['Alice', 'Bob'] }
    ]
    const additionalCostsAndDeductions = {
      serviceCharge: 0,
      discount: 0,
      gst: 0
    }
    const personNames = ['Alice', 'Bob']

    const result = calculateAmounts(sharedData, additionalCostsAndDeductions, personNames)

    assert.deepStrictEqual(result, {
      Alice: 50,
      Bob: 50,
      Total: 100
    })
  })

  test('should handle empty sharedData', () => {
    const sharedData = []
    const additionalCostsAndDeductions = {
      serviceCharge: 10,
      discount: 5,
      gst: 2
    }
    const personNames = ['Alice', 'Bob']

    const result = calculateAmounts(sharedData, additionalCostsAndDeductions, personNames)

    assert.deepStrictEqual(result, {
      Alice: 5,
      Bob: 5,
      Total: 10
    })
  })

  test('should not throw an error for valid input', () => {
    const sharedData = [
      { amount: 100, sharedPersons: ['Alice', 'Bob'] }
    ]
    const additionalCostsAndDeductions = {
      serviceCharge: 0,
      discount: 0,
      gst: 0
    }
    const personNames = ['Alice', 'Bob']

    assert.doesNotThrow(() => calculateAmounts(sharedData, additionalCostsAndDeductions, personNames))
  })
})

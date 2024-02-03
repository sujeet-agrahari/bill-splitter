import { describe, test } from 'node:test'
import assert from 'node:assert'

import { calculateAmounts } from './calculation.js'

describe('calculateAmounts', () => {
  test('calculates amounts correctly', () => {
    const sharedData = [{
      amount: 290,
      sharedPersons: ['Manoj']
    },
    {
      amount: 315,
      sharedPersons: ['Desmond', 'Tharun']

    },
    {
      amount: 290,
      sharedPersons: ['Abhishek']
    },
    {
      amount: 390,
      sharedPersons: ['Manoj', 'Deepak']
    },
    {
      amount: 340,
      sharedPersons: ['Manoj', 'Tharun', 'Deepak']
    },
    {
      amount: 355,
      sharedPersons: ['Manoj', 'Desmond', 'Tharun', 'Deepak']
    },
    {
      amount: 660,
      sharedPersons: ['Naga', 'Sujeet', 'Chethan', 'Pavan']
    },
    {
      amount: 355,
      sharedPersons: ['Naga', 'Sujeet', 'Chethan', 'Pavan']
    },
    {
      amount: 133.32,
      sharedPersons: ['Naga', 'Sujeet', 'Chethan', 'Pavan']
    },
    {
      amount: 133.32,
      sharedPersons: ['Desmond', 'Abhishek']
    },
    {
      amount: 19.05,
      sharedPersons: ['Naga', 'Sujeet', 'Chethan', 'Pavan']
    },
    {
      amount: 19.10,
      sharedPersons: ['Naga', 'Sujeet', 'Chethan', 'Pavan']
    },
    {
      amount: 9.55,
      sharedPersons: ['Manoj']
    }

    ]
    const additionalCostsAndDeductions = {
      gst: 5,
      discount: 0,
      serviceCharge: 9.55
    }
    const personNames = ['Manoj', 'Desmond', 'Sujeet', 'Chethan', 'Pavan', 'Deepak', 'Abhishek', 'Tharun', 'Naga']

    const result = calculateAmounts(sharedData, additionalCostsAndDeductions, personNames)
    assert.strictEqual(result.Manoj, 733)
    assert.strictEqual(result.Desmond, 330)
    assert.strictEqual(result.Chethan, 313)
    assert.strictEqual(result.Pavan, 313)
    assert.strictEqual(result.Naga, 313)
    assert.strictEqual(result.Sujeet, 313)
    assert.strictEqual(result.Deepak, 418)
    assert.strictEqual(result.Abhishek, 376)
    assert.strictEqual(result.Tharun, 379)
    assert.strictEqual(result.Total, 3488)
  })

  test('handles no persons', () => {
    const sharedData = [{ amount: 100, sharedPersons: [] }]
    const additionalCostsAndDeductions = {}
    const personNames = []

    const result = calculateAmounts(sharedData, additionalCostsAndDeductions, personNames)

    assert.strictEqual(result.Total, 0.00)
  })

  test('handles empty inputs', () => {
    const result = calculateAmounts([], {}, [])

    assert.strictEqual(result.Total, 0.00)
  })
})

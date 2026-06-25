import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, currentMonthLabel } from './format'

describe('formatCurrency', () => {
  it('formats IDR with thousands separators and no decimals', () => {
    const out = formatCurrency(1000)
    expect(out).toMatch(/Rp/)
    expect(out).toMatch(/1\.000/)
    expect(out).not.toMatch(/,/) // no fraction digits
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toMatch(/Rp\s?0/)
  })

  it('handles large numbers', () => {
    expect(formatCurrency(12500000)).toMatch(/12\.500\.000/)
  })

  it('rounds to whole rupiah', () => {
    expect(formatCurrency(1999.9)).toMatch(/2\.000/)
  })
})

describe('formatDate', () => {
  it('renders day, month and year for an ISO date', () => {
    const out = formatDate('2026-06-25')
    expect(out).toMatch(/25/)
    expect(out).toMatch(/2026/)
  })
})

describe('currentMonthLabel', () => {
  it('includes the current year', () => {
    expect(currentMonthLabel()).toContain(String(new Date().getFullYear()))
  })
})

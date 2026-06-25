import { describe, it, expect } from 'vitest'
import {
  signedDelta,
  summarizeAccounts,
  dedupeCategories,
  mergeBudgetSpending,
  goalProgress,
  applyContribution,
  MONTHLY_FACTOR,
  monthlyEquivalent,
  sumMonthly,
  withInvestmentMetrics,
  summarizePortfolio,
  reconcileAllowance,
} from './finance'

// ── Transactions ──────────────────────────────────────────────
describe('signedDelta', () => {
  it('income increases balance', () => {
    expect(signedDelta('income', 100)).toBe(100)
  })
  it('expense decreases balance', () => {
    expect(signedDelta('expense', 100)).toBe(-100)
  })
  it('coerces string amounts', () => {
    expect(signedDelta('income', '250')).toBe(250)
  })
  it('treats invalid amount as 0', () => {
    expect(signedDelta('expense', undefined)).toBe(-0)
  })
})

// ── Accounts ──────────────────────────────────────────────────
describe('summarizeAccounts', () => {
  it('splits assets and liabilities and computes net worth', () => {
    const accounts = [
      { category: 'asset', balance: 1000 },
      { category: 'asset', balance: 500 },
      { category: 'liability', balance: 300 },
    ]
    const r = summarizeAccounts(accounts)
    expect(r.totalAssets).toBe(1500)
    expect(r.totalLiabilities).toBe(300)
    expect(r.netWorth).toBe(1200)
    expect(r.assets).toHaveLength(2)
    expect(r.liabilities).toHaveLength(1)
  })
  it('returns zeros for empty input', () => {
    const r = summarizeAccounts([])
    expect(r).toMatchObject({ totalAssets: 0, totalLiabilities: 0, netWorth: 0 })
  })
  it('handles string balances', () => {
    expect(summarizeAccounts([{ category: 'asset', balance: '2000' }]).netWorth).toBe(2000)
  })
})

// ── Categories (the duplicate-category bug) ───────────────────
describe('dedupeCategories', () => {
  it('removes duplicates with the same type and name, keeping first', () => {
    const cats = [
      { id: 1, type: 'expense', name: 'Makanan' },
      { id: 2, type: 'expense', name: 'Makanan' }, // duplicate
      { id: 3, type: 'income', name: 'Gaji' },
    ]
    const r = dedupeCategories(cats)
    expect(r).toHaveLength(2)
    expect(r[0].id).toBe(1)
  })
  it('is case- and whitespace-insensitive', () => {
    const cats = [
      { id: 1, type: 'expense', name: 'Makanan' },
      { id: 2, type: 'expense', name: ' makanan ' },
    ]
    expect(dedupeCategories(cats)).toHaveLength(1)
  })
  it('keeps same name across different types', () => {
    const cats = [
      { id: 1, type: 'income', name: 'Lainnya' },
      { id: 2, type: 'expense', name: 'Lainnya' },
    ]
    expect(dedupeCategories(cats)).toHaveLength(2)
  })
})

// ── Budgets ───────────────────────────────────────────────────
describe('mergeBudgetSpending', () => {
  const budgets = [
    { id: 'b1', category_id: 'c1', amount: 1000 },
    { id: 'b2', category_id: 'c2', amount: 500 },
  ]
  const tx = [
    { category_id: 'c1', amount: 300 },
    { category_id: 'c1', amount: 200 },
    { category_id: 'c2', amount: 600 }, // over budget
    { category_id: null, amount: 99 }, // ignored
  ]
  it('sums spending per category', () => {
    const r = mergeBudgetSpending(budgets, tx)
    expect(r[0].spent).toBe(500)
    expect(r[1].spent).toBe(600)
  })
  it('computes remaining and percent', () => {
    const r = mergeBudgetSpending(budgets, tx)
    expect(r[0].remaining).toBe(500)
    expect(r[0].pct).toBe(50)
    expect(r[1].remaining).toBe(-100)
    expect(r[1].pct).toBe(120)
  })
  it('handles a zero limit without dividing by zero', () => {
    const r = mergeBudgetSpending([{ category_id: 'c1', amount: 0 }], tx)
    expect(r[0].pct).toBe(0)
  })
})

// ── Goals ─────────────────────────────────────────────────────
describe('goalProgress', () => {
  it('computes percent towards target', () => {
    expect(goalProgress({ current_amount: 250, target_amount: 1000 })).toBe(25)
  })
  it('returns 0 when target is 0', () => {
    expect(goalProgress({ current_amount: 100, target_amount: 0 })).toBe(0)
  })
})

describe('applyContribution', () => {
  it('adds to current amount', () => {
    const r = applyContribution({ current_amount: 100, target_amount: 1000, status: 'active' }, 50)
    expect(r.current_amount).toBe(150)
    expect(r.status).toBe('active')
  })
  it('auto-completes when target reached', () => {
    const r = applyContribution({ current_amount: 900, target_amount: 1000, status: 'active' }, 100)
    expect(r.current_amount).toBe(1000)
    expect(r.status).toBe('completed')
  })
  it('reports the parsed contribution value', () => {
    expect(applyContribution({ current_amount: 0, target_amount: 10, status: 'active' }, '5').value).toBe(5)
  })
})

// ── Bills ─────────────────────────────────────────────────────
describe('monthlyEquivalent / sumMonthly', () => {
  it('keeps a monthly bill as-is', () => {
    expect(monthlyEquivalent({ amount: 100, frequency: 'monthly' })).toBe(100)
  })
  it('annualises a yearly bill to 1/12', () => {
    expect(monthlyEquivalent({ amount: 1200, frequency: 'yearly' })).toBeCloseTo(100)
  })
  it('converts quarterly and weekly', () => {
    expect(monthlyEquivalent({ amount: 300, frequency: 'quarterly' })).toBeCloseTo(100)
    expect(monthlyEquivalent({ amount: 10, frequency: 'weekly' })).toBeCloseTo(10 * MONTHLY_FACTOR.weekly)
  })
  it('defaults unknown frequency to a factor of 1', () => {
    expect(monthlyEquivalent({ amount: 50, frequency: 'whenever' })).toBe(50)
  })
  it('sums a mixed list to monthly total', () => {
    const total = sumMonthly([
      { amount: 100, frequency: 'monthly' },
      { amount: 1200, frequency: 'yearly' },
    ])
    expect(total).toBeCloseTo(200)
  })
})

// ── Investments ───────────────────────────────────────────────
describe('withInvestmentMetrics', () => {
  it('computes cost, value and gain', () => {
    const r = withInvestmentMetrics({ quantity: 10, avg_buy_price: 100, current_price: 150 })
    expect(r.cost).toBe(1000)
    expect(r.value).toBe(1500)
    expect(r.gain).toBe(500)
    expect(r.gainPct).toBeCloseTo(50)
  })
  it('handles a loss', () => {
    const r = withInvestmentMetrics({ quantity: 2, avg_buy_price: 100, current_price: 80 })
    expect(r.gain).toBe(-40)
    expect(r.gainPct).toBeCloseTo(-20)
  })
  it('avoids divide-by-zero when cost is 0', () => {
    expect(withInvestmentMetrics({ quantity: 0, avg_buy_price: 0, current_price: 10 }).gainPct).toBe(0)
  })
})

describe('summarizePortfolio', () => {
  it('aggregates value, cost and gain across holdings', () => {
    const r = summarizePortfolio([
      { quantity: 10, avg_buy_price: 100, current_price: 150 }, // +500
      { quantity: 1, avg_buy_price: 1000, current_price: 900 }, // -100
    ])
    expect(r.totalValue).toBe(1500 + 900)
    expect(r.totalCost).toBe(1000 + 1000)
    expect(r.totalGain).toBe(400)
    expect(r.totalGainPct).toBeCloseTo(20)
    expect(r.investments).toHaveLength(2)
  })
  it('returns zeros for an empty portfolio', () => {
    expect(summarizePortfolio([])).toMatchObject({ totalValue: 0, totalCost: 0, totalGain: 0, totalGainPct: 0 })
  })
})

// ── Monthly allowance (Jatah Bulanan) ─────────────────────────
describe('reconcileAllowance', () => {
  it('computes the expected remaining (jatah - terpakai)', () => {
    const r = reconcileAllowance({ amount: 1000, spent: 400 })
    expect(r.expected).toBe(600)
    expect(r.remaining).toBe(600)
    expect(r.spentPct).toBe(40)
  })
  it('returns null difference until a real balance is provided', () => {
    const r = reconcileAllowance({ amount: 1000, spent: 400 })
    expect(r.difference).toBeNull()
    expect(r.matched).toBeNull()
  })
  it('matches when real balance equals expected', () => {
    const r = reconcileAllowance({ amount: 1000, spent: 400, realBalance: 600 })
    expect(r.difference).toBe(0)
    expect(r.matched).toBe(true)
  })
  it('flags a positive difference (untracked income)', () => {
    const r = reconcileAllowance({ amount: 1000, spent: 400, realBalance: 650 })
    expect(r.difference).toBe(50)
    expect(r.matched).toBe(false)
  })
  it('flags a negative difference (untracked spending)', () => {
    const r = reconcileAllowance({ amount: 1000, spent: 400, realBalance: 500 })
    expect(r.difference).toBe(-100)
    expect(r.matched).toBe(false)
  })
  it('treats sub-rupiah gaps as matched', () => {
    const r = reconcileAllowance({ amount: 1000, spent: 0, realBalance: 1000.4 })
    expect(r.matched).toBe(true)
  })
  it('handles empty-string real balance as not yet reconciled', () => {
    expect(reconcileAllowance({ amount: 1000, spent: 0, realBalance: '' }).difference).toBeNull()
  })
})

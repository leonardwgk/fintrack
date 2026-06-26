// ─────────────────────────────────────────────────────────────
// Pure, side-effect-free finance helpers.
// IMPORTANT: this file must NOT import supabase or React so it can be
// unit-tested in a plain Node environment.
// ─────────────────────────────────────────────────────────────

const num = (v) => Number(v) || 0

// ── Transactions ──────────────────────────────────────────────
// Signed effect a transaction has on its account balance.
export const signedDelta = (type, amount) => (type === 'income' ? 1 : -1) * num(amount)

// ── Accounts ──────────────────────────────────────────────────
export function summarizeAccounts(accounts = []) {
  const assets = accounts.filter((a) => a.category === 'asset')
  const liabilities = accounts.filter((a) => a.category === 'liability')
  const totalAssets = assets.reduce((s, a) => s + num(a.balance), 0)
  const totalLiabilities = liabilities.reduce((s, a) => s + num(a.balance), 0)
  return { assets, liabilities, totalAssets, totalLiabilities, netWorth: totalAssets - totalLiabilities }
}

// ── Categories ────────────────────────────────────────────────
// Collapse duplicate categories (same type + name, case-insensitive),
// keeping the first occurrence. Guards against historical double-seeds.
export function dedupeCategories(categories = []) {
  const seen = new Set()
  const out = []
  for (const c of categories) {
    const key = `${c.type}::${String(c.name || '').trim().toLowerCase()}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(c)
  }
  return out
}

// ── Budgets ───────────────────────────────────────────────────
// Merge each budget with the real spending of its category.
export function mergeBudgetSpending(budgets = [], expenseTransactions = []) {
  const spentByCat = {}
  for (const t of expenseTransactions) {
    if (!t.category_id) continue
    spentByCat[t.category_id] = (spentByCat[t.category_id] || 0) + num(t.amount)
  }
  return budgets.map((b) => {
    const limit = num(b.amount)
    const spent = spentByCat[b.category_id] || 0
    const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0
    return { ...b, spent, limit, remaining: limit - spent, pct }
  })
}

// ── Goals ─────────────────────────────────────────────────────
export function goalProgress(goal) {
  const target = num(goal?.target_amount)
  return target > 0 ? Math.round((num(goal?.current_amount) / target) * 100) : 0
}

// Result of contributing `amount` to a goal (auto-completes when target met).
export function applyContribution(goal, amount) {
  const value = num(amount)
  const current_amount = num(goal?.current_amount) + value
  const status = current_amount >= num(goal?.target_amount) ? 'completed' : goal?.status
  return { value, current_amount, status }
}

// ── Bills ─────────────────────────────────────────────────────
export const MONTHLY_FACTOR = { weekly: 52 / 12, monthly: 1, quarterly: 1 / 3, yearly: 1 / 12 }

export function monthlyEquivalent(bill) {
  return num(bill?.amount) * (MONTHLY_FACTOR[bill?.frequency] ?? 1)
}

export function sumMonthly(bills = []) {
  return bills.reduce((s, b) => s + monthlyEquivalent(b), 0)
}

// ── Investments ───────────────────────────────────────────────
export function withInvestmentMetrics(inv) {
  const qty = num(inv?.quantity)
  const cost = qty * num(inv?.avg_buy_price)
  const value = qty * num(inv?.current_price)
  const gain = value - cost
  const gainPct = cost > 0 ? (gain / cost) * 100 : 0
  return { ...inv, cost, value, gain, gainPct }
}

export function summarizePortfolio(investments = []) {
  const withMetrics = investments.map(withInvestmentMetrics)
  const totalValue = withMetrics.reduce((s, i) => s + i.value, 0)
  const totalCost = withMetrics.reduce((s, i) => s + i.cost, 0)
  const totalGain = totalValue - totalCost
  const totalGainPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0
  return { investments: withMetrics, totalValue, totalCost, totalGain, totalGainPct }
}

// ── Monthly allowance (Jatah Bulanan) ─────────────────────────
// `amount`      : jatah bulanan untuk needs (uang yang disisakan di rekening)
// `spent`       : total pengeluaran bulan ini (dari rekening jatah)
// `realBalance` : saldo riil rekening saat ini (dibaca dari m-banking)
// Returns the expected remaining vs the real balance, and the gap.
export function reconcileAllowance({ amount = 0, spent = 0, realBalance = null } = {}) {
  const expected = num(amount) - num(spent) // sisa jatah yang seharusnya ada
  const spentPct = num(amount) > 0 ? Math.round((num(spent) / num(amount)) * 100) : 0
  const hasReal = realBalance !== null && realBalance !== undefined && realBalance !== ''
  if (!hasReal) {
    return { expected, remaining: expected, spentPct, difference: null, matched: null }
  }
  const difference = num(realBalance) - expected
  return { expected, remaining: expected, spentPct, difference, matched: Math.abs(difference) < 1 }
}

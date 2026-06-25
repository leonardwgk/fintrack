import { useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Card, Button, ProgressBar, Badge, EmptyState } from '../components/ui/index'
import Modal from '../components/ui/Modal'
import { Input } from '../components/ui/FormField'
import AllowanceForm from '../components/allowance/AllowanceForm'
import { useAllowance } from '../hooks/useAllowance'
import { useAccounts } from '../hooks/useAccounts'
import { formatCurrency, currentMonthLabel, formatDate } from '../lib/format'

export default function AllowancePage() {
  const a = useAllowance()
  const { accounts } = useAccounts()
  const [modalOpen, setModalOpen] = useState(false)
  const [realInput, setRealInput] = useState('')
  const [reconciling, setReconciling] = useState(false)

  const linkedAccount = accounts.find((acc) => acc.id === a.allowance?.account_id)

  const handleSave = async (values) => {
    await a.save(values)
    setModalOpen(false)
  }

  const handleReconcile = async (e) => {
    e.preventDefault()
    if (realInput === '') return
    setReconciling(true)
    try {
      await a.reconcile(Number(realInput))
      setRealInput('')
    } finally {
      setReconciling(false)
    }
  }

  // Migration not run yet.
  if (a.needsMigration) {
    return (
      <AppLayout title="Jatah Bulanan">
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <Card>
            <EmptyState
              icon="◐"
              title="Fitur belum diaktifkan"
              description="Jalankan migrasi 003_allowances.sql di Supabase SQL Editor untuk mengaktifkan Jatah Bulanan."
            />
          </Card>
        </div>
      </AppLayout>
    )
  }

  const hasAllowance = a.amount > 0 || a.allowance != null
  const diff = a.difference

  return (
    <AppLayout
      title="Jatah Bulanan"
      action={hasAllowance ? <Button variant="secondary" onClick={() => setModalOpen(true)}>Atur jatah</Button> : null}
    >
      <div style={{ maxWidth: 620, margin: '0 auto' }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-muted)', margin: '0 0 16px', letterSpacing: '.04em', textTransform: 'uppercase' }}>{currentMonthLabel()}</p>

        {a.loading ? (
          <Card style={{ padding: '24px' }}><div className="skeleton" style={{ height: 20, width: '50%' }} /></Card>
        ) : !hasAllowance ? (
          <Card>
            <EmptyState
              icon="◐"
              title="Belum set jatah bulan ini"
              description="Tentukan jatah bulanan untuk kebutuhan (needs)—uang yang kamu sisakan di rekening setelah memindahkan sisanya ke pocket Blu."
              action={<Button onClick={() => setModalOpen(true)}>＋ Set jatah bulanan</Button>}
            />
          </Card>
        ) : (
          <>
            {/* hero: jatah & sisa */}
            <div style={{ background: 'var(--ink)', borderRadius: 'var(--radius-xl)', padding: '26px 30px', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,.03)' }} />
              <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>Sisa jatah</p>
              <p style={{ color: a.remaining < 0 ? '#f87171' : 'white', fontSize: 36, fontWeight: 600, letterSpacing: '-.04em', margin: '0 0 16px', lineHeight: 1, fontFamily: 'var(--font-mono)' }}>
                {formatCurrency(a.remaining)}
              </p>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <div>
                  <p style={{ color: 'rgba(255,255,255,.35)', fontSize: 11, margin: '0 0 2px' }}>Jatah bulan ini</p>
                  <p style={{ color: 'rgba(255,255,255,.9)', fontSize: 14, fontWeight: 500, margin: 0, fontFamily: 'var(--font-mono)' }}>{formatCurrency(a.amount)}</p>
                </div>
                <div>
                  <p style={{ color: 'rgba(255,255,255,.35)', fontSize: 11, margin: '0 0 2px' }}>Terpakai</p>
                  <p style={{ color: '#f87171', fontSize: 14, fontWeight: 500, margin: 0, fontFamily: 'var(--font-mono)' }}>{formatCurrency(a.spent)}</p>
                </div>
                {linkedAccount && (
                  <div>
                    <p style={{ color: 'rgba(255,255,255,.35)', fontSize: 11, margin: '0 0 2px' }}>Rekening</p>
                    <p style={{ color: 'rgba(255,255,255,.9)', fontSize: 14, fontWeight: 500, margin: 0 }}>{linkedAccount.icon} {linkedAccount.name}</p>
                  </div>
                )}
              </div>
            </div>

            {/* progress */}
            <Card style={{ padding: '18px 22px', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Pemakaian jatah</span>
                <Badge accent={a.spentPct > 100 ? 'red' : a.spentPct > 80 ? 'amber' : 'green'}>{a.spentPct}%</Badge>
              </div>
              <ProgressBar value={a.spentPct} accent={a.spentPct > 100 ? 'red' : a.spentPct > 80 ? 'amber' : 'green'} height={10} />
            </Card>

            {/* reconciliation */}
            <Card style={{ padding: '20px 22px' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', margin: '0 0 4px', letterSpacing: '-.02em' }}>Cocokkan dengan saldo riil</p>
              <p style={{ fontSize: 12, color: 'var(--ink-muted)', margin: '0 0 16px' }}>
                Sisa jatah seharusnya <strong style={{ color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>{formatCurrency(a.expected)}</strong>. Masukkan saldo asli rekening dari m-banking untuk cek selisih.
              </p>

              <form onSubmit={handleReconcile} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--ink-soft)', marginBottom: 6 }}>Saldo riil rekening</label>
                  <Input type="number" step="any" value={realInput} onChange={(e) => setRealInput(e.target.value)} placeholder={a.allowance?.real_balance != null ? formatCurrency(a.allowance.real_balance) : '0'} />
                </div>
                <Button type="submit" variant="primary" disabled={reconciling || realInput === ''}>{reconciling ? '…' : 'Cocokkan'}</Button>
              </form>

              {a.allowance?.real_balance != null && diff != null && (
                <div style={{
                  marginTop: 16, padding: '14px 16px', borderRadius: 'var(--radius-md)',
                  background: a.matched ? 'var(--green-soft)' : 'var(--amber-soft)',
                  border: `1px solid ${a.matched ? '#86efac' : '#fde68a'}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 2px', color: a.matched ? 'var(--green)' : 'var(--amber)' }}>
                        {a.matched ? 'Cocok ✓' : diff > 0 ? `Lebih ${formatCurrency(Math.abs(diff))}` : `Kurang ${formatCurrency(Math.abs(diff))}`}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--ink-muted)', margin: 0 }}>
                        {a.matched
                          ? 'Catatan sesuai dengan saldo riil.'
                          : diff > 0
                            ? 'Saldo riil lebih besar—mungkin ada pemasukan belum dicatat.'
                            : 'Saldo riil lebih kecil—mungkin ada pengeluaran belum dicatat.'}
                      </p>
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 600, fontFamily: 'var(--font-mono)', color: a.matched ? 'var(--green)' : 'var(--amber)' }}>
                      {diff > 0 ? '+' : diff < 0 ? '-' : ''}{formatCurrency(Math.abs(diff))}
                    </span>
                  </div>
                  {a.allowance.reconciled_at && (
                    <p style={{ fontSize: 10, color: 'var(--ink-faint)', margin: '8px 0 0' }}>
                      Terakhir dicocokkan {formatDate(a.allowance.reconciled_at)}
                    </p>
                  )}
                </div>
              )}
            </Card>
          </>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Atur jatah bulanan">
        <AllowanceForm initial={a.allowance} accounts={accounts} onSubmit={handleSave} onCancel={() => setModalOpen(false)} />
      </Modal>
    </AppLayout>
  )
}

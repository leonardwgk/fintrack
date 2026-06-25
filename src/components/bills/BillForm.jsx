import { useState } from 'react'
import { Field, Input, Select, FormActions } from '../ui/FormField'
import { Button } from '../ui/index'

export default function BillForm({ initial, accounts, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name || '')
  const [amount, setAmount] = useState(initial?.amount ?? '')
  const [frequency, setFrequency] = useState(initial?.frequency || 'monthly')
  const [dueDay, setDueDay] = useState(initial?.due_day ?? '')
  const [billingType, setBillingType] = useState(initial?.billing_type || 'subscription')
  const [category, setCategory] = useState(initial?.category || 'personal')
  const [accountId, setAccountId] = useState(initial?.account_id || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await onSubmit({
        name: name.trim(),
        amount: Number(amount),
        frequency,
        due_day: dueDay ? Number(dueDay) : null,
        billing_type: billingType,
        category,
        account_id: accountId || null,
      })
    } catch (err) {
      setError(err.message || 'Gagal menyimpan tagihan.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field label="Nama" required>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="cth. Netflix, Listrik PLN" required />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Jumlah" required>
          <Input type="number" step="any" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" required />
        </Field>
        <Field label="Frekuensi">
          <Select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
            <option value="weekly">Mingguan</option>
            <option value="monthly">Bulanan</option>
            <option value="quarterly">Kuartalan</option>
            <option value="yearly">Tahunan</option>
          </Select>
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Jenis">
          <Select value={billingType} onChange={(e) => setBillingType(e.target.value)}>
            <option value="subscription">Langganan</option>
            <option value="bill">Tagihan</option>
          </Select>
        </Field>
        <Field label="Tanggal jatuh tempo" hint="1–31">
          <Input type="number" min="1" max="31" value={dueDay} onChange={(e) => setDueDay(e.target.value)} placeholder="—" />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Kategori">
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="personal">Personal</option>
            <option value="professional">Profesional</option>
          </Select>
        </Field>
        <Field label="Bayar dari">
          <Select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
            <option value="">— pilih akun —</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>{a.icon} {a.name}</option>
            ))}
          </Select>
        </Field>
      </div>

      {error && <p style={{ fontSize: 13, color: 'var(--red)', margin: 0 }}>{error}</p>}

      <FormActions>
        <Button variant="secondary" onClick={onCancel}>Batal</Button>
        <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Menyimpan…' : initial ? 'Simpan' : 'Tambah'}</Button>
      </FormActions>
    </form>
  )
}

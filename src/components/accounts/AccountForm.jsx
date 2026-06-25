import { useState } from 'react'
import { Field, Input, Select, Textarea, FormActions } from '../ui/FormField'
import { Button } from '../ui/index'

const ACCOUNT_TYPES = [
  { value: 'bank',        label: 'Bank',         icon: '🏦', category: 'asset' },
  { value: 'cash',        label: 'Tunai',        icon: '💵', category: 'asset' },
  { value: 'e-wallet',    label: 'E-Wallet',     icon: '📱', category: 'asset' },
  { value: 'investment',  label: 'Investasi',    icon: '📈', category: 'asset' },
  { value: 'crypto',      label: 'Kripto',       icon: '🪙', category: 'asset' },
  { value: 'credit_card', label: 'Kartu Kredit', icon: '💳', category: 'liability' },
  { value: 'loan',        label: 'Pinjaman',     icon: '📄', category: 'liability' },
  { value: 'other',       label: 'Lainnya',      icon: '📦', category: 'asset' },
]

export default function AccountForm({ initial, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name || '')
  const [type, setType] = useState(initial?.type || 'bank')
  const [category, setCategory] = useState(initial?.category || 'asset')
  const [balance, setBalance] = useState(initial?.balance ?? '')
  const [notes, setNotes] = useState(initial?.notes || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const onTypeChange = (value) => {
    setType(value)
    const t = ACCOUNT_TYPES.find((x) => x.value === value)
    if (t) setCategory(t.category)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const icon = ACCOUNT_TYPES.find((x) => x.value === type)?.icon || '📦'
      await onSubmit({
        name: name.trim(),
        type,
        category,
        balance: Number(balance) || 0,
        icon,
      })
    } catch (err) {
      setError(err.message || 'Gagal menyimpan akun.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field label="Nama akun" required>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="cth. BCA, GoPay, Dompet" required />
      </Field>

      <Field label="Jenis">
        <Select value={type} onChange={(e) => onTypeChange(e.target.value)}>
          {ACCOUNT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
          ))}
        </Select>
      </Field>

      <Field label="Kategori" hint="Aset menambah net worth, liabilitas menguranginya.">
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="asset">Aset</option>
          <option value="liability">Liabilitas</option>
        </Select>
      </Field>

      <Field label={category === 'liability' ? 'Saldo terutang' : 'Saldo saat ini'} required>
        <Input type="number" step="any" min="0" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="0" required />
      </Field>

      <Field label="Catatan">
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Opsional" />
      </Field>

      {error && <p style={{ fontSize: 13, color: 'var(--red)', margin: 0 }}>{error}</p>}

      <FormActions>
        <Button variant="secondary" onClick={onCancel}>Batal</Button>
        <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Menyimpan…' : initial ? 'Simpan' : 'Tambah akun'}</Button>
      </FormActions>
    </form>
  )
}

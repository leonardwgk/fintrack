import { useState } from 'react'
import { Field, Input, Select, FormActions } from '../ui/FormField'
import { Button } from '../ui/index'

const TYPES = [
  { value: 'stock',       label: 'Saham' },
  { value: 'crypto',      label: 'Kripto' },
  { value: 'mutual_fund', label: 'Reksa Dana' },
  { value: 'bond',        label: 'Obligasi' },
  { value: 'gold',        label: 'Emas' },
  { value: 'property',    label: 'Properti' },
  { value: 'other',       label: 'Lainnya' },
]

export default function InvestmentForm({ initial, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name || '')
  const [type, setType] = useState(initial?.type || 'stock')
  const [ticker, setTicker] = useState(initial?.ticker || '')
  const [quantity, setQuantity] = useState(initial?.quantity ?? '')
  const [avgBuyPrice, setAvgBuyPrice] = useState(initial?.avg_buy_price ?? '')
  const [currentPrice, setCurrentPrice] = useState(initial?.current_price ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await onSubmit({
        name: name.trim(),
        type,
        ticker: ticker.trim() || null,
        quantity: Number(quantity) || 0,
        avg_buy_price: Number(avgBuyPrice) || 0,
        current_price: Number(currentPrice) || 0,
        last_updated: new Date().toISOString().split('T')[0],
      })
    } catch (err) {
      setError(err.message || 'Gagal menyimpan investasi.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 12 }}>
        <Field label="Nama aset" required>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="cth. Bitcoin, BBCA" required />
        </Field>
        <Field label="Ticker">
          <Input value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="BTC" />
        </Field>
      </div>

      <Field label="Jenis">
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </Select>
      </Field>

      <Field label="Jumlah unit" required>
        <Input type="number" step="any" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" required />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Harga beli rata-rata" required>
          <Input type="number" step="any" min="0" value={avgBuyPrice} onChange={(e) => setAvgBuyPrice(e.target.value)} placeholder="0" required />
        </Field>
        <Field label="Harga saat ini" required>
          <Input type="number" step="any" min="0" value={currentPrice} onChange={(e) => setCurrentPrice(e.target.value)} placeholder="0" required />
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

import { useState } from 'react'
import { Field, Input, Textarea, FormActions } from '../ui/FormField'
import { Button } from '../ui/index'

const ICONS = ['🎯', '🏠', '🚗', '✈️', '💍', '🎓', '💻', '🏖️', '🛡️', '📱']

export default function GoalForm({ initial, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name || '')
  const [targetAmount, setTargetAmount] = useState(initial?.target_amount ?? '')
  const [currentAmount, setCurrentAmount] = useState(initial?.current_amount ?? '')
  const [targetDate, setTargetDate] = useState(initial?.target_date || '')
  const [icon, setIcon] = useState(initial?.icon || '🎯')
  const [description, setDescription] = useState(initial?.description || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await onSubmit({
        name: name.trim(),
        target_amount: Number(targetAmount),
        current_amount: Number(currentAmount) || 0,
        target_date: targetDate || null,
        icon,
        description: description.trim() || null,
      })
    } catch (err) {
      setError(err.message || 'Gagal menyimpan goal.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field label="Ikon">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ICONS.map((ic) => (
            <button
              key={ic}
              type="button"
              onClick={() => setIcon(ic)}
              style={{
                width: 38, height: 38, fontSize: 18, cursor: 'pointer',
                borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${icon === ic ? 'var(--ink)' : 'var(--border)'}`,
                background: icon === ic ? 'var(--surface-2)' : 'var(--white)',
              }}
            >
              {ic}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Nama goal" required>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="cth. Dana darurat" required />
      </Field>

      <Field label="Target jumlah" required>
        <Input type="number" step="any" min="1" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="0" required />
      </Field>

      <Field label="Sudah terkumpul">
        <Input type="number" step="any" min="0" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} placeholder="0" />
      </Field>

      <Field label="Target tanggal">
        <Input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
      </Field>

      <Field label="Deskripsi">
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Opsional" />
      </Field>

      {error && <p style={{ fontSize: 13, color: 'var(--red)', margin: 0 }}>{error}</p>}

      <FormActions>
        <Button variant="secondary" onClick={onCancel}>Batal</Button>
        <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Menyimpan…' : initial ? 'Simpan' : 'Buat goal'}</Button>
      </FormActions>
    </form>
  )
}

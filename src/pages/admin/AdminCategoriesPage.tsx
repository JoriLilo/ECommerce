import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService'
import type { Category } from '../../types/category'
import ErrorMessage from '../../components/common/ErrorMessage'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await getCategories()
        if (!cancelled) setCategories(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load categories.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  function resetForm() {
    setName('')
    setEditingId(null)
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (!name.trim()) throw new Error('Enter a category name.')
      if (editingId === null) await createCategory(name)
      else await updateCategory(editingId, name)
      resetForm()
      setCategories(await getCategories())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save category.')
    } finally {
      setSaving(false)
    }
  }

  async function remove(category: Category) {
    if (!window.confirm(`Delete category "${category.name}"?`)) return
    setSaving(true)
    setError(null)
    try {
      await deleteCategory(category.id)
      if (editingId === category.id) resetForm()
      setCategories(await getCategories())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete category.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="content-page">
      <Link to="/admin/dashboard">Back to admin dashboard</Link>
      <h1>Categories</h1>
      <ErrorMessage message={error} />
      <form onSubmit={save} className="checkout">
        <label htmlFor="category-name">{editingId === null ? 'New category' : 'Edit category'}</label>
        <input id="category-name" className="form-input" value={name} maxLength={50} required disabled={saving} onChange={(event) => setName(event.target.value)} />
        <div className="page-actions">
          <button className="btn btn-primary" disabled={saving || loading}>{saving ? 'Saving…' : 'Save category'}</button>
          {editingId !== null && <button type="button" className="btn" disabled={saving} onClick={resetForm}>Cancel edit</button>}
        </div>
      </form>
      {loading && <p role="status">Loading categories…</p>}
      {!loading && !error && categories.length === 0 && <p>No categories yet. Add the first one above.</p>}
      {categories.map((category) => (
        <article key={category.id} className="card">
          <h2>{category.name}</h2>
          <div className="page-actions">
            <button className="btn" disabled={saving} onClick={() => { setEditingId(category.id); setName(category.name) }}>Edit</button>
            <button className="btn btn-danger" disabled={saving} onClick={() => remove(category)}>Delete</button>
          </div>
        </article>
      ))}
    </section>
  )
}

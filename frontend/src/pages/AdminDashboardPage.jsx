import { useCallback, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import {
  fetchMemories,
  createMemory,
  updateMemory,
  deleteMemory,
  reorderMemories,
  updateWebsitePassword,
  imageUrl,
} from '../services/api';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useJourneyAccess } from '../hooks/useJourneyAccess';

const emptyForm = { text: '', order: '', image: null, imagePreview: null };

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { logout, getUsername } = useAdminAuth();
  const { unlock } = useJourneyAccess();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [newSitePassword, setNewSitePassword] = useState('');
  const [reorderDraft, setReorderDraft] = useState({});

  const loadMemories = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchMemories();
      setMemories(data);
    } catch (err) {
      setError(err.message || 'Failed to load memories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMemories();
  }, [loadMemories]);

  const resetForm = () => {
    if (form.imagePreview) URL.revokeObjectURL(form.imagePreview);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (form.imagePreview) URL.revokeObjectURL(form.imagePreview);
    setForm((f) => ({
      ...f,
      image: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const body = new FormData();
      body.append('text', form.text);
      if (form.order !== '') body.append('order', form.order);
      if (form.image) body.append('image', form.image);

      if (editingId) {
        if (!form.image && !memories.find((m) => m.id === editingId)?.image) {
          throw new Error('Image is required');
        }
        await updateMemory(editingId, body);
        setSuccess('Memory updated');
      } else {
        if (!form.image) throw new Error('Image is required for new memories');
        await createMemory(body);
        setSuccess('Memory added');
      }
      resetForm();
      await loadMemories();
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (memory) => {
    resetForm();
    setEditingId(memory.id);
    setForm({
      text: memory.text,
      order: String(memory.order),
      image: null,
      imagePreview: imageUrl(memory.image),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this memory?')) return;
    setError('');
    try {
      await deleteMemory(id);
      setSuccess('Memory deleted');
      if (editingId === id) resetForm();
      await loadMemories();
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };

  const handleReorderSave = async () => {
    const items = memories.map((m) => ({
      id: m.id,
      order: Number(reorderDraft[m.id] ?? m.order),
    }));
    setSubmitting(true);
    try {
      const updated = await reorderMemories(items);
      setMemories(updated);
      setReorderDraft({});
      setSuccess('Order updated');
    } catch (err) {
      setError(err.message || 'Reorder failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!newSitePassword.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await updateWebsitePassword(newSitePassword);
      setNewSitePassword('');
      setSuccess('Website password updated');
    } catch (err) {
      setError(err.message || 'Password update failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePreview = () => {
    unlock();
    navigate('/journey');
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen gradient-romantic py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="font-display text-3xl text-cream">Dashboard</h1>
            <p className="text-cream/50 text-sm mt-1">Welcome, {getUsername()}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-ghost" onClick={handlePreview}>
              Preview journey
            </button>
            <button type="button" className="btn-ghost" onClick={handleLogout}>
              Logout
            </button>
            <Link to="/" className="btn-ghost">
              Home
            </Link>
          </div>
        </header>

        {success && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-400 text-sm text-center mb-4"
            role="status"
          >
            {success}
          </motion.p>
        )}
        <ErrorMessage message={error} />

        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          <motion.section
            className="glass-card rounded-2xl p-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="font-display text-xl text-pink-soft mb-4">
              {editingId ? 'Edit memory' : 'Add memory'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-cream/70 mb-1.5">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-cream/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-purple-mid file:text-cream"
                />
                {form.imagePreview && (
                  <img
                    src={form.imagePreview}
                    alt="Preview"
                    className="mt-3 w-32 h-32 object-cover rounded-xl"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm text-cream/70 mb-1.5">Memory text</label>
                <textarea
                  className="input-field min-h-[100px] resize-y"
                  value={form.text}
                  onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-cream/70 mb-1.5">Order</label>
                <input
                  type="number"
                  min="1"
                  className="input-field"
                  value={form.order}
                  onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
                  placeholder="Auto if empty"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingId ? 'Update' : 'Add'}
                </button>
                {editingId && (
                  <button type="button" className="btn-ghost" onClick={resetForm}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </motion.section>

          <motion.section
            className="glass-card rounded-2xl p-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="font-display text-xl text-pink-soft mb-4">Website password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input
                type="password"
                className="input-field"
                placeholder="New journey password"
                value={newSitePassword}
                onChange={(e) => setNewSitePassword(e.target.value)}
                minLength={4}
                required
              />
              <button type="submit" className="btn-primary w-full" disabled={submitting}>
                Update password
              </button>
            </form>
          </motion.section>
        </div>

        <section className="glass-card rounded-2xl p-6 overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl text-pink-soft">Memories</h2>
            {Object.keys(reorderDraft).length > 0 && (
              <button type="button" className="btn-primary text-sm" onClick={handleReorderSave}>
                Save order
              </button>
            )}
          </div>

          {loading ? (
            <LoadingSpinner label="Loading memories..." />
          ) : !memories.length ? (
            <EmptyState
              title="No memories"
              description="Add your first memory using the form above."
            />
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-cream/50 border-b border-pink-soft/10">
                  <th className="py-3 pr-4 font-medium">Image</th>
                  <th className="py-3 pr-4 font-medium">Preview</th>
                  <th className="py-3 pr-4 font-medium w-24">Order</th>
                  <th className="py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {memories.map((memory) => (
                  <tr key={memory.id} className="border-b border-pink-soft/5">
                    <td className="py-4 pr-4">
                      <img
                        src={imageUrl(memory.image)}
                        alt=""
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="py-4 pr-4 text-cream/80 max-w-xs truncate">
                      {memory.text}
                    </td>
                    <td className="py-4 pr-4">
                      <input
                        type="number"
                        className="input-field w-20 py-1 text-sm"
                        value={reorderDraft[memory.id] ?? memory.order}
                        onChange={(e) =>
                          setReorderDraft((d) => ({
                            ...d,
                            [memory.id]: e.target.value,
                          }))
                        }
                        aria-label={`Order for memory ${memory.id}`}
                      />
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="btn-ghost text-xs py-1.5 px-3"
                          onClick={() => handleEdit(memory)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn-ghost text-xs py-1.5 px-3 text-red-300 border-red-400/30"
                          onClick={() => handleDelete(memory.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}

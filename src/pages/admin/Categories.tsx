import { useEffect, useState } from 'react';
import { Alert, Box, Button, Container, IconButton, Paper, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import api from '../../api/axios';
import ConfirmDialog from '../../components/ConfirmDialog';
import { errorText } from '../../utils/helpers';
import type { Category } from '../../types/types';

const Categories = () => {
  const [cats, setCats] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState<Category | null>(null);
  const [toDelete, setToDelete] = useState<Category | null>(null);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    api
      .get<Category[]>('/categories/')
      .then((res) => setCats(res.data))
      .catch((e) => setMsg({ text: errorText(e), type: 'error' }));
  }, [reload]);

  const save = async () => {
    if (!name.trim()) {
      setMsg({ text: 'Type a category name first', type: 'error' });
      return;
    }
    try {
      if (editing) await api.put(`/categories/${editing.id}/`, { name: name.trim() });
      else await api.post('/categories/', { name: name.trim() });
      setMsg({ text: editing ? 'Category updated' : 'Category added', type: 'success' });
      setName('');
      setEditing(null);
      setReload((r) => r + 1);
    } catch (e) {
      setMsg({ text: errorText(e), type: 'error' });
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await api.delete(`/categories/${toDelete.id}/`);
      setMsg({ text: `"${toDelete.name}" deleted`, type: 'success' });
      setReload((r) => r + 1);
    } catch (e) {
      setMsg({ text: errorText(e), type: 'error' });
    }
    setToDelete(null);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Manage categories</Typography>

      {msg && <Alert severity={msg.type} onClose={() => setMsg(null)} sx={{ mb: 2 }}>{msg.text}</Alert>}

      <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <TextField
          size="small" sx={{ flexGrow: 1 }}
          label={editing ? 'Rename category' : 'New category'}
          value={name} onChange={(e) => setName(e.target.value)}
        />
        <Button variant="contained" onClick={save}>{editing ? 'Update' : 'Add'}</Button>
        {editing && (
          <Button onClick={() => { setEditing(null); setName(''); }}>Cancel</Button>
        )}
      </Paper>

      {cats.map((c) => (
        <Paper key={c.id} sx={{ p: 1.5, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>{c.name}</Typography>
          {/* Uncategorized is the safety net, so it has no edit or delete */}
          {c.name === 'Uncategorized' ? (
            <Typography variant="body2" color="text.secondary">default</Typography>
          ) : (
            <Box>
              <IconButton size="small" aria-label="rename" onClick={() => { setEditing(c); setName(c.name); }}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="error" aria-label="delete" onClick={() => setToDelete(c)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Paper>
      ))}

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete this category?"
        text={`Expenses in "${toDelete?.name ?? ''}" will be moved to Uncategorized. Nothing is lost.`}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </Container>
  );
};

export default Categories;
// web-ui/src/components/AddCredentialModal.jsx
import { useState } from 'react';
import api from '../services/api';
import { useSyncStore } from '../stores/syncStore';
import { useAuthStore } from '../stores/authStore';
import './AddCredentialModal.css';

function AddCredentialModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    service: '',
    username: '',
    password: '',
    notes: '',
    url: '',
    category: 'other'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { syncAllData } = useSyncStore();
  const { encryptionKey } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await api.post('/credentials', {
        ...formData,
        password: formData.password || generatePassword()
      });
      await syncAllData();
      onClose();
    } catch (error) {
      console.error('Failed to add credential:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Credential</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Service</label>
            <input
              type="text"
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Username/Email</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave empty to generate"
            />
            <button 
              type="button" 
              className="generate-btn"
              onClick={() => setFormData({...formData, password: generatePassword()})}
            >
              Generate
            </button>
          </div>
          
          <div className="form-group">
            <label>URL (optional)</label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="social">Social Media</option>
              <option value="work">Work</option>
              <option value="finance">Finance</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Credential'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCredentialModal;

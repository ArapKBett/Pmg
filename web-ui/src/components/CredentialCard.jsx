// web-ui/src/components/CredentialCard.jsx
import { useState } from 'react';
import { copyToClipboard } from '../utils/helpers';
import './CredentialCard.css';

function CredentialCard({ credential }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleEdit = () => setIsEditing(!isEditing);

  const handleCopy = (text) => {
    copyToClipboard(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="credential-card">
      <div className="card-header">
        <h3>{credential.service}</h3>
        <div className="card-actions">
          <button onClick={toggleEdit}>
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>
      </div>
      
      <div className="card-content">
        <div className="field">
          <label>Username:</label>
          <div className="field-value">
            <span>{credential.username}</span>
            <button onClick={() => handleCopy(credential.username)}>Copy</button>
          </div>
        </div>
        
        <div className="field">
          <label>Password:</label>
          <div className="field-value">
            <span>{showPassword ? credential.password : '••••••••'}</span>
            <div className="password-actions">
              <button onClick={togglePassword}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => handleCopy(credential.password)}>Copy</button>
            </div>
          </div>
        </div>
        
        {credential.notes && (
          <div className="field">
            <label>Notes:</label>
            <p className="notes">{credential.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CredentialCard;

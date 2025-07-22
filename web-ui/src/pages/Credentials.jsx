// web-ui/src/pages/Credentials.jsx
import { useEffect, useState } from 'react';
import { useSyncStore } from '../stores/syncStore';
import CredentialCard from '../components/CredentialCard';
import AddCredentialModal from '../components/AddCredentialModal';
import SearchBar from '../components/SearchBar';
import './Credentials.css';

function Credentials() {
  const { credentials, syncAllData } = useSyncStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await syncAllData();
      } catch (error) {
        console.error('Failed to load credentials:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [syncAllData]);

  const filteredCredentials = credentials.filter(cred =>
    cred.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cred.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="credentials-page">
      <div className="credentials-header">
        <h1>Credentials</h1>
        <div className="credentials-actions">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <button 
            className="refresh-btn"
            onClick={syncAllData}
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button 
            className="add-btn"
            onClick={() => setIsModalOpen(true)}
          >
            Add New
          </button>
        </div>
      </div>

      <div className="credentials-grid">
        {filteredCredentials.length > 0 ? (
          filteredCredentials.map(credential => (
            <CredentialCard 
              key={credential.id} 
              credential={credential} 
            />
          ))
        ) : (
          <div className="empty-state">
            {searchTerm ? 'No matching credentials found' : 'No credentials saved yet'}
          </div>
        )}
      </div>

      <AddCredentialModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default Credentials;

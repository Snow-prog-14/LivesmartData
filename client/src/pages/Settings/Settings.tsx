import React, { useState, useEffect } from 'react';
import type { SettingItem, SettingsGroup } from '../../utils/settingsStorage';
import { 
  getSettings, 
  addSettingItem, 
  toggleSettingItem, 
  deleteSettingItem 
} from '../../utils/settingsStorage';

interface SettingGroupProps {
  title: string;
  group: SettingsGroup;
}

const SettingGroupManager: React.FC<SettingGroupProps> = ({ title, group }) => {
  const [items, setItems] = useState<SettingItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItems(getSettings(group));
  }, [group]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newItemName.trim()) {
      setError('Item name is required.');
      return;
    }

    if (items.some(item => item.name.toLowerCase() === newItemName.trim().toLowerCase())) {
      setError('This item already exists.');
      return;
    }

    const updated = addSettingItem(group, newItemName.trim());
    setItems(updated);
    setNewItemName('');
  };

  const handleToggle = (id: string) => {
    const updated = toggleSettingItem(group, id);
    setItems(updated);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      const updated = deleteSettingItem(group, id);
      setItems(updated);
    }
  };

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-header bg-white py-3 border-0">
        <h5 className="card-title mb-0">{title}</h5>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}

        <form onSubmit={handleAdd} className="mb-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder={`Add new ${title.toLowerCase()}...`}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              <i className="bi bi-plus-lg me-2"></i>
              Add
            </button>
          </div>
        </form>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th style={{ width: '150px' }}>Status</th>
                <th style={{ width: '200px' }} className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map(item => (
                  <tr key={item.id}>
                    <td className={item.isActive ? '' : 'text-muted text-decoration-line-through'}>
                      {item.name}
                    </td>
                    <td>
                      <span className={`badge ${item.isActive ? 'bg-success' : 'bg-secondary'}`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-end">
                      <button 
                        className={`btn btn-sm me-2 ${item.isActive ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                        onClick={() => handleToggle(item.id)}
                      >
                        {item.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(item.id, item.name)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-muted">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsGroup>('programs');

  const tabs: { label: string; value: SettingsGroup }[] = [
    { label: 'Programs', value: 'programs' },
    { label: 'City of Camp', value: 'cityOfCamp' },
    { label: 'City of Preview', value: 'cityOfPreview' },
    { label: 'Venues', value: 'introductoryVenues' },
    { label: 'Payment Modes', value: 'paymentModes' },
    { label: 'Channels', value: 'confirmationChannels' },
    { label: 'Call Statuses', value: 'callStatuses' },
  ];

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h2 className="mb-1">Settings</h2>
        <p className="text-muted">Manage system-wide dropdown options and configurations.</p>
      </div>

      <div className="row">
        <div className="col-lg-3">
          <div className="list-group shadow-sm border-0 mb-4 sticky-top" style={{ top: '1rem' }}>
            {tabs.map(tab => (
              <button
                key={tab.value}
                className={`list-group-item list-group-item-action border-0 px-4 py-3 ${activeTab === tab.value ? 'active bg-primary' : ''}`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="col-lg-9">
          <div className="tab-content">
            {activeTab === 'programs' && <SettingGroupManager title="Programs" group="programs" />}
            {activeTab === 'cityOfCamp' && <SettingGroupManager title="City of Camp" group="cityOfCamp" />}
            {activeTab === 'cityOfPreview' && <SettingGroupManager title="City of Preview" group="cityOfPreview" />}
            {activeTab === 'introductoryVenues' && <SettingGroupManager title="Introductory Venues" group="introductoryVenues" />}
            {activeTab === 'paymentModes' && <SettingGroupManager title="Payment Modes" group="paymentModes" />}
            {activeTab === 'confirmationChannels' && <SettingGroupManager title="Confirmation Channels" group="confirmationChannels" />}
            {activeTab === 'callStatuses' && <SettingGroupManager title="Call Statuses" group="callStatuses" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

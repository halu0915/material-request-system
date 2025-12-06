import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

export default function Addresses() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    site_name: '',
    contact_person: '',
    contact_phone: '',
    is_default: false
  });

  const { data, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await api.get('/api/addresses');
      return response.data;
    }
  });

  const addresses = data?.addresses || [];

  const createAddress = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/api/addresses', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      resetForm();
      alert('地址建立成功');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || '建立失敗');
    }
  });

  const updateAddress = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.put(`/api/addresses/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      resetForm();
      alert('地址更新成功');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || '更新失敗');
    }
  });

  const deleteAddress = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/addresses/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      alert('地址已刪除');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || '刪除失敗');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      site_name: '',
      contact_person: '',
      contact_phone: '',
      is_default: false
    });
    setEditingAddress(null);
    setShowForm(false);
  };

  const handleEdit = (address: any) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      address: address.address,
      site_name: address.site_name || '',
      contact_person: address.contact_person || '',
      contact_phone: address.contact_phone || '',
      is_default: address.is_default || false
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddress) {
      updateAddress.mutate({ id: editingAddress.id, data: formData });
    } else {
      createAddress.mutate(formData);
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`確定要刪除地址「${name}」嗎？此操作無法復原。`)) {
      deleteAddress.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">地址管理</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          新增地址
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingAddress ? '編輯地址' : '新增地址'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                地址名稱 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                工區 <span className="text-gray-400 text-xs">(選填)</span>
              </label>
              <input
                type="text"
                value={formData.site_name}
                onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                placeholder="例如：三總"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">工區名稱，例如：三總、金山、關西等</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                送貨地址 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="例如：三總 - 台北市內湖區成功路二段325號"
              />
              <p className="mt-1 text-xs text-gray-500">建議格式：工區 - 詳細地址</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                聯絡人 <span className="text-gray-400 text-xs">(選填)</span>
              </label>
              <input
                type="text"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                聯絡電話 <span className="text-gray-400 text-xs">(選填)</span>
              </label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_default"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_default" className="ml-2 block text-sm text-gray-700">
                設為預設地址
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={createAddress.isPending || updateAddress.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {createAddress.isPending || updateAddress.isPending ? '處理中...' : (editingAddress ? '更新' : '建立')}
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <p className="text-gray-500 mb-4">尚無地址</p>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            建立第一個地址 →
          </button>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    地址名稱
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    工區
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    送貨地址
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    聯絡人
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    聯絡電話
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {addresses.map((address: any) => (
                  <tr key={address.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {address.name}
                      {address.is_default && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">預設</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {address.site_name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {address.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {address.contact_person || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {address.contact_phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(address)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => handleDelete(address.id, address.name)}
                        disabled={deleteAddress.isPending}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deleteAddress.isPending ? '刪除中...' : '刪除'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

export default function Addresses() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    site_name: '',
    contact_person: '',
    contact_phone: '',
    is_default: false
  });

  const { data, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await api.get('/api/addresses');
      return response.data;
    }
  });

  const addresses = data?.addresses || [];

  const createAddress = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/api/addresses', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      resetForm();
      alert('地址建立成功');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || '建立失敗');
    }
  });

  const updateAddress = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.put(`/api/addresses/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      resetForm();
      alert('地址更新成功');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || '更新失敗');
    }
  });

  const deleteAddress = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/addresses/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      alert('地址已刪除');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || '刪除失敗');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      site_name: '',
      contact_person: '',
      contact_phone: '',
      is_default: false
    });
    setEditingAddress(null);
    setShowForm(false);
  };

  const handleEdit = (address: any) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      address: address.address,
      site_name: address.site_name || '',
      contact_person: address.contact_person || '',
      contact_phone: address.contact_phone || '',
      is_default: address.is_default || false
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddress) {
      updateAddress.mutate({ id: editingAddress.id, data: formData });
    } else {
      createAddress.mutate(formData);
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`確定要刪除地址「${name}」嗎？此操作無法復原。`)) {
      deleteAddress.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">地址管理</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          新增地址
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingAddress ? '編輯地址' : '新增地址'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                地址名稱 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                工區 <span className="text-gray-400 text-xs">(選填)</span>
              </label>
              <input
                type="text"
                value={formData.site_name}
                onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                placeholder="例如：三總"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">工區名稱，例如：三總、金山、關西等</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                送貨地址 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="例如：三總 - 台北市內湖區成功路二段325號"
              />
              <p className="mt-1 text-xs text-gray-500">建議格式：工區 - 詳細地址</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                聯絡人 <span className="text-gray-400 text-xs">(選填)</span>
              </label>
              <input
                type="text"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                聯絡電話 <span className="text-gray-400 text-xs">(選填)</span>
              </label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_default"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_default" className="ml-2 block text-sm text-gray-700">
                設為預設地址
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={createAddress.isPending || updateAddress.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {createAddress.isPending || updateAddress.isPending ? '處理中...' : (editingAddress ? '更新' : '建立')}
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <p className="text-gray-500 mb-4">尚無地址</p>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            建立第一個地址 →
          </button>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    地址名稱
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    工區
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    送貨地址
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    聯絡人
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    聯絡電話
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {addresses.map((address: any) => (
                  <tr key={address.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {address.name}
                      {address.is_default && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">預設</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {address.site_name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {address.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {address.contact_person || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {address.contact_phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(address)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => handleDelete(address.id, address.name)}
                        disabled={deleteAddress.isPending}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deleteAddress.isPending ? '刪除中...' : '刪除'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

export default function Addresses() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    site_name: '',
    contact_person: '',
    contact_phone: '',
    is_default: false
  });

  const { data, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await api.get('/api/addresses');
      return response.data;
    }
  });

  const addresses = data?.addresses || [];

  const createAddress = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/api/addresses', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      resetForm();
      alert('地址建立成功');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || '建立失敗');
    }
  });

  const updateAddress = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.put(`/api/addresses/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      resetForm();
      alert('地址更新成功');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || '更新失敗');
    }
  });

  const deleteAddress = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/addresses/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      alert('地址已刪除');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || '刪除失敗');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      site_name: '',
      contact_person: '',
      contact_phone: '',
      is_default: false
    });
    setEditingAddress(null);
    setShowForm(false);
  };

  const handleEdit = (address: any) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      address: address.address,
      site_name: address.site_name || '',
      contact_person: address.contact_person || '',
      contact_phone: address.contact_phone || '',
      is_default: address.is_default || false
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddress) {
      updateAddress.mutate({ id: editingAddress.id, data: formData });
    } else {
      createAddress.mutate(formData);
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`確定要刪除地址「${name}」嗎？此操作無法復原。`)) {
      deleteAddress.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">地址管理</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          新增地址
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingAddress ? '編輯地址' : '新增地址'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                地址名稱 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                工區 <span className="text-gray-400 text-xs">(選填)</span>
              </label>
              <input
                type="text"
                value={formData.site_name}
                onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                placeholder="例如：三總"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">工區名稱，例如：三總、金山、關西等</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                送貨地址 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="例如：三總 - 台北市內湖區成功路二段325號"
              />
              <p className="mt-1 text-xs text-gray-500">建議格式：工區 - 詳細地址</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                聯絡人 <span className="text-gray-400 text-xs">(選填)</span>
              </label>
              <input
                type="text"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                聯絡電話 <span className="text-gray-400 text-xs">(選填)</span>
              </label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_default"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_default" className="ml-2 block text-sm text-gray-700">
                設為預設地址
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={createAddress.isPending || updateAddress.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {createAddress.isPending || updateAddress.isPending ? '處理中...' : (editingAddress ? '更新' : '建立')}
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <p className="text-gray-500 mb-4">尚無地址</p>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            建立第一個地址 →
          </button>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    地址名稱
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    工區
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    送貨地址
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    聯絡人
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    聯絡電話
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {addresses.map((address: any) => (
                  <tr key={address.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {address.name}
                      {address.is_default && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">預設</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {address.site_name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {address.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {address.contact_person || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {address.contact_phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(address)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => handleDelete(address.id, address.name)}
                        disabled={deleteAddress.isPending}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deleteAddress.isPending ? '刪除中...' : '刪除'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

export default function Addresses() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    site_name: '',
    contact_person: '',
    contact_phone: '',
    is_default: false
  });

  const { data, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await api.get('/api/addresses');
      return response.data;
    }
  });

  const addresses = data?.addresses || [];

  const createAddress = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/api/addresses', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      resetForm();
      alert('地址建立成功');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || '建立失敗');
    }
  });

  const updateAddress = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.put(`/api/addresses/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      resetForm();
      alert('地址更新成功');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || '更新失敗');
    }
  });

  const deleteAddress = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/addresses/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      alert('地址已刪除');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || '刪除失敗');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      site_name: '',
      contact_person: '',
      contact_phone: '',
      is_default: false
    });
    setEditingAddress(null);
    setShowForm(false);
  };

  const handleEdit = (address: any) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      address: address.address,
      site_name: address.site_name || '',
      contact_person: address.contact_person || '',
      contact_phone: address.contact_phone || '',
      is_default: address.is_default || false
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddress) {
      updateAddress.mutate({ id: editingAddress.id, data: formData });
    } else {
      createAddress.mutate(formData);
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`確定要刪除地址「${name}」嗎？此操作無法復原。`)) {
      deleteAddress.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">地址管理</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          新增地址
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingAddress ? '編輯地址' : '新增地址'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                地址名稱 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                工區 <span className="text-gray-400 text-xs">(選填)</span>
              </label>
              <input
                type="text"
                value={formData.site_name}
                onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                placeholder="例如：三總"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">工區名稱，例如：三總、金山、關西等</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                送貨地址 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="例如：三總 - 台北市內湖區成功路二段325號"
              />
              <p className="mt-1 text-xs text-gray-500">建議格式：工區 - 詳細地址</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                聯絡人 <span className="text-gray-400 text-xs">(選填)</span>
              </label>
              <input
                type="text"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                聯絡電話 <span className="text-gray-400 text-xs">(選填)</span>
              </label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_default"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_default" className="ml-2 block text-sm text-gray-700">
                設為預設地址
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={createAddress.isPending || updateAddress.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {createAddress.isPending || updateAddress.isPending ? '處理中...' : (editingAddress ? '更新' : '建立')}
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <p className="text-gray-500 mb-4">尚無地址</p>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            建立第一個地址 →
          </button>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    地址名稱
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    工區
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    送貨地址
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    聯絡人
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    聯絡電話
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {addresses.map((address: any) => (
                  <tr key={address.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {address.name}
                      {address.is_default && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">預設</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {address.site_name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {address.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {address.contact_person || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {address.contact_phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(address)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => handleDelete(address.id, address.name)}
                        disabled={deleteAddress.isPending}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deleteAddress.isPending ? '刪除中...' : '刪除'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

export default function Addresses() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    site_name: '',
    contact_person: '',
    contact_phone: '',
    is_default: false
  });

  const { data, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await api.get('/api/addresses');
      return response.data;
    }
  });

  const addresses = data?.addresses || [];

  const createAddress = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/api/addresses', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      resetForm();
      alert('地址建立成功');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || '建立失敗');
    }
  });

  const updateAddress = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.put(`/api/addresses/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      resetForm();
      alert('地址更新成功');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || '更新失敗');
    }
  });

  const deleteAddress = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/addresses/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      alert('地址已刪除');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || '刪除失敗');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      site_name: '',
      contact_person: '',
      contact_phone: '',
      is_default: false
    });
    setEditingAddress(null);
    setShowForm(false);
  };

  const handleEdit = (address: any) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      address: address.address,
      site_name: address.site_name || '',
      contact_person: address.contact_person || '',
      contact_phone: address.contact_phone || '',
      is_default: address.is_default || false
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddress) {
      updateAddress.mutate({ id: editingAddress.id, data: formData });
    } else {
      createAddress.mutate(formData);
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`確定要刪除地址「${name}」嗎？此操作無法復原。`)) {
      deleteAddress.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">地址管理</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          新增地址
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingAddress ? '編輯地址' : '新增地址'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                地址名稱 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                工區 <span className="text-gray-400 text-xs">(選填)</span>
              </label>
              <input
                type="text"
                value={formData.site_name}
                onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                placeholder="例如：三總"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">工區名稱，例如：三總、金山、關西等</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                送貨地址 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="例如：三總 - 台北市內湖區成功路二段325號"
              />
              <p className="mt-1 text-xs text-gray-500">建議格式：工區 - 詳細地址</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                聯絡人 <span className="text-gray-400 text-xs">(選填)</span>
              </label>
              <input
                type="text"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                聯絡電話 <span className="text-gray-400 text-xs">(選填)</span>
              </label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_default"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_default" className="ml-2 block text-sm text-gray-700">
                設為預設地址
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={createAddress.isPending || updateAddress.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {createAddress.isPending || updateAddress.isPending ? '處理中...' : (editingAddress ? '更新' : '建立')}
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <p className="text-gray-500 mb-4">尚無地址</p>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            建立第一個地址 →
          </button>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    地址名稱
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    工區
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    送貨地址
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    聯絡人
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    聯絡電話
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {addresses.map((address: any) => (
                  <tr key={address.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {address.name}
                      {address.is_default && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">預設</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {address.site_name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {address.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {address.contact_person || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {address.contact_phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(address)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => handleDelete(address.id, address.name)}
                        disabled={deleteAddress.isPending}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deleteAddress.isPending ? '刪除中...' : '刪除'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

export default function Addresses() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    site_name: '',
    contact_person: '',
    contact_phone: '',
    is_default: false
  });

  const { data, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await api.get('/api/addresses');
      return response.data;
    }
  });

  const addresses = data?.addresses || [];

  const createAddress = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/api/addresses', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      resetForm();
      alert('地址建立成功');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || '建立失敗');
    }
  });

  const updateAddress = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.put(`/api/addresses/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      resetForm();
      alert('地址更新成功');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || '更新失敗');
    }
  });

  const deleteAddress = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/addresses/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      alert('地址已刪除');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || '刪除失敗');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      site_name: '',
      contact_person: '',
      contact_phone: '',
      is_default: false
    });
    setEditingAddress(null);
    setShowForm(false);
  };

  const handleEdit = (address: any) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      address: address.address,
      site_name: address.site_name || '',
      contact_person: address.contact_person || '',
      contact_phone: address.contact_phone || '',
      is_default: address.is_default || false
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddress) {
      updateAddress.mutate({ id: editingAddress.id, data: formData });
    } else {
      createAddress.mutate(formData);
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`確定要刪除地址「${name}」嗎？此操作無法復原。`)) {
      deleteAddress.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">地址管理</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          新增地址
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingAddress ? '編輯地址' : '新增地址'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                地址名稱 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                工區 <span className="text-gray-400 text-xs">(選填)</span>
              </label>
              <input
                type="text"
                value={formData.site_name}
                onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                placeholder="例如：三總"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">工區名稱，例如：三總、金山、關西等</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                送貨地址 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="例如：三總 - 台北市內湖區成功路二段325號"
              />
              <p className="mt-1 text-xs text-gray-500">建議格式：工區 - 詳細地址</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                聯絡人 <span className="text-gray-400 text-xs">(選填)</span>
              </label>
              <input
                type="text"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                聯絡電話 <span className="text-gray-400 text-xs">(選填)</span>
              </label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_default"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_default" className="ml-2 block text-sm text-gray-700">
                設為預設地址
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={createAddress.isPending || updateAddress.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {createAddress.isPending || updateAddress.isPending ? '處理中...' : (editingAddress ? '更新' : '建立')}
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <p className="text-gray-500 mb-4">尚無地址</p>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            建立第一個地址 →
          </button>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    地址名稱
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    工區
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    送貨地址
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    聯絡人
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    聯絡電話
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {addresses.map((address: any) => (
                  <tr key={address.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {address.name}
                      {address.is_default && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">預設</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {address.site_name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {address.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {address.contact_person || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {address.contact_phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(address)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => handleDelete(address.id, address.name)}
                        disabled={deleteAddress.isPending}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deleteAddress.isPending ? '刪除中...' : '刪除'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


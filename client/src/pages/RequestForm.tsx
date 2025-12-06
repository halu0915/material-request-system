import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

interface RequestItem {
  material_id: number;
  quantity: number;
  unit?: string;
  notes?: string;
}

export default function RequestForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [constructionCategoryId, setConstructionCategoryId] = useState<number | ''>('');
  const [companyId, setCompanyId] = useState<number | string | ''>(''); // 可以是數字（數據庫）或字串（環境變數）
  const [addressId, setAddressId] = useState<number | ''>(''); // 地址 ID
  const [items, setItems] = useState<RequestItem[]>([]);
  const [notes, setNotes] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<number | ''>('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    address: '',
    site_name: '',
    contact_person: '',
    contact_phone: '',
    is_default: false
  });

  // Fetch construction categories
  const { data: constructionCategories } = useQuery({
    queryKey: ['construction-categories'],
    queryFn: async () => {
      const response = await api.get('/api/materials/construction-categories');
      return response.data.categories;
    }
  });

  // Fetch companies
  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const response = await api.get('/api/companies');
      return response.data.companies;
    }
  });

  // Fetch addresses
  const { data: addresses, isLoading: addressesLoading, error: addressesError } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/addresses');
        console.log('地址 API 回應:', response.data);
        // 確保返回的是數組
        const addressList = response.data?.addresses || response.data || [];
        console.log('地址列表:', addressList);
        return Array.isArray(addressList) ? addressList : [];
      } catch (error: any) {
        console.error('載入地址列表錯誤:', error);
        throw error;
      }
    }
  });

  // Create address mutation
  const createAddress = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/api/addresses', data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      // 自動選擇新建立的地址
      if (data?.address?.id) {
        setAddressId(data.address.id);
      }
      setShowAddressForm(false);
      // 重置表單
      setNewAddress({
        name: '',
        address: '',
        site_name: '',
        contact_person: '',
        contact_phone: '',
        is_default: false
      });
      alert('地址建立成功！');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || '建立地址失敗');
    }
  });

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.name || !newAddress.address) {
      alert('請填寫地址名稱和完整地址');
      return;
    }
    createAddress.mutate(newAddress);
  };

  // Fetch materials based on construction category
  const { data: materials } = useQuery({
    queryKey: ['materials', constructionCategoryId],
    queryFn: async () => {
      if (!constructionCategoryId) return [];
      const response = await api.get('/api/materials', {
        params: { constructionCategory: constructionCategoryId }
      });
      return response.data.materials;
    },
    enabled: !!constructionCategoryId
  });

  // Create request mutation
  const createRequest = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/api/requests', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      navigate('/requests');
    }
  });

  const handleAddItem = () => {
    if (!selectedMaterial) return;
    
    const material = materials?.find((m: any) => m.id === parseInt(selectedMaterial as string));
    if (!material) return;

    // Check if material already added
    if (items.find(item => item.material_id === material.id)) {
      alert('此材料已加入');
      return;
    }

    setItems([...items, {
      material_id: material.id,
      quantity: 1,
      unit: material.unit || '',
      notes: ''
    }]);
    setSelectedMaterial('');
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!constructionCategoryId || items.length === 0) {
      alert('請選擇施工類別並至少新增一項材料');
      return;
    }

    createRequest.mutate({
      construction_category_id: constructionCategoryId,
      company_id: companyId || null,
      address_id: addressId || null,
      items,
      notes
    });
  };

  // Get selected address details
  const selectedAddress = addresses?.find((addr: any) => addr.id === addressId);

  // 提取工區名稱（從地址中）
  const extractSiteName = (address?: string): string => {
    if (!address) return '';
    const parts = address.split(' - ');
    if (parts.length > 1 && parts[0].trim()) {
      return parts[0].trim();
    }
    const parts2 = address.split('-');
    if (parts2.length > 1 && parts2[0].trim()) {
      return parts2[0].trim();
    }
    return '';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">新增叫料單</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            公司 <span className="text-gray-400 text-xs">(選填)</span>
          </label>
          <select
            value={companyId}
            onChange={(e) => {
              const value = e.target.value;
              // 環境變數公司的 ID 是字串（如 "env_0"），數據庫公司的 ID 是數字
              setCompanyId(value ? (isNaN(Number(value)) ? value : Number(value)) : '');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">請選擇公司（選填）</option>
            {companies?.map((company: any) => (
              <option key={company.id} value={company.id}>
                {company.name} {company.tax_id ? `(${company.tax_id})` : ''}
                {company.is_from_env && ' [系統預設]'}
              </option>
            ))}
          </select>
          {companies?.length === 0 && (
            <p className="mt-1 text-sm text-gray-500">尚未建立公司，Excel 將使用預設公司資訊</p>
          )}
          {companies && companies.some((c: any) => c.is_from_env) && (
            <p className="mt-1 text-sm text-gray-500">標記 [系統預設] 的公司來自環境變數，不可修改或刪除</p>
          )}
        </div>

        {/* Address Selection */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              工區/送貨地址 <span className="text-gray-400 text-xs">(選填)</span>
            </label>
            <button
              type="button"
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showAddressForm ? '取消建立' : '+ 快速建立地址'}
            </button>
          </div>
          
          {showAddressForm && (
            <div className="mb-4 p-4 bg-gray-50 rounded-md border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">快速建立地址</h3>
              <form onSubmit={handleCreateAddress} className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">地址名稱 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="例如：三總工地"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">工區</label>
                  <input
                    type="text"
                    value={newAddress.site_name}
                    onChange={(e) => setNewAddress({ ...newAddress, site_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="例如：三總"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">完整地址 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="例如：台北市內湖區成功路二段325號"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">聯絡人</label>
                    <input
                      type="text"
                      value={newAddress.contact_person}
                      onChange={(e) => setNewAddress({ ...newAddress, contact_person: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="選填"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">聯繫電話</label>
                    <input
                      type="text"
                      value={newAddress.contact_phone}
                      onChange={(e) => setNewAddress({ ...newAddress, contact_phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="選填"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={newAddress.is_default}
                    onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_default" className="ml-2 block text-xs text-gray-700">
                    設為預設地址
                  </label>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddressForm(false);
                      setNewAddress({
                        name: '',
                        address: '',
                        site_name: '',
                        contact_person: '',
                        contact_phone: '',
                        is_default: false
                      });
                    }}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={createAddress.isPending}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {createAddress.isPending ? '建立中...' : '建立'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {addressesLoading ? (
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm">
              載入地址中...
            </div>
          ) : addressesError ? (
            <div className="w-full px-3 py-2 border border-red-300 rounded-md bg-red-50 text-red-600 text-sm">
              載入地址失敗，請重新整理頁面
            </div>
          ) : (
            <select
              value={addressId}
              onChange={(e) => {
                const value = e.target.value;
                console.log('選擇地址:', value);
                setAddressId(value ? parseInt(value) : '');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">請選擇工區/地址（選填）</option>
              {addresses && Array.isArray(addresses) && addresses.length > 0 ? (
                addresses.map((address: any) => {
                  const siteName = address.site_name || extractSiteName(address.address);
                  const displayName = siteName ? `${siteName} - ${address.name}` : address.name;
                  return (
                    <option key={address.id} value={address.id}>
                      {displayName} {address.is_default && '(預設)'}
                    </option>
                  );
                })
              ) : (
                <option value="" disabled>尚無地址，請先建立地址</option>
              )}
            </select>
          )}
          {selectedAddress && (
            <div className="mt-3 p-4 bg-blue-50 rounded-md border border-blue-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">已選擇的地址資訊</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {(selectedAddress.site_name || extractSiteName(selectedAddress.address)) && (
                  <div className="bg-white p-2 rounded border border-gray-200">
                    <span className="block text-xs font-medium text-gray-500 mb-1">工區</span>
                    <span className="text-gray-900 font-medium">{selectedAddress.site_name || extractSiteName(selectedAddress.address)}</span>
                  </div>
                )}
                <div className="bg-white p-2 rounded border border-gray-200">
                  <span className="block text-xs font-medium text-gray-500 mb-1">送貨地址</span>
                  <span className="text-gray-900">{selectedAddress.address || '-'}</span>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                  <span className="block text-xs font-medium text-gray-500 mb-1">聯絡人</span>
                  <span className="text-gray-900">{selectedAddress.contact_person || '-'}</span>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                  <span className="block text-xs font-medium text-gray-500 mb-1">聯繫電話</span>
                  <span className="text-gray-900">{selectedAddress.contact_phone || '-'}</span>
                </div>
              </div>
            </div>
          )}
          {!addressesLoading && !addressesError && addresses && Array.isArray(addresses) && addresses.length === 0 && !showAddressForm && (
            <p className="mt-1 text-sm text-gray-500">尚未建立地址，請點擊「快速建立地址」或到地址管理建立地址</p>
          )}
          {addressesError && (
            <p className="mt-1 text-sm text-red-500">載入地址時發生錯誤，請檢查網路連線或重新整理頁面</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            施工類別 <span className="text-red-500">*</span>
          </label>
          <select
            value={constructionCategoryId}
            onChange={(e) => {
              setConstructionCategoryId(e.target.value ? parseInt(e.target.value) : '');
              setItems([]); // Clear items when category changes
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">請選擇施工類別</option>
            {constructionCategories?.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {constructionCategoryId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              選擇材料
            </label>
            <div className="flex gap-2">
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value ? parseInt(e.target.value) : '')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">請選擇材料</option>
                {materials?.map((material: any) => (
                  <option key={material.id} value={material.id}>
                    {material.material_category_name} - {material.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                新增
              </button>
            </div>
          </div>
        )}

        {items.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              材料清單
            </label>
            <div className="space-y-3">
              {items.map((item, index) => {
                const material = materials?.find((m: any) => m.id === item.material_id);
                return (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium">{material?.material_category_name} - {material?.name}</p>
                        <p className="text-sm text-gray-500">單位: {item.unit || material?.unit || '無'}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        移除
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">數量</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">備註</label>
                        <input
                          type="text"
                          value={item.notes || ''}
                          onChange={(e) => handleUpdateItem(index, 'notes', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="選填"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            備註
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="選填"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/requests')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={createRequest.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {createRequest.isPending ? '建立中...' : '建立叫料單'}
          </button>
        </div>
      </form>
    </div>
  );
}


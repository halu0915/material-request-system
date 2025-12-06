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
  const { data: addresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await api.get('/api/addresses');
      return response.data.addresses;
    }
  });

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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            送貨地址 <span className="text-gray-400 text-xs">(選填)</span>
          </label>
          <select
            value={addressId}
            onChange={(e) => setAddressId(e.target.value ? parseInt(e.target.value) : '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">請選擇地址（選填）</option>
            {addresses?.map((address: any) => (
              <option key={address.id} value={address.id}>
                {address.name} {address.is_default && '(預設)'}
              </option>
            ))}
          </select>
          {selectedAddress && (
            <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">送貨地址：</span>
                  <span className="text-gray-600">{selectedAddress.address}</span>
                </div>
                {selectedAddress.contact_person && (
                  <div>
                    <span className="font-medium text-gray-700">聯絡人：</span>
                    <span className="text-gray-600">{selectedAddress.contact_person}</span>
                  </div>
                )}
                {selectedAddress.contact_phone && (
                  <div>
                    <span className="font-medium text-gray-700">聯絡電話：</span>
                    <span className="text-gray-600">{selectedAddress.contact_phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {addresses?.length === 0 && (
            <p className="mt-1 text-sm text-gray-500">尚未建立地址，請先到地址管理建立地址</p>
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


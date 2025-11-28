import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

export default function Materials() {
  const queryClient = useQueryClient();
  const [showImportForm, setShowImportForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: materials } = useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      const response = await api.get('/api/materials');
      return response.data.materials;
    }
  });

  const { data: constructionCategories } = useQuery({
    queryKey: ['construction-categories'],
    queryFn: async () => {
      const response = await api.get('/api/materials/construction-categories');
      return response.data.categories;
    }
  });

  const { data: materialCategories } = useQuery({
    queryKey: ['material-categories'],
    queryFn: async () => {
      const response = await api.get('/api/materials/material-categories');
      return response.data.categories;
    }
  });

  const importMaterials = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/api/materials/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['construction-categories'] });
      queryClient.invalidateQueries({ queryKey: ['material-categories'] });
      setShowImportForm(false);
      setSelectedFile(null);
      alert('材料匯入成功！');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || '匯入失敗');
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (!selectedFile) {
      alert('請選擇檔案');
      return;
    }
    importMaterials.mutate(selectedFile);
  };

  // Group materials by construction category
  const groupedMaterials = materials?.reduce((acc: any, material: any) => {
    const key = material.construction_category_name || '未分類';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(material);
    return acc;
  }, {}) || {};

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">材料管理</h1>
        <button
          onClick={() => setShowImportForm(!showImportForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showImportForm ? '取消匯入' : '匯入Excel'}
        </button>
      </div>

      {showImportForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">從Excel匯入材料</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                選擇Excel檔案
              </label>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="mt-2 text-sm text-gray-500">
                Excel格式：施工類別、材料類別、材料名稱、單位（選填）
              </p>
            </div>
            {selectedFile && (
              <button
                onClick={handleImport}
                disabled={importMaterials.isPending}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {importMaterials.isPending ? '匯入中...' : '開始匯入'}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            總計 {materials?.length || 0} 項材料，{Object.keys(groupedMaterials).length} 個施工類別
          </p>
        </div>

        {Object.keys(groupedMaterials).length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>尚無材料資料</p>
            <p className="text-sm mt-2">請匯入Excel檔案或手動新增材料</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedMaterials).map(([constructionCategory, materialsList]: [string, any]) => (
              <div key={constructionCategory} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{constructionCategory}</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">材料類別</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">材料名稱</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">單位</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {materialsList.map((material: any) => (
                        <tr key={material.id}>
                          <td className="px-4 py-3 text-sm text-gray-900">{material.material_category_name}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{material.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{material.unit || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


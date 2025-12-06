import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../utils/api';

export default function RequestList() {
  const queryClient = useQueryClient();
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | number | ''>('');
  const [pendingDownload, setPendingDownload] = useState<{ requestId: number; requestNumber: string } | null>(null);

  // Fetch companies for selection
  const { data: companiesData } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const response = await api.get('/api/companies');
      return response.data;
    }
  });

  const companies = companiesData?.companies || [];
  
  const { data, isLoading } = useQuery({
    queryKey: ['requests'],
    queryFn: async () => {
      const response = await api.get('/api/requests');
      return response.data;
    }
  });

  const deleteRequest = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/requests/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    }
  });

  const handleDelete = async (id: number, requestNumber: string) => {
    if (window.confirm(`確定要刪除叫料單 ${requestNumber} 嗎？此操作無法復原。`)) {
      try {
        await deleteRequest.mutateAsync(id);
        alert('叫料單已刪除');
      } catch (error: any) {
        alert(error.response?.data?.error || '刪除失敗');
      }
    }
  };

  const handleDownloadExcel = async (requestId: number, requestNumber: string, companyId?: string | number) => {
    try {
      const params: any = {};
      if (companyId) {
        params.company_id = companyId;
      }
      
      const response = await api.get(`/api/requests/${requestId}/excel`, {
        params,
        responseType: 'blob',
        validateStatus: (status) => status === 200
      });
      
      // 檢查響應類型，確保是 Excel 文件
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('spreadsheet') && !contentType.includes('excel') && !contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        // 如果不是 Excel 文件，嘗試讀取為文本（可能是錯誤訊息）
        const text = await response.data.text();
        try {
          const errorData = JSON.parse(text);
          alert(errorData.error || '下載 Excel 失敗');
        } catch {
          alert('下載 Excel 失敗：伺服器返回了非預期的響應');
        }
        return;
      }
      
      // 從 Content-Disposition header 獲取文件名，或使用默認名稱
      const contentDisposition = response.headers['content-disposition'];
      let filename = `${requestNumber}.xlsx`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = decodeURIComponent(filenameMatch[1].replace(/['"]/g, ''));
        }
      }
      
      // 創建下載連結
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('下載 Excel 失敗:', error);
      
      // 如果是 blob 類型的錯誤響應，嘗試讀取錯誤訊息
      if (error.response && error.response.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const errorData = JSON.parse(text);
          alert(errorData.error || '下載 Excel 失敗');
        } catch {
          if (error.response.status === 401) {
            alert('請先登入');
            window.location.href = '/login';
          } else if (error.response.status === 404) {
            alert('找不到叫料單');
          } else {
            alert('下載 Excel 失敗，請稍後再試');
          }
        }
      } else {
        alert(error.response?.data?.error || '下載 Excel 失敗，請稍後再試');
      }
    }
  };

  const handleDownloadClick = (requestId: number, requestNumber: string) => {
    setPendingDownload({ requestId, requestNumber });
    setShowCompanyDialog(true);
    setSelectedCompanyId('');
  };

  const handleConfirmDownload = () => {
    if (pendingDownload) {
      setShowCompanyDialog(false);
      handleDownloadExcel(pendingDownload.requestId, pendingDownload.requestNumber, selectedCompanyId || undefined);
      setPendingDownload(null);
      setSelectedCompanyId('');
    }
  };

  const handleCancelDownload = () => {
    setShowCompanyDialog(false);
    setPendingDownload(null);
    setSelectedCompanyId('');
  };

  const requests = data?.requests || [];

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
        <h1 className="text-2xl font-bold text-gray-900">叫料單列表</h1>
        <Link
          to="/requests/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          新增叫料單
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <p className="text-gray-500 mb-4">尚無叫料單</p>
          <Link
            to="/requests/new"
            className="text-blue-600 hover:text-blue-800"
          >
            建立第一張叫料單 →
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    單號
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    工區
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    施工類別
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    材料名稱
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    數量
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request: any) => {
                  const siteName = extractSiteName(request.delivery_address);
                  // 處理材料名稱：如果有多個，顯示前幾個，超過的用"等"
                  const materialNames = request.material_names || '';
                  const materialNamesDisplay = materialNames 
                    ? (materialNames.length > 30 ? materialNames.substring(0, 30) + '...' : materialNames)
                    : '-';
                  // 處理數量：顯示總數量
                  const totalQuantity = request.total_quantity || 0;
                  
                  return (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request.request_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {siteName || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.construction_category_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {materialNamesDisplay}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {totalQuantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/requests/${request.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          查看
                        </Link>
                      <button
                        onClick={() => handleDownloadClick(request.id, request.request_number)}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        下載 Excel
                      </button>
                        <button
                          onClick={() => handleDelete(request.id, request.request_number)}
                          disabled={deleteRequest.isPending}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {deleteRequest.isPending ? '刪除中...' : '刪除'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Company Selection Dialog */}
      {showCompanyDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">選擇公司</h2>
            <p className="text-sm text-gray-600 mb-4">請選擇要顯示在 Excel 中的公司名稱與統編</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                公司 <span className="text-gray-400 text-xs">(選填，不選擇則使用原叫料單的公司)</span>
              </label>
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value ? (isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value)) : '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">使用原叫料單的公司</option>
                {companies.map((company: any) => (
                  <option key={company.id} value={company.id}>
                    {company.name} {company.tax_id ? `(${company.tax_id})` : ''}
                    {company.is_from_env && ' [系統預設]'}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDownload}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDownload}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                下載
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


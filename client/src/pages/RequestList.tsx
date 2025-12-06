import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

export default function RequestList() {
  const queryClient = useQueryClient();
  
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
                    叫料單號
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    工區
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    施工類別
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    狀態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    建立日期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request: any) => {
                  const siteName = extractSiteName(request.delivery_address);
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.status === 'pending' ? '待處理' :
                         request.status === 'completed' ? '已完成' :
                         request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.created_at).toLocaleString('zh-TW')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/requests/${request.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        查看
                      </Link>
                      <a
                        href={`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/requests/${request.id}/excel`}
                        className="text-green-600 hover:text-green-900 mr-4"
                        download
                      >
                        下載 Excel
                      </a>
                      <button
                        onClick={() => handleDelete(request.id, request.request_number)}
                        disabled={deleteRequest.isPending}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deleteRequest.isPending ? '刪除中...' : '刪除'}
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


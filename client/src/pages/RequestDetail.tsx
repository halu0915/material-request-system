import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

export default function RequestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['request', id],
    queryFn: async () => {
      const response = await api.get(`/api/requests/${id}`);
      return response.data;
    }
  });

  const deleteRequest = useMutation({
    mutationFn: async (requestId: number) => {
      const response = await api.delete(`/api/requests/${requestId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      navigate('/requests');
    }
  });

  const handleDelete = async () => {
    if (!id || !data?.request) return;
    
    if (window.confirm(`確定要刪除叫料單 ${data.request.request_number} 嗎？此操作無法復原。`)) {
      try {
        await deleteRequest.mutateAsync(parseInt(id));
        alert('叫料單已刪除');
      } catch (error: any) {
        alert(error.response?.data?.error || '刪除失敗');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">找不到叫料單</p>
        <Link to="/requests" className="text-blue-600 hover:text-blue-800">
          返回列表 →
        </Link>
      </div>
    );
  }

  const { request, items } = data;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Link
          to="/requests"
          className="text-blue-600 hover:text-blue-800"
        >
          ← 返回列表
        </Link>
        <div className="flex gap-3">
          <a
            href={`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/requests/${id}/excel`}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            download
          >
            下載 Excel
          </a>
          <button
            onClick={handleDelete}
            disabled={deleteRequest.isPending}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {deleteRequest.isPending ? '刪除中...' : '刪除叫料單'}
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">叫料單詳情</h1>
        </div>

        <div className="px-6 py-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">叫料單號</label>
              <p className="text-lg font-semibold text-gray-900">{request.request_number}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">狀態</label>
              <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                request.status === 'completed' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {request.status === 'pending' ? '待處理' :
                 request.status === 'completed' ? '已完成' :
                 request.status}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">施工類別</label>
              <p className="text-gray-900">{request.construction_category_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">建立日期</label>
              <p className="text-gray-900">{new Date(request.created_at).toLocaleString('zh-TW')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">建立人</label>
              <p className="text-gray-900">{request.user_name || request.user_email}</p>
            </div>
          </div>

          {request.notes && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">備註</label>
              <p className="text-gray-900 whitespace-pre-wrap">{request.notes}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-3">材料明細</label>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">材料類別</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">材料名稱</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">數量</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">單位</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">備註</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item: any) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.material_category_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.material_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{item.unit || item.material_unit || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{item.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


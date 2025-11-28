import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  const { data: requestsData } = useQuery({
    queryKey: ['requests'],
    queryFn: async () => {
      const response = await api.get('/api/requests');
      return response.data;
    }
  });

  const recentRequests = requestsData?.requests?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          歡迎回來，{user?.name || user?.email}
        </h1>
        {user?.isTrial && (
          <p className="text-sm text-yellow-600">您正在使用試用帳號</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/requests/new"
          className="bg-blue-600 text-white rounded-lg p-6 hover:bg-blue-700 transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">新增叫料單</h3>
              <p className="text-blue-100 text-sm mt-1">建立新的材料需求單</p>
            </div>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </Link>

        <Link
          to="/requests"
          className="bg-green-600 text-white rounded-lg p-6 hover:bg-green-700 transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">查看叫料單</h3>
              <p className="text-green-100 text-sm mt-1">查看所有叫料單記錄</p>
            </div>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </Link>

        <Link
          to="/materials"
          className="bg-purple-600 text-white rounded-lg p-6 hover:bg-purple-700 transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">材料管理</h3>
              <p className="text-purple-100 text-sm mt-1">管理材料資料庫</p>
            </div>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </Link>
      </div>

      {recentRequests.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">最近的叫料單</h2>
            <Link to="/requests" className="text-blue-600 hover:text-blue-800 text-sm">
              查看全部 →
            </Link>
          </div>
          <div className="space-y-3">
            {recentRequests.map((request: any) => (
              <Link
                key={request.id}
                to={`/requests/${request.id}`}
                className="block border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 rounded"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{request.request_number}</p>
                    <p className="text-sm text-gray-500">{request.construction_category_name}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {request.status === 'pending' ? '待處理' :
                     request.status === 'completed' ? '已完成' :
                     request.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(request.created_at).toLocaleString('zh-TW')}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


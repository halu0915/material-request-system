import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../utils/api';

export default function RequestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | number | ''>('');

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

  const handleDownloadExcel = async (companyId?: string | number) => {
    if (!id) return;
    try {
      const params: any = {};
      if (companyId) {
        params.company_id = companyId;
      }
      
      const response = await api.get(`/api/requests/${id}/excel`, {
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
      let filename = `叫料單-${id}.xlsx`;
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

  const handleDownloadClick = () => {
    setShowCompanyDialog(true);
    setSelectedCompanyId('');
  };

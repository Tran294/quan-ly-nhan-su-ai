
import React from 'react';
import { AIPrediction, Member } from '../types';

interface PredictionModalProps {
  member: Member;
  prediction: AIPrediction | null;
  onClose: () => void;
  isLoading: boolean;
}

export const PredictionModal: React.FC<PredictionModalProps> = ({ member, prediction, onClose, isLoading }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-indigo-600 p-8 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="flex items-center gap-4">
            <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-2xl border-2 border-white/20 shadow-lg" />
            <div>
              <h2 className="text-2xl font-bold">Dự đoán Vị trí AI</h2>
              <p className="text-indigo-100">Phân tích phân công tương lai cho {member.name}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium animate-pulse">Gemini đang phân tích lịch sử và các mẫu hiệu suất...</p>
            </div>
          ) : prediction ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Vị trí Đề xuất</p>
                  <p className="text-xl font-bold text-slate-900">{prediction.recommendedRole}</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Độ tin cậy AI</p>
                  <p className="text-xl font-bold text-slate-900">{Math.round(prediction.confidence * 100)}%</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Lý do lựa chọn
                </h4>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl italic">
                  "{prediction.reasoning}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Vị trí Thay thế</h4>
                  <div className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium inline-block">
                    {prediction.alternativeRole}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Định hướng Phát triển</h4>
                  <p className="text-sm text-slate-600">{prediction.suggestedImprovement}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={onClose}
                  className="px-6 py-2 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-lg"
                >
                  Xác nhận Phân công
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-rose-500">Không thể tạo dự đoán. Vui lòng thử lại.</p>
          )}
        </div>
      </div>
    </div>
  );
};

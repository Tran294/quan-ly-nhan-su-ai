
import React, { useState } from 'react';
import { Member, Role } from '../types';

interface AddMemberModalProps {
  onClose: () => void;
  onAdd: (member: Member) => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    strengths: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const newMember: Member = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      avatar: `https://picsum.photos/seed/${Date.now()}/100/100`,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      strengths: formData.strengths.split(',').map(s => s.trim()).filter(s => s),
      history: [],
      joinedDate: new Date().toISOString().split('T')[0]
    };

    onAdd(newMember);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Thêm Thành viên Mới</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Họ và Tên</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="VD: Nguyễn Văn A"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
            <input 
              required
              type="email" 
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Kỹ năng (cách nhau bằng dấu phẩy)</label>
            <textarea 
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-20"
              placeholder="VD: MC, Tiếng Anh, Thiết kế..."
              value={formData.skills}
              onChange={e => setFormData({...formData, skills: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Thế mạnh</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="VD: Nhiệt tình, Kỷ luật..."
              value={formData.strengths}
              onChange={e => setFormData({...formData, strengths: e.target.value})}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg"
            >
              Lưu Thành viên
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

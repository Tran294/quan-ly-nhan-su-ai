
import React, { useState, useMemo } from 'react';
import { Member, AIPrediction, Role } from './types';
import { predictMemberRole } from './services/geminiService';
import { StatsCard } from './components/StatsCard';
import { PredictionModal } from './components/PredictionModal';
import { AddMemberModal } from './components/AddMemberModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Dữ liệu mẫu tiếng Việt
const INITIAL_MEMBERS: Member[] = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    email: 'vanan@example.com',
    avatar: 'https://picsum.photos/seed/vana/100/100',
    skills: ['Quản lý dự án', 'Giao tiếp', 'Hỗ trợ kỹ thuật'],
    strengths: ['Giải quyết vấn đề', 'Lãnh đạo'],
    joinedDate: '2023-01-15',
    history: [
      { eventName: 'Tech Summit 2023', role: Role.COORDINATOR, rating: 5, feedback: 'Lãnh đạo xuất sắc dưới áp lực.' },
      { eventName: 'Gala Thường niên', role: Role.TECHNICAL, rating: 4, feedback: 'Xử lý âm thanh ánh sáng hoàn hảo.' }
    ]
  },
  {
    id: '2',
    name: 'Lê Thị Bình',
    email: 'thibinh@example.com',
    avatar: 'https://picsum.photos/seed/thib/100/100',
    skills: ['Thiết kế đồ họa', 'Mạng xã hội', 'Sáng tạo nội dung'],
    strengths: ['Sáng tạo', 'Tỉ mỉ'],
    joinedDate: '2023-05-20',
    history: [
      { eventName: 'Triển lãm Nghệ thuật', role: Role.DESIGNER, rating: 5, feedback: 'Bộ nhận diện hình ảnh rất ấn tượng.' },
      { eventName: 'Chạy bộ Từ thiện', role: Role.MARKETING, rating: 3, feedback: 'Ý tưởng tốt nhưng thời điểm đăng bài chưa chuẩn.' }
    ]
  },
  {
    id: '3',
    name: 'Trần Văn Cường',
    email: 'vancuong@example.com',
    avatar: 'https://picsum.photos/seed/vanc/100/100',
    skills: ['Nói trước công chúng', 'Dẫn chương trình', 'Kể chuyện'],
    strengths: ['Sức hút', 'Gần gũi'],
    joinedDate: '2023-08-10',
    history: [
      { eventName: 'Đêm hội Tài năng', role: Role.HOST, rating: 5, feedback: 'Kết nối đám đông cực kỳ tốt.' }
    ]
  },
  {
    id: '4',
    name: 'Phạm Minh Đức',
    email: 'minhduc@example.com',
    avatar: 'https://picsum.photos/seed/minhd/100/100',
    skills: ['Hậu cần', 'Quản lý nhà cung cấp', 'An ninh'],
    strengths: ['Tổ chức tốt', 'Đáng tin cậy'],
    joinedDate: '2023-11-02',
    history: [
      { eventName: 'Lễ hội Âm nhạc', role: Role.LOGISTICS, rating: 4, feedback: 'Điều phối khu vực hậu trường trơn tru.' }
    ]
  }
];

const App: React.FC = () => {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [prediction, setPrediction] = useState<AIPrediction | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredMembers = useMemo(() => {
    return members.filter(m => 
      m.name.toLowerCase().includes(search.toLowerCase()) || 
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
    );
  }, [members, search]);

  const handlePredict = async (member: Member) => {
    setSelectedMember(member);
    setIsPredicting(true);
    setShowPredictionModal(true);
    setPrediction(null);
    try {
      const result = await predictMemberRole(member);
      setPrediction(result);
    } catch (error) {
      console.error("Dự đoán thất bại:", error);
    } finally {
      setIsPredicting(false);
    }
  };

  const handleAddMember = (newMember: Member) => {
    setMembers([newMember, ...members]);
    setShowAddModal(false);
  };

  const performanceData = useMemo(() => {
    return members.map(m => ({
      name: m.name.split(' ').pop(),
      avgRating: m.history.length > 0 ? m.history.reduce((acc, h) => acc + h.rating, 0) / m.history.length : 0,
      count: m.history.length
    }));
  }, [members]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Quản lý Nhân sự <span className="text-indigo-600">AI</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-slate-100 rounded-full px-4 py-2 border border-slate-200">
              <svg className="w-4 h-4 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" 
                placeholder="Tìm kiếm thành viên..." 
                className="bg-transparent border-none focus:ring-0 text-sm text-slate-900 w-48"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Thêm Thành viên
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Dashboard Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            label="Tổng Thành viên" 
            value={members.length} 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 15.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 01-9-3.5" /></svg>}
            trend="+12%"
            trendUp={true}
          />
          <StatsCard 
            label="Hiệu suất TB" 
            value="4.7" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
            trend="+0.3"
            trendUp={true}
          />
          <StatsCard 
            label="Vị trí Trống" 
            value="5" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
          />
          <StatsCard 
            label="Lượt dự đoán AI" 
            value="128" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Member List */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Danh sách Nhân sự</h2>
              <span className="text-sm text-slate-500">Tìm thấy {filteredMembers.length} thành viên</span>
            </div>
            
            <div className="space-y-3">
              {filteredMembers.map(member => (
                <div key={member.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h3 className="font-bold text-slate-900">{member.name}</h3>
                      <p className="text-sm text-slate-500">{member.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {member.skills.slice(0, 2).map(skill => (
                      <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                    {member.skills.length > 2 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-400 rounded-md text-xs font-medium">
                        +{member.skills.length - 2} kỹ năng khác
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Đánh giá TB</p>
                      <p className="text-sm font-bold text-indigo-600">
                        {member.history.length > 0 
                          ? (member.history.reduce((a, b) => a + b.rating, 0) / member.history.length).toFixed(1)
                          : '0.0'
                        }/5
                      </p>
                    </div>
                    <button 
                      onClick={() => handlePredict(member)}
                      className="flex-1 md:flex-none px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                      Dự đoán Vị trí
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Analytics Sidebar */}
          <section className="space-y-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Hiệu suất Thành viên</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} domain={[0, 5]} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="avgRating" radius={[4, 4, 0, 0]}>
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#818cf8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Tối ưu với Gemini</h3>
                <p className="text-indigo-100 text-sm mb-4 leading-relaxed">
                  Tự động khớp các điểm mạnh riêng biệt của nhóm với yêu cầu sự kiện bằng suy luận nâng cao.
                </p>
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest">Mô hình hoạt động</span>
                  <span className="text-xs font-mono">gemini-3-flash</span>
                </div>
              </div>
              {/* Abstract decorative element */}
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
            </div>
          </section>
        </div>
      </main>

      {/* Modals */}
      {showAddModal && (
        <AddMemberModal 
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddMember}
        />
      )}

      {showPredictionModal && selectedMember && (
        <PredictionModal 
          member={selectedMember} 
          prediction={prediction} 
          isLoading={isPredicting}
          onClose={() => setShowPredictionModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">© 2024 Quản lý Nhân sự Sự kiện AI. Vận hành bởi Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

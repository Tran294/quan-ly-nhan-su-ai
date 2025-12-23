
export enum Role {
  COORDINATOR = 'Điều phối viên',
  TECHNICAL = 'Hỗ trợ Kỹ thuật',
  MARKETING = 'Truyền thông & PR',
  LOGISTICS = 'Hậu cần',
  HOSPITALITY = 'Lễ tân & Đón khách',
  DESIGNER = 'Thiết kế Hình ảnh',
  HOST = 'MC/Dẫn chương trình',
  SECURITY = 'An ninh & Kiểm soát'
}

export interface PerformanceRecord {
  eventName: string;
  role: Role;
  rating: number; // 1-5
  feedback: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  skills: string[];
  strengths: string[];
  history: PerformanceRecord[];
  joinedDate: string;
}

export interface AIPrediction {
  recommendedRole: Role;
  confidence: number;
  reasoning: string;
  alternativeRole: Role;
  suggestedImprovement: string;
}

export interface AppState {
  members: Member[];
  isPredicting: boolean;
  prediction: AIPrediction | null;
  selectedMemberId: string | null;
}

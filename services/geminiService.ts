
import { GoogleGenAI, Type } from "@google/genai";
import { Member, AIPrediction, Role } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const predictMemberRole = async (member: Member): Promise<AIPrediction> => {
  const prompt = `
    Phân tích hồ sơ và lịch sử hoạt động của thành viên sau đây để dự đoán vị trí phù hợp nhất cho họ trong sự kiện lớn sắp tới.
    
    Tên thành viên: ${member.name}
    Kỹ năng: ${member.skills.join(', ')}
    Thế mạnh: ${member.strengths.join(', ')}
    Lịch sử hiệu suất:
    ${member.history.map(h => `- Vị trí: ${h.role}, Đánh giá: ${h.rating}/5, Phản hồi: ${h.feedback}`).join('\n')}

    Hãy xem xét lộ trình phát triển, tính nhất quán trong hiệu suất và bộ kỹ năng cốt lõi của họ. 
    Lưu ý: Phải trả về kết quả bằng tiếng Việt hoàn toàn.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "Bạn là một chuyên gia tư vấn nhân sự và quản lý sự kiện cao cấp. Nhiệm vụ của bạn là phân tích dữ liệu thành viên và đưa ra các đề xuất vị trí chính xác, dựa trên dữ liệu thực tế. Mọi câu trả lời phải bằng tiếng Việt.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendedRole: {
            type: Type.STRING,
            enum: Object.values(Role),
            description: "Vị trí phù hợp nhất cho sự kiện tiếp theo.",
          },
          confidence: {
            type: Type.NUMBER,
            description: "Mức độ tự tin của dự đoán từ 0 đến 1.",
          },
          reasoning: {
            type: Type.STRING,
            description: "Giải thích chi tiết lý do tại sao vị trí này được chọn.",
          },
          alternativeRole: {
            type: Type.STRING,
            enum: Object.values(Role),
            description: "Một vị trí đề xuất dự phòng.",
          },
          suggestedImprovement: {
            type: Type.STRING,
            description: "Thành viên nên tập trung vào điều gì để xuất sắc hơn ở vai trò mới này.",
          },
        },
        required: ["recommendedRole", "confidence", "reasoning", "alternativeRole", "suggestedImprovement"],
      },
    },
  });

  return JSON.parse(response.text) as AIPrediction;
};

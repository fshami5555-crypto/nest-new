
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile } from "./types";

// دالة مساعدة لإنشاء كائن الـ AI بأمان
const getAI = () => {
  const apiKey = process.env.API_KEY || "";
  return new GoogleGenAI({ apiKey });
};

export const getSmartGreeting = async (user: UserProfile) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `أنت مساعد في تطبيق "نست جيرل" للمرأة. ولدينا مستخدمة اسمها ${user.name} وحالتها هي ${user.status}. قم بتوليد رسالة ترحيبية قصيرة دافئة ومخصصة لها ولحالتها باللغة العربية بأسلوب راقٍ.`,
  });
  return response.text;
};

export const getPeriodAdvice = async (user: UserProfile) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `بناءً على بيانات المستخدمة: الاسم: ${user.name}، الحالة: ${user.status}، الوزن: ${user.weight}، هل تأتيها الدورة: ${user.hasPeriod ? 'نعم' : 'لا'}.
    أعطِ نصيحة صحية قصيرة ومفيدة جداً تتعلق بالدورة الشهرية أو الصحة الإنجابية بأسلوب لطيف ومشجع.`,
  });
  return response.text;
};

export const chatWithPsych = async (user: UserProfile, message: string, history: any[]) => {
  const ai = getAI();
  const systemInstruction = `أنت "نست"، الصديقة المقربة والمستشارة النفسية للمستخدمة. اسم المستخدمة هو ${user.name} وحالتها الاجتماعية ${user.status}.
تحدثي معها بلهجة عامية دافئة، كوني مستمعة جيدة، قدمي دعماً نفسياً، واسمعي لمشاكلها واقترحي حلولاً بسيطة وداعمة. حافظي على خصوصيتها كأنك أعز صديقاتها.
استخدمي رموز تعبيرية (Emojis) مناسبة لتكون المحادثة لطيفة.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: message,
    config: {
      systemInstruction: systemInstruction,
    }
  });
  return response.text;
};

export const generateMealPlan = async (user: UserProfile, goal: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `أنشئ جدولاً غذائياً أسبوعياً (7 أيام) للمستخدمة التالية:
    الاسم: ${user.name}
    الطول: ${user.height} سم
    الوزن: ${user.weight} كغم
    الحالة: ${user.status}
    الهدف: ${goal}
    يجب أن يكون الجدول باللغة العربية وبتنسيق JSON يحتوي على مصفوفة من الأيام، وكل يوم يحتوي على (الفطور، الغداء، العشاء، وجبة خفيفة).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                dayName: { type: Type.STRING },
                breakfast: { type: Type.STRING },
                lunch: { type: Type.STRING },
                dinner: { type: Type.STRING },
                snack: { type: Type.STRING },
              },
              required: ["dayName", "breakfast", "lunch", "dinner", "snack"]
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text);
};

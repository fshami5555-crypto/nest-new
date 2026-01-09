
/**
 * تم إلغاء الارتباط بـ Firebase بناءً على طلب المستخدم.
 * هذا الملف يعمل الآن كمحرك بيانات محلي (Local Storage Database) 
 * لمحاكاة العمليات السحابية بدون الحاجة لمفاتيح API أو اتصالات خارجية.
 */

const STORAGE_KEY_PREFIX = 'nest_db_';

const getCollection = (name: string): any[] => {
  const data = localStorage.getItem(STORAGE_KEY_PREFIX + name);
  return data ? JSON.parse(data) : [];
};

const saveCollection = (name: string, data: any[]) => {
  localStorage.setItem(STORAGE_KEY_PREFIX + name, JSON.stringify(data));
};

export const db = {
  // محاكاة بسيطة لهيكل Firestore
};

export const fsGetDocs = async <T,>(collectionName: string): Promise<T[]> => {
  // محاكاة تأخير الشبكة البسيط
  await new Promise(resolve => setTimeout(resolve, 100));
  return getCollection(collectionName) as T[];
};

export const fsAddDoc = async (collectionName: string, data: any) => {
  await new Promise(resolve => setTimeout(resolve, 150));
  const collection = getCollection(collectionName);
  const newDoc = {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: Date.now()
  };
  collection.unshift(newDoc); // إضافة في البداية كـ Firebase
  saveCollection(collectionName, collection);
  return newDoc;
};

export const fsUpdateDoc = async (collectionName: string, id: string, data: any) => {
  const collection = getCollection(collectionName);
  const index = collection.findIndex(doc => doc.id === id);
  if (index !== -1) {
    // التعامل مع arrayUnion و arrayRemove يدوياً
    if (data.likes && typeof data.likes === 'object') {
      // محاكاة بسيطة للـ likes
      const currentLikes = collection[index].likes || [];
      if (data.likes._method === 'union') {
        if (!currentLikes.includes(data.likes.value)) currentLikes.push(data.likes.value);
      } else if (data.likes._method === 'remove') {
        const i = currentLikes.indexOf(data.likes.value);
        if (i > -1) currentLikes.splice(i, 1);
      }
      collection[index].likes = currentLikes;
    } else {
      collection[index] = { ...collection[index], ...data };
    }
    saveCollection(collectionName, collection);
  }
};

export const fsDeleteDoc = async (collectionName: string, id: string) => {
  const collection = getCollection(collectionName);
  const filtered = collection.filter(doc => doc.id !== id);
  saveCollection(collectionName, filtered);
};

// وظائف محاكاة للـ Firebase SDK لتقليل تغييرات الكود في الملفات الأخرى
export const arrayUnion = (value: any) => ({ _method: 'union', value });
export const arrayRemove = (value: any) => ({ _method: 'remove', value });

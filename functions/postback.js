import { writeFileSync, existsSync, readFileSync } from 'fs';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');
  const payout = searchParams.get('payout');

  if (!uid || !payout) {
    return new Response('Missing params', { status: 400 });
  }

  // نقرأ الملف الحالي لو موجود
  let data = [];
  const filePath = './postbacks.json';
  if (existsSync(filePath)) {
    const fileData = readFileSync(filePath);
    data = JSON.parse(fileData);
  }

  // نضيف الطلب الجديد
  data.push({ uid, payout, timestamp: Date.now() });

  // نكتب الملف من جديد
  writeFileSync(filePath, JSON.stringify(data, null, 2));

  return new Response('Postback received!', { status: 200 });
}

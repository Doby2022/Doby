
import { Carpet, Totals, SchedulingData } from '../types';

export const sendOrderEmails = async (carpets: Carpet[], totals: Totals, orderData: SchedulingData) => {
  const orderDetails = {
    orderNumber: `DBY-${Math.floor(1000 + Math.random() * 9000)}`,
    client: orderData,
    carpets: carpets
      .filter(c => parseFloat(c.length) > 0 && parseFloat(c.width) > 0)
      .map((c, i) => ({
        index: i + 1,
        dims: `${c.length}x${c.width} cm`,
        area: ((parseFloat(c.length) / 100) * (parseFloat(c.width) / 100)).toFixed(2),
        price: (((parseFloat(c.length) / 100) * (parseFloat(c.width) / 100)) * 20).toFixed(2)
      })),
    totals: {
      totalPrice: totals.totalPrice.toFixed(2),
      totalArea: totals.totalArea.toFixed(2),
      shipping: totals.isFreeShipping ? 'Gratuit' : '15.00 lei'
    }
  };

  try {
    // Folosim text/plain pentru a evita cererea OPTIONS (CORS Preflight)
    const response = await fetch('https://doby.ro/send-order.php', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain', // Important: text/plain evită preflight-ul CORS
      },
      body: JSON.stringify(orderDetails),
    });

    if (!response.ok) {
      const text = await response.text();
      return { success: false, error: `Server HTTP ${response.status}` };
    }

    const result = await response.json();
    return { success: !!result.success, error: result.message };
  } catch (error: any) {
    console.error('Fetch error:', error);
    return { success: false, error: "Conexiune blocată de browser sau firewall (CORS)." };
  }
};

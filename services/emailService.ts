
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
    const response = await fetch('https://doby.ro/send-order.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(orderDetails),
    });

    const contentType = response.headers.get("content-type");
    if (!response.ok) {
      const text = await response.text();
      return { success: false, error: `Server Error ${response.status}: ${text.substring(0, 100)}` };
    }

    if (contentType && contentType.indexOf("application/json") !== -1) {
      const result = await response.json();
      if (!result.success) {
        return { success: false, error: result.message || 'Eroare trimitere email de pe server.' };
      }
      return { success: true };
    } else {
      const text = await response.text();
      return { success: false, error: `Răspuns invalid de la server (nu e JSON): ${text.substring(0, 100)}` };
    }
  } catch (error: any) {
    return { success: false, error: `Eroare conexiune: ${error.message}` };
  }
};

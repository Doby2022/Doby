
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
    // Apelăm scriptul PHP de pe serverul tău
    const response = await fetch('https://doby.ro/send-order.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderDetails),
    });

    if (!response.ok) {
      throw new Error('Eroare la server');
    }

    const result = await response.json();
    return { success: result.success };
  } catch (error) {
    console.error('Eroare la trimiterea emailului:', error);
    // Chiar dacă dă eroare de rețea, în mod normal scriptul PHP a primit datele dacă request-ul a plecat
    return { success: false, error };
  }
};

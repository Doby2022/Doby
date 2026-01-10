
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
    // Folosim URLSearchParams pentru a trimite datele ca un formular standard (x-www-form-urlencoded)
    const formData = new URLSearchParams();
    formData.append('order_data', JSON.stringify(orderDetails));

    const response = await fetch('https://doby.ro/send-order.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(`Status: ${response.status}`);
    }

    const result = await response.json();
    return { success: !!result.success, error: result.message };
  } catch (error: any) {
    console.error('Fetch error:', error);
    return { 
      success: false, 
      error: "Blocaj de securitate la nivel de server. Asigurați-vă că fișierul PHP este actualizat pe doby.ro." 
    };
  }
};

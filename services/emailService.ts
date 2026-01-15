
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
    const formData = new URLSearchParams();
    formData.append('order_data', JSON.stringify(orderDetails));

    // Căutăm send-order.php în același folder cu aplicația
    // Dacă pui index.html și send-order.php în folderul /calculator/, 
    // browserul le va găsi împreună.
    const apiUrl = './send-order.php';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(`Serverul a răspuns cu eroarea: ${response.status}`);
    }

    const result = await response.json();
    return { success: !!result.success, error: result.message };
  } catch (error: any) {
    console.error('Eroare la trimitere:', error);
    return { 
      success: false, 
      error: "Nu am putut conecta cu serverul Doby. Verificați dacă fișierul send-order.php există în folder." 
    };
  }
};

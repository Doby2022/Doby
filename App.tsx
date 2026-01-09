
import React, { useState, useMemo, useCallback } from 'react';
import { Carpet, AppScreen, SchedulingData } from './types';
import CarpetCard from './components/CarpetCard';
import LocationForm from './components/LocationForm';
import SchedulingForm from './components/SchedulingForm';
import ObservationsForm from './components/ObservationsForm';
import SuccessScreen from './components/SuccessScreen';
import { PRICE_PER_SQM, FREE_SHIPPING_THRESHOLD } from './constants';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>('calculator');
  const [carpets, setCarpets] = useState<Carpet[]>([
    { id: '1', length: '250', width: '200' },
    { id: '2', length: '', width: '' }
  ]);
  
  // Persist order data across screens
  const [orderInfo, setOrderInfo] = useState<Partial<SchedulingData>>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    date: '',
    observations: ''
  });

  const updateCarpet = useCallback((id: string, field: 'length' | 'width', value: string) => {
    setCarpets(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  }, []);

  const addCarpet = useCallback(() => {
    setCarpets(prev => [
      ...prev,
      { id: Math.random().toString(36).substr(2, 9), length: '', width: '' }
    ]);
  }, []);

  const removeLastCarpet = useCallback(() => {
    if (carpets.length > 1) {
      setCarpets(prev => prev.slice(0, -1));
    }
  }, [carpets.length]);

  const totals = useMemo(() => {
    const totalArea = carpets.reduce((acc, c) => {
      const l = parseFloat(c.length) || 0;
      const w = parseFloat(c.width) || 0;
      return acc + ((l / 100) * (w / 100));
    }, 0);
    
    const calculatedPrice = totalArea * PRICE_PER_SQM;
    const MIN_PRICE = 100;
    const totalPrice = calculatedPrice === 0 ? MIN_PRICE : Math.max(calculatedPrice, MIN_PRICE);
    
    const isFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
    const progress = Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100);

    return { 
      totalArea, 
      totalPrice, 
      isFreeShipping, 
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      progress 
    };
  }, [carpets]);

  const handleLocationSubmit = (data: { fullName: string; phone: string; email: string; address: string }) => {
    setOrderInfo(prev => ({ ...prev, ...data }));
    setScreen('scheduling');
  };

  const handleSchedulingSubmit = (date: string) => {
    setOrderInfo(prev => ({ ...prev, date }));
    setScreen('observations');
  };

  const handleFinish = (observations: string) => {
    const finalData: SchedulingData = {
      ...orderInfo as Required<Omit<SchedulingData, 'observations'>>,
      observations
    };
    console.log('Order finished:', { carpets, totals, finalData });
    setScreen('success');
  };

  if (screen === 'success') {
    return <SuccessScreen onRestart={() => {
      setCarpets([{ id: '1', length: '', width: '' }]);
      setOrderInfo({ fullName: '', phone: '', email: '', address: '', date: '', observations: '' });
      setScreen('calculator');
    }} />;
  }

  if (screen === 'location') {
    return (
      <LocationForm 
        totals={totals}
        initialData={orderInfo as any}
        onBack={() => setScreen('calculator')} 
        onNext={handleLocationSubmit} 
      />
    );
  }

  if (screen === 'scheduling') {
    return (
      <SchedulingForm 
        totals={totals} 
        onBack={() => setScreen('location')} 
        onNext={handleSchedulingSubmit} 
      />
    );
  }

  if (screen === 'observations') {
    return (
      <ObservationsForm
        totals={totals}
        onBack={() => setScreen('scheduling')}
        onFinish={handleFinish}
      />
    );
  }

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden max-w-[430px] mx-auto bg-slate-50 dark:bg-slate-950 shadow-2xl animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg sticky top-0 z-20 px-4 py-5 justify-between border-b border-slate-100 dark:border-slate-800">
        <div className="text-slate-400 dark:text-slate-500 flex size-10 items-center justify-start cursor-pointer hover:text-doby-blue transition-colors">
          <span className="material-symbols-outlined text-2xl font-bold">chevron_left</span>
        </div>
        <h2 className="text-doby-blue dark:text-white text-sm font-black tracking-[0.15em] flex-1 text-center pr-10 uppercase italic">
          Detalii <span className="text-doby-red italic">Covoare</span>
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-[360px] p-5 space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 card-shadow border border-slate-100 dark:border-slate-800/50">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-center mb-5">Număr de covoare</p>
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 rounded-2xl p-2 border border-slate-100 dark:border-slate-800">
            <button 
              onClick={removeLastCarpet}
              disabled={carpets.length <= 1}
              className={`size-14 bg-white dark:bg-slate-800 shadow-sm rounded-xl flex items-center justify-center text-doby-blue active:scale-95 transition-all ${carpets.length <= 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
              <span className="material-symbols-outlined font-black">remove</span>
            </button>
            <span className="text-4xl font-black text-slate-900 dark:text-white tabular-nums">
              {carpets.length}
            </span>
            <button 
              onClick={addCarpet}
              className="size-14 bg-doby-blue text-white shadow-lg shadow-doby-blue/20 rounded-xl flex items-center justify-center active:scale-95 hover:bg-doby-blue-dark transition-all"
            >
              <span className="material-symbols-outlined font-black">add</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dimensiuni covoare</p>
            <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800 ml-4"></div>
          </div>
          {carpets.map((carpet, index) => (
            <CarpetCard
              key={carpet.id}
              carpet={carpet}
              index={index}
              isActive={parseFloat(carpet.length) > 0 && parseFloat(carpet.width) > 0}
              onUpdate={updateCarpet}
            />
          ))}
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-[0_-15px_40px_rgba(0,0,0,0.08)] z-30 p-6 pt-5">
        <div className="mb-6">
          <div className="flex justify-between items-end mb-2.5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-500 text-lg">local_shipping</span>
              <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Transport Gratuit</p>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Peste {FREE_SHIPPING_THRESHOLD} lei</p>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-[2px]">
            <div 
              style={{ width: `${totals.progress}%` }}
              className={`h-full rounded-full transition-all duration-700 relative ${totals.isFreeShipping ? 'bg-emerald-500 progress-glow' : 'bg-doby-blue-light'}`}
            ></div>
          </div>
          <div className="mt-3 min-h-[1.25rem]">
            {totals.isFreeShipping ? (
              <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-1 duration-500">
                <span className="material-symbols-outlined text-emerald-500 text-sm font-black">check_circle</span>
                <p className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">Felicitări! Transportul este gratuit.</p>
              </div>
            ) : (
              <p className="text-[10px] font-bold text-slate-400 uppercase italic tracking-tight">
                Mai adaugă <span className="text-doby-blue dark:text-doby-yellow font-black">{(FREE_SHIPPING_THRESHOLD - totals.totalPrice).toFixed(2)} lei</span> pentru transport gratuit
              </p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Total de plată (minim) LA LIVRARE*</p>
              <p className="text-4xl font-black text-slate-900 dark:text-white leading-none tabular-nums">
                {totals.totalPrice.toFixed(2)} <span className="text-sm text-slate-400 font-bold ml-1 uppercase">lei</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Suprafață Totală</p>
              <p className="text-2xl font-black text-doby-blue dark:text-doby-yellow tabular-nums">
                {totals.totalArea.toFixed(2)} <span className="text-xs uppercase">mp</span>
              </p>
            </div>
          </div>
          <p className="text-[9px] text-center text-slate-400 font-medium leading-tight px-4 italic">
            *Comandă minimă: 100 lei. Suma este garantată doar dacă dimensiunile introduse sunt cele reale.
          </p>
        </div>

        <button 
          className="w-full bg-gradient-to-br from-doby-red to-doby-red-dark hover:from-doby-red-light hover:to-doby-red text-white font-black text-lg py-5 px-6 rounded-2xl shadow-xl shadow-doby-red/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group border-b-4 border-black/20"
          onClick={() => setScreen('location')}
        >
          Continuă spre DETALII LOCAȚIE
          <span className="material-symbols-outlined font-black group-hover:translate-x-1.5 transition-transform">location_on</span>
        </button>
        <div className="h-4"></div>
      </div>
    </div>
  );
};

export default App;

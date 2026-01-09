
import React, { useState, useEffect } from 'react';
import { Totals } from '../types';

interface ObservationsFormProps {
  totals: Totals;
  onBack: () => void;
  onFinish: (observations: string) => void;
}

const ObservationsForm: React.FC<ObservationsFormProps> = ({ totals, onBack, onFinish }) => {
  const [observations, setObservations] = useState('');
  const [captcha, setCaptcha] = useState({ a: 0, b: 0, result: 0 });
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ a, b, result: a + b });
    setCaptchaInput('');
  };

  const handleFinishClick = () => {
    if (parseInt(captchaInput) !== captcha.result) {
      setError('Codul de verificare este incorect.');
      generateCaptcha();
      return;
    }
    onFinish(observations);
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden max-w-[430px] mx-auto bg-slate-50 dark:bg-slate-950 shadow-2xl animate-in slide-in-from-right duration-500">
      <div className="flex items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg sticky top-0 z-20 px-4 py-5 justify-between border-b border-slate-100 dark:border-slate-800">
        <button 
          type="button"
          onClick={onBack}
          className="text-slate-400 dark:text-slate-500 flex size-10 items-center justify-start hover:text-doby-blue transition-colors"
        >
          <span className="material-symbols-outlined text-2xl font-bold">chevron_left</span>
        </button>
        <h2 className="text-doby-blue dark:text-white text-sm font-black tracking-[0.15em] flex-1 text-center pr-10 uppercase italic">
          Detalii <span className="text-doby-red italic">Observații</span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-[180px] p-6 space-y-6">
        <div className="bg-doby-blue rounded-3xl p-5 text-white shadow-lg shadow-doby-blue/20 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Total de plată (minim) LA LIVRARE</p>
            <p className="text-2xl font-black">{totals.totalPrice.toFixed(2)} lei</p>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Transport</p>
             <p className="text-sm font-bold uppercase">{totals.isFreeShipping ? 'Gratuit' : '15.00 lei'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
             <div className="flex items-center gap-2 px-1 mb-1">
               <span className="material-symbols-outlined text-doby-blue text-sm">edit_note</span>
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Observații Client (Opțional)</label>
             </div>
             <textarea 
               placeholder="Ex. Vă rugăm să ne sunați cu 10 minute înainte de sosire..."
               className="w-full h-32 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl p-4 text-sm font-bold outline-none focus:border-doby-blue transition-all resize-none placeholder:italic placeholder:font-normal"
               value={observations}
               onChange={e => setObservations(e.target.value)}
             />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
               <span className="material-symbols-outlined text-emerald-500 text-sm">verified_user</span>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verificare Antirobot</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl px-5 py-3 border border-slate-100 dark:border-slate-700">
                <p className="text-xl font-black italic tracking-widest text-slate-900 dark:text-white">
                  {captcha.a} + {captcha.b} =
                </p>
              </div>
              <input 
                type="number"
                placeholder="?"
                className={`flex-1 bg-white dark:bg-slate-900 border-2 rounded-2xl px-4 py-3 text-lg font-black text-center outline-none transition-all ${error ? 'border-doby-red' : 'border-slate-100 dark:border-slate-800 focus:border-doby-blue'}`}
                value={captchaInput}
                onChange={e => {
                  setCaptchaInput(e.target.value);
                  setError(null);
                }}
              />
            </div>
            {error && <p className="text-[11px] text-doby-red font-black px-1 animate-pulse uppercase tracking-tight text-center">{error}</p>}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-6 z-30">
        <button 
          onClick={handleFinishClick}
          className="w-full bg-gradient-to-br from-doby-red to-doby-red-dark hover:from-doby-red-light hover:to-doby-red text-white font-black text-lg py-5 px-6 rounded-2xl shadow-xl shadow-doby-red/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 border-b-4 border-black/20"
        >
          Finalizează Comanda
          <span className="material-symbols-outlined font-black">check_circle</span>
        </button>
      </div>
    </div>
  );
};

export default ObservationsForm;

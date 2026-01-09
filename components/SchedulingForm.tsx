
import React, { useState } from 'react';
import { Totals } from '../types';
import { BLOCKED_DATES } from '../constants';

interface SchedulingFormProps {
  totals: Totals;
  onBack: () => void;
  onNext: (date: string) => void;
}

const SchedulingForm: React.FC<SchedulingFormProps> = ({ totals, onBack, onNext }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [viewDate, setViewDate] = useState(new Date());
  const [error, setError] = useState<string | null>(null);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const isDateBlocked = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date <= today) return true;
    if (date.getDay() === 0) return true; // Sunday blocked
    if (BLOCKED_DATES.includes(dateStr)) return true;
    return false;
  };

  const handleNextClick = () => {
    if (!selectedDate) {
      setError('Vă rugăm selectați o dată pentru colectare.');
      return;
    }
    onNext(selectedDate);
  };

  const monthNames = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
  const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const firstDay = (getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth()) + 6) % 7;

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
          Detalii <span className="text-doby-red italic">Data Colectare</span>
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
          <div className="flex items-center gap-2 px-1">
             <span className="material-symbols-outlined text-doby-blue text-sm">calendar_month</span>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selectați Data Colectării</p>
           </div>
          
          <div className={`bg-white dark:bg-slate-900 rounded-3xl border-2 p-5 transition-all ${error ? 'border-doby-red' : 'border-slate-100 dark:border-slate-800 shadow-sm'}`}>
            <div className="flex justify-between items-center mb-6 px-2">
              <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-base italic">
                {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
              </p>
              <div className="flex gap-2">
                <button type="button" onClick={handlePrevMonth} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl hover:text-doby-blue transition-colors shadow-sm">
                  <span className="material-symbols-outlined font-black">chevron_left</span>
                </button>
                <button type="button" onClick={handleNextMonth} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl hover:text-doby-blue transition-colors shadow-sm">
                  <span className="material-symbols-outlined font-black">chevron_right</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => (
                <div key={d} className="text-center text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateString = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const blocked = isDateBlocked(dateString);
                const selected = selectedDate === dateString;

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={blocked}
                    onClick={() => {
                        setSelectedDate(dateString);
                        setError(null);
                    }}
                    className={`
                      aspect-square rounded-2xl text-[15px] font-black flex items-center justify-center transition-all border-2
                      ${blocked 
                        ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-30 border-transparent' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-50 dark:border-slate-800/50 text-slate-900 dark:text-slate-100 shadow-sm'}
                      ${selected ? '!bg-doby-blue !text-white !border-doby-blue shadow-lg shadow-doby-blue/40 scale-105 z-10 opacity-100' : ''}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
          {error && <p className="text-[11px] text-doby-red font-black px-1 animate-pulse uppercase tracking-tight">{error}</p>}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-6 z-30">
        <button 
          onClick={handleNextClick}
          className="w-full bg-gradient-to-br from-doby-red to-doby-red-dark hover:from-doby-red-light hover:to-doby-red text-white font-black text-lg py-5 px-6 rounded-2xl shadow-xl shadow-doby-red/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 border-b-4 border-black/20"
        >
          Către OBSERVAȚII ȘI FINALIZARE
          <span className="material-symbols-outlined font-black">edit_note</span>
        </button>
      </div>
    </div>
  );
};

export default SchedulingForm;

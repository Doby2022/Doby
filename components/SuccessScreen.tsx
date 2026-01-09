
import React from 'react';

interface SuccessScreenProps {
  onRestart: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ onRestart }) => {
  const orderNumber = Math.floor(1000 + Math.random() * 9000);

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center max-w-[430px] mx-auto bg-white dark:bg-slate-950 p-8 text-center animate-in zoom-in duration-500">
      <div className="size-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-8 animate-bounce">
        <span className="material-symbols-outlined text-emerald-500 text-5xl font-black">check_circle</span>
      </div>
      
      <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 italic uppercase tracking-tighter">
        Comandă <span className="text-doby-red">Preluată!</span>
      </h1>
      
      <div className="px-2 mb-8">
        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-sm">
          În cel mai scurt timp posibil un operator comenzi <span className="font-bold text-doby-blue">Doby | Spălătorie Covoare București</span> vă va contacta (fie telefonic fie în scris) pentru confirmarea primirii comenzii Dvs. și pentru stabilirea altor detalii necesare.
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 w-full mb-10 border border-slate-100 dark:border-slate-800">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Număr Comandă</p>
        <p className="text-2xl font-black text-slate-900 dark:text-white">#DBY-{orderNumber}</p>
      </div>

      <button 
        onClick={onRestart}
        className="text-doby-blue dark:text-doby-yellow font-black text-sm uppercase tracking-widest hover:underline transition-all"
      >
        Înapoi la Calculator
      </button>

      <div className="absolute bottom-10 flex flex-col items-center opacity-30">
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Doby Carpet Cleaning</p>
        <div className="h-0.5 w-10 bg-doby-red mt-2"></div>
      </div>
    </div>
  );
};

export default SuccessScreen;

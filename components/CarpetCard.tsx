
import React from 'react';
import { Carpet } from '../types';
import { PRICE_PER_SQM } from '../constants';

interface CarpetCardProps {
  carpet: Carpet;
  index: number;
  isActive: boolean;
  onUpdate: (id: string, field: 'length' | 'width', value: string) => void;
}

const CarpetCard: React.FC<CarpetCardProps> = ({ carpet, index, isActive, onUpdate }) => {
  const lengthCm = parseFloat(carpet.length) || 0;
  const widthCm = parseFloat(carpet.width) || 0;
  
  const area = (lengthCm / 100) * (widthCm / 100);
  const price = area * PRICE_PER_SQM;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 card-shadow border border-slate-100 dark:border-slate-800/50 relative overflow-hidden transition-all duration-300">
      <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors duration-500 ${isActive ? 'bg-doby-blue' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className={`${isActive ? 'bg-doby-blue/10 text-doby-blue dark:bg-doby-blue/20 dark:text-doby-blue-light' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'} rounded-lg py-1 px-3 text-[10px] font-black uppercase tracking-wider`}>
            Covor {index + 1}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase px-1 tracking-tight">Lungime (cm)</label>
          <input
            className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-doby-blue focus:border-doby-blue outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
            placeholder="0"
            type="number"
            value={carpet.length}
            onChange={(e) => onUpdate(carpet.id, 'length', e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase px-1 tracking-tight">Lățime (cm)</label>
          <input
            className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-doby-blue focus:border-doby-blue outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
            placeholder="0"
            type="number"
            value={carpet.width}
            onChange={(e) => onUpdate(carpet.id, 'width', e.target.value)}
          />
        </div>
      </div>

      <div className={`mt-4 pt-4 border-t border-slate-50 dark:border-slate-800/50 flex justify-between items-end transition-all duration-300 ${area > 0 ? 'opacity-100 translate-y-0' : 'opacity-30'}`}>
        <div>
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Suprafață</p>
          <p className={`text-xl font-black ${isActive ? 'text-doby-blue dark:text-doby-yellow' : 'text-slate-900 dark:text-white'}`}>
            {area.toFixed(2)} <span className="text-xs font-bold text-slate-400">mp</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Preț*</p>
          <p className="text-xl font-black text-slate-900 dark:text-white">
            {price.toFixed(2)} <span className="text-xs font-bold text-slate-400">lei</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CarpetCard;

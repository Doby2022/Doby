
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Totals } from '../types';

interface LocationFormProps {
  totals: Totals;
  initialData: { fullName: string; phone: string; email: string; address: string };
  onBack: () => void;
  onNext: (data: { fullName: string; phone: string; email: string; address: string }) => void;
}

const ILFOV_LOCALITIES = [
  "București",
  "1 Decembrie", "Afumați", "Balotești", "Berceni", "Bragadiru", "Brănești", "Buftea", 
  "Cernica", "Chiajna", "Chitila", "Ciolpani", "Ciorogârla", "Clinceni", "Copăceni", 
  "Corbeanca", "Cornetu", "Dascălu", "Dărăști-Ilfov", "Domnești", "Dragomirești-Vale", 
  "Găneasa", "Glina", "Grădiștea", "Gruiu", "Jilava", "Moara Vlăsiei", "Mogoșoaia", 
  "Măgurele", "Nuci", "Otopeni", "Pantelimon", "Periș", "Petrești", "Popești-Leordeni", 
  "Postăvari", "Snagov", "Ștefăneștii de Jos", "Ștefăneștii de Sus", "Tunari", "Vidra", "Voluntari"
].sort((a, b) => {
  if (a === "București") return -1;
  if (b === "București") return 1;
  return a.localeCompare(b);
});

const BUCHAREST_STREETS_DATABASE = [
  "Victoriei", "Magheru", "Unirii", "Decebal", "Burebista", "Mihai Bravu", "Iancu de Hunedoara",
  "Ștefan cel Mare", "Pantelimon", "Colentina", "Moșilor", "Carol I", "Elisabeta", "Rahovei",
  "Floreasca", "Dorobanților", "Griviței", "Plevnei", "Văcărești", "Splaiul Unirii", "Splaiul Independenței", 
  "Timișoara", "Iuliu Maniu", "Uverturii", "Ghencea", "Drumul Taberei", "Vasile Milea", "Poligrafiei", 
  "Bucureștii Noi", "Ion Mihalache", "Pavel Kiseleff", "Aviatorilor", "Constantin Prezan", "Primăverii", 
  "Mircea Eliade", "Radu Beller", "Barbu Văcărescu", "Lacul Tei", "Doamna Ghica", "Petricani", "Fundeni", 
  "Andronache", "Giurgiului", "Olteniței", "Berceni", "Viilor", "Alexandriei", "Mărgeanului", "Antiaeriană", 
  "Drumul Sării", "13 Septembrie", "Libertății", "Națiunile Unite", "Corneliu Coposu", "Octavian Goga", 
  "Mircea Vodă", "Nerva Traian", "Ion Dragalina", "Vasile Lascăr", "Viitorului", "Tunari", "Erou Iancu Nicolae",
  "Pipera", "Zambaccian", "Mendeleev", "Amzei", "Câmpineanu", "Brezoianu", "Lipscani", "Gabroveni", 
  "Franceză", "Smârdan", "Șelari", "Covaci", "Baicului", "Ziduri Moși", "Heliade între Vii", "Electronică", 
  "Fabrica de Glucoză", "Dimitrie Pompeiu", "George Constantinescu", "Vatra Luminoasă", "Maior Coravu", 
  "Baba Novac", "Constantin Brâncuși", "Nicolae Grigorescu", "Theodor Pallady", "Camil Ressu", "Rebreanu",
  "Postăvarului", "1 Decembrie 1918", "Lucrețiu Pătrășcanu", "Codrii Neamțului", "Prevederii", "Alexandru Obregia"
].sort((a, b) => a.localeCompare(b, 'ro'));

const LocationForm: React.FC<LocationFormProps> = ({ totals, initialData, onBack, onNext }) => {
  const [form, setForm] = useState({
    fullName: initialData.fullName,
    phone: initialData.phone,
    email: initialData.email,
    city: 'București',
    sector: '',
    streetType: 'Str.',
    streetName: '',
    number: '',
    building: '',
    scara: '',
    floor: '0',
    intercom: '',
    apartment: '',
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (form.city !== 'București') {
      setForm(prev => ({ ...prev, sector: 'IF' }));
    } else if (form.sector === 'IF') {
      setForm(prev => ({ ...prev, sector: '' }));
    }
  }, [form.city]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredStreets = useMemo(() => {
    const query = form.streetName.trim().toLowerCase();
    if (query.length === 0) return [];
    return BUCHAREST_STREETS_DATABASE.filter(s => 
      s.toLowerCase().startsWith(query)
    ).slice(0, 15);
  }, [form.streetName]);

  const validate = () => {
    const newErrors: Partial<Record<string, string>> = {};
    if (!form.fullName) newErrors.fullName = 'NUME COMPLET OBLIGATORIU';
    if (!form.phone || form.phone.length < 10) newErrors.phone = 'TELEFON OBLIGATORIU (MIN. 10 CIFRE)';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'EMAIL VALID OBLIGATORIU';
    if (!form.city) newErrors.city = 'LOCALITATE OBLIGATORIE';
    if (!form.sector) newErrors.sector = 'SECTOR OBLIGATORIU';
    if (!form.streetName) newErrors.streetName = 'NUME STRADĂ OBLIGATORIU';
    if (!form.number) newErrors.number = 'NUMĂR OBLIGATORIU';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const fullAddress = `${form.city}, Sector ${form.sector}, ${form.streetType} ${form.streetName}, Nr. ${form.number}${form.building ? ', Bl. ' + form.building : ''}${form.scara ? ', Sc. ' + form.scara : ''}${form.floor ? ', Et. ' + form.floor : ''}${form.apartment ? ', Ap. ' + form.apartment : ''}${form.intercom ? ', Int. ' + form.intercom : ''}`;
      
      onNext({
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        address: fullAddress,
      });
    }
  };

  const ErrorLabel = ({ error }: { error?: string }) => {
    if (!error) return null;
    return <p className="text-[9px] text-doby-red font-black px-1 mt-0.5 uppercase tracking-tighter">{error}</p>;
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
          Detalii <span className="text-doby-red italic">Locație</span>
        </h2>
      </div>

      <form onSubmit={handleNextClick} className="flex-1 overflow-y-auto no-scrollbar pb-[180px] p-6 space-y-5">
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

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
             <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase px-1 tracking-widest">Nume Complet</label>
                <input 
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Ion Popescu"
                  className={`w-full bg-white dark:bg-slate-900 border-2 rounded-2xl px-4 py-2.5 text-sm font-bold outline-none transition-all ${errors.fullName ? 'border-doby-red' : 'border-slate-100 dark:border-slate-800 focus:border-doby-blue'}`}
                  value={form.fullName}
                  onChange={e => setForm({...form, fullName: e.target.value})}
                />
                <ErrorLabel error={errors.fullName} />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase px-1 tracking-widest">Telefon</label>
                <input 
                  type="tel"
                  name="tel"
                  autoComplete="tel"
                  placeholder="07xxxxxxxx"
                  className={`w-full bg-white dark:bg-slate-900 border-2 rounded-2xl px-4 py-2.5 text-sm font-bold outline-none transition-all ${errors.phone ? 'border-doby-red' : 'border-slate-100 dark:border-slate-800 focus:border-doby-blue'}`}
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                />
                <ErrorLabel error={errors.phone} />
             </div>
          </div>
          <div className="space-y-1">
             <label className="text-[10px] font-black text-slate-400 uppercase px-1 tracking-widest">Email (Confirmare Comandă)</label>
             <input 
               type="email"
               name="email"
               autoComplete="email"
               placeholder="exemplu@mail.ro"
               className={`w-full bg-white dark:bg-slate-900 border-2 rounded-2xl px-4 py-2.5 text-sm font-bold outline-none transition-all ${errors.email ? 'border-doby-red' : 'border-slate-100 dark:border-slate-800 focus:border-doby-blue'}`}
               value={form.email}
               onChange={e => setForm({...form, email: e.target.value})}
             />
             <ErrorLabel error={errors.email} />
          </div>
        </div>

        <div className="space-y-3">
           <div className="flex items-center gap-2 mb-1 px-1">
             <span className="material-symbols-outlined text-doby-blue text-sm">location_on</span>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adresă Ridicare</p>
           </div>
           
           <div className="grid grid-cols-10 gap-3">
              <div className="col-span-6 space-y-1">
                 <label className="text-[9px] font-black text-slate-400 uppercase px-1">Localitate</label>
                 <select 
                   name="city"
                   autoComplete="address-level2"
                   className={`w-full bg-white dark:bg-slate-900 border-2 rounded-2xl px-4 py-2.5 text-sm font-bold outline-none border-slate-100 dark:border-slate-800 focus:border-doby-blue transition-all appearance-none cursor-pointer`}
                   value={form.city}
                   onChange={e => setForm({...form, city: e.target.value})}
                 >
                   {ILFOV_LOCALITIES.map(city => (
                     <option key={city} value={city}>{city}</option>
                   ))}
                 </select>
                 <ErrorLabel error={errors.city} />
              </div>
              <div className="col-span-4 space-y-1">
                 <label className="text-[9px] font-black text-slate-400 uppercase px-1">Sector</label>
                 <select 
                   name="address-level1"
                   disabled={form.city !== 'București'}
                   className={`w-full bg-white dark:bg-slate-900 border-2 rounded-2xl px-3 py-2.5 text-sm font-bold outline-none appearance-none cursor-pointer ${errors.sector ? 'border-doby-red' : 'border-slate-100 dark:border-slate-800 focus:border-doby-blue'} ${form.city !== 'București' ? 'opacity-80 bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed' : ''}`}
                   value={form.sector}
                   onChange={e => setForm({...form, sector: e.target.value})}
                 >
                   {form.city === 'București' ? (
                     <>
                       <option value="">Selectează</option>
                       {[1, 2, 3, 4, 5, 6].map(s => <option key={s} value={s.toString()}>{s}</option>)}
                     </>
                   ) : (
                     <option value="IF">IF</option>
                   )}
                 </select>
                 <ErrorLabel error={errors.sector} />
              </div>
           </div>

           <div className="grid grid-cols-10 gap-3">
              <div className="col-span-2 space-y-1">
                 <label className="text-[9px] font-black text-slate-400 uppercase px-1">Tip</label>
                 <select 
                   className="w-full bg-white dark:bg-slate-900 border-2 rounded-2xl px-3 py-2.5 text-sm font-bold outline-none border-slate-100 dark:border-slate-800 focus:border-doby-blue appearance-none cursor-pointer"
                   value={form.streetType}
                   onChange={e => setForm({...form, streetType: e.target.value})}
                 >
                   {['Str.', 'Bd.', 'Cal.', 'Intr.', 'Sos.'].map(t => <option key={t} value={t}>{t}</option>)}
                 </select>
              </div>
              <div className="col-span-8 space-y-1 relative">
                 <label className="text-[9px] font-black text-slate-400 uppercase px-1">Nume Stradă</label>
                 <input 
                   type="text"
                   name="address-line1"
                   autoComplete="address-line1"
                   placeholder="Ex. Victoriei"
                   className={`w-full bg-white dark:bg-slate-900 border-2 rounded-2xl px-4 py-2.5 text-sm font-bold outline-none transition-all ${errors.streetName ? 'border-doby-red' : 'border-slate-100 dark:border-slate-800 focus:border-doby-blue'}`}
                   value={form.streetName}
                   onChange={e => {
                     setForm({...form, streetName: e.target.value});
                     setShowSuggestions(true);
                   }}
                   onFocus={() => setShowSuggestions(true)}
                 />
                 
                 {showSuggestions && filteredStreets.length > 0 && (
                   <div ref={suggestionRef} className="absolute left-0 top-[60px] w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
                     <p className="px-4 py-2 text-[8px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800/50">Sugestii Străzi</p>
                     {filteredStreets.map((s, idx) => (
                       <button
                         key={idx}
                         type="button"
                         className="w-full text-left px-4 py-2.5 text-xs font-black text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-b last:border-0 border-slate-50 dark:border-slate-800/50 uppercase italic flex items-center gap-2"
                         onClick={() => {
                           setForm({...form, streetName: s});
                           setShowSuggestions(false);
                         }}
                       >
                         <span className="material-symbols-outlined text-xs text-doby-blue/50">search</span>
                         {s}
                       </button>
                     ))}
                   </div>
                 )}
                 <ErrorLabel error={errors.streetName} />
              </div>
           </div>

           <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase px-1">Număr</label>
                    <input 
                      type="text"
                      name="address-line2"
                      autoComplete="address-line2"
                      placeholder="Ex. 25"
                      className={`w-full bg-white dark:bg-slate-900 border-2 rounded-2xl px-3 py-2.5 text-sm font-bold outline-none transition-all ${errors.number ? 'border-doby-red' : 'border-slate-100 dark:border-slate-800 focus:border-doby-blue'}`}
                      value={form.number}
                      onChange={e => setForm({...form, number: e.target.value})}
                    />
                    <ErrorLabel error={errors.number} />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase px-1">Bloc</label>
                    <input 
                      type="text"
                      placeholder="Ex. 11"
                      className="w-full bg-white dark:bg-slate-900 border-2 rounded-2xl px-3 py-2.5 text-sm font-bold outline-none border-slate-100 dark:border-slate-800 focus:border-doby-blue"
                      value={form.building}
                      onChange={e => setForm({...form, building: e.target.value})}
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase px-1">Scară</label>
                    <input 
                      type="text"
                      placeholder="Ex. 1"
                      className="w-full bg-white dark:bg-slate-900 border-2 rounded-2xl px-3 py-2.5 text-sm font-bold outline-none border-slate-100 dark:border-slate-800 focus:border-doby-blue"
                      value={form.scara}
                      onChange={e => setForm({...form, scara: e.target.value})}
                    />
                 </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase px-1">Interfon</label>
                    <input 
                      type="text"
                      placeholder="Ex. 001"
                      className="w-full bg-white dark:bg-slate-900 border-2 rounded-2xl px-3 py-2.5 text-sm font-bold outline-none border-slate-100 dark:border-slate-800 focus:border-doby-blue"
                      value={form.intercom}
                      onChange={e => setForm({...form, intercom: e.target.value})}
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase px-1">Etaj</label>
                    <input 
                      type="number"
                      placeholder="Ex. 1"
                      className="w-full bg-white dark:bg-slate-900 border-2 rounded-2xl px-3 py-2.5 text-sm font-bold outline-none border-slate-100 dark:border-slate-800 focus:border-doby-blue"
                      value={form.floor}
                      onChange={e => setForm({...form, floor: e.target.value})}
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase px-1">APT</label>
                    <input 
                      type="text"
                      placeholder="Ex. 5"
                      className="w-full bg-white dark:bg-slate-900 border-2 rounded-2xl px-3 py-2.5 text-sm font-bold outline-none border-slate-100 dark:border-slate-800 focus:border-doby-blue"
                      value={form.apartment}
                      onChange={e => setForm({...form, apartment: e.target.value})}
                    />
                 </div>
              </div>
           </div>
        </div>
      </form>

      <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-6 z-30">
        <button 
          onClick={handleNextClick}
          className="w-full bg-gradient-to-br from-doby-red to-doby-red-dark hover:from-doby-red-light hover:to-doby-red text-white font-black text-lg py-5 px-6 rounded-2xl shadow-xl shadow-doby-red/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 border-b-4 border-black/20"
        >
          Continuă spre DATA COLECTĂRII
          <span className="material-symbols-outlined font-black">calendar_month</span>
        </button>
      </div>
    </div>
  );
};

export default LocationForm;

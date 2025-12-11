import React, { useState, useEffect, useRef } from 'react';
import { Ghost, Skull, HandCoins, History, TrendingUp, Info } from 'lucide-react';
import { Die } from './components/Die';
import { BetOption, DiceValue, GameHistory } from './types';

// The "Salty" Data
const TROLL_MESSAGES = {
  WIN: [
    "Chó ngáp phải ruồi!",
    "Đỏ thôi, đen quên đi cưng.",
    "Hack game à? Trả tiền đây!",
    "Nay ăn cứt gà hay sao đỏ thế?",
    "Thánh độ rồi, nạp thêm đi!",
    "Rùa vãi cả chưởng.",
    "Hay không bằng hên."
  ],
  LOSE: [
    "Ra đê mà ở!",
    "Ngu thì chết, bệnh tật gì.",
    "Còn đúng cái nịt!",
    "Về méc mẹ đi.",
    "Bán nhà chưa em?",
    "Thôi bỏ đi làm người.",
    "Đừng khóc, lau nước mắt đi em.",
    "Gà thế này thì bao giờ mới giàu?"
  ],
  BAO: [
    "Bão rồi! Nhà cái xin nhẹ cái nịt hihi.",
    "3 con giống nhau? Đen hơn mõm chó.",
    "Vào hang mà trốn đi.",
    "Cười ỉa, bão về làng!"
  ],
  POOR: [
    "Nghèo mà ham, cầm tạm 500k gỡ đi em.",
    "Khổ thân, tiền không có mà đòi đú.",
    "Bố thí cho ít lá mít này.",
    "Lần sau nạp nhiều vào nhé con."
  ]
};

const INITIAL_BALANCE = 5000;

export default function App() {
  // State
  const [balance, setBalance] = useState<number>(INITIAL_BALANCE);
  const [dice, setDice] = useState<DiceValue[]>([1, 1, 1]);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [betSide, setBetSide] = useState<BetOption | null>(null);
  const [betAmount, setBetAmount] = useState<number>(1000);
  const [history, setHistory] = useState<GameHistory[]>([]);
  const [notification, setNotification] = useState<string>("Vào sòng làm tí không em zai?");
  const [showLoanModal, setShowLoanModal] = useState<boolean>(false);

  // Audio refs (Mental implementation only per requirements, but structure is ready)
  const rollIntervalRef = useRef<number | null>(null);

  // Helper to pick random message
  const getSaltyMessage = (type: 'WIN' | 'LOSE' | 'BAO' | 'POOR') => {
    const arr = TROLL_MESSAGES[type];
    return arr[Math.floor(Math.random() * arr.length)];
  };

  // Helper to roll one die
  const randomDie = (): DiceValue => (Math.floor(Math.random() * 6) + 1) as DiceValue;

  // Check poverty logic
  useEffect(() => {
    if (balance <= 0 && !isRolling) {
      setTimeout(() => setShowLoanModal(true), 1000);
    }
  }, [balance, isRolling]);

  const handleRoll = () => {
    // 1. Validation
    if (balance < betAmount) {
      setNotification("Tiền đâu mà đòi chơi? Nạp lá mít vào!");
      return;
    }
    if (!betSide) {
      setNotification("Chọn Tài hoặc Xỉu đi má, ngắm hoài!");
      return;
    }

    // 2. Start Rolling
    setIsRolling(true);
    setNotification("Đang lắc... Cầu trời khấn phật đi!");
    
    // Deduct money immediately (Salty House rules)
    setBalance(prev => prev - betAmount);

    // Animation loop
    rollIntervalRef.current = window.setInterval(() => {
      setDice([randomDie(), randomDie(), randomDie()]);
    }, 100);

    // 3. Stop Logic (after 2.5 seconds)
    setTimeout(() => {
      if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
      
      const finalDice: DiceValue[] = [randomDie(), randomDie(), randomDie()];
      setDice(finalDice);
      
      finishGame(finalDice);
      setIsRolling(false);
    }, 2500);
  };

  const finishGame = (finalDice: DiceValue[]) => {
    const sum = finalDice.reduce((a, b) => a + b, 0);
    const isTriple = finalDice[0] === finalDice[1] && finalDice[1] === finalDice[2];
    
    let result: BetOption | 'BAO';
    
    if (isTriple) {
      result = 'BAO';
    } else if (sum >= 3 && sum <= 10) {
      result = BetOption.XIU;
    } else {
      result = BetOption.TAI;
    }

    // Logic xử lý thắng thua
    let won = false;
    let message = "";

    if (result === 'BAO') {
      won = false; // Nhà cái ăn hết (House takes all on Triple)
      message = getSaltyMessage('BAO');
    } else if (result === betSide) {
      won = true;
      message = getSaltyMessage('WIN');
    } else {
      won = false;
      message = getSaltyMessage('LOSE');
    }

    // Payout
    if (won) {
      // Return stake + profit (1:1 ratio for simplicity)
      setBalance(prev => prev + (betAmount * 2));
    }

    // Update History
    const newRecord: GameHistory = {
      id: Date.now(),
      dice: finalDice,
      sum,
      result
    };
    setHistory(prev => [newRecord, ...prev].slice(0, 10)); // Keep last 10
    setNotification(message);
    setBetSide(null); // Reset bet
  };

  const emergencyLoan = () => {
    setBalance(prev => prev + 500);
    setShowLoanModal(false);
    setNotification(getSaltyMessage('POOR'));
  };

  const quickBet = (amount: number) => {
    if (amount > balance && amount !== balance) { // Allow "All in" logic if exact
       setNotification("Làm gì còn tiền mà chọn mức đó?");
       return;
    }
    setBetAmount(amount);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
        <div className="absolute top-10 left-10 text-9xl">🎲</div>
        <div className="absolute bottom-10 right-10 text-9xl">💸</div>
      </div>

      {/* Header */}
      <header className="z-10 w-full max-w-2xl bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700 shadow-2xl mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Ghost className="w-8 h-8 text-purple-400 animate-pulse" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                TÀI XỈU CỰC MẶN
              </h1>
              <p className="text-xs text-slate-400">Uy tín thì ít, bịp thì nhiều</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-full border border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.2)]">
            <HandCoins className="w-5 h-5 text-yellow-400" />
            <span className="font-mono text-xl font-bold text-yellow-400">
              {balance.toLocaleString()} <span className="text-xs">Lá Mít</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="z-10 w-full max-w-2xl bg-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-700 relative">
        
        {/* History Bar */}
        <div className="flex gap-2 mb-6 overflow-x-auto p-2 bg-slate-900/50 rounded-lg justify-center scrollbar-hide">
          {history.length === 0 && <span className="text-slate-500 text-sm py-1">Chưa có lịch sử (Mới mở sòng)</span>}
          {history.map((h) => (
            <div 
              key={h.id}
              className={`
                w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold shrink-0
                ${h.result === 'TAI' ? 'bg-red-500 text-white shadow-lg shadow-red-500/50' : ''}
                ${h.result === 'XIU' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50' : ''}
                ${h.result === 'BAO' ? 'bg-green-500 text-white shadow-lg shadow-green-500/50 border-2 border-yellow-300' : ''}
              `}
              title={`Dice: ${h.dice.join('-')} | Sum: ${h.sum}`}
            >
              {h.result === 'BAO' ? 'B' : h.result === 'TAI' ? 'T' : 'X'}
            </div>
          ))}
        </div>

        {/* Dice Table */}
        <div className={`
          relative bg-green-800 rounded-full h-48 md:h-64 flex items-center justify-center gap-4 md:gap-8 mb-8 border-8 border-amber-900 shadow-inner
          ${isRolling ? 'animate-shake' : ''}
        `}>
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-yellow-500/20 pointer-events-none"></div>
          {dice.map((val, idx) => (
            <Die key={idx} value={val} isRolling={isRolling} />
          ))}
          
          {/* Total Sum Display (Hidden while rolling) */}
          {!isRolling && history.length > 0 && (
            <div className="absolute -bottom-4 bg-slate-900 text-white px-6 py-1 rounded-full border border-slate-600 font-bold shadow-xl">
               Tổng: <span className="text-yellow-400 text-lg">{dice.reduce((a,b)=>a+b,0)}</span>
            </div>
          )}
        </div>

        {/* Notification Area */}
        <div className="text-center mb-6 h-12 flex items-center justify-center">
          <p className={`text-lg font-bold transition-all duration-300 ${isRolling ? 'text-yellow-400 animate-pulse' : 'text-cyan-300'}`}>
            "{notification}"
          </p>
        </div>

        {/* Betting Controls */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => !isRolling && setBetSide(BetOption.TAI)}
            className={`
              p-6 rounded-2xl flex flex-col items-center gap-2 border-b-4 transition-all
              ${betSide === BetOption.TAI 
                ? 'bg-red-600 border-red-800 scale-95 ring-4 ring-red-400/50' 
                : 'bg-slate-700 border-slate-900 hover:bg-slate-600'}
              ${isRolling ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={isRolling}
          >
            <span className="text-3xl font-black uppercase tracking-wider text-white">TÀI</span>
            <span className="text-xs text-red-200">11 - 18</span>
            {betSide === BetOption.TAI && (
               <div className="mt-2 bg-black/30 px-3 py-1 rounded text-yellow-300 font-mono text-sm">
                 Đang cược: {betAmount.toLocaleString()}
               </div>
            )}
          </button>

          <button
            onClick={() => !isRolling && setBetSide(BetOption.XIU)}
            className={`
              p-6 rounded-2xl flex flex-col items-center gap-2 border-b-4 transition-all
              ${betSide === BetOption.XIU 
                ? 'bg-blue-600 border-blue-800 scale-95 ring-4 ring-blue-400/50' 
                : 'bg-slate-700 border-slate-900 hover:bg-slate-600'}
              ${isRolling ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={isRolling}
          >
            <span className="text-3xl font-black uppercase tracking-wider text-white">XỈU</span>
            <span className="text-xs text-blue-200">3 - 10</span>
            {betSide === BetOption.XIU && (
               <div className="mt-2 bg-black/30 px-3 py-1 rounded text-yellow-300 font-mono text-sm">
                 Đang cược: {betAmount.toLocaleString()}
               </div>
            )}
          </button>
        </div>

        {/* Money Input */}
        <div className="flex flex-col gap-3 mb-6">
          <label className="text-slate-400 text-sm font-semibold flex justify-between">
            <span>Mức cược (Lá Mít)</span>
            <span className="text-xs italic text-slate-500">Đừng tất tay rồi ra đê nhé</span>
          </label>
          <div className="flex gap-2">
            <input 
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Math.max(0, parseInt(e.target.value) || 0))}
              className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-yellow-500"
              disabled={isRolling}
            />
            <button onClick={() => quickBet(balance)} className="bg-purple-600 hover:bg-purple-500 text-white px-4 rounded-lg font-bold text-sm">ALL-IN</button>
          </div>
          <div className="flex justify-between gap-2 overflow-x-auto scrollbar-hide">
            {[100, 500, 1000, 5000].map(amt => (
              <button 
                key={amt}
                onClick={() => quickBet(amt)}
                className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded text-xs font-mono transition-colors whitespace-nowrap"
                disabled={isRolling}
              >
                +{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleRoll}
          disabled={isRolling}
          className={`
            w-full py-4 rounded-xl text-xl font-black text-slate-900 uppercase tracking-widest transition-all
            ${isRolling 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)] active:scale-95'}
          `}
        >
          {isRolling ? 'Đang Xóc Lọ...' : 'LẮC NGAY CON ƠI'}
        </button>

      </main>

      {/* Footer Info */}
      <footer className="mt-8 text-center text-slate-600 text-xs">
        <p className="flex items-center justify-center gap-1">
           <Info size={12}/> Game chỉ mang tính chất troll, không khuyến khích cờ bạc thật.
        </p>
        <p>Thắng không kiêu, bại thì... nạp tiền chơi tiếp.</p>
      </footer>

      {/* LOAN MODAL (Bơm máu) */}
      {showLoanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-slate-800 border-2 border-red-500 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-600 rounded-full p-3 border-4 border-slate-800">
              <Skull className="w-8 h-8 text-white animate-bounce" />
            </div>
            
            <h2 className="text-2xl font-black text-red-500 mt-6 mb-2">HẾT TIỀN RỒI À?</h2>
            <p className="text-slate-300 mb-6 italic">
              "Trông mặt hãm tài thế kia thì làm sao mà đỏ được? Thôi cầm tạm ít tiền lẻ mà gỡ, lãi 0% nhưng lãi tình cảm thì vô cực."
            </p>
            
            <button 
              onClick={emergencyLoan}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <HandCoins size={20} />
              Vay nóng bát họ (500 Lá Mít)
            </button>
            <p className="text-[10px] text-slate-500 mt-2">*Bấm vào đây đồng nghĩa với việc bạn thừa nhận mình 'gà'.</p>
          </div>
        </div>
      )}

    </div>
  );
}
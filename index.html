import React, { useState, useEffect } from 'react';

const IBCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState([]);
  const [mode, setMode] = useState('basic');
  const [expression, setExpression] = useState('');
  const [openParentheses, setOpenParentheses] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [memory, setMemory] = useState({
    wacc: 8.5,
    terminalGrowth: 2.5,
    discountRate: 10,
    revenue: 0,
    ebitda: 0,
    netIncome: 0,
    shares: 0,
    marketCap: 0,
    enterprise: 0,
    debtEquityRatio: 4.0,
    debtEbitdaMultiple: 6.0,
    initialInvestment: 0,
    cashFlows: [],
    currentCashFlow: 0
  });

  const [exchangeRates, setExchangeRates] = useState({
    USD: 1.0000,
    EUR: 0.9150,
    JPY: 142.30,
    GBP: 0.7820,
    CHF: 0.8850,
    CAD: 1.3720,
    CNY: 7.2800,
    PLN: 4.0500,
    AUD: 1.4950,
    SEK: 10.8500
  });
  const [ratesLastUpdated, setRatesLastUpdated] = useState(null);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedToCurrency, setSelectedToCurrency] = useState('EUR');
  const [showTutorial, setShowTutorial] = useState(false);

  // PWA Service Worker Registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('PWA: Service Worker registered successfully:', registration);
          })
          .catch((registrationError) => {
            console.log('PWA: Service Worker registration failed:', registrationError);
          });
      });
    }
  }, []);

  const getTutorialContent = () => {
    switch (mode) {
      case 'basic':
        return {
          title: 'Basic Calculator Tutorial',
          content: [
            {
              section: 'What it does:',
              text: 'Standard calculator with financial shortcuts for quick calculations.'
            },
            {
              section: 'Key Features:',
              text: '• Standard arithmetic operations (+, -, ×, ÷)\n• Parentheses for complex expressions\n• Quick multipliers: ×1K, ×1M, ×1B\n• Percentage calculations'
            },
            {
              section: 'Example:',
              text: 'Calculate company valuation:\n1. Enter "15" (revenue in millions)\n2. Click "×1M" → 15,000,000\n3. Click "×" then "12" (multiple)\n4. Click "=" → Result: 180M valuation'
            }
          ]
        };
      
      case 'dcf':
        return {
          title: 'DCF (Discounted Cash Flow) Tutorial',
          content: [
            {
              section: 'What it does:',
              text: 'Values a company based on projected future cash flows discounted to present value.'
            },
            {
              section: 'How to use:',
              text: '1. Set WACC (Weighted Average Cost of Capital)\n2. Set Terminal Growth rate\n3. Enter current Free Cash Flow\n4. Click "DCF Model" for valuation'
            },
            {
              section: 'Example:',
              text: 'Value a tech company:\n1. Enter "8.5" → Click "Set WACC" (8.5%)\n2. Enter "2.5" → Click "Set TG" (2.5%)\n3. Enter "100" (FCF in millions)\n4. Click "×1M" then "DCF Model"\n→ Result: Enterprise Value'
            }
          ]
        };
      
      case 'comps':
        return {
          title: 'Comparable Analysis Tutorial',
          content: [
            {
              section: 'What it does:',
              text: 'Values companies using trading multiples from similar public companies.'
            },
            {
              section: 'How to use:',
              text: '1. Set Enterprise Value and Market Cap\n2. Enter financial metrics (Revenue, EBITDA)\n3. Click multiple buttons to calculate ratios'
            }
          ]
        };
      
      default:
        return { title: 'Calculator Tutorial', content: [] };
    }
  };

  const fetchExchangeRates = async () => {
    setIsLoadingRates(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockData = {
        rates: {
          EUR: 0.9234 + (Math.random() - 0.5) * 0.02,
          JPY: 147.85 + (Math.random() - 0.5) * 3,
          GBP: 0.7912 + (Math.random() - 0.5) * 0.015,
          CHF: 0.8923 + (Math.random() - 0.5) * 0.012,
          CAD: 1.3567 + (Math.random() - 0.5) * 0.025,
          CNY: 7.2456 + (Math.random() - 0.5) * 0.15,
          PLN: 4.0234 + (Math.random() - 0.5) * 0.08,
          AUD: 1.5123 + (Math.random() - 0.5) * 0.03,
          SEK: 10.7834 + (Math.random() - 0.5) * 0.25
        }
      };
      
      setExchangeRates({
        USD: 1.0000,
        ...mockData.rates
      });
      setRatesLastUpdated(new Date());
      setIsLoadingRates(false);
    } catch (error) {
      setIsLoadingRates(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setExpression('');
    setOpenParentheses(0);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+': return firstValue + secondValue;
      case '-': return firstValue - secondValue;
      case '×': return firstValue * secondValue;
      case '÷': return secondValue !== 0 ? firstValue / secondValue : 0;
      case '%': return firstValue % secondValue;
      case '^': return Math.pow(firstValue, secondValue);
      default: return secondValue;
    }
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(newValue);
      const calculation = `${formatNumber(currentValue)} ${operation} ${formatNumber(inputValue)} = ${formatNumber(newValue)}`;
      setHistory(prev => [calculation, ...prev.slice(0, 19)]);
    }
    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const performEquals = () => {
    const inputValue = parseFloat(display);
    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      const calculation = `${formatNumber(previousValue)} ${operation} ${formatNumber(inputValue)} = ${formatNumber(newValue)}`;
      setHistory(prev => [calculation, ...prev.slice(0, 19)]);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const calculateDCF = () => {
    const fcf = parseFloat(display);
    const wacc = memory.wacc / 100;
    const terminalGrowth = memory.terminalGrowth / 100;
    const projectionYears = 5;
    
    let pv = 0;
    const initialGrowth = 0.15;
    const growthDecline = 0.02;
    
    for (let year = 1; year <= projectionYears; year++) {
      const yearGrowth = Math.max(initialGrowth - (growthDecline * (year - 1)), terminalGrowth);
      const fcfYear = fcf * Math.pow(1 + yearGrowth, year);
      pv += fcfYear / Math.pow(1 + wacc, year);
    }
    
    const finalYearGrowth = Math.max(initialGrowth - (growthDecline * projectionYears), terminalGrowth);
    const terminalFCF = fcf * Math.pow(1 + finalYearGrowth, projectionYears) * (1 + terminalGrowth);
    const terminalValue = terminalFCF / (wacc - terminalGrowth);
    const terminalPV = terminalValue / Math.pow(1 + wacc, projectionYears);
    
    const enterpriseValue = pv + terminalPV;
    const result = Math.round(enterpriseValue);
    
    setDisplay(String(result));
    setHistory(prev => [`DCF: FCF=${formatNumber(fcf)}, WACC=${memory.wacc}%, TG=${memory.terminalGrowth}% = ${formatNumber(result)}`, ...prev.slice(0, 19)]);
    setWaitingForOperand(true);
  };

  const storeMemory = (key) => {
    const value = parseFloat(display);
    setMemory(prev => ({ ...prev, [key]: value }));
    setHistory(prev => [`Stored ${key.toUpperCase()}: ${formatNumber(value)}`, ...prev.slice(0, 19)]);
  };

  const formatNumber = (num) => {
    if (Math.abs(num) >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (Math.abs(num) >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (Math.abs(num) >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const Button = ({ onClick, className = '', children, variant = 'default', size = 'normal', disabled = false }) => {
    const baseClasses = 'font-semibold rounded-lg transition-all duration-200 active:scale-95 shadow-sm border';
    const sizes = {
      normal: 'h-10 sm:h-12 text-xs sm:text-sm px-2 sm:px-3',
      small: 'h-8 sm:h-10 text-xs px-1 sm:px-2',
      large: 'h-12 sm:h-14 text-sm sm:text-base px-3 sm:px-4'
    };
    
    const variants = isDarkMode ? {
      default: disabled ? 'bg-gray-800 text-gray-600 border-gray-700 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600 text-gray-100 border-gray-600 hover:border-gray-500',
      operator: 'bg-gray-800 hover:bg-gray-700 text-yellow-400 border-gray-600 hover:border-yellow-400',
      equals: 'bg-yellow-500 hover:bg-yellow-400 text-black font-bold border-yellow-400',
      function: disabled ? 'bg-gray-800 text-gray-600 border-gray-700 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 text-blue-400 border-gray-600',
      clear: 'bg-red-600 hover:bg-red-500 text-white border-red-500',
      ib: 'bg-yellow-600 hover:bg-yellow-500 text-black font-semibold border-yellow-500',
      memory: 'bg-purple-600 hover:bg-purple-500 text-white border-purple-500',
      theme: 'bg-gray-600 hover:bg-gray-500 text-yellow-400 border-gray-500 hover:border-yellow-400'
    } : {
      default: disabled ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300 hover:border-gray-400',
      operator: 'bg-white hover:bg-yellow-50 text-yellow-600 border-yellow-300 hover:border-yellow-400',
      equals: 'bg-yellow-500 hover:bg-yellow-600 text-white font-bold border-yellow-500',
      function: disabled ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed' : 'bg-white hover:bg-blue-50 text-blue-600 border-blue-300',
      clear: 'bg-red-500 hover:bg-red-600 text-white border-red-500',
      ib: 'bg-yellow-400 hover:bg-yellow-500 text-black font-semibold border-yellow-400',
      memory: 'bg-purple-500 hover:bg-purple-600 text-white border-purple-500',
      theme: 'bg-yellow-100 hover:bg-yellow-200 text-gray-800 border-yellow-300 hover:border-yellow-400'
    };
    
    return (
      <button
        className={`${baseClasses} ${sizes[size]} ${variants[variant]} ${className}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  };

  return (
    <div className={`w-full max-w-3xl mx-auto rounded-2xl shadow-2xl p-3 sm:p-6 mt-4 sm:mt-8 border transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-white border-gray-200'
    } min-h-screen sm:min-h-0`}>
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <Button
            variant="function"
            size="small"
            onClick={() => setShowTutorial(true)}
            className="w-14 sm:w-20 h-6 sm:h-8 flex items-center justify-center text-xs"
            title="Learn how to use this mode"
          >
            📚 Help
          </Button>
          <h1 className={`text-base sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            <span className="hidden sm:inline">Investment Banking Calculator</span>
            <span className="sm:hidden">IB Calculator</span>
          </h1>
          <Button
            variant="theme"
            size="small"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-8 sm:w-12 h-6 sm:h-8 flex items-center justify-center text-xs"
            title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </Button>
        </div>
        <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className="hidden sm:inline">Professional financial modeling and analysis tool by MissCept</span>
          <span className="sm:hidden">Financial modeling tool by MissCept</span>
        </p>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-2 sm:p-4 pt-10 sm:pt-16">
          <div className={`w-full max-w-3xl rounded-xl border shadow-2xl h-80 sm:h-40 ${
            isDarkMode 
              ? 'bg-gray-900 border-gray-600' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="p-2 sm:p-3 h-full flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h2 className={`text-sm sm:text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {getTutorialContent().title}
                </h2>
                <Button
                  variant="clear"
                  size="small"
                  onClick={() => setShowTutorial(false)}
                  className="w-5 h-5 flex items-center justify-center p-0 text-xs"
                >
                  ✕
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2" style={{scrollbarWidth: 'thin'}}>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  {getTutorialContent().content.map((item, index) => (
                    <div key={index} className={`flex-1 p-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <h3 className={`font-semibold mb-1 text-xs ${
                        isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                      }`}>
                        {item.section}
                      </h3>
                      <p className={`text-xs whitespace-pre-line leading-tight ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Display */}
      <div className="mb-4 sm:mb-6">
        <div className={`p-4 sm:p-6 rounded-xl mb-3 sm:mb-4 border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-black text-white border-gray-600' 
            : 'bg-gray-50 text-gray-800 border-gray-200'
        }`}>
          <div className="text-right text-xl sm:text-3xl font-mono overflow-hidden mb-2">
            {formatNumber(parseFloat(display) || 0)}
          </div>
          <div className={`text-right text-sm sm:text-lg mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {parseFloat(display) >= 1000000 ? `${parseFloat(display).toLocaleString()}` : display}
          </div>
          {operation && previousValue !== null && (
            <div className={`text-right text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {formatNumber(previousValue)} {operation}
            </div>
          )}
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-3 sm:flex gap-1 sm:gap-2 mb-3 sm:mb-4">
          {[
            { key: 'basic', label: 'BASIC' },
            { key: 'dcf', label: 'DCF' },
            { key: 'comps', label: 'COMPS' }
          ].map((m) => (
            <Button
              key={m.key}
              variant={mode === m.key ? 'ib' : 'default'}
              size="small"
              onClick={() => {
                setMode(m.key);
                setHistory([]);
              }}
              className="flex-1 text-xs"
            >
              {m.label}
            </Button>
          ))}
        </div>

        {/* Memory Display */}
        {mode !== 'basic' && (
          <div className={`p-2 sm:p-3 rounded-lg mb-3 sm:mb-4 border transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-600' 
              : 'bg-gray-100 border-gray-200'
          }`}>
            <div className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Memory Values
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 text-xs">
              <div className={`px-1 sm:px-2 py-1 rounded transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300' 
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}>WACC: {memory.wacc}%</div>
              <div className={`px-1 sm:px-2 py-1 rounded transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300' 
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}>TG: {memory.terminalGrowth}%</div>
              <div className={`px-1 sm:px-2 py-1 rounded transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300' 
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}>EV: {formatNumber(memory.enterprise)}</div>
              <div className={`px-1 sm:px-2 py-1 rounded transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300' 
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}>MCap: {formatNumber(memory.marketCap)}</div>
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className={`p-2 sm:p-3 rounded-lg max-h-24 sm:max-h-32 overflow-y-auto border transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-600' 
              : 'bg-gray-100 border-gray-200'
          }`}>
            <div className="flex justify-between items-center mb-2">
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                History
              </div>
              <Button
                variant="clear"
                size="small"
                onClick={() => setHistory([])}
                className="h-4 sm:h-5 px-1 sm:px-2 text-xs"
              >
                Clear
              </Button>
            </div>
            {history.slice(0, 6).map((calc, index) => (
              <div key={index} className={`text-xs font-mono mb-1 p-1 rounded transition-all duration-300 ${
                isDarkMode 
                  ? 'text-gray-300 bg-gray-700' 
                  : 'text-gray-700 bg-white border border-gray-200'
              }`}>
                {calc}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mode-specific functions */}
      {mode === 'dcf' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 mb-3 sm:mb-4">
          <Button variant="ib" size="small" onClick={calculateDCF}>DCF Model</Button>
          <Button variant="memory" size="small" onClick={() => storeMemory('wacc')}>Set WACC</Button>
          <Button variant="memory" size="small" onClick={() => storeMemory('terminalGrowth')}>Set TG</Button>
          <Button variant="memory" size="small" onClick={() => storeMemory('enterprise')}>Set EV</Button>
        </div>
      )}

      {/* Basic Calculator Layout */}
      <div className="space-y-2 sm:space-y-3">
        <div className="grid grid-cols-4 gap-1 sm:gap-3">
          <Button variant="clear" size="small" onClick={clear}>AC</Button>
          <Button variant="function" size="small" onClick={() => setDisplay(display.slice(0, -1) || '0')}>⌫</Button>
          <Button variant="operator" size="small" onClick={() => performOperation('%')}>%</Button>
          <Button variant="operator" size="small" onClick={() => performOperation('÷')}>÷</Button>
        </div>

        <div className="grid grid-cols-4 gap-1 sm:gap-3">
          <Button onClick={() => inputNumber(7)}>7</Button>
          <Button onClick={() => inputNumber(8)}>8</Button>
          <Button onClick={() => inputNumber(9)}>9</Button>
          <Button variant="operator" onClick={() => performOperation('×')}>×</Button>
        </div>

        <div className="grid grid-cols-4 gap-1 sm:gap-3">
          <Button onClick={() => inputNumber(4)}>4</Button>
          <Button onClick={() => inputNumber(5)}>5</Button>
          <Button onClick={() => inputNumber(6)}>6</Button>
          <Button variant="operator" onClick={() => performOperation('-')}>-</Button>
        </div>

        <div className="grid grid-cols-4 gap-1 sm:gap-3">
          <Button onClick={() => inputNumber(1)}>1</Button>
          <Button onClick={() => inputNumber(2)}>2</Button>
          <Button onClick={() => inputNumber(3)}>3</Button>
          <Button variant="operator" onClick={() => performOperation('+')}>+</Button>
        </div>

        <div className="grid grid-cols-4 gap-1 sm:gap-3">
          <Button variant="function" onClick={() => {
            const val = parseFloat(display);
            setDisplay(String(val * 1000));
            setWaitingForOperand(true);
          }}>×1K</Button>
          <Button onClick={() => inputNumber(0)}>0</Button>
          <Button onClick={inputDecimal}>.</Button>
          <Button variant="equals" onClick={performEquals}>=</Button>
        </div>

        <div className="grid grid-cols-2 gap-1 sm:gap-3">
          <Button variant="function" onClick={() => {
            const val = parseFloat(display);
            setDisplay(String(val * 1000000));
            setWaitingForOperand(true);
          }}>×1M</Button>
          <Button variant="function" onClick={() => {
            const val = parseFloat(display);
            setDisplay(String(val * 1000000000));
            setWaitingForOperand(true);
          }}>×1B</Button>
        </div>
      </div>

      {/* Footer */}
      <div className={`text-xs mt-4 sm:mt-6 text-center transition-all duration-300 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        <div className="mb-1">
          <span className="hidden sm:inline">IB Calculator v2.3 | Enhanced Financial Modeling Suite</span>
          <span className="sm:hidden">IB Calculator v2.3 | Financial Suite</span>
        </div>
        <div className="text-xs hidden sm:block">DCF: Discounted Cash Flow | Comps: Comparable Analysis</div>
      </div>
    </div>
  );
};

export default IBCalculator;

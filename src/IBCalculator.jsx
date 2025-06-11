import React, { useState, useEffect } from 'react';

const IBCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState([]);
  const [mode, setMode] = useState('basic');
  const [activeTab, setActiveTab] = useState('calculator');
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
  const [tutorialContent, setTutorialContent] = useState(null);

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
      case 'forex':
        return {
          title: 'Foreign Exchange Tutorial',
          content: [
            {
              section: 'What it does:',
              text: 'Converts currencies using live exchange rates from reliable financial APIs.'
            },
            {
              section: 'How to use:',
              text: '1. Select source and target currencies\n2. Enter amount to convert\n3. Click "Convert" or "Get Rate"\n4. Use swap button (⇄) to reverse currencies'
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

  const convertCurrency = (fromCurrency, toCurrency, amount) => {
    const usdAmount = amount / exchangeRates[fromCurrency];
    return usdAmount * exchangeRates[toCurrency];
  };

  const performForexConversion = (toCurrency) => {
    const amount = parseFloat(display);
    if (isNaN(amount) || amount === 0) return;
    
    const convertedAmount = convertCurrency(selectedCurrency, toCurrency, amount);
    const formattedResult = convertedAmount < 0.01 ? convertedAmount.toFixed(6) : convertedAmount.toFixed(4);
    setDisplay(String(formattedResult));
    setHistory(prev => [`${amount.toFixed(2)} ${selectedCurrency} = ${formattedResult} ${toCurrency}`, ...prev.slice(0, 19)]);
    setWaitingForOperand(true);
  };

  const getCurrencyName = (code) => {
    const names = {
      USD: 'US Dollar',
      EUR: 'Euro',
      JPY: 'Japanese Yen',
      GBP: 'British Pound',
      CHF: 'Swiss Franc',
      CAD: 'Canadian Dollar',
      CNY: 'Chinese Yuan',
      PLN: 'Polish Zloty',
      AUD: 'Australian Dollar',
      SEK: 'Swedish Krona'
    };
    return names[code] || code;
  };

  const swapCurrencies = () => {
    const temp = selectedCurrency;
    setSelectedCurrency(selectedToCurrency);
    setSelectedToCurrency(temp);
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
      swap: 'bg-green-600 hover:bg-green-500 text-white font-semibold border-green-500',
      theme: 'bg-gray-600 hover:bg-gray-500 text-yellow-400 border-gray-500 hover:border-yellow-400'
    } : {
      default: disabled ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300 hover:border-gray-400',
      operator: 'bg-white hover:bg-yellow-50 text-yellow-600 border-yellow-300 hover:border-yellow-400',
      equals: 'bg-yellow-500 hover:bg-yellow-600 text-white font-bold border-yellow-500',
      function: disabled ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed' : 'bg-white hover:bg-blue-50 text-blue-600 border-blue-300',
      clear: 'bg-red-500 hover:bg-red-600 text-white border-red-500',
      ib: 'bg-yellow-400 hover:bg-yellow-500 text-black font-semibold border-yellow-400',
      memory: 'bg-purple-500 hover:bg-purple-600 text-white border-purple-500',
      swap: 'bg-green-500 hover:bg-green-600 text-white font-semibold border-green-500',
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-start z-50 p-2 pt-16">
          <div className={`w-full max-w-md rounded-lg shadow-xl ml-2 ${
            isDarkMode ? 'bg-gray-900' : 'bg-white'
          }`}>
            <div className="p-3">
              <div className="flex justify-between items-center mb-2">
                <h2 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {activeTab.toUpperCase()} {mode && `- ${mode.toUpperCase()}`}
                </h2>
                <button
                  onClick={() => setShowTutorial(false)}
                  className={`text-lg ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {/* Calculator Tutorial */}
                {activeTab === 'calculator' && (
                  <div>
                    <h3 className={`font-semibold text-xs mb-1 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      Basic Calculator
                    </h3>
                    <p className={`mb-2 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Standard calculator with financial shortcuts for quick calculations.
                    </p>
                    <ul className={`list-disc list-inside space-y-0.5 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <li>Basic operations: +, -, ×, ÷</li>
                      <li>Quick multipliers: ×1K, ×1M, ×1B</li>
                      <li>Advanced functions: √, ^, ln</li>
                      <li>Percentage calculations</li>
                    </ul>
                    <div className={`mt-2 p-2 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <p className={`font-semibold text-xs mb-1 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Example:</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Company valuation: Enter "15" → ×1M → × → "12" → = <br/>
                        Result: 180,000,000 (15M revenue × 12 multiple)
                      </p>
                    </div>
                  </div>
                )}

                {/* DCF Tutorial */}
                {activeTab === 'models' && mode === 'dcf' && (
                  <div>
                    <h3 className={`font-semibold text-xs mb-1 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      DCF (Discounted Cash Flow)
                    </h3>
                    <p className={`mb-2 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Values companies based on projected future cash flows discounted to present value.
                    </p>
                    <div className={`space-y-1 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <p><strong>Steps:</strong></p>
                      <ol className="list-decimal list-inside space-y-0.5 text-xs">
                        <li>Enter WACC rate → Click "Set WACC"</li>
                        <li>Enter terminal growth → Click "Set TG"</li>
                        <li>Enter current Free Cash Flow</li>
                        <li>Click "DCF Model" for enterprise value</li>
                      </ol>
                    </div>
                    <div className={`mt-2 p-2 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <p className={`font-semibold text-xs mb-1 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Example:</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        1. Enter "10" → Set WACC (10%)<br/>
                        2. Enter "3" → Set TG (3%)<br/>
                        3. Enter "100" → ×1M → DCF Model<br/>
                        Result: ~$1.2B enterprise value
                      </p>
                    </div>
                  </div>
                )}

                {/* COMPS Tutorial */}
                {activeTab === 'models' && mode === 'comps' && (
                  <div>
                    <h3 className={`font-semibold text-xs mb-1 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      Comparable Company Analysis
                    </h3>
                    <p className={`mb-2 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Values companies using trading multiples from similar public companies.
                    </p>
                    <div className={`space-y-1 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <p><strong>Available Multiples:</strong></p>
                      <ul className="list-disc list-inside space-y-0.5 text-xs">
                        <li>EV/EBITDA - Enterprise value to EBITDA</li>
                        <li>P/E - Price to earnings ratio</li>
                        <li>EV/Revenue - Enterprise value to sales</li>
                        <li>P/B - Price to book value</li>
                      </ul>
                      <p><strong>Process:</strong></p>
                      <ol className="list-decimal list-inside space-y-0.5 text-xs">
                        <li>Click "Set EV" to store Enterprise Value</li>
                        <li>Click "Set MCap" for Market Cap</li>
                        <li>Enter financial metric (EBITDA, Revenue)</li>
                        <li>Click multiple button to calculate ratio</li>
                      </ol>
                    </div>
                    <div className={`mt-2 p-2 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <p className={`font-semibold text-xs mb-1 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Example:</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        1. Enter "1200" → ×1M → Set EV ($1.2B)<br/>
                        2. Enter "100" → ×1M → EV/EBITDA<br/>
                        Result: 12.0x (1200M ÷ 100M EBITDA)<br/>
                        Compare to industry average of 8-15x
                      </p>
                    </div>
                  </div>
                )}

                {/* LBO Tutorial */}
                {activeTab === 'models' && mode === 'lbo' && (
                  <div>
                    <h3 className={`font-semibold text-xs mb-1 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      Leveraged Buyout (LBO)
                    </h3>
                    <p className={`mb-2 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Models private equity acquisitions using debt and equity financing.
                    </p>
                    <div className={`space-y-1 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <p><strong>Key Functions:</strong></p>
                      <ul className="list-disc list-inside space-y-0.5 text-xs">
                        <li>LBO Size - Total deal size (equity + debt)</li>
                        <li>Debt Cap - Max debt based on EBITDA multiples</li>
                        <li>IRR - Internal rate of return</li>
                        <li>MOIC - Multiple of invested capital</li>
                      </ul>
                      <p><strong>Target Returns:</strong> 15-25% IRR, 2-5x MOIC</p>
                    </div>
                    <div className={`mt-2 p-2 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <p className={`font-semibold text-xs mb-1 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Example:</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        1. Enter "200" → ×1M → LBO Size<br/>
                        Result: $1B total (200M equity + 800M debt)<br/>
                        2. Enter "150" → ×1M → Debt Cap<br/>
                        Result: $900M max debt (150M × 6x EBITDA)<br/>
                        3. Exit at $1.5B → IRR = 22%
                      </p>
                    </div>
                  </div>
                )}

                {/* IRR/NPV Tutorial */}
                {activeTab === 'models' && mode === 'irr_npv' && (
                  <div>
                    <h3 className={`font-semibold text-xs mb-1 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      IRR/NPV Investment Analysis
                    </h3>
                    <p className={`mb-2 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Evaluates investments using multiple financial metrics.
                    </p>
                    <div className={`space-y-1 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <p><strong>Key Metrics:</strong></p>
                      <ul className="list-disc list-inside space-y-0.5 text-xs">
                        <li>NPV - Net Present Value (positive = good)</li>
                        <li>IRR - Internal Rate of Return</li>
                        <li>Payback - Time to recover investment</li>
                        <li>PI - Profitability Index</li>
                      </ul>
                      <p><strong>Decision Rule:</strong> NPV>0, IRR>hurdle rate, PI>1.0</p>
                    </div>
                    <div className={`mt-2 p-2 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <p className={`font-semibold text-xs mb-1 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Example:</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        1. Enter "1000" → ×1K → Set Investment ($1M)<br/>
                        2. Enter "12" → Set Rate (12% discount)<br/>
                        3. Add CF: "300K" → Add CF (repeat 5 years)<br/>
                        4. NPV = $81K, IRR = 15.2%, Payback = 3.3 years<br/>
                        Decision: Invest (NPV>0, IRR>12%)
                      </p>
                    </div>
                  </div>
                )}

                {/* Scientific Tutorial */}
                {activeTab === 'scientific' && (
                  <div>
                    <h3 className={`font-semibold text-xs mb-1 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      Scientific Calculator
                    </h3>
                    <p className={`mb-2 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Advanced mathematical calculator for complex financial modeling.
                    </p>
                    <div className={`space-y-1 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <p><strong>Function Categories:</strong></p>
                      <ul className="list-disc list-inside space-y-0.5 text-xs">
                        <li>Memory: mc, m+, m-, mr</li>
                        <li>Powers: x², x³, xʸ, eˣ, 10ˣ</li>
                        <li>Trigonometry: sin, cos, tan, sinh, cosh, tanh</li>
                        <li>Logarithms: ln, log₁₀</li>
                        <li>Constants: π, e</li>
                      </ul>
                      <p><strong>Financial Uses:</strong> Option pricing, volatility modeling, statistical analysis</p>
                    </div>
                    <div className={`mt-2 p-2 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <p className={`font-semibold text-xs mb-1 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Example:</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Black-Scholes calculation:<br/>
                        1. Enter "0.05" → ln → Result: -2.996 (risk-free rate)<br/>
                        2. Enter "0.25" → x² → Result: 0.0625 (volatility²)<br/>
                        3. Enter "365" → ÷ → "252" → Result: 1.45 (time factor)<br/>
                        Use with option pricing formulas
                      </p>
                    </div>
                  </div>
                )}

                {/* Forex Tutorial */}
                {activeTab === 'forex' && (
                  <div>
                    <h3 className={`font-semibold text-xs mb-1 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      Foreign Exchange Converter
                    </h3>
                    <p className={`mb-2 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Converts between major currencies with simulated live rates.
                    </p>
                    <div className={`space-y-1 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <p><strong>Supported:</strong> USD, EUR, GBP, JPY, CHF, CAD, CNY, PLN, AUD, SEK</p>
                      <p><strong>How to use:</strong></p>
                      <ol className="list-decimal list-inside space-y-0.5 text-xs">
                        <li>Select source and target currencies</li>
                        <li>Enter amount to convert</li>
                        <li>Click "Convert"</li>
                        <li>Use ⇄ button to swap currencies</li>
                      </ol>
                    </div>
                    <div className={`mt-2 p-2 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <p className={`font-semibold text-xs mb-1 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Example:</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Converting investment amount:<br/>
                        1. Select USD → EUR<br/>
                        2. Enter "1000000" (1M USD)<br/>
                        3. Click "Convert to EUR"<br/>
                        Result: €923,400 (at 0.9234 rate)<br/>
                        Use ⇄ to reverse: EUR → USD
                      </p>
                    </div>
                  </div>
                )}

                {/* Default */}
                {!['calculator', 'models', 'forex', 'scientific'].includes(activeTab) && (
                  <div>
                    <h3 className={`font-semibold text-xs mb-1 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      Welcome to IB Calculator
                    </h3>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Select a tab and mode to see specific tutorials for each feature.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className={`flex rounded-xl mb-4 sm:mb-6 border overflow-hidden ${
        isDarkMode ? 'border-gray-600' : 'border-gray-200'
      }`}>
        {[
          { key: 'calculator', label: 'Calculator' },
          { key: 'models', label: 'Models' },
          { key: 'forex', label: 'Forex' },
          { key: 'scientific', label: 'Scientific' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              if (tab.key === 'calculator') setMode('basic');
              else if (tab.key === 'models') setMode('dcf');
              else if (tab.key === 'forex') setMode('forex');
              else if (tab.key === 'scientific') setMode('scientific');
            }}
            className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.key
                ? isDarkMode
                  ? 'bg-yellow-600 text-black'
                  : 'bg-yellow-400 text-black'
                : isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

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

        {/* Mode Selector - Only show for Models tab */}
        {activeTab === 'models' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 mb-3 sm:mb-4">
            {[
              { key: 'dcf', label: 'DCF' },
              { key: 'comps', label: 'COMPS' },
              { key: 'lbo', label: 'LBO' },
              { key: 'irr_npv', label: 'IRR/NPV' }
            ].map((m) => (
              <Button
                key={m.key}
                variant={mode === m.key ? 'ib' : 'default'}
                size="small"
                onClick={() => setMode(m.key)}
                className="flex-1 text-xs"
              >
                {m.label}
              </Button>
            ))}
          </div>
        )}



        {/* Memory/Status Display */}
        {((activeTab === 'models' && mode !== 'basic') || (activeTab === 'scientific')) && (
          <div className={`p-2 sm:p-3 rounded-lg mb-3 sm:mb-4 border transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-600' 
              : 'bg-gray-100 border-gray-200'
          }`}>
            <div className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {mode === 'irr_npv' ? 'Investment Analysis Values' : activeTab === 'scientific' ? 'Scientific Calculator' : 'Memory Values'}
            </div>
            {mode === 'irr_npv' ? (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 text-xs">
                  <div className={`px-1 sm:px-2 py-1 rounded transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-white text-gray-700 border border-gray-200'
                  }`}>Investment: {formatNumber(memory.initialInvestment)}</div>
                  <div className={`px-1 sm:px-2 py-1 rounded transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-white text-gray-700 border border-gray-200'
                  }`}>Rate: {memory.discountRate}%</div>
                  <div className={`px-1 sm:px-2 py-1 rounded transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-white text-gray-700 border border-gray-200'
                  }`}>Cash Flows: {memory.cashFlows.length}y</div>
                  <div className={`px-1 sm:px-2 py-1 rounded transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-white text-gray-700 border border-gray-200'
                  }`}>Total CF: {formatNumber(memory.cashFlows.reduce((sum, cf) => sum + cf, 0))}</div>
                </div>
                {memory.cashFlows.length > 0 && (
                  <div className="mt-2">
                    <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Cash Flow Stream:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {memory.cashFlows.slice(0, 6).map((cf, index) => (
                        <div key={index} className={`px-1 sm:px-2 py-1 rounded text-xs ${
                          isDarkMode 
                            ? 'bg-blue-900 text-blue-300' 
                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                        }`}>
                          Y{index + 1}: {formatNumber(cf)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === 'scientific' ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 text-xs">
                <div className={`px-1 sm:px-2 py-1 rounded transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}>Mode: Scientific</div>
                <div className={`px-1 sm:px-2 py-1 rounded transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}>Angle: Radians</div>
                <div className={`px-1 sm:px-2 py-1 rounded transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}>Memory: {formatNumber(memory.revenue || 0)}</div>
                <div className={`px-1 sm:px-2 py-1 rounded transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}>Last: {formatNumber(previousValue || 0)}</div>
              </div>
            ) : (
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
            )}
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

      {/* Tab-specific function panels */}
      {activeTab === 'models' && mode === 'dcf' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 mb-3 sm:mb-4">
          <Button variant="ib" size="small" onClick={calculateDCF}>DCF Model</Button>
          <Button variant="memory" size="small" onClick={() => storeMemory('wacc')}>Set WACC</Button>
          <Button variant="memory" size="small" onClick={() => storeMemory('terminalGrowth')}>Set TG</Button>
          <Button variant="memory" size="small" onClick={() => storeMemory('enterprise')}>Set EV</Button>
        </div>
      )}

      {activeTab === 'models' && mode === 'comps' && (
        <div className="mb-3 sm:mb-4">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 sm:gap-2 mb-2">
            <Button variant="ib" size="small" onClick={() => {
              const value = parseFloat(display);
              const result = memory.enterprise / value;
              setDisplay(String(result.toFixed(2)));
              setHistory(prev => [`EV/EBITDA: ${formatNumber(memory.enterprise)} / ${formatNumber(value)} = ${result.toFixed(1)}x`, ...prev.slice(0, 19)]);
              setWaitingForOperand(true);
            }}>EV/EBITDA</Button>
            <Button variant="ib" size="small" onClick={() => {
              const value = parseFloat(display);
              const result = memory.marketCap / value;
              setDisplay(String(result.toFixed(2)));
              setHistory(prev => [`P/E: ${formatNumber(memory.marketCap)} / ${formatNumber(value)} = ${result.toFixed(1)}x`, ...prev.slice(0, 19)]);
              setWaitingForOperand(true);
            }}>P/E</Button>
            <Button variant="ib" size="small" onClick={() => {
              const value = parseFloat(display);
              const result = memory.enterprise / value;
              setDisplay(String(result.toFixed(2)));
              setHistory(prev => [`EV/Revenue: ${formatNumber(memory.enterprise)} / ${formatNumber(value)} = ${result.toFixed(1)}x`, ...prev.slice(0, 19)]);
              setWaitingForOperand(true);
            }}>EV/Rev</Button>
            <Button variant="ib" size="small" onClick={() => {
              const value = parseFloat(display);
              const result = memory.marketCap / value;
              setDisplay(String(result.toFixed(2)));
              setHistory(prev => [`P/B: ${formatNumber(memory.marketCap)} / ${formatNumber(value)} = ${result.toFixed(1)}x`, ...prev.slice(0, 19)]);
              setWaitingForOperand(true);
            }}>P/B</Button>
            <Button variant="ib" size="small" onClick={() => {
              const value = parseFloat(display);
              const result = memory.enterprise / value;
              setDisplay(String(result.toFixed(2)));
              setHistory(prev => [`EV/Sales: ${formatNumber(memory.enterprise)} / ${formatNumber(value)} = ${result.toFixed(1)}x`, ...prev.slice(0, 19)]);
              setWaitingForOperand(true);
            }}>EV/Sales</Button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-2">
            <Button variant="memory" size="small" onClick={() => storeMemory('enterprise')}>Set EV</Button>
            <Button variant="memory" size="small" onClick={() => storeMemory('marketCap')}>Set MCap</Button>
            <Button variant="memory" size="small" onClick={() => storeMemory('revenue')}>Set Rev</Button>
            <Button variant="memory" size="small" onClick={() => storeMemory('ebitda')}>Set EBITDA</Button>
            <Button variant="function" size="small" onClick={() => {
              setDisplay(String(memory.enterprise));
              setWaitingForOperand(true);
            }}>Rcl EV</Button>
            <Button variant="function" size="small" onClick={() => {
              setDisplay(String(memory.marketCap));
              setWaitingForOperand(true);
            }}>Rcl MCap</Button>
          </div>
        </div>
      )}

      {activeTab === 'scientific' && (
        <div className="mb-3 sm:mb-4">
          {/* Memory and Advanced Functions Row */}
          <div className="grid grid-cols-6 gap-1 sm:gap-2 mb-2">
            <Button variant="function" size="small" onClick={() => addParenthesis('open')}>(</Button>
            <Button variant="function" size="small" onClick={() => addParenthesis('close')}>)</Button>
            <Button variant="clear" size="small" onClick={() => setMemory(prev => ({ ...prev, revenue: 0 }))}>mc</Button>
            <Button variant="memory" size="small" onClick={() => storeMemory('revenue')}>m+</Button>
            <Button variant="memory" size="small" onClick={() => {
              const current = parseFloat(display);
              setMemory(prev => ({ ...prev, revenue: prev.revenue - current }));
              setHistory(prev => [`M- ${formatNumber(current)}`, ...prev.slice(0, 19)]);
            }}>m-</Button>
            <Button variant="memory" size="small" onClick={() => {
              setDisplay(String(memory.revenue || 0));
              setWaitingForOperand(true);
            }}>mr</Button>
          </div>

          {/* Power and Root Functions Row */}
          <div className="grid grid-cols-6 gap-1 sm:gap-2 mb-2">
            <Button variant="function" size="small" onClick={() => performOperation('^')}>2ⁿᵈ</Button>
            <Button variant="function" size="small" onClick={() => {
              const val = parseFloat(display);
              setDisplay(String(Math.pow(val, 2)));
              setHistory(prev => [`${formatNumber(val)}² = ${formatNumber(Math.pow(val, 2))}`, ...prev.slice(0, 19)]);
              setWaitingForOperand(true);
            }}>x²</Button>
            <Button variant="function" size="small" onClick={() => {
              const val = parseFloat(display);
              setDisplay(String(Math.pow(val, 3)));
              setHistory(prev => [`${formatNumber(val)}³ = ${formatNumber(Math.pow(val, 3))}`, ...prev.slice(0, 19)]);
              setWaitingForOperand(true);
            }}>x³</Button>
            <Button variant="function" size="small" onClick={() => performOperation('^')}>xʸ</Button>
            <Button variant="function" size="small" onClick={() => {
              const val = parseFloat(display);
              setDisplay(String(Math.exp(val)));
              setHistory(prev => [`e^${formatNumber(val)} = ${formatNumber(Math.exp(val))}`, ...prev.slice(0, 19)]);
              setWaitingForOperand(true);
            }}>eˣ</Button>
            <Button variant="function" size="small" onClick={() => {
              const val = parseFloat(display);
              setDisplay(String(Math.pow(10, val)));
              setHistory(prev => [`10^${formatNumber(val)} = ${formatNumber(Math.pow(10, val))}`, ...prev.slice(0, 19)]);
              setWaitingForOperand(true);
            }}>10ˣ</Button>
          </div>

          {/* Reciprocal and Root Functions Row */}
          <div className="grid grid-cols-6 gap-1 sm:gap-2 mb-2">
            <Button variant="function" size="small" onClick={() => {
              const val = parseFloat(display);
              setDisplay(String(1 / val));
              setHistory(prev => [`1/${formatNumber(val)} = ${(1/val).toFixed(6)}`, ...prev.slice(0, 19)]);
              setWaitingForOperand(true);
            }}>¹⁄ₓ</Button>
            <Button variant="function" size="small" onClick={() => {
              const val = parseFloat(display);
              setDisplay(String(Math.sqrt(val)));
              setHistory(prev => [`²√${formatNumber(val)} = ${Math.sqrt(val).toFixed(6)}`, ...prev.slice(0, 19)]);
              setWaitingForOperand(true);
            }}>²√x</Button>
            <Button variant="function" size="small" onClick={() => {
              const val = parseFloat(display);
              setDisplay(String(Math.cbrt(val)));
              setHistory(prev => [`³√${formatNumber(val)} = ${Math.cbrt(val).toFixed(6)}`, ...prev.slice(0, 19)]);
              setWaitingForOperand(true);
            }}>³√x</Button>
            <Button variant="function" size="small" onClick={() => performOperation('^')}>ʸ√x</Button>
            <Button variant="function" size="small" onClick={() => {
              const val = parseFloat(display);
              setDisplay(String(Math.log(val)));
              setHistory(prev => [`ln(${formatNumber(val)}) = ${Math.log(val).toFixed(6)}`, ...prev.slice(0, 19)]);
              setWaitingForOperand(true);
            }}>ln</Button>
            <Button variant="function" size="small" onClick={() => {
              const val = parseFloat(display);
              setDisplay(String(Math.log10(val)));
              setHistory(prev => [`log₁₀(${formatNumber(val)}) = ${Math.log10(val).toFixed(6)}`, ...prev.slice(0, 19)]);
              setWaitingForOperand(true);
            }}>log₁₀</Button>
          </div>

          {/* Factorial and Trigonometric Functions Row */}
          <div className="grid grid-cols-6 gap-1 sm:gap-2 mb-2">
            <Button variant="function" size="small" onClick={() => {
              const val = parseFloat(display);
              const factorial = (n) => n <= 1 ? 1 : n * factorial(n - 1);
              const result = factorial(Math.floor(val));
              setDisplay(String(result));
              setHistory(prev => [`${Math.floor(val)}! = ${formatNumber(result)}`, ...prev.slice(0, 19)]);
              setWaitingForOperand(true);
            }}>x!</Button>
            <Button variant="ib" size="small" onClick={() => {
              const val = parseFloat(display);
              setDisplay(String(Math.sin(val)));
              setHistory(prev => [`sin(${formatNumber(val)}) = ${Math.sin(val).toFixed(6)}`, ...prev.slice(0, 19)]);
              setWaitingForOperand(true);
            }}>sin</Button>
            <Button variant="ib" size="small" onClick={() => {
              const val = parseFloat(display);
              setDisplay(String(Math.cos(val)));
              setHistory(prev => [`cos(${formatNumber(val)}) = ${Math.cos(val).toFixed(6)}`, ...prev.slice(0, 19)]);
              setWaitingForOperand(true);
            }}>cos</Button>
            <Button variant="ib" size="small" onClick={() => {
              const val = parseFloat(display);
              setDisplay(String(Math.tan(val)));
              setHistory(prev => [`tan(${formatNumber(val)}) = ${Math.tan(val).toFixed(6)}`, ...prev.slice(0, 19)]);
              setWaitingForOperand(true);
            }}>tan</Button>
            <Button variant="function" size="small" onClick={() => {
              setDisplay(String(Math.E));
              setHistory(prev => [`e = ${Math.E.toFixed(6)}`, ...prev.slice(0, 19)]);
              setWaitingForOperand(true);
            }}>e</Button>
            <Button variant="function" size="small" onClick={() => {
              const val = parseFloat(display);
              setDisplay(String(Math.pow(val, Math.E)));
              setHistory(prev => [`${formatNumber(val)}^e = ${formatNumber(Math.pow(val, Math.E))}`, ...prev.slice(0, 19)]);
              setWaitingForOperand(true);
            }}>EE</Button>
          </div>

          {/* Hyperbolic and Constants Row */}
          <div className="grid grid-cols-6 gap-1 sm:gap-2 mb-2">
            <Button variant="function" size="small" onClick={() => {
              const val = parseFloat(display);
              setDisplay(String(Math.random()));
              setHistory(prev => [`Random = ${Math.random().toFixed(6)}`, ...prev.slice(0, 19)]);
              setWaitingForOperand(true);
            }}>Rand</Button>
            <Button variant="ib" size="small" onClick={() => {
              const val = parseFloat(display);
              setDisplay(String(Math.sinh(val)));
              setHistory(prev => [`sinh(${formatNumber(val)}) = ${Math.sinh(val).toFixed(6)}`, ...prev.slice(0, 19)]);
              setWaitingForOperand(true);
            }}>sinh</Button>
            <Button variant="ib" size="small" onClick={() => {
              const val = parseFloat(display);
              setDisplay(String(Math.cosh(val)));
              setHistory(prev => [`cosh(${formatNumber(val)}) = ${Math.cosh(val).toFixed(6)}`, ...prev.slice(0, 19)]);
              setWaitingForOperand(true);
            }}>cosh</Button>
            <Button variant="ib" size="small" onClick={() => {
              const val = parseFloat(display);
              setDisplay(String(Math.tanh(val)));
              setHistory(prev => [`tanh(${formatNumber(val)}) = ${Math.tanh(val).toFixed(6)}`, ...prev.slice(0, 19)]);
              setWaitingForOperand(true);
            }}>tanh</Button>
            <Button variant="function" size="small" onClick={() => {
              setDisplay(String(Math.PI));
              setHistory(prev => [`π = ${Math.PI.toFixed(6)}`, ...prev.slice(0, 19)]);
              setWaitingForOperand(true);
            }}>π</Button>
            <Button variant="function" size="small" onClick={() => {
              // Toggle between radians and degrees mode
              setHistory(prev => [`Mode: ${history.includes('Radians') ? 'Degrees' : 'Radians'}`, ...prev.slice(0, 19)]);
            }}>Deg</Button>
          </div>
        </div>
      )}

      {activeTab === 'forex' && (
        <div className="mb-3 sm:mb-4">
          <div className="grid grid-cols-5 gap-2 mb-3 sm:mb-4">
            <div className="col-span-2">
              <label className={`block text-xs mb-1 sm:mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                From Currency
              </label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className={`w-full border rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm focus:outline-none transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white border-gray-500 focus:border-yellow-400' 
                    : 'bg-white text-gray-800 border-gray-300 focus:border-yellow-500'
                }`}
              >
                {Object.keys(exchangeRates).map((currency) => (
                  <option key={currency} value={currency}>
                    {currency} - {getCurrencyName(currency)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end justify-center">
              <Button 
                variant="swap" 
                size="small"
                onClick={swapCurrencies}
                className="h-6 sm:h-8 w-8 sm:w-10 flex items-center justify-center p-0 text-xs"
                title="Swap currencies"
              >
                ⇄
              </Button>
            </div>
            <div className="col-span-2">
              <label className={`block text-xs mb-1 sm:mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                To Currency
              </label>
              <select
                value={selectedToCurrency}
                onChange={(e) => setSelectedToCurrency(e.target.value)}
                className={`w-full border rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm focus:outline-none transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white border-gray-500 focus:border-yellow-400' 
                    : 'bg-white text-gray-800 border-gray-300 focus:border-yellow-500'
                }`}
              >
                {Object.keys(exchangeRates).filter(c => c !== selectedCurrency).map((currency) => (
                  <option key={currency} value={currency}>
                    {currency} - {getCurrencyName(currency)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1 sm:gap-2">
            <Button variant="ib" size="small" onClick={() => performForexConversion(selectedToCurrency)}>
              Convert to {selectedToCurrency}
            </Button>
            <Button 
              variant="function" 
              size="small"
              onClick={fetchExchangeRates}
              disabled={isLoadingRates}
            >
              {isLoadingRates ? 'Updating...' : 'Refresh Rates'}
            </Button>
          </div>
        </div>
      )}

      {/* Basic Calculator Layout */}
      <div className="space-y-2 sm:space-y-3">
        <div className="grid grid-cols-7 gap-1 sm:gap-3">
          <Button variant="clear" size="small" onClick={clear}>AC</Button>
          <Button variant="function" size="small" onClick={() => setDisplay(display.slice(0, -1) || '0')}>⌫</Button>
          <Button variant="operator" size="small" onClick={() => {
            const val = parseFloat(display);
            setDisplay(String(Math.sqrt(val)));
            setWaitingForOperand(true);
          }}>√</Button>
          <Button variant="operator" size="small" onClick={() => performOperation('^')}>^</Button>
          <Button variant="operator" size="small" onClick={() => {
            const val = parseFloat(display);
            setDisplay(String(Math.log(val)));
            setWaitingForOperand(true);
          }}>ln</Button>
          <Button variant="operator" size="small" onClick={() => performOperation('%')}>%</Button>
          <Button variant="operator" size="small" onClick={() => {
            const val = parseFloat(display);
            setDisplay(String(-val));
            setWaitingForOperand(true);
          }}>±</Button>
        </div>

        <div className="grid grid-cols-4 gap-1 sm:gap-3">
          <Button onClick={() => inputNumber(7)}>7</Button>
          <Button onClick={() => inputNumber(8)}>8</Button>
          <Button onClick={() => inputNumber(9)}>9</Button>
          <Button variant="operator" onClick={() => performOperation('÷')}>÷</Button>
        </div>

        <div className="grid grid-cols-4 gap-1 sm:gap-3">
          <Button onClick={() => inputNumber(4)}>4</Button>
          <Button onClick={() => inputNumber(5)}>5</Button>
          <Button onClick={() => inputNumber(6)}>6</Button>
          <Button variant="operator" onClick={() => performOperation('×')}>×</Button>
        </div>

        <div className="grid grid-cols-4 gap-1 sm:gap-3">
          <Button onClick={() => inputNumber(1)}>1</Button>
          <Button onClick={() => inputNumber(2)}>2</Button>
          <Button onClick={() => inputNumber(3)}>3</Button>
          <Button variant="operator" onClick={() => performOperation('-')}>-</Button>
        </div>

        <div className="grid grid-cols-4 gap-1 sm:gap-3">
          <Button variant="function" onClick={() => {
            const val = parseFloat(display);
            setDisplay(String(val * 1000));
            setWaitingForOperand(true);
          }}>×1K</Button>
          <Button onClick={() => inputNumber(0)}>0</Button>
          <Button onClick={inputDecimal}>.</Button>
          <Button variant="operator" onClick={() => performOperation('+')}>+</Button>
        </div>

        <div className="grid grid-cols-4 gap-1 sm:gap-3">
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
          <Button variant="function" onClick={() => {
            const val = parseFloat(display);
            setDisplay(String(val / 100));
            setWaitingForOperand(true);
          }}>%</Button>
          <Button variant="equals" onClick={performEquals}>=</Button>
        </div>
      </div>

      {/* Footer */}
      <div className={`text-xs mt-4 sm:mt-6 text-center transition-all duration-300 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        <div className="mb-1">
          <span className="hidden sm:inline">IB Calculator v2.4 | Multi-Tab Financial Modeling Suite</span>
          <span className="sm:hidden">IB Calculator v2.4</span>
        </div>
        <div className="text-xs hidden sm:block">Calculator | Models (DCF, Comps, LBO, IRR/NPV) | Forex | Scientific Calculator</div>
        {activeTab === 'forex' && ratesLastUpdated && (
          <div className={`mt-1 text-center text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
            🌐 Live exchange rates | Last updated: {ratesLastUpdated.toLocaleDateString()} at {ratesLastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default IBCalculator;

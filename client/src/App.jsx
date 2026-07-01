import React, { useState, useEffect, createContext, useContext, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sprout, Sun, CloudRain, MapPin, Menu, Search, 
  ChevronLeft, Bell, User, CheckCircle2, Droplets, Bug, 
  Wind, Map, ShieldCheck, Droplet, SunMedium, Heart, X, Moon, LogOut, AlertTriangle, CloudLightning
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line, YAxis, CartesianGrid } from 'recharts';
import { auth } from './firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
// --- Contexts ---
const LangContext = createContext();
const ThemeContext = createContext();
const AuthContext = createContext();

const translations = {
  English: {
    welcome: "Smart Farming with AI",
    selectLang: "Select Language",
    continue: "Continue",
    welcomeBack: "Welcome Back!",
    loginText: "Create your account",
    name: "Full Name",
    phone: "Phone Number",
    sendOtp: "Send OTP",
    enterOtp: "Enter OTP",
    otpSent: "OTP sent to",
    verifyLogin: "Verify & Login",
    greeting: "Good Morning",
    season: "Current Season",
    sunrise: "Sunrise",
    sunset: "Sunset",
    cropCategories: "Crop Categories",
    forecast: "7-Day Forecast",
    analyze: "Analyze",
    top5: "Top 5 Recommendations",
    guide: "Cultivation Guide",
    addToDash: "Add to Dashboard",
    myCrops: "My Crops",
    pendingTasks: "Pending Tasks",
    home: "Home",
    dashboard: "My Dashboard",
    profile: "Profile",
    theme: "Dark Mode",
    logout: "Logout",
    location: "Location",
    temperature: "Temperature (°C)",
    rainfall: "Rainfall (mm)",
    humidity: "Humidity (%)",
    soilPh: "Soil pH",
    preferences: "Preferences",
    language: "Language",
    alertTitle: "Heavy Rain & Flood Warning",
    alertMsg: "Expect extreme rainfall over the next 48 hours in Karnataka. Please secure your freshly sown seeds and ensure proper drainage."
  },
  kannada: {
    welcome: "AI ಜೊತೆಗೆ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ",
    selectLang: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    continue: "ಮುಂದುವರಿಸಿ",
    welcomeBack: "ಮತ್ತೆ ಸ್ವಾಗತ!",
    loginText: "ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಚಿಸಿ",
    name: "ಪೂರ್ಣ ಹೆಸರು",
    phone: "ಫೋನ್ ಸಂಖ್ಯೆ",
    sendOtp: "OTP ಕಳುಹಿಸಿ",
    enterOtp: "OTP ನಮೂದಿಸಿ",
    otpSent: "OTP ಕಳುಹಿಸಲಾಗಿದೆ",
    verifyLogin: "ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಲಾಗಿನ್",
    greeting: "ಶುಭೋದಯ",
    season: "ಪ್ರಸ್ತುತ ಋತು",
    sunrise: "ಸೂರ್ಯೋದಯ",
    sunset: "ಸೂರ್ಯಾಸ್ತ",
    cropCategories: "ಬೆಳೆ ವರ್ಗಗಳು",
    forecast: "7-ದಿನದ ಹವಾಮಾನ",
    analyze: "ವಿಶ್ಲೇಷಿಸಿ",
    top5: "ಟಾಪ್ 5 ಶಿಫಾರಸುಗಳು",
    guide: "ಕೃಷಿ ಮಾರ್ಗದರ್ಶಿ",
    addToDash: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಸೇರಿಸಿ",
    myCrops: "ನನ್ನ ಬೆಳೆಗಳು",
    pendingTasks: "ಬಾಕಿ ಇರುವ ಕಾರ್ಯಗಳು",
    home: "ಮುಖಪುಟ",
    dashboard: "ನನ್ನ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    profile: "ಪ್ರೊಫೈಲ್",
    theme: "ಡಾರ್ಕ್ ಮೋಡ್",
    logout: "ಲಾಗ್ ಔಟ್",
    location: "ಸ್ಥಳ",
    temperature: "ತಾಪಮಾನ (°C)",
    rainfall: "ಮಳೆ (ಮಿ.ಮೀ)",
    humidity: "ಆರ್ದ್ರತೆ (%)",
    soilPh: "ಮಣ್ಣಿನ pH",
    preferences: "ಪ್ರಾಶಸ್ತ್ಯಗಳು",
    language: "ಭಾಷೆ",
    alertTitle: "ಭಾರಿ ಮಳೆ ಮತ್ತು ಪ್ರವಾಹ ಎಚ್ಚರಿಕೆ",
    alertMsg: "ಮುಂದಿನ 48 ಗಂಟೆಗಳಲ್ಲಿ ಕರ್ನಾಟಕದಲ್ಲಿ ಭಾರಿ ಮಳೆಯಾಗುವ ನಿರೀಕ್ಷೆಯಿದೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೊಸದಾಗಿ ಬಿತ್ತಿದ ಬೀಜಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿರಿಸಿ ಮತ್ತು ಸರಿಯಾದ ಒಳಚರಂಡಿಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ."
  },
  hindi: {
    welcome: "AI के साथ स्मार्ट खेती",
    selectLang: "भाषा चुनें",
    continue: "जारी रखें",
    welcomeBack: "वापसी पर स्वागत है!",
    loginText: "अपना खाता बनाएं",
    name: "पूरा नाम",
    phone: "फ़ोन नंबर",
    sendOtp: "OTP भेजें",
    enterOtp: "OTP दर्ज करें",
    otpSent: "OTP भेजा गया",
    verifyLogin: "सत्यापित करें और लॉगिन करें",
    greeting: "सुप्रभात",
    season: "वर्तमान मौसम",
    sunrise: "सूर्योदय",
    sunset: "सूर्यास्त",
    cropCategories: "फसल श्रेणियाँ",
    forecast: "7-दिवसीय मौसम",
    analyze: "विश्लेषण करें",
    top5: "शीर्ष 5 सिफारिशें",
    guide: "खेती गाइड",
    addToDash: "डैशबोर्ड में जोड़ें",
    myCrops: "मेरी फसलें",
    pendingTasks: "लंबित कार्य",
    home: "होम",
    dashboard: "मेरा डैशबोर्ड",
    profile: "प्रोफ़ाइल",
    theme: "डार्क मोड",
    logout: "लॉग आउट",
    location: "स्थान",
    temperature: "तापमान (°C)",
    rainfall: "वर्षा (मिमी)",
    humidity: "नमी (%)",
    soilPh: "मिट्टी का पीएच",
    preferences: "प्राथमिकताएं",
    language: "भाषा",
    alertTitle: "भारी बारिश और बाढ़ की चेतावनी",
    alertMsg: "अगले 48 घंटों में कर्नाटक में अत्यधिक बारिश की उम्मीद है। कृपया अपने बोए गए बीजों को सुरक्षित करें और उचित जल निकासी सुनिश्चित करें।"
  }
};

// Farm Background Component to reuse
const FarmBackground = ({ image = '/bg-farmer.png' }) => (
  <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
     <div className="absolute inset-0 bg-cover bg-center opacity-30 dark:opacity-20 mix-blend-overlay transition-opacity duration-500" style={{ backgroundImage: `url('${image}')` }}></div>
     <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 via-gray-50/40 to-white/90 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-gray-900 transition-colors duration-500"></div>
  </div>
);

// --- Helper Components ---
const Sidebar = ({ isOpen, setOpen }) => {
  const navigate = useNavigate();
  const { t, lang, setLang } = useContext(LangContext);
  const { isDark, setIsDark } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity" onClick={() => setOpen(false)}></div>
      <div className={`fixed inset-y-0 left-0 w-72 glass-card dark:bg-gray-900/90 z-50 transform transition-transform duration-300 flex flex-col`}>
        <div className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
             <div className="bg-green-600 text-white p-2 rounded-xl shadow-lg"><Sprout size={24}/></div>
             <h2 className="font-extrabold text-xl dark:text-white">RaitaBandhu</h2>
          </div>
          <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white"><X size={24}/></button>
        </div>
        
        <div className="p-6 flex-1 space-y-2 overflow-y-auto">
          {user && (
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-2xl mb-6 flex items-center space-x-4 border border-green-100 dark:border-green-800/50">
              <div className="w-12 h-12 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center text-green-700 dark:text-green-300 font-bold text-xl">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-800 dark:text-white">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.phone}</p>
              </div>
            </div>
          )}

          <button onClick={() => {navigate('/home'); setOpen(false);}} className="w-full flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-200 font-semibold">
             <Sprout size={20} className="text-green-600"/><span>{t.home}</span>
          </button>
          <button onClick={() => {navigate('/mydashboard'); setOpen(false);}} className="w-full flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-200 font-semibold">
             <CheckCircle2 size={20} className="text-blue-500"/><span>{t.dashboard}</span>
          </button>
          <button className="w-full flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-200 font-semibold">
             <User size={20} className="text-purple-500"/><span>{t.profile}</span>
          </button>

          <div className="h-px bg-gray-200 dark:bg-gray-800 my-4"></div>

          <div className="p-4">
             <p className="text-xs text-gray-400 font-bold mb-4 uppercase tracking-wider">{t.preferences}</p>
             <div className="flex items-center justify-between mb-4 text-gray-700 dark:text-gray-200 font-semibold">
                <div className="flex items-center space-x-4"><Moon size={20} className="text-indigo-400"/><span>{t.theme}</span></div>
                <button onClick={() => setIsDark(!isDark)} className={`w-12 h-6 rounded-full p-1 transition-colors ${isDark ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${isDark ? 'translate-x-6' : ''}`}></div>
                </button>
             </div>
             <div className="flex items-center justify-between text-gray-700 dark:text-gray-200 font-semibold">
                <div className="flex items-center space-x-4"><Map size={20} className="text-orange-400"/><span>{t.language}</span></div>
                <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg text-sm focus:outline-none">
                  <option value="English">English</option><option value="kannada">ಕನ್ನಡ</option><option value="hindi">हिन्दी</option>
                </select>
             </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-800">
           <button onClick={() => { logout(); setOpen(false); navigate('/login'); }} className="w-full flex items-center justify-center space-x-2 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition">
              <LogOut size={20} /><span>{t.logout}</span>
           </button>
        </div>
      </div>
    </>
  );
};

const Header = ({ title, showBack = false, onMenuClick, alertsCount = 1, onAlertClick }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between p-4 glass-card dark:bg-gray-900/80 sticky top-0 z-20 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      {showBack ? (
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"><ChevronLeft size={24} className="text-gray-700 dark:text-gray-200"/></button>
      ) : (
        <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"><Menu size={24} className="text-gray-700 dark:text-gray-200"/></button>
      )}
      <h1 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h1>
      <button onClick={onAlertClick} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition relative group">
        <Bell size={24} className="text-gray-700 dark:text-gray-200 group-hover:text-red-500 transition-colors"/>
        {alertsCount > 0 && (
          <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse"></span>
        )}
      </button>
    </div>
  );
}

// --- Pages ---

const Splash = () => {
  const navigate = useNavigate();
  useEffect(() => { setTimeout(() => navigate('/lang'), 3000); }, [navigate]);

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-[#e6f4ea]">
      {/* Top Logo Area */}
      <div className="z-10 flex flex-col items-center pt-20">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-green-600 mb-4 relative">
           <Sprout size={48} className="text-green-600" />
           <div className="absolute -top-2 w-4 h-4 bg-yellow-400 rounded-full"></div>
        </div>
        <h1 className="text-4xl font-extrabold text-green-900 tracking-tight">RaitaBandhu</h1>
        <p className="mt-1 text-green-700 font-bold text-sm">Smart Farming with AI</p>
      </div>

      {/* Full Background Image spanning middle to bottom */}
      <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('/bg-home.png')", backgroundPosition: "center 60%" }}></div>

      {/* Bottom Loading Card */}
      <div className="absolute bottom-8 left-0 right-0 px-6 z-20">
         <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/40 text-center flex flex-col items-center">
            <h3 className="font-bold text-gray-900 mb-2">AI Powered Crop Recommendation</h3>
            <p className="text-xs text-gray-500 font-medium mb-3">Weather • Market • Soil • Profit</p>
            <p className="text-sm font-bold text-gray-700 mb-6">Better Farming, Better Future</p>
            
            <div className="w-full max-w-[200px] h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-700 w-1/2 animate-[slide_1s_ease-in-out_infinite_alternate] rounded-full"></div>
            </div>
         </div>
      </div>
    </div>
  );
};

const LanguageSelection = () => {
  const navigate = useNavigate();
  const { setLang } = useContext(LangContext);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-start pt-20 p-6 transition-colors duration-300 relative">
      <div className="w-full max-w-sm animate-fade-in z-10 relative">
        <h2 className="text-3xl font-extrabold mb-2 text-gray-900 dark:text-white tracking-tight">Select Language</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-10">Choose your preferred language</p>
        
        <div className="space-y-4">
          <button onClick={() => { setLang('English'); navigate('/login'); }} className="w-full flex items-center p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/40 border border-green-200 dark:border-green-800/50 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-green-600 text-white flex items-center justify-center rounded-xl font-bold text-xl mr-5 shadow-inner">A</div>
            <div className="text-left">
              <p className="font-bold text-gray-900 dark:text-white text-lg">English</p>
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">Continue</p>
            </div>
          </button>
          
          <button onClick={() => { setLang('kannada'); navigate('/login'); }} className="w-full flex items-center p-5 glass-card dark:bg-gray-800/80 rounded-2xl hover:shadow-md transition">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center rounded-xl font-bold text-xl mr-5">ಕ</div>
            <div className="text-left">
              <p className="font-bold text-gray-900 dark:text-white text-lg">ಕನ್ನಡ</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">ಮುಂದುವರಿಸಿ</p>
            </div>
          </button>

          <button onClick={() => { setLang('hindi'); navigate('/login'); }} className="w-full flex items-center p-5 glass-card dark:bg-gray-800/80 rounded-2xl hover:shadow-md transition">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center rounded-xl font-bold text-xl mr-5">अ</div>
            <div className="text-left">
              <p className="font-bold text-gray-900 dark:text-white text-lg">हिन्दी</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">जारी रखें</p>
            </div>
          </button>
        </div>
      </div>
      
      <FarmBackground />
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const { t } = useContext(LangContext);
  const { setUser } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // We are removing the Recaptcha setup because Firebase blocks the SMS without billing enabled.
  useEffect(() => {
    // Left intentionally empty to prevent Firebase errors
  }, []);

  const handleSendOtp = async () => {
    if (name.length < 2) return alert("Please enter your name");
    if (phone.length < 10) return alert("Please enter a valid 10-digit phone number");
    
    setLoading(true);
    try {
      // MOCK OTP FLOW: Simulating a successful SMS to bypass the Google Firebase Billing Error
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUser({ name, phone }); // Save user info
      setLoading(false);
      navigate('/otp', { state: { phone } });
    } catch (error) {
      console.error(error);
      alert("Failed to send OTP. " + error.message);
      setLoading(false);
    }
  };

  const inputClass = "w-full px-5 py-4 rounded-2xl bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-semibold text-gray-800 dark:text-white shadow-sm transition backdrop-blur-md";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex flex-col justify-start pt-16 relative">
      <div className="w-full max-w-sm mx-auto animate-fade-in z-10 relative">
        <button onClick={() => navigate(-1)} className="mb-8 w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"><ChevronLeft size={20} className="text-gray-700 dark:text-gray-300"/></button>
        <h2 className="text-3xl font-extrabold mb-2 text-gray-900 dark:text-white tracking-tight">{t.welcomeBack}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-10">{t.loginText}</p>

        <div className="space-y-5 mb-8">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t.name}</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ramesh Kumar" className={inputClass} />
          </div>
          <div>
             <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t.phone}</label>
             <div className="flex space-x-3">
               <div className="w-1/4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl flex items-center justify-center font-bold text-gray-700 dark:text-gray-300 shadow-sm">+91</div>
               <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="81234 56789" className={`${inputClass} w-3/4`} />
             </div>
          </div>
        </div>

        <button onClick={handleSendOtp} disabled={loading} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transition transform hover:-translate-y-1">
          {loading ? "Sending..." : t.sendOtp}
        </button>
        <div id="recaptcha-container"></div>
      </div>

      <FarmBackground />
    </div>
  );
};

const OtpScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useContext(LangContext);
  const phone = location.state?.phone || "81234 56789";
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (val, index) => {
     let newOtp = [...otp];
     newOtp[index] = val;
     setOtp(newOtp);
  };

  const verifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length < 6) return alert("Please enter the full 6-digit OTP");
    
    setLoading(true);
    
    try {
      // MOCK OTP VERIFICATION: Simulating success to bypass the Google Firebase Billing Error
      await new Promise(resolve => setTimeout(resolve, 600)); 
      
      // We accept any 6 digit code for now to let you into the app
      if (otpString.length === 6) {
        localStorage.setItem('raitabandhu_user', JSON.stringify({ phone }));
        navigate('/home');
      } else {
        alert("Invalid OTP! Try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong! Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex flex-col justify-start pt-16 transition-colors relative">
      <div className="w-full max-w-sm mx-auto animate-fade-in z-10 relative">
        <button onClick={() => navigate(-1)} className="mb-8 w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700"><ChevronLeft size={20} className="text-gray-700 dark:text-gray-300"/></button>
        <h2 className="text-3xl font-extrabold mb-2 text-gray-900 dark:text-white tracking-tight">{t.enterOtp}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">{t.otpSent}<br/><span className="font-bold text-gray-900 dark:text-white text-lg">+91 {phone}</span></p>
        
        <div className="flex justify-between mb-10 gap-2">
          {[0, 1, 2, 3, 4, 5].map((index) => (
             <input key={index} type="text" maxLength="1" 
                    value={otp[index]}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none text-gray-800 dark:text-white shadow-sm transition"/>
          ))}
        </div>

        <button onClick={verifyOtp} disabled={loading} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
          {loading ? "Verifying..." : t.verifyLogin}
        </button>
      </div>

      <FarmBackground />
    </div>
  );
};

const LocationMap = ({ onLocationSelect }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let checkInterval;
    
    const initMap = () => {
      if (!window.L || mapInstanceRef.current) return;
      
      mapInstanceRef.current = window.L.map(mapRef.current).setView([13.3379, 77.1173], 7);
      window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(mapInstanceRef.current);

      markerRef.current = window.L.marker([13.3379, 77.1173]).addTo(mapInstanceRef.current);

      mapInstanceRef.current.on('click', (e) => {
        const { lat, lng } = e.latlng;
        markerRef.current.setLatLng([lat, lng]);
        onLocationSelect(lat, lng);
      });
    };

    if (window.L) {
      initMap();
    } else {
      checkInterval = setInterval(() => {
        if (window.L) {
          initMap();
          clearInterval(checkInterval);
        }
      }, 100);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onLocationSelect]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        mapInstanceRef.current.setView([lat, lon], 10);
        markerRef.current.setLatLng([lat, lon]);
        onLocationSelect(lat, lon);
      } else {
        alert("Location not found");
      }
    } catch (err) {
      alert("Search failed");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-6 relative z-0 animate-fade-in">
       <form onSubmit={handleSearch} className="flex flex-col sm:flex-row mb-4 gap-2 relative z-10">
         <div className="relative flex-1">
           <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
           <input type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search city, town, village..." className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold text-gray-800 dark:text-white transition" />
         </div>
         <button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-md hover:shadow-lg transition flex items-center justify-center">
            <Search size={18} className="mr-2" />
            Search
         </button>
       </form>
       <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
         <div ref={mapRef} style={{height: '250px', width: '100%', zIndex: 0}}></div>
       </div>
       <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center font-bold tracking-wide uppercase">Click map or search to update weather</p>
    </div>
  );
};

const HomeDashboard = () => {
  const navigate = useNavigate();
  const { t } = useContext(LangContext);
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // Alert hidden by default
  // --- Open-Meteo Weather State ---
  const [weatherData, setWeatherData] = useState({
    temp: 33, humidity: 60, wind: 12, windDir: 'N', rain: 0,
    description: 'Sunny & Clear', location: 'Tumakuru, Karnataka',
    sunrise: '6:05 AM', sunset: '6:35 PM', isDay: true, loading: true, error: false
  });
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [trendData, setTrendData] = useState([]);

  // --- Open-Meteo API Integration ---
  const fetchWeather = useCallback(async (lat, lon) => {
    setWeatherData(prev => ({ ...prev, loading: true, error: false }));
    try {
      const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${lat}&longitude=${lon}` +
        `&hourly=temperature_2m,relative_humidity_2m,rain,wind_speed_10m,wind_direction_10m,weather_code,cloud_cover` +
        `&daily=temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m_max,precipitation_sum,sunrise,sunset` +
        `&timezone=Asia%2FKolkata&forecast_days=7`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();

      const codeToDesc = (code) => {
        if (code === 0) return 'Clear Sky';
        if (code <= 2) return 'Partly Cloudy';
        if (code === 3) return 'Overcast';
        if (code <= 49) return 'Foggy';
        if (code <= 59) return 'Drizzle';
        if (code <= 69) return 'Rain';
        if (code <= 79) return 'Snow';
        if (code <= 82) return 'Rain Showers';
        if (code <= 95) return 'Thunderstorm';
        return 'Heavy Storm';
      };

      const codeToIcon = (code) => {
        if (code === 0) return <Sun size={32} className="text-yellow-400" />;
        if (code <= 2) return <SunMedium size={32} className="text-yellow-400" />;
        if (code <= 3) return <SunMedium size={32} className="text-gray-400" />;
        if (code <= 59) return <CloudRain size={32} className="text-gray-300" />;
        if (code <= 69) return <CloudRain size={32} className="text-blue-300" />;
        if (code <= 95) return <CloudLightning size={32} className="text-purple-400" />;
        return <CloudLightning size={32} className="text-red-400" />;
      };

      const degToCompass = (deg) => {
        const dirs = ['N','NE','E','SE','S','SW','W','NW'];
        return dirs[Math.round(deg / 45) % 8];
      };

      const formatTime = (iso) => {
        const d = new Date(iso);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      };

      const now = new Date();
      const currentHour = now.getHours();
      const todayStr = now.toISOString().split('T')[0];
      const hourIdx = data.hourly.time.findIndex(t => t.startsWith(todayStr) && new Date(t).getHours() === currentHour);
      const safeIdx = hourIdx >= 0 ? hourIdx : 0;

      const todayDailyIdx = 0;
      const sunriseTime = formatTime(data.daily.sunrise[todayDailyIdx]);
      const sunsetTime = formatTime(data.daily.sunset[todayDailyIdx]);
      const sunriseDate = new Date(data.daily.sunrise[todayDailyIdx]);
      const sunsetDate = new Date(data.daily.sunset[todayDailyIdx]);
      const isDayTime = now >= sunriseDate && now <= sunsetDate;

      let locationName = 'My Location, India';
      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
        const geoData = await geoRes.json();
        const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || '';
        const state = geoData.address?.state || 'India';
        if (city) locationName = `${city}, ${state}`;
        else locationName = state;
      } catch(e) {}

      setWeatherData({
        temp: Math.round(data.hourly.temperature_2m[safeIdx]),
        humidity: data.hourly.relative_humidity_2m[safeIdx],
        wind: Math.round(data.hourly.wind_speed_10m[safeIdx]),
        windDir: degToCompass(data.hourly.wind_direction_10m[safeIdx]),
        rain: data.hourly.rain[safeIdx],
        description: codeToDesc(data.hourly.weather_code[safeIdx]),
        location: locationName,
        sunrise: sunriseTime,
        sunset: sunsetTime,
        isDay: isDayTime,
        loading: false,
        error: false
      });

      const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
      const forecast7 = data.daily.time.map((dateStr, i) => {
        const d = new Date(dateStr);
        return {
          date: `${d.getDate()}`,
          day: days[d.getDay()],
          temp: Math.round(data.daily.temperature_2m_max[i]),
          low: Math.round(data.daily.temperature_2m_min[i]),
          wind: `${Math.round(data.daily.wind_speed_10m_max[i])} km/h`,
          icon: codeToIcon(data.daily.weather_code[i])
        };
      });
      setWeeklyForecast(forecast7);

      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const trend = data.daily.time.map((dateStr, i) => {
        const d = new Date(dateStr);
        return { date: `${d.getDate()} ${months[d.getMonth()]}`, temp: Math.round(data.daily.temperature_2m_max[i]) };
      });
      setTrendData(trend);

    } catch (err) {
      setWeatherData(prev => ({ ...prev, loading: false, error: true }));
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(13.3379, 77.1173)
      );
    } else {
      fetchWeather(13.3379, 77.1173);
    }
  }, [fetchWeather]);

  // Determine current farming season
  const getSeason = () => {
    const month = new Date().getMonth();
    if (month >= 5 && month <= 9) return 'Kharif';
    if (month >= 10 || month <= 2) return 'Rabi';
    return 'Zaid';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10 transition-colors">
      <Sidebar isOpen={sidebarOpen} setOpen={setSidebarOpen} />
      <Header title="RaitaBandhu" onMenuClick={() => setSidebarOpen(true)} alertsCount={1} onAlertClick={() => setShowAlert(!showAlert)} />

      {/* Main Container constrained for readability on full-screen web */}
      <div className="max-w-5xl mx-auto p-5">
        
         {/* Extreme Weather Alert Banner */}
        {showAlert && (
          <div className="bg-red-500 text-white p-4 rounded-2xl shadow-lg mb-6 flex items-start justify-between animate-fade-in border border-red-400 relative overflow-hidden">
             <div className="absolute -right-4 -top-4 opacity-10">
                <CloudLightning size={100} />
             </div>
             <div className="flex items-start z-10">
               <AlertTriangle size={24} className="mr-3 flex-shrink-0 mt-1" />
               <div>
                  <h4 className="font-extrabold text-lg">{t.alertTitle}</h4>
                  <p className="text-red-100 text-sm mt-1 font-medium">{t.alertMsg}</p>
               </div>
             </div>
             <button onClick={() => setShowAlert(false)} className="text-red-200 hover:text-white transition z-10 p-1">
               <X size={20} />
             </button>
          </div>
        )}

        <div className="mb-6 animate-fade-in">
             <div className="flex justify-between items-start mb-4">
                 <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">{t.greeting}, {user?.name || "Farmer"} 👋</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1 font-medium"><MapPin size={14} className="mr-1 text-gray-700"/> {weatherData.location}</p>
                 </div>
             </div>

             <div className="bg-gradient-to-r from-[#194017] to-[#3a6b32] text-white rounded-2xl p-4 relative overflow-hidden flex items-center border border-green-900 shadow-md">
                <div className="absolute right-0 top-0 bottom-0 w-3/4 opacity-40 bg-cover bg-center" style={{backgroundImage: "url('/bg-home.png')"}}></div>
                <div className="flex items-center z-10">
                  <div className="w-12 h-12 bg-[#2d562a] border border-[#4a7946] rounded-xl flex items-center justify-center text-yellow-400 mr-4 shadow-inner">
                    <Sprout size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-green-200 font-semibold mb-0.5 tracking-wide">Current Season</p>
                    <h3 className="font-bold text-lg">{getSeason()} Season</h3>
                    <p className="text-xs text-green-100 font-medium opacity-80">Perfect time for farming</p>
                  </div>
                </div>
             </div>

         {/* Leaflet JS Interactive Location Map */}
         <LocationMap onLocationSelect={fetchWeather} />
        </div>

        {/* Current Weather Card - Open-Meteo Live Data */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-8 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
          {/* Loading overlay */}
          {weatherData.loading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 rounded-3xl flex items-center justify-center z-10">
              <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {/* Error banner */}
          {weatherData.error && (
            <p className="text-xs text-red-400 font-semibold text-center mb-2">⚠ Could not load live weather. Showing last known data.</p>
          )}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
             <div className="flex items-center">
               <div className="w-16 h-16 mr-4 flex justify-center items-center">
                  {weatherData.isDay ? <Sun size={64} className="text-yellow-400 drop-shadow-md" /> : <Moon size={64} className="text-indigo-300 drop-shadow-md" />}
               </div>
               <div>
                 <h3 className="text-5xl font-bold text-gray-900 dark:text-white">{weatherData.temp}°<span className="text-2xl text-gray-500 font-normal">C</span></h3>
                 <p className="text-gray-500 dark:text-gray-400 font-medium capitalize">{weatherData.description}</p>
               </div>
             </div>
             <div className="flex flex-wrap gap-4 mt-4 md:mt-0 text-sm text-gray-600 dark:text-gray-300 font-semibold">
                <div className="flex items-center"><Droplets size={16} className="text-blue-500 mr-2"/> {weatherData.humidity}% Humidity</div>
                <div className="flex items-center"><Wind size={16} className="text-teal-500 mr-2"/> {weatherData.wind} km/h {weatherData.windDir}</div>
                {weatherData.rain > 0 && <div className="flex items-center"><CloudRain size={16} className="text-blue-400 mr-2"/> {weatherData.rain} mm Rain</div>}
             </div>
          </div>
          
          <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-between items-center">
            <div className="text-center">
              <p className="text-xs text-gray-400 font-bold mb-1">Sunrise</p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{weatherData.sunrise}</p>
            </div>
            
            <div className="flex-1 px-8 relative h-10 hidden sm:block">
              {/* Simple arc representation */}
              <div className="w-full h-20 border-t-2 border-dashed border-yellow-400 rounded-t-full absolute top-5 opacity-50"></div>
              <div className="w-4 h-4 bg-yellow-400 rounded-full absolute top-3 left-1/2 transform -translate-x-1/2 shadow-lg shadow-yellow-400"></div>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-400 font-bold mb-1">Sunset</p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{weatherData.sunset}</p>
            </div>
          </div>
        </div>

        {/* Crop Categories - Clean White Theme */}
        <div className="flex justify-between items-end mb-4 animate-fade-in">
          <h3 className="font-extrabold text-xl text-gray-900 dark:text-white tracking-tight">{t.cropCategories}</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 animate-fade-in">
          {[
            {icon: '🌸', name: 'Flowers', bg: 'bg-pink-100 dark:bg-pink-900/30', color: 'text-pink-600'}, 
            {icon: '🍎', name: 'Fruits', bg: 'bg-red-100 dark:bg-red-900/30', color: 'text-red-600'}, 
            {icon: '🥦', name: 'Vegetables', bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600'}, 
            {icon: '🌾', name: 'Food Grains', bg: 'bg-amber-100 dark:bg-amber-900/30', color: 'text-amber-600'},
            {icon: '🥜', name: 'Oil Seeds', bg: 'bg-orange-100 dark:bg-orange-900/30', color: 'text-orange-600'}, 
            {icon: '🌴', name: 'Plantation', bg: 'bg-teal-100 dark:bg-teal-900/30', color: 'text-teal-600'}
          ].map((cat, i) => (
             <div key={i} onClick={() => navigate('/analyze', { state: { category: cat.name, weatherData } })} className="bg-white dark:bg-gray-800 p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow shadow-sm border border-gray-100 dark:border-gray-700">
                <div className={`w-14 h-14 rounded-xl ${cat.bg} flex items-center justify-center text-2xl mb-3`}>
                   {cat.icon}
                </div>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{cat.name}</span>
             </div>
          ))}
        </div>

        {/* Temperature Trend Area Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in mb-8">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">Temperature Trend (°C)</h3>
              <div className="flex bg-gray-100 dark:bg-gray-900 rounded-full p-1 shadow-inner">
                <button className="px-4 py-1.5 bg-green-700 text-white rounded-full text-xs font-bold shadow-md">7D</button>
                <button className="px-4 py-1.5 text-gray-500 font-bold text-xs">1M</button>
                <button className="px-4 py-1.5 text-gray-500 font-bold text-xs">3M</button>
              </div>
           </div>

           <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={trendData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                       <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 600}} dy={10} />
                    <Tooltip 
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                       itemStyle={{ color: '#111827', fontWeight: 'bold', fontSize: '18px' }}
                       labelStyle={{ color: '#6b7280', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}
                    />
                    <Area type="monotone" dataKey="temp" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" activeDot={{r: 8, fill: '#22c55e', stroke: '#fff', strokeWidth: 2}} />
                 </AreaChart>
               </ResponsiveContainer>
           </div>
        </div>

        {/* Dynamic 7-Day Forecast - Open-Meteo data */}
        <div className="flex justify-between items-end mb-4 animate-fade-in">
          <h3 className="font-extrabold text-xl text-gray-900 dark:text-white tracking-tight">7-Day Forecast</h3>
          <span className="text-xs text-gray-400 font-semibold">{weatherData.location}</span>
        </div>
        
        <div className="bg-gradient-to-br from-[#6b8bf5] to-[#4f6bf0] dark:from-[#3a52a3] dark:to-[#25397a] rounded-3xl p-6 shadow-lg mb-10 animate-fade-in">
            <div className="flex items-center text-white/90 mb-6 font-medium text-sm">
               <MapPin size={16} className="mr-1"/> {weatherData.location}
               {weeklyForecast.length >= 2 && (
                 <span className="ml-2 text-white/50">• {weeklyForecast[0]?.day} – {weeklyForecast[6]?.day}</span>
               )}
            </div>

            {weeklyForecast.length === 0 ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-white/50 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
            <div className="grid grid-cols-7 gap-1 md:gap-2 divide-x divide-white/10 relative z-10">
               {weeklyForecast.map((day, idx) => (
                  <div key={idx} className={`flex flex-col items-center justify-between text-white py-3 transition-colors cursor-pointer ${idx === 0 ? 'bg-white/10 rounded-2xl' : 'hover:bg-white/5 rounded-2xl'}`}>
                     <div className="text-center mb-4">
                        <p className="font-bold text-xs md:text-sm tracking-wider uppercase">{day.day}</p>
                        <p className="text-xs text-blue-100/70">{day.date}</p>
                     </div>
                     
                     <div className="my-3">
                        {day.icon}
                     </div>

                     <div className="text-center mt-3">
                        <p className="text-xl md:text-2xl font-light">{day.temp}°</p>
                        <p className="text-xs md:text-sm text-blue-200/80 font-medium">{day.low}°</p>
                     </div>

                     <div className="mt-4 flex flex-col items-center opacity-80">
                        <Wind size={12} className="mb-1" />
                        <span className="text-[9px] md:text-[10px] font-medium text-center tracking-tighter">{day.wind}</span>
                     </div>
                  </div>
               ))}
            </div>
            )}
        </div>

      </div>
    </div>
  );
};

const CropAnalysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useContext(LangContext);
  const targetCategory = location.state?.category || 'All';
  const weatherData = location.state?.weatherData || null;
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Location: weatherData ? weatherData.location : 'Tumakuru, Karnataka',
    Temperature: weatherData ? weatherData.temp : 33,
    Rainfall: weatherData && weatherData.rain > 0 ? (weatherData.rain * 30).toFixed(1) : 120,
    Humidity: weatherData ? weatherData.humidity : 60,
    Soil_pH: 6.5
  });

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Calls the Flask ML backend running at port 5000 (127.0.0.1 avoids IPv6 localhost issues)
      const response = await fetch('http://127.0.0.1:5000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           Temperature: parseFloat(formData.Temperature),
           Rainfall: parseFloat(formData.Rainfall),
           Humidity: parseFloat(formData.Humidity),
           Soil_pH: parseFloat(formData.Soil_pH),
           Category: targetCategory
        }),
      });
      const data = await response.json();
      setLoading(false);
      navigate('/result', { state: { predictionData: data, category: targetCategory } });
    } catch (error) {
      console.error("Analysis failed", error);
      setLoading(false);
      alert("Could not reach ML server. Make sure the Python backend is running on port 5000.");
    }
  };

  const inputClass = "w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition";
  const labelClass = "block text-gray-500 dark:text-gray-400 mb-2 text-xs font-extrabold uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors">
      <Header title={`${targetCategory} ${t.analyze}`} showBack={true} />
      
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col relative z-10">
          <form onSubmit={handleAnalyze} className="p-5 flex-1 flex flex-col space-y-5">
            <div className="glass-card dark:bg-gray-800/80 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-2 backdrop-blur-xl bg-white/70">
               <label className={labelClass}>{t.location}</label>
               <div className="relative">
                 <input type="text" value={formData.Location} onChange={(e) => setFormData({...formData, Location: e.target.value})} className={`${inputClass} pr-12`} />
                 <MapPin size={20} className="absolute right-4 top-4 text-green-500" />
               </div>
            </div>


            
            <div className="glass-card dark:bg-gray-800/80 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-5 backdrop-blur-xl bg-white/70">
              <div>
                <label className={labelClass}>{t.temperature}</label>
                <input type="number" value={formData.Temperature} onChange={(e) => setFormData({...formData, Temperature: e.target.value})} className={inputClass} />
              </div>
              
              <div>
                <label className={labelClass}>{t.rainfall}</label>
                <input type="number" value={formData.Rainfall} onChange={(e) => setFormData({...formData, Rainfall: e.target.value})} className={inputClass} />
              </div>
              
              <div>
                <label className={labelClass}>{t.humidity}</label>
                <input type="number" value={formData.Humidity} onChange={(e) => setFormData({...formData, Humidity: e.target.value})} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>{t.soilPh}</label>
                <input type="number" step="0.1" value={formData.Soil_pH} onChange={(e) => setFormData({...formData, Soil_pH: e.target.value})} className={inputClass} />
              </div>
            </div>

            <div className="flex-1"></div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-extrabold text-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              {loading ? 'Analyzing 65,000 Data points...' : t.analyze}
            </button>
          </form>
      </div>
      <FarmBackground image="/bg-input.png" />
    </div>
  );
};

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useContext(LangContext);
  const targetCategory = location.state?.category || 'Crops';
  const apiData = location.state?.predictionData?.top_5;

  const getEmoji = (name) => {
      const mapping = { 'Rose': '🌸', 'Marigold': '🌼', 'Coconut': '🥥', 'Banana': '🍌', 'Tomato': '🍅', 'Potato': '🥔', 'Sunflower': '🌻', 'Arecanut': '🌴', 'Mango': '🥭', 'Papaya': '🍈', 'Groundnut': '🥜', 'Onion': '🧅', 'Grapes': '🍇' };
      return mapping[name] || '🌱';
  };

  const predictions = apiData ? apiData.map(d => ({
      name: d.crop, match: d.match, demand: d.demand, profit: d.profit, img: getEmoji(d.crop)
  })) : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors">
      <Header title={`Top 5 ${targetCategory}`} showBack={true} />
      
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col p-5 relative z-10">
        <div className="flex-1 overflow-y-auto space-y-4">
          {predictions.map((crop, idx) => (
             <div key={idx} onClick={() => navigate('/guide', { state: { crop } })} className="glass-card dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-transform duration-200">
               <div className="flex items-center">
                 <span className="font-black text-gray-300 dark:text-gray-600 mr-4 text-xl w-4">{idx + 1}</span>
                 <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center text-3xl mr-4 shadow-sm border border-white dark:border-gray-600">{crop.img}</div>
                 <div>
                   <h3 className="font-extrabold text-gray-900 dark:text-white text-lg">{crop.name}</h3>
                   <p className="text-xs text-green-600 dark:text-green-400 font-bold">{crop.match}</p>
                 </div>
               </div>
               <div className="text-right space-y-1.5">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-lg block ${crop.demand.includes('High') ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800' : 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-800'}`}>{crop.demand}</span>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-lg block ${crop.profit.includes('High') ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800'}`}>{crop.profit}</span>
               </div>
             </div>
          ))}
          {predictions.length === 0 && <p className="text-center text-gray-500 font-bold mt-10">No specific crops found for this category in the database.</p>}
        </div>

        <div className="mt-8 glass-card dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 flex-none rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-3xl flex items-center justify-center font-bold shadow-lg">
            <ShieldCheck size={24} className="mr-3 text-emerald-200" /> 95% AI Model Accuracy
            </div>
        </div>
      </div>
      <FarmBackground />
    </div>
  );
};

const GuidePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [adding, setAdding] = useState(false);
    
    const crop = location.state?.crop || { name: "Rose", match: "98% Match", profit: "High Profit", img: "🌸" };
    
    const handleAddToDashboard = async () => {
       setAdding(true);
       try {
         const existing = JSON.parse(localStorage.getItem('dashboardCrops') || '[]');
         if (!existing.find(c => c.name === crop.name)) {
             existing.push({ name: crop.name, emoji: crop.img });
             localStorage.setItem('dashboardCrops', JSON.stringify(existing));
         }
         await new Promise(r => setTimeout(r, 600));
         navigate('/mydashboard');
       } catch (err) {
         console.error(err);
         navigate('/mydashboard');
       } finally {
         setAdding(false);
       }
    };
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors">
            <Header title={`${crop.name} Guide`} showBack={true} />
            
            <div className="max-w-2xl mx-auto w-full p-5 flex-1 flex flex-col relative z-10">
                <div className="flex-1 overflow-y-auto">
                    <div className="bg-gradient-to-br from-green-700 to-emerald-900 rounded-[2rem] p-6 flex items-center shadow-xl mb-8 text-white relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 opacity-10"><Sprout size={150} /></div>
                        <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl mr-5 backdrop-blur-md border border-white/20 shadow-inner z-10">{crop.img}</div>
                        <div className="z-10">
                            <h2 className="text-3xl font-black mb-1">{crop.name}</h2>
                            <p className="text-sm text-green-200 font-bold bg-black/20 inline-block px-3 py-1 rounded-lg backdrop-blur-sm mt-2 border border-white/10">{crop.profit} | {crop.match}</p>
                        </div>
                    </div>

                    <h3 className="font-extrabold text-gray-900 dark:text-white mb-5 text-xl tracking-tight">Step by Step Guide</h3>

                    <div className="space-y-4 relative ml-2">
                        <div className="absolute left-6 top-6 bottom-6 w-1 bg-gray-200 dark:bg-gray-800 rounded-full"></div>

                        {[
                           {title: "Land Preparation", icon: <Map size={18} className="text-amber-600"/>, desc: "Prepare the soil by removing weeds and deep ploughing."},
                           {title: "Sowing / Planting", icon: <Sprout size={18} className="text-green-600"/>, desc: "Best time to plant is October to February for optimal yield."},
                           {title: "Watering", icon: <Droplet size={18} className="text-blue-500"/>, desc: "Water the plants regularly. Ensure good drainage to prevent rot."},
                           {title: "Fertilizer", icon: <Sun size={18} className="text-yellow-500"/>, desc: "Apply NPK organic fertilizer every 15-20 days based on soil pH."}
                        ].map((step, idx) => (
                          <div key={idx} className="glass-card dark:bg-gray-800/80 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 pl-16 relative">
                              <div className="absolute left-3 top-6 w-7 h-7 bg-white dark:bg-gray-900 rounded-full border-4 border-green-500 z-10 shadow-sm flex items-center justify-center"></div>
                              <h4 className="font-extrabold text-gray-900 dark:text-white flex items-center text-lg">{step.icon}<span className="ml-2">{step.title}</span></h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium leading-relaxed">{step.desc}</p>
                          </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 glass-card dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 flex space-x-4 rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                   <button onClick={handleAddToDashboard} disabled={adding} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-3xl font-bold text-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                      {adding ? 'Adding...' : 'Add to Dashboard'}
                   </button>
                </div>
            </div>
            <FarmBackground />
        </div>
    )
}

const CustomPlantDot = (props) => {
  const { cx, cy, index } = props;
  
  const animationStyle = {
    animation: `pop-up 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`,
    animationDelay: `${index * 0.3}s`,
    opacity: 0,
    transformOrigin: `${cx}px ${cy}px`
  };

  return (
    <g style={animationStyle} className="custom-dot">
      <circle cx={cx} cy={cy} r="24" fill="white" stroke="#e2e8f0" strokeWidth="1" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))" />
      {/* Dirt */}
      <path d={`M ${cx - 12} ${cy + 12} Q ${cx} ${cy + 6} ${cx + 12} ${cy + 12} Z`} fill="#8B4513" />
      {/* Plant based on index */}
      {index === 0 && (
         <path d={`M ${cx} ${cy + 10} Q ${cx - 4} ${cy} ${cx} ${cy - 2} Q ${cx + 4} ${cy} ${cx} ${cy + 10}`} fill="#22c55e" />
      )}
      {index === 1 && (
         <>
           <path d={`M ${cx} ${cy + 10} Q ${cx - 6} ${cy - 4} ${cx} ${cy - 10}`} stroke="#22c55e" strokeWidth="2.5" fill="none" />
           <path d={`M ${cx} ${cy - 2} Q ${cx - 8} ${cy - 2} ${cx - 10} ${cy - 6} Q ${cx - 4} ${cy - 8} ${cx} ${cy - 2}`} fill="#22c55e" />
           <path d={`M ${cx} ${cy - 6} Q ${cx + 8} ${cy - 6} ${cx + 10} ${cy - 10} Q ${cx + 4} ${cy - 12} ${cx} ${cy - 6}`} fill="#22c55e" />
         </>
      )}
      {index === 2 && (
         <>
           <path d={`M ${cx} ${cy + 10} L ${cx} ${cy - 14}`} stroke="#22c55e" strokeWidth="3" fill="none" />
           <path d={`M ${cx} ${cy} Q ${cx - 10} ${cy + 2} ${cx - 14} ${cy - 4} Q ${cx - 6} ${cy - 8} ${cx} ${cy}`} fill="#22c55e" />
           <path d={`M ${cx} ${cy - 4} Q ${cx + 10} ${cy - 2} ${cx + 14} ${cy - 8} Q ${cx + 6} ${cy - 12} ${cx} ${cy - 4}`} fill="#22c55e" />
           <path d={`M ${cx} ${cy - 14} Q ${cx - 4} ${cy - 20} ${cx} ${cy - 22} Q ${cx + 4} ${cy - 20} ${cx} ${cy - 14}`} fill="#22c55e" />
         </>
      )}
    </g>
  );
};

const CropTimeline = ({ cropName, emoji, onDelete }) => {
  const [steps, setSteps] = useState([
    { id: 1, title: 'Land Preparation', desc: 'Plough the field & organic manure.', done: false },
    { id: 2, title: 'Seed Sowing', desc: 'Plant the seeds with proper spacing.', done: false },
    { id: 3, title: 'First Watering', desc: 'Irrigate immediately after sowing.', done: false },
    { id: 4, title: 'Fertilizer & Weeding', desc: 'Remove weeds and apply nutrients.', done: false },
    { id: 5, title: 'Harvesting', desc: 'Harvest when the crop is mature.', done: false }
  ]);

  useEffect(() => {
    const saved = localStorage.getItem(`crop_steps_${cropName}`);
    if (saved) {
      try { setSteps(JSON.parse(saved)); } catch(e){}
    }
  }, [cropName]);

  const toggleStep = (id) => {
    const newSteps = steps.map(s => {
      // Allow completing steps up to the clicked one, or toggling
      if (s.id <= id) return { ...s, done: true };
      return { ...s, done: false };
    });
    setSteps(newSteps);
    localStorage.setItem(`crop_steps_${cropName}`, JSON.stringify(newSteps));
  };

  return (
    <div className="bg-gradient-to-br from-[#1b4332]/90 to-[#081c15]/90 backdrop-blur-2xl rounded-3xl p-6 shadow-xl border border-white/20 flex-1 flex flex-col relative overflow-hidden text-white group hover:shadow-2xl transition duration-500">
       <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-50"></div>
       <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-50"></div>
       
       <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center space-x-4">
             <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-3xl border border-white/20 shadow-inner">{emoji}</div>
             <div>
               <h3 className="font-extrabold text-xl tracking-tight">{cropName} Growth Tracker</h3>
               <p className="text-[10px] text-green-300 font-bold uppercase tracking-widest mt-1">Step-by-step Guide</p>
             </div>
          </div>
          <button onClick={() => onDelete(cropName)} className="w-10 h-10 flex items-center justify-center bg-red-500/20 text-red-300 rounded-full hover:bg-red-500 hover:text-white transition cursor-pointer shadow-sm border border-red-500/30">
             <X size={18} />
          </button>
       </div>
       
       <div className="space-y-4 relative z-10 flex-1 overflow-y-auto pr-2">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-white/10 z-0"></div>
          
          {steps.map((step) => (
             <div key={step.id} className="flex items-start relative z-10 group/step cursor-pointer" onClick={() => toggleStep(step.id)}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 shadow-lg ${step.done ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white scale-110 shadow-green-500/30' : 'bg-[#081c15] text-gray-400 border border-white/20 group-hover/step:border-green-400 group-hover/step:bg-[#1b4332]'}`}>
                   {step.done ? <CheckCircle2 size={20} /> : <span className="font-bold text-sm">{step.id}</span>}
                </div>
                <div className="ml-5 flex-1 pt-2 pb-5 border-b border-white/10 last:border-0">
                   <h4 className={`font-bold text-base transition-colors ${step.done ? 'text-green-400 line-through opacity-70' : 'text-gray-100 group-hover/step:text-green-300'}`}>{step.title}</h4>
                   <p className={`text-xs mt-1 transition-colors ${step.done ? 'text-white/40' : 'text-gray-400 group-hover/step:text-gray-300'}`}>{step.desc}</p>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

const MyDashboard = () => {
  const navigate = useNavigate();
  const { t } = useContext(LangContext);
  const { user, logout } = useContext(AuthContext);
  const [dashboardCrops, setDashboardCrops] = useState([]);
  const [weatherData, setWeatherData] = useState({
     temp: 29, temp_min: 25, humidity: 90, wind: 5, pressure: 1007,
     day: 'Monday', dateStr: '10th Apr 2023'
  });

  useEffect(() => {
    const saved = localStorage.getItem('dashboardCrops');
    if (saved) {
      try { setDashboardCrops(JSON.parse(saved)); } catch(e){}
    }

    const fetchWeather = async (lat, lon) => {
       try {
          const API_KEY = 'b1c383566e0242b47c97fa5c73a7ad12';
          const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
          const data = await res.json();
          const d = new Date();
          const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
          const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          
          setWeatherData({
             temp: Math.round(data.main.temp),
             temp_min: Math.round(data.main.temp_min),
             humidity: data.main.humidity,
             wind: Math.round(data.wind.speed * 3.6),
             pressure: data.main.pressure,
             day: days[d.getDay()],
             dateStr: `${d.getDate()}th ${months[d.getMonth()]} ${d.getFullYear()}`
          });
       } catch(e) {}
    };

    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(
          (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
          () => fetchWeather(12.9716, 77.5946)
       );
    } else {
       fetchWeather(12.9716, 77.5946);
    }
  }, []);

  const deleteCrop = (cropName) => {
    const newCrops = dashboardCrops.filter(c => c.name !== cropName);
    setDashboardCrops(newCrops);
    localStorage.setItem('dashboardCrops', JSON.stringify(newCrops));
    localStorage.removeItem(`crop_steps_${cropName}`); // clean up steps
  };
  
  // Data for Plant Growth Activity
  const growthData = [
    { name: 'Seed Phase (W1)', value: 20 },
    { name: 'Final Growth (W3)', value: 60 },
    { name: 'Vegetarian (W2)', value: 80 },
  ];

  // Data for Summer of production
  const productionData = [
    { name: 'JAN', current: 1000, last: 800 },
    { name: 'FEB', current: 1500, last: 1000 },
    { name: 'MAR', current: 2000, last: 1200 },
    { name: 'APR', current: 2500, last: 1800 },
    { name: 'MAY', current: 2000, last: 1600 },
    { name: 'JUN', current: 1800, last: 1400 },
    { name: 'JUL', current: 3500, last: 2800 },
    { name: 'AUG', current: 3000, last: 2400 },
    { name: 'SEP', current: 2500, last: 2000 },
    { name: 'OCT', current: 1800, last: 1500 },
    { name: 'NOV', current: 1200, last: 1000 },
    { name: 'DEC', current: 2200, last: 1800 },
  ];

  // Data for Weather Pie
  const dynamicWeatherPie = [
    { name: 'Humidity', value: weatherData.humidity, color: '#0ea5e9' }, // Blue
    { name: 'Temperature', value: weatherData.temp, color: '#22c55e' }, // Green
    { name: 'Wind', value: weatherData.wind, color: '#334155' } // Dark
  ];

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center p-0 md:p-6 lg:p-10" style={{ backgroundImage: "url('/bg-home.png')" }}>
      {/* Main Glass/White Container matching Image 3 */}
      <div className="w-full max-w-[1400px] h-[100vh] md:h-[90vh] bg-white md:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/40 backdrop-blur-xl">
        
        {/* Sidebar Removed */}

        {/* Main Content Area */}
        <div className="flex-1 bg-[#f8fafc] overflow-y-auto flex flex-col p-4 md:p-8 relative">
           {/* Header with Back Button */}
           <div className="flex items-center mb-6">
              <button onClick={() => navigate('/home')} className="flex items-center text-gray-600 hover:text-[#113219] font-extrabold bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-200 transition-colors mr-4 hover:shadow-md cursor-pointer">
                 <ChevronLeft size={20} className="mr-1" />
                 Back to Home
              </button>
              <h2 className="font-extrabold text-2xl text-gray-800 tracking-tight">My Dashboard</h2>
           </div>

           {/* Dashboard Content */}
           <div className="flex flex-col space-y-6 flex-1">
              
              {/* Charts & Timelines */}
              <div className="flex flex-col space-y-6">
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Weather Today */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
                       <div>
                         <p className="text-gray-400 font-semibold text-xs uppercase tracking-wider mb-1">Weather's today</p>
                         <h3 className="font-bold text-xl text-gray-800">{weatherData.day}</h3>
                         <p className="text-xs text-gray-400 font-medium">({weatherData.dateStr})</p>
                       </div>
                       
                       <div className="flex items-center justify-between mt-6">
                          <div>
                            <h2 className="text-4xl font-extrabold text-gray-800">{weatherData.temp}°C</h2>
                            <p className="text-xs text-gray-400 font-bold mt-1">Live data</p>
                          </div>
                          <div className="w-28 h-28 relative">
                             <ResponsiveContainer width="100%" height="100%">
                               <PieChart>
                                 <Pie data={dynamicWeatherPie} innerRadius={35} outerRadius={50} dataKey="value" stroke="none" cornerRadius={4} paddingAngle={2}>
                                   {dynamicWeatherPie.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                 </Pie>
                               </PieChart>
                             </ResponsiveContainer>
                             <div className="absolute inset-0 flex flex-col items-center justify-center">
                               <span className="font-extrabold text-lg text-gray-800">{weatherData.temp_min}°C</span>
                               <span className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">Min Temp</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex justify-between items-center mt-8 text-xs text-gray-500 font-extrabold border-t border-gray-100 pt-5">
                          <div className="flex items-center"><Wind size={14} className="mr-1 text-gray-400"/> {weatherData.wind} km/h</div>
                          <div className="flex items-center"><Droplet size={14} className="mr-1 text-gray-400"/> {weatherData.humidity}%</div>
                          <div className="flex items-center"><Sun size={14} className="mr-1 text-gray-400"/> {weatherData.pressure} hPa</div>
                       </div>
                    </div>

                    {/* Plant Growth Activity */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition">
                       <div className="flex justify-between items-center mb-6">
                         <h3 className="text-gray-400 font-semibold text-xs uppercase tracking-wider">Plant growth activity</h3>
                         <button className="text-xs font-bold bg-white px-3 py-1.5 rounded-full text-gray-700 border border-gray-200 shadow-sm flex items-center">
                           Weekly <ChevronLeft size={14} className="ml-1 -rotate-90 text-gray-400"/>
                         </button>
                       </div>
                       <div className="flex-1 w-full min-h-[160px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={growthData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                               <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#f1f5f9" />
                               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#64748b', fontWeight: 700}} dy={15} />
                               <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}/>
                               <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} dot={<CustomPlantDot />} activeDot={<CustomPlantDot />} isAnimationActive={true} />
                            </LineChart>
                          </ResponsiveContainer>
                       </div>
                    </div>
                 </div>

                 {/* Step-by-Step Crop Tracker replacing Summer of Production */}
                 {dashboardCrops.length > 0 ? (
                    dashboardCrops.map((crop, idx) => (
                       <CropTimeline key={idx} cropName={crop.name} emoji={crop.emoji} onDelete={deleteCrop} />
                    ))
                 ) : (
                   <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 flex flex-col items-center justify-center text-center py-12">
                     <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 shadow-inner">
                        <Sprout size={32} />
                     </div>
                     <h3 className="font-extrabold text-xl text-gray-800 tracking-tight mb-2">No Active Crop Tracker</h3>
                     <p className="text-sm text-gray-500 mb-6 font-medium max-w-[250px]">Add a crop from the analysis page to view the step-by-step growing guide.</p>
                     <button onClick={() => navigate('/analyze')} className="px-6 py-2.5 bg-[#113219] hover:bg-[#1a4a26] text-white rounded-xl font-bold shadow-md transition-colors text-sm">
                        Find a Crop
                     </button>
                   </div>
                 )}
              </div>

              {/* Right Column Removed */}

           </div>
        </div>
      </div>
    </div>
  );
};



function App() {
  const [lang, setLang] = useState('English');
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState(null);

  // Apply dark mode class to HTML element
  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const t = translations[lang] || translations['English'];

  return (
    <AuthContext.Provider value={{ user, setUser, logout: () => setUser(null) }}>
      <ThemeContext.Provider value={{ isDark, setIsDark }}>
        <LangContext.Provider value={{ lang, setLang, t }}>
          <div className="font-sans antialiased text-gray-900 bg-black min-h-screen">
            {/* Removed max-w-md to make it full screen responsive on web! */}
            <div className="w-full min-h-screen bg-white shadow-2xl relative overflow-x-hidden">
              <Router>
                <Routes>
                  <Route path="/" element={<Splash />} />
                  <Route path="/lang" element={<LanguageSelection />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/otp" element={<OtpScreen />} />
                  <Route path="/home" element={<HomeDashboard />} />
                  <Route path="/analyze" element={<CropAnalysis />} />
                  <Route path="/result" element={<ResultPage />} />
                  <Route path="/guide" element={<GuidePage />} />
                  <Route path="/mydashboard" element={<MyDashboard />} />
                </Routes>
              </Router>
            </div>
          </div>
        </LangContext.Provider>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;

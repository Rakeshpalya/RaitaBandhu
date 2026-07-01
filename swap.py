import re

with open('scratch.txt', 'r', encoding='utf-16') as f:
    new_dashboard_code = f.read()

new_dashboard_code = new_dashboard_code.replace('const HomeDashboard = () => {', 'const MyDashboard = () => {')

with open('client/src/App.jsx', 'r', encoding='utf-8') as f:
    app_jsx = f.read()

old_home_dashboard = """const HomeDashboard = () => {
  const navigate = useNavigate();
  const { t } = useContext(LangContext);
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // Alert hidden by default
  
  const getSeason = () => {
      const month = new Date().getMonth();
      if(month >= 5 && month <= 9) return 'Kharif';
      if(month >= 10 || month <= 2) return 'Rabi';
      return 'Zaid';
  };

  const weatherData = [
    { date: '12', day: 'MON', temp: 14, low: 6, icon: <Sun size={32} className="text-yellow-400"/>, wind: '5 km/h' },
    { date: '13', day: 'TUE', temp: 11, low: 4, icon: <CloudLightning size={32} className="text-purple-400"/>, wind: '12 km/h' },
    { date: '14', day: 'WED', temp: 13, low: 7, icon: <SunMedium size={32} className="text-yellow-400"/>, wind: '10 km/h' },
    { date: '15', day: 'THU', temp: 17, low: 5, icon: <Sun size={32} className="text-yellow-400"/>, wind: '4 km/h' },
    { date: '16', day: 'FRI', temp: 15, low: 8, icon: <CloudRain size={32} className="text-gray-300"/>, wind: '11 km/h' },
    { date: '17', day: 'SAT', temp: 9, low: 2, icon: <CloudRain size={32} className="text-blue-300"/>, wind: '12 km/h' },
    { date: '18', day: 'SUN', temp: 12, low: 3, icon: <CloudRain size={32} className="text-blue-300"/>, wind: '14 km/h' },
  ];

  const trendData = [
    { date: '20 Apr', temp: 20 }, { date: '21 Apr', temp: 22 },
    { date: '22 Apr', temp: 25 }, { date: '23 Apr', temp: 28 },
    { date: '24 Apr', temp: 21 }, { date: '25 Apr', temp: 26 },
    { date: '26 Apr', temp: 32 }
  ];

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
                  <h4 className="font-extrabold text-lg">Heavy Rain & Flood Warning</h4>
                  <p className="text-red-100 text-sm mt-1 font-medium">Expect extreme rainfall over the next 48 hours in Tumakuru district. Please secure your freshly sown seeds and ensure proper drainage.</p>
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
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1 font-medium"><MapPin size={14} className="mr-1 text-gray-700"/> Tumakuru, Karnataka, India</p>
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
        </div>

        {/* Current Weather Card with Sunrise/Sunset */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
             <div className="flex items-center">
               <div className="w-16 h-16 mr-4">
                  <Sun size={64} className="text-yellow-400 drop-shadow-md" />
               </div>
               <div>
                 <h3 className="text-5xl font-bold text-gray-900 dark:text-white">33°<span className="text-2xl text-gray-500 font-normal">C</span></h3>
                 <p className="text-gray-500 dark:text-gray-400 font-medium">Sunny & Clear</p>
               </div>
             </div>
             <div className="flex gap-8 mt-4 md:mt-0 text-sm text-gray-600 dark:text-gray-300 font-semibold">
                <div className="flex items-center"><Droplets size={16} className="text-blue-500 mr-2"/> 60%</div>
                <div className="flex items-center"><Wind size={16} className="text-teal-500 mr-2"/> 12 km/h</div>
             </div>
          </div>
          
          <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-between items-center">
            <div className="text-center">
              <p className="text-xs text-gray-400 font-bold mb-1">Sunrise</p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">6:05 AM</p>
            </div>
            
            <div className="flex-1 px-8 relative h-10 hidden sm:block">
              {/* Simple arc representation */}
              <div className="w-full h-20 border-t-2 border-dashed border-yellow-400 rounded-t-full absolute top-5 opacity-50"></div>
              <div className="w-4 h-4 bg-yellow-400 rounded-full absolute top-3 left-1/2 transform -translate-x-1/2 shadow-lg shadow-yellow-400"></div>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-400 font-bold mb-1">Sunset</p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">6:35 PM</p>
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
             <div key={i} onClick={() => navigate('/analyze', { state: { category: cat.name } })} className="bg-white dark:bg-gray-800 p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow shadow-sm border border-gray-100 dark:border-gray-700">
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

        {/* Enhanced Glassmorphic 7-Day Forecast */}
        <div className="flex justify-between items-end mb-4 animate-fade-in">
          <h3 className="font-extrabold text-xl text-gray-900 dark:text-white tracking-tight">7-Day Forecast</h3>
        </div>
        
        {/* Beautiful Glassmorphic Forecast Card based on uploaded reference */}
        <div className="bg-gradient-to-br from-[#6b8bf5] to-[#4f6bf0] dark:from-[#3a52a3] dark:to-[#25397a] rounded-3xl p-6 shadow-lg mb-10 animate-fade-in">
            <div className="flex items-center text-white/90 mb-6 font-medium text-sm">
               <MapPin size={16} className="mr-1"/> Rivertown <span className="mx-2 text-white/50">•</span> Mar 12–19
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2 divide-x divide-white/10 relative z-10">
               {weatherData.map((day, idx) => (
                  <div key={idx} className={`flex flex-col items-center justify-between text-white py-3 transition-colors cursor-pointer ${idx === 4 ? 'bg-white/10 rounded-2xl' : 'hover:bg-white/5 rounded-2xl'}`}>
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
        </div>

      </div>
    </div>
  );
};
"""

# 1. replace MyDashboard
match_my = re.search(r'(const MyDashboard = \(\) => \{.*?\n\})\n+function App', app_jsx, re.DOTALL)
app_jsx = app_jsx.replace(match_my.group(1), new_dashboard_code.strip() + '\n')

# 2. replace HomeDashboard
match_home = re.search(r'(const HomeDashboard = \(\) => \{.*?\n\};)\n+const CropAnalysis = \(\) => \{', app_jsx, re.DOTALL)
app_jsx = app_jsx.replace(match_home.group(1), old_home_dashboard.strip())

with open('client/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(app_jsx)

print("Done")

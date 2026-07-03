import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MapPin } from 'lucide-react';

const WeatherForecast = ({ weatherData = {}, hourly72Forecast = [], weeklyForecast = [] }) => {
  const [visibleStart, setVisibleStart] = useState(0);
  const scrollRef = useRef(null);
  const visibleCount = 18;

  useEffect(() => {
    setVisibleStart(0);
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
  }, [hourly72Forecast]);

  const chartData = useMemo(() => {
    const safeStart = Math.min(Math.max(visibleStart, 0), Math.max(hourly72Forecast.length - visibleCount, 0));
    return hourly72Forecast.slice(safeStart, safeStart + visibleCount).map((hour, index) => ({
      ...hour,
      index,
    }));
  }, [hourly72Forecast, visibleStart]);

  const summaryDays = useMemo(() => weeklyForecast.slice(0, 3), [weeklyForecast]);
  const current = weatherData || {};

  return (
    <section className="rounded-[38px] border border-white/10 bg-slate-950/90 backdrop-blur-3xl shadow-2xl shadow-slate-900/30 p-6 mb-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-6 gap-y-6">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.32em] text-sky-300/80">Premium Weather Intelligence</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-white">Next 72 Hours</h2>
          <p className="mt-2 text-sm text-slate-300">Live hyperlocal forecast, hourly temperature curve, rain probability, and crop-safe weather signals for the next three days.</p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/20 backdrop-blur-xl w-full md:max-w-sm">
          <div className="flex items-center gap-3 text-slate-100 font-semibold mb-4">
            <MapPin size={18} className="text-sky-300" />
            <span>{current.location || 'Tumakuru, Karnataka'}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-slate-100">
              <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Humidity</p>
              <p className="mt-3 text-xl font-bold">{current.humidity ?? '--'}%</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-slate-100">
              <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Wind</p>
              <p className="mt-3 text-xl font-bold">{current.wind ?? '--'} m/s</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-slate-100">
              <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Feels Like</p>
              <p className="mt-3 text-xl font-bold">{current.temp ?? '--'}°</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-slate-100">
              <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Rain Chance</p>
              <p className="mt-3 text-xl font-bold">{current.rainChance != null ? `${current.rainChance}%` : '--'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-white/10 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/20">
        <div className="grid gap-3 md:grid-cols-3 mb-5">
          {summaryDays.map((day) => (
            <div key={day.day} className="rounded-[24px] border border-white/10 bg-slate-950/70 p-4 text-slate-100 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.32em] text-slate-400">{day.day}</p>
              <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-2xl font-semibold">{day.temp}°</p>
                  <p className="mt-1 text-xs text-slate-400">{day.low}° low</p>
                </div>
                <div className="rounded-3xl bg-slate-800/90 p-3 text-slate-100">{day.icon}</div>
              </div>
              <p className="mt-4 text-sm text-slate-300 font-semibold">{day.icon ? 'Forecast' : ''}</p>
              <p className="mt-2 text-[11px] text-slate-500">Wind {day.wind}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-950/90 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Hourly Temperature</p>
              <h3 className="text-xl font-bold text-white">72-hour temp curve</h3>
            </div>
            <span className="rounded-full bg-sky-500/15 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-sky-200">Live API</span>
          </div>

          <div className="h-[320px]">
            {chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-slate-400">Loading forecast…</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.75} />
                      <stop offset="100%" stopColor="#0f172a" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 6" stroke="#334155" opacity={0.35} />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                    minTickGap={20}
                    interval={7}
                    dy={10}
                  />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: 'none', borderRadius: 16, color: '#f8fafc' }}
                    labelStyle={{ color: '#94a3b8' }}
                    formatter={(value, name) => [`${value}°`, 'Temp']}
                  />
                  <Area
                    type="monotone"
                    dataKey="temp"
                    stroke="#38bdf8"
                    strokeWidth={3}
                    fill="url(#tempGradient)"
                    activeDot={{ r: 6, fill: '#38bdf8', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-5 overflow-x-auto hide-scrollbar" ref={scrollRef} onScroll={() => {
            if (!scrollRef.current) return;
            const scrollLeft = scrollRef.current.scrollLeft;
            const cardWidth = 112; // approx card width + gap
            const newIndex = Math.round(scrollLeft / cardWidth);
            setVisibleStart(newIndex);
          }}>
            <div className="min-w-full md:min-w-[1040px] flex items-center gap-3 rounded-[24px] border border-white/10 bg-slate-950/80 p-3 text-slate-300">
              {hourly72Forecast.map((point) => (
                <div key={`${point.time}-${point.temp}`} className="flex min-w-[90px] flex-col items-center gap-2 rounded-3xl bg-slate-900/80 px-3 py-4 text-center">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-slate-500">{point.time}</span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-800/90 shadow-sm">
                    {point.icon}
                  </div>
                  <p className="text-lg font-semibold text-white">{point.temp}°</p>
                  <p className="text-[11px] text-slate-400">{point.rainChance}% rain</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeatherForecast;

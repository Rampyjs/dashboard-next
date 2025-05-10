'use client';

import { useEffect, useState } from 'react';
import pb from '../lib/pocketbase'; // Asegúrate de tener esta conexión lista
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  CartesianGrid,
} from 'recharts';
import { startOfWeek, addDays, format } from 'date-fns';

export default function Statistics() {
  const [data, setData] = useState([
    { name: 'mon', uv: 0, label: '0h' },
    { name: 'tue', uv: 0, label: '0h' },
    { name: 'wed', uv: 0, label: '0h' },
    { name: 'thu', uv: 0, label: '0h' },
    { name: 'fri', uv: 0, label: '0h' },
    { name: 'sat', uv: 0, label: '0h' },
    { name: 'sun', uv: 0, label: '0h' },
  ]);

  useEffect(() => {
    async function fetchLearningLogs() {
      const user = pb.authStore.model;
      if (!user) return;

      const start = startOfWeek(new Date(), { weekStartsOn: 1 });
      const end = addDays(start, 6);

      const records = await pb.collection('learning_logs').getFullList({
        filter: `user = "${user.id}" && date >= "${format(start, 'yyyy-MM-dd')}" && date <= "${format(end, 'yyyy-MM-dd')}"`,
      });

      const weeklyData = [0, 0, 0, 0, 0, 0, 0]; // lunes a domingo

      records.forEach(log => {
        const date = new Date(log.date);
        const dayIndex = (date.getDay() + 6) % 7;
        weeklyData[dayIndex] += log.minutes;
      });

      const finalData = weeklyData.map((min, i) => {
        const hours = Math.round((min / 60) * 10) / 10;
        const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        return {
          name: days[i],
          uv: hours,
          label: `${hours}h`,
        };
      });

      setData(finalData);
    }

    fetchLearningLogs();
  }, []);

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm px-4 py-4 md:px-5 md:py-5">
      <h2 className="font-bold text-sm md:text-base mb-3 text-black">
        Your statistics
      </h2>

      {/* Tabs + Dropdown */}
      <div className="flex items-center justify-between mb-3 text-xs sm:text-sm flex-wrap gap-2">
        <div className="flex gap-4">
          <span className="font-semibold text-black border-b-2 border-black pb-0.5">
            Learning Hours
          </span>
          <span className="text-gray-400 font-semibold">My Courses</span>
        </div>
        <select className="text-xs bg-[#F5F5F7] px-2 py-1 rounded-md border border-gray-300 text-black">
          <option>Weekly</option>
        </select>
      </div>

      {/* Gráfico */}
      <div className="w-full h-[190px] sm:h-[210px] md:h-[230px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 0, right: 10, bottom: 0, left: -45 }}
          >
            <CartesianGrid
              horizontal
              vertical={false}
              stroke="#e5e7eb"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#000', fontSize: 10 }}
            />
            <YAxis
              domain={[0, 5]}
              ticks={[0, 1, 2, 3, 4, 5]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#000', fontSize: 10 }}
            />
            <Tooltip contentStyle={{ display: 'none' }} />
            <Line
              type="monotone"
              dataKey="uv"
              stroke="#000"
              strokeWidth={1.8}
              dot={{
                r: 3.5,
                stroke: '#000',
                strokeWidth: 1.8,
                fill: '#000',
              }}
            >
              <LabelList
                dataKey="label"
                position="top"
                content={({ x, y, value }) => (
                  <foreignObject x={x - 20} y={y - 32} width={44} height={26}>
                    <div className="bg-white rounded-md shadow px-1.5 py-0.5 text-[10px] text-black text-center font-semibold border border-white">
                      {value}
                    </div>
                  </foreignObject>
                )}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

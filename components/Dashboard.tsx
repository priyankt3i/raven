import React, { useMemo, useState, useCallback } from 'react';
import { Task, Category, Status } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { getWeeklySummary } from '../services/geminiService';
import { SparklesIcon } from './icons/Icons';

interface DashboardProps {
  tasks: Task[];
}

const PIE_COLORS = ['#334155', '#64748b', '#94a3b8']; // slate-700, slate-500, slate-400

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-bold text-base">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} className="recharts-pie-active-shape-text-value">{`${value} tasks`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} className="recharts-pie-active-shape-text-rate">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};


const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const [weeklySummary, setWeeklySummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [pieActiveIndex, setPieActiveIndex] = useState(0);

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(t => t.status === Status.Completed);
    const totalTasks = tasks.filter(t => t.status === Status.Completed || t.status === Status.Todo);
    const completionRate = totalTasks.length > 0 ? (completedTasks.length / totalTasks.length) * 100 : 0;
    
    const onTime = completedTasks.filter(t => t.completedAt && new Date(t.completedAt) <= new Date(t.dueDate)).length;
    const late = completedTasks.length - onTime;
    
    const categoryData = Object.values(Category).map(cat => ({
      name: cat,
      completed: tasks.filter(t => t.category === cat && t.status === Status.Completed).length,
      todo: tasks.filter(t => t.category === cat && t.status === Status.Todo).length,
    }));

    const completionByDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => ({
        name: day,
        tasks: completedTasks.filter(t => new Date(t.completedAt!).getDay() === i).length,
    }));

    return { completionRate, onTime, late, categoryData, completionByDay };
  }, [tasks]);

  const onPieEnter = useCallback((_: any, index: number) => {
    setPieActiveIndex(index);
  }, []);

  const handleGenerateSummary = async () => {
    setIsSummaryLoading(true);
    setWeeklySummary('');
    try {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const recentTasks = tasks.filter(t => t.createdAt > oneWeekAgo);
        const summary = await getWeeklySummary(recentTasks);
        setWeeklySummary(summary);
    } catch(error) {
        console.error("Failed to generate summary", error);
        setWeeklySummary("Sorry, I couldn't generate a summary right now.");
    } finally {
        setIsSummaryLoading(false);
    }
  };


  return (
    <div className="dashboard-container">
      <div className="dashboard-stats-grid">
        <div className="dashboard-stat-card">
          <p className="dashboard-stat-value">{stats.completionRate.toFixed(0)}%</p>
          <p className="dashboard-stat-label">Completion Rate</p>
        </div>
        <div className="dashboard-stat-card">
          <p className="dashboard-stat-value">{stats.onTime}</p>
          <p className="dashboard-stat-label">On Time</p>
        </div>
        <div className="dashboard-stat-card col-span-2 md:col-span-1">
          <p className="dashboard-stat-value">{stats.late}</p>
          <p className="dashboard-stat-label">Late</p>
        </div>
      </div>

      <div className="dashboard-summary-card">
        <h3 className="dashboard-card-title">AI Weekly Summary</h3>
        {weeklySummary && <div className="dashboard-summary-text">{weeklySummary}</div>}
        {isSummaryLoading && <div className="dashboard-summary-loading">Generating your summary...</div>}
        <button onClick={handleGenerateSummary} disabled={isSummaryLoading} className="dashboard-generate-summary-button">
          <SparklesIcon className="dashboard-generate-summary-button-icon"/>
          {isSummaryLoading ? 'Thinking...' : 'Generate Summary'}
        </button>
      </div>

      <div className="dashboard-chart-card">
        <h3 className="dashboard-card-title">Tasks by Category</h3>
         <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                activeIndex={pieActiveIndex}
                activeShape={renderActiveShape}
                data={stats.categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="completed"
                onMouseEnter={onPieEnter}
                nameKey="name"
              >
              {stats.categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} className="focus:outline-none" />
              ))}
              </Pie>
            </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="dashboard-chart-card">
        <h3 className="dashboard-card-title">Weekly Completion</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.completionByDay} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <XAxis dataKey="name" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} className="recharts-axis-stroke recharts-axis-tick-font" />
            <YAxis stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} className="recharts-axis-stroke recharts-axis-tick-font" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.8)', // slate-800
                borderColor: '#64748b', // slate-500
                color: '#f1f5f9', // slate-100
                borderRadius: '0.5rem'
              }}
              cursor={{fill: 'rgba(100, 116, 139, 0.1)'}} // slate-500
            />
            <Legend wrapperStyle={{fontSize: "14px"}}/>
            <Bar dataKey="tasks" name="Completed Tasks" fill="#475569" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default Dashboard;

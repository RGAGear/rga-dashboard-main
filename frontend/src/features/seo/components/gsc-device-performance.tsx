import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const data = [
  { name: 'Mobile', Clicks: 45000, Impressions: 350000 },
  { name: 'Desktop', Clicks: 28000, Impressions: 120000 },
  { name: 'Tablet', Clicks: 2500, Impressions: 15000 },
];

export function GscDevicePerformance() {
  return (
    <Card className="h-[400px] flex flex-col shadow-sm dark:border-border/70 dark:bg-card">
      <CardHeader className="px-4 py-3 border-b shrink-0 flex flex-row items-center gap-2 dark:border-border/70">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-card-foreground">
              Search Device Performance (GSC)
          </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `${value / 1000}k`} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar yAxisId="left" dataKey="Clicks" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                  <Bar yAxisId="right" dataKey="Impressions" fill="#a5b4fc" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
          </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

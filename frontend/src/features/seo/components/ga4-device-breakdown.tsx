import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Mobile', value: 65, color: '#f59e0b' },
  { name: 'Desktop', value: 30, color: '#fbbf24' },
  { name: 'Tablet', value: 5, color: '#fcd34d' },
];

export function Ga4DeviceBreakdown() {
  return (
    <Card className="h-[400px] flex flex-col shadow-sm dark:border-border/70 dark:bg-card">
      <CardHeader className="px-4 py-3 border-b shrink-0 flex flex-row items-center gap-2 dark:border-border/70">
          <CardTitle className="text-base font-semibold text-gray-800 dark:text-card-foreground">
              Device Breakdown (GA4)
          </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-1 min-h-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                  <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                  >
                      {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                  </Pie>
                  <Tooltip
                      formatter={(value: number) => [`${value}%`, 'Users']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
              </PieChart>
          </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

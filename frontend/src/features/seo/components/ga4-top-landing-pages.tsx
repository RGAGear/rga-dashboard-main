import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCompactNumber } from '@/lib/formatters';

const landingPages = [
    { url: '/home', sessions: 12500, bounceRate: 45.2, avgTime: '02:15' },
    { url: '/products/shoes', sessions: 8300, bounceRate: 38.5, avgTime: '03:45' },
    { url: '/blog/seo-tips', sessions: 6200, bounceRate: 65.0, avgTime: '01:20' },
    { url: '/about-us', sessions: 4100, bounceRate: 55.4, avgTime: '01:50' },
    { url: '/contact', sessions: 2800, bounceRate: 30.1, avgTime: '00:45' },
];

export function Ga4TopLandingPages() {
    return (
        <Card className="h-[400px] flex flex-col shadow-sm dark:border-border/70 dark:bg-card">
            <CardHeader className="px-4 py-3 border-b shrink-0 flex flex-row items-center gap-2 dark:border-border/70">
                <CardTitle className="text-base font-semibold text-gray-800 dark:text-card-foreground">
                    Top Landing Pages (GA4)
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 min-h-0 overflow-auto">
                <table className="w-full caption-bottom text-xs text-left">
                    <thead className="bg-amber-50/50 sticky top-0 z-10 backdrop-blur-sm dark:bg-amber-950/20">
                        <tr className="border-b border-border dark:border-border/70">
                            <th className="h-8 px-4 text-left align-middle font-medium text-muted-foreground w-[40%]">Page URL</th>
                            <th className="h-8 px-4 text-left align-middle font-medium text-muted-foreground w-[20%]">Sessions</th>
                            <th className="h-8 px-4 text-left align-middle font-medium text-muted-foreground w-[20%]">Bounce Rate</th>
                            <th className="h-8 px-4 text-left align-middle font-medium text-muted-foreground w-[20%]">Avg. Time</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0 text-xs">
                        {landingPages.map((page, i) => (
                            <tr key={i} className="border-b border-border transition-colors hover:bg-muted/30 dark:border-border/60 dark:hover:bg-muted/20">
                                <td className="p-2 px-4 align-middle font-medium text-amber-600 truncate max-w-[200px] dark:text-amber-500">
                                    {page.url}
                                </td>
                                <td className="p-2 px-4 align-middle text-gray-700 dark:text-foreground/80">{formatCompactNumber(page.sessions)}</td>
                                <td className="p-2 px-4 align-middle text-gray-700 dark:text-foreground/80">{page.bounceRate}%</td>
                                <td className="p-2 px-4 align-middle text-gray-700 dark:text-foreground/80">{page.avgTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCompactNumber } from '@/lib/formatters';

const gscPages = [
    { url: '/how-to-tie-a-tie', clicks: 15400, impressions: 154000, ctr: 10.0, position: 2.4 },
    { url: '/best-running-shoes', clicks: 12300, impressions: 98000, ctr: 12.5, position: 1.8 },
    { url: '/home', clicks: 8900, impressions: 45000, ctr: 19.7, position: 1.1 },
    { url: '/what-is-seo', clicks: 6500, impressions: 120000, ctr: 5.4, position: 8.5 },
    { url: '/contact-support', clicks: 3200, impressions: 15000, ctr: 21.3, position: 1.5 },
];

export function GscTopPages() {
    return (
        <Card className="h-[400px] flex flex-col shadow-sm dark:border-border/70 dark:bg-card">
            <CardHeader className="px-4 py-3 border-b shrink-0 flex flex-row items-center gap-2 dark:border-border/70">
                <CardTitle className="text-base font-semibold text-gray-800 dark:text-card-foreground">
                    Top Pages (GSC)
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 min-h-0 overflow-auto">
                <table className="w-full caption-bottom text-xs text-left">
                    <thead className="bg-indigo-50/50 sticky top-0 z-10 backdrop-blur-sm dark:bg-indigo-950/20">
                        <tr className="border-b border-border dark:border-border/70">
                            <th className="h-8 px-4 text-left align-middle font-medium text-muted-foreground w-[35%]">URL</th>
                            <th className="h-8 px-4 text-left align-middle font-medium text-muted-foreground w-[15%]">Clicks</th>
                            <th className="h-8 px-4 text-left align-middle font-medium text-muted-foreground w-[20%]">Impressions</th>
                            <th className="h-8 px-4 text-left align-middle font-medium text-muted-foreground w-[15%]">CTR</th>
                            <th className="h-8 px-4 text-left align-middle font-medium text-muted-foreground w-[15%]">Position</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0 text-xs">
                        {gscPages.map((page, i) => (
                            <tr key={i} className="border-b border-border transition-colors hover:bg-muted/30 dark:border-border/60 dark:hover:bg-muted/20">
                                <td className="p-2 px-4 align-middle font-medium text-indigo-600 truncate max-w-[150px] dark:text-indigo-400">
                                    {page.url}
                                </td>
                                <td className="p-2 px-4 align-middle text-gray-700 dark:text-foreground/80">{formatCompactNumber(page.clicks)}</td>
                                <td className="p-2 px-4 align-middle text-gray-700 dark:text-foreground/80">{formatCompactNumber(page.impressions)}</td>
                                <td className="p-2 px-4 align-middle text-gray-700 dark:text-foreground/80">{page.ctr}%</td>
                                <td className="p-2 px-4 align-middle text-indigo-700 dark:text-indigo-300 font-medium">{page.position}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}

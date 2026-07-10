import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SeoPremiumCards } from '../components/seo-premium-cards';
import { SeoSummaryCards } from '../components/seo-summary-cards';
import { TrafficByLocation } from '../components/traffic-by-location';
import { SeoPerformanceChart } from '../components/seo-performance-chart';
import { useSeoSummary } from '../hooks';
import { SeoMetricSummary } from '../types';
import { OrganicKeywordsByIntent } from '../components/organic-keywords-by-intent';
import { AdsConnectionStatus } from '../components/ads-connection-status';
import { SeoAnchorText } from '../components/seo-anchor-text';
import { TopOrganicKeywords } from '../components/top-organic-keywords';
import { SeoOffPageMetrics } from '../components/seo-offpage-metrics';
import { Ga4DeviceBreakdown } from '../components/ga4-device-breakdown';
import { Ga4TopLandingPages } from '../components/ga4-top-landing-pages';
import { GscTopPages } from '../components/gsc-top-pages';
import { GscDevicePerformance } from '../components/gsc-device-performance';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info, RefreshCw, Activity, BarChart2, Search, Link as LinkIcon, Unlink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { integrationService } from '@/services/integration-service';
import { toast } from 'sonner';
import { useTranslation } from '@/i18n/use-translation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'wouter';
import { useIntegrationStatus } from '@/hooks/useIntegrationStatus';

// =============================================================================
// Info Tooltip Component
// =============================================================================

function InfoTooltip({ content }: { content: string }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Info className="h-4 w-4" />
                    </button>
                </TooltipTrigger>
                <TooltipContent
                    side="top"
                    className="max-w-xs text-sm leading-relaxed"
                >
                    {content}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export function SeoPage() {
    const { t } = useTranslation('seo');
    const { data, isLoading, refetch } = useSeoSummary();
    const [isSyncing, setIsSyncing] = useState(false);
    const { status } = useIntegrationStatus();
    const [, setLocation] = useLocation();

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            // Sync GA4
            try {
                await integrationService.syncGoogleAnalytics();
                toast.success(t('page.toasts.syncGaSuccess'));
            } catch (error) {
                toast.error(t('page.toasts.syncGaFailed'));
            }

            // Sync GSC
            try {
                await integrationService.syncGoogleSearchConsole(30);
                toast.success(t('page.toasts.syncGscSuccess'));
            } catch (error) {
                toast.error(t('page.toasts.syncGscFailed'));
            }

            await refetch();
        } finally {
            setIsSyncing(false);
        }
    };

    // Default fallback data if API fails or is loading (to prevent crash)
    const displayData: SeoMetricSummary = data || {
        organicSessions: 0,
        organicSessionsTrend: 0,
        goalCompletions: null,
        avgPosition: null,
        avgTimeOnPage: 0,
        avgTimeOnPageTrend: 0,
        bounceRate: 0,
        ur: null,
        dr: null,
        backlinks: null,
        referringDomains: null,
        keywords: null,
        trafficCost: null,
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 p-4 sm:p-6 md:p-8">
                {/* Page Header */}
                <div data-tutorial="seo-header">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl mb-2">
                        {t('page.title')}
                    </h1>
                    <div className="flex items-center gap-3 mb-3">
                        <AdsConnectionStatus />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSync}
                            disabled={isSyncing}
                            className="flex items-center gap-2"
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`}
                            />
                            {isSyncing
                                ? t('page.syncing')
                                : t('page.refreshData')}
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground sm:text-base">
                        {t('page.subtitle')}
                    </p>
                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <div className="w-full overflow-x-auto pb-2 -mb-2">
                        <TabsList className="inline-flex w-max min-w-full sm:w-auto h-11 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground">
                            <TabsTrigger value="overview" className="flex items-center gap-2 px-4 py-2">
                                <Activity className="h-4 w-4" />
                                <span>{t('page.sections.performanceSummary')}</span>
                            </TabsTrigger>
                            <TabsTrigger value="ga4" className="flex items-center gap-2 px-4 py-2 data-[state=active]:text-amber-600 data-[state=active]:bg-amber-100 dark:data-[state=active]:bg-amber-950/50">
                                <BarChart2 className="h-4 w-4" />
                                <span>Web Analytics (GA4)</span>
                            </TabsTrigger>
                            <TabsTrigger value="gsc" className="flex items-center gap-2 px-4 py-2 data-[state=active]:text-indigo-600 data-[state=active]:bg-indigo-100 dark:data-[state=active]:bg-indigo-950/50">
                                <Search className="h-4 w-4" />
                                <span>Search Performance (GSC)</span>
                            </TabsTrigger>
                            <TabsTrigger value="offpage" className="flex items-center gap-2 px-4 py-2 data-[state=active]:text-emerald-600 data-[state=active]:bg-emerald-100 dark:data-[state=active]:bg-emerald-950/50">
                                <LinkIcon className="h-4 w-4" />
                                <span>Off-Page & Authority</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Tab 1: Overview */}
                    <TabsContent value="overview" className="space-y-6 mt-0 border-none p-0 outline-none">
                        <section data-tutorial="seo-performance" className="space-y-3">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold">
                                    {t('page.sections.performanceSummary')}
                                </h2>
                                <InfoTooltip
                                    content={t('page.sections.performanceSummaryTooltip')}
                                />
                            </div>
                            <SeoSummaryCards data={displayData} isLoading={isLoading} />
                        </section>

                        <section data-tutorial="seo-performance-trends" className="space-y-3">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold">
                                    {t('page.sections.performanceTrends')}
                                </h2>
                                <InfoTooltip
                                    content={t('page.sections.performanceTrendsTooltip')}
                                />
                            </div>
                            <SeoPerformanceChart />
                        </section>
                    </TabsContent>

                    {/* Tab 2: GA4 */}
                    <TabsContent value="ga4" className="space-y-6 mt-0 border-none p-0 outline-none">
                        <section className="space-y-3">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-1.5 rounded-md bg-amber-100 text-amber-600 dark:bg-amber-950/50">
                                    <BarChart2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">Web Analytics</h2>
                                    <p className="text-sm text-muted-foreground">Powered by Google Analytics 4</p>
                                </div>
                            </div>
                            
                            {!status.googleAnalytics ? (
                                <div className="flex flex-col items-center justify-center p-8 py-16 border border-dashed rounded-lg bg-muted/30">
                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                        <Unlink className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">Google Analytics 4 Not Connected</h3>
                                    <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                                        Connect your GA4 account to unlock insights about your website traffic, user behavior, and top landing pages.
                                    </p>
                                    <Button onClick={() => setLocation('/data-sources')} className="bg-amber-600 hover:bg-amber-700 text-white">
                                        Connect GA4
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 auto-rows-max">
                                    {/* Top Landing Pages */}
                                    <div className="space-y-3 w-full md:col-span-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-base font-medium">Top Landing Pages</h3>
                                        </div>
                                        <div className="w-full">
                                            <Ga4TopLandingPages />
                                        </div>
                                    </div>
                                    
                                    {/* Traffic by Location */}
                                    <div className="space-y-3 w-full">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-base font-medium">
                                                {t('page.sections.trafficByLocation')}
                                            </h3>
                                            <InfoTooltip
                                                content={t('page.sections.trafficByLocationTooltip')}
                                            />
                                        </div>
                                        <div className="w-full">
                                            <TrafficByLocation isLoading={isLoading} />
                                        </div>
                                    </div>

                                    {/* Device Breakdown */}
                                    <div className="space-y-3 w-full">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-base font-medium">Device Breakdown</h3>
                                        </div>
                                        <div className="w-full">
                                            <Ga4DeviceBreakdown />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>
                    </TabsContent>

                    {/* Tab 3: GSC */}
                    <TabsContent value="gsc" className="space-y-6 mt-0 border-none p-0 outline-none">
                        <section className="space-y-3">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-1.5 rounded-md bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50">
                                    <Search className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">Search Performance</h2>
                                    <p className="text-sm text-muted-foreground">Powered by Google Search Console</p>
                                </div>
                            </div>
                            
                            {!status.googleSearchConsole ? (
                                <div className="flex flex-col items-center justify-center p-8 py-16 border border-dashed rounded-lg bg-muted/30">
                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                        <Unlink className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">Google Search Console Not Connected</h3>
                                    <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                                        Connect your Search Console account to view organic keywords, top pages on Google, and search device performance.
                                    </p>
                                    <Button onClick={() => setLocation('/data-sources')} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                        Connect Search Console
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 auto-rows-max">
                                    {/* Top Pages (GSC) */}
                                    <div className="space-y-3 w-full md:col-span-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-base font-medium">Top Pages</h3>
                                        </div>
                                        <div className="w-full">
                                            <GscTopPages />
                                        </div>
                                    </div>

                                    {/* Top Organic Keywords */}
                                    <div className="space-y-3 w-full">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-base font-medium">
                                                {t('page.sections.topOrganicKeywords')}
                                            </h3>
                                            <InfoTooltip
                                                content={t('page.sections.topOrganicKeywordsTooltip')}
                                            />
                                        </div>
                                        <div className="w-full">
                                            <TopOrganicKeywords />
                                        </div>
                                    </div>

                                    {/* Keywords by Intent */}
                                    <div className="space-y-3 w-full">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-base font-medium">
                                                {t('page.sections.keywordsByIntent')}
                                            </h3>
                                            <InfoTooltip
                                                content={t('page.sections.keywordsByIntentTooltip')}
                                            />
                                        </div>
                                        <div className="w-full">
                                            <OrganicKeywordsByIntent isLoading={isLoading} />
                                        </div>
                                    </div>
                                    
                                    {/* Device Performance */}
                                    <div className="space-y-3 w-full md:col-span-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-base font-medium">Search Device Performance</h3>
                                        </div>
                                        <div className="w-full">
                                            <GscDevicePerformance />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>
                    </TabsContent>

                    {/* Tab 4: Off-Page & Authority */}
                    <TabsContent value="offpage" className="space-y-6 mt-0 border-none p-0 outline-none">
                        <section data-tutorial="seo-offpage-metrics" className="space-y-6">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50">
                                    <LinkIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        {t('page.sections.offPageAuthority')}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">Authority & Backlink Profile</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <h3 className="text-base font-medium text-muted-foreground">
                                        {t('page.sections.authorityMetrics')}
                                    </h3>
                                    <SeoPremiumCards data={displayData} isLoading={isLoading} />
                                </div>

                                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                                    <div className="space-y-3 w-full">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-base font-medium text-muted-foreground">
                                                {t('page.sections.anchorTextAnalysis')}
                                            </h3>
                                            <InfoTooltip content={t('page.sections.anchorTextAnalysisTooltip')} />
                                        </div>
                                        <div className="w-full">
                                            <SeoAnchorText />
                                        </div>
                                    </div>

                                    <div className="space-y-3 w-full">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-base font-medium text-muted-foreground">
                                                {t('page.sections.backlinkProfile')}
                                            </h3>
                                        </div>
                                        <div className="w-full">
                                            <SeoOffPageMetrics />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}

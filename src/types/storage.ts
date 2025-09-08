export interface ProxyItem {
    id: string;
    path: string;
    target: string;
    original: string;
    isExplicitPath: boolean;
}
export interface ServiceItem {
    id: string;
    name: string;
    port: number;
    createdAt: Date;
    updatedAt: Date;
    proxies?: ProxyItem[];
    viteConfig?: string
    dir?: string
    dist?: string
}
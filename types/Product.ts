export interface ProductType {
    glb: string;
    usdz: string;
    isActive: boolean;
    name: string;
    placement: string;
    resize: boolean;
    modelId: string | null;
    manufacturerId: string | null;
    pdpUrl: string;
    hdri: string | null;
    exposure: number | null;
    bloom: boolean | null;
    viewerOptions: Object;
}
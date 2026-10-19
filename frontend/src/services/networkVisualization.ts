import { api } from "./api";

import type {
  NetworkVisualizationData,
  VisualizationAccessPoint,
  VisualizationClient,
  VisualizationRadio,
  VisualizationSite,
} from "../types/networkVisualization";

interface ApiResponse<T> {
  data?: T[];
}

export async function getNetworkVisualizationData(): Promise<NetworkVisualizationData> {
  const [
    sitesResponse,
    accessPointsResponse,
    radiosResponse,
    clientsResponse,
  ] = await Promise.all([
    api.getSites() as Promise<ApiResponse<VisualizationSite>>,
    api.getAccessPoints() as Promise<
      ApiResponse<VisualizationAccessPoint>
    >,
    api.getRadios() as Promise<
      ApiResponse<VisualizationRadio>
    >,
    api.getClients() as Promise<
      ApiResponse<VisualizationClient>
    >,
  ]);

  return {
    sites: sitesResponse.data ?? [],
    accessPoints: accessPointsResponse.data ?? [],
    radios: radiosResponse.data ?? [],
    clients: clientsResponse.data ?? [],
  };
}
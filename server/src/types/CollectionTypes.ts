export interface Collection {
  data: CollectionData;
}

export interface CollectionList {
  success: boolean;
  data: CollectionData[];
  query_time: number;
}

export interface CollectionData {
  collection_name: string;
  data: CollectionInfo;
}

export interface CollectionInfo {
  img?: string;
  url?: string;
  name: string;
  description?: string;
}

// Original file: ../../vendor/zoekt/grpc/protos/zoekt/webserver/v1/webserver.proto

import type { 搜索Response as _zoekt_webserver_v1_搜索Response, 搜索Response__Output as _zoekt_webserver_v1_搜索Response__Output } from '../../../zoekt/webserver/v1/搜索Response';

export interface Stream搜索Response {
  'response_chunk'?: (_zoekt_webserver_v1_搜索Response | null);
}

export interface Stream搜索Response__Output {
  'response_chunk': (_zoekt_webserver_v1_搜索Response__Output | null);
}

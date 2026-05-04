// Original file: ../../vendor/zoekt/grpc/protos/zoekt/webserver/v1/webserver.proto

import type { Q as _zoekt_webserver_v1_Q, Q__Output as _zoekt_webserver_v1_Q__Output } from '../../../zoekt/webserver/v1/Q';
import type { 搜索Options as _zoekt_webserver_v1_搜索Options, 搜索Options__Output as _zoekt_webserver_v1_搜索Options__Output } from '../../../zoekt/webserver/v1/搜索Options';

export interface 搜索Request {
  'query'?: (_zoekt_webserver_v1_Q | null);
  'opts'?: (_zoekt_webserver_v1_搜索Options | null);
}

export interface 搜索Request__Output {
  'query': (_zoekt_webserver_v1_Q__Output | null);
  'opts': (_zoekt_webserver_v1_搜索Options__Output | null);
}

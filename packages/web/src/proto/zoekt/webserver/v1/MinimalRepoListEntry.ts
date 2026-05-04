// Original file: ../../vendor/zoekt/grpc/protos/zoekt/webserver/v1/webserver.proto

import type { 仓库Branch as _zoekt_webserver_v1_仓库Branch, 仓库Branch__Output as _zoekt_webserver_v1_仓库Branch__Output } from '../../../zoekt/webserver/v1/仓库Branch';
import type { Long } from '@grpc/proto-loader';

export interface MinimalRepoListEntry {
  'has_symbols'?: (boolean);
  'branches'?: (_zoekt_webserver_v1_仓库Branch)[];
  'index_time_unix'?: (number | string | Long);
}

export interface MinimalRepoListEntry__Output {
  'has_symbols': (boolean);
  'branches': (_zoekt_webserver_v1_仓库Branch__Output)[];
  'index_time_unix': (number);
}

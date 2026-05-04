// Original file: ../../vendor/zoekt/grpc/protos/zoekt/webserver/v1/webserver.proto

import type { 仓库 as _zoekt_webserver_v1_仓库, 仓库__Output as _zoekt_webserver_v1_仓库__Output } from '../../../zoekt/webserver/v1/仓库';
import type { IndexMetadata as _zoekt_webserver_v1_IndexMetadata, IndexMetadata__Output as _zoekt_webserver_v1_IndexMetadata__Output } from '../../../zoekt/webserver/v1/IndexMetadata';
import type { RepoStats as _zoekt_webserver_v1_RepoStats, RepoStats__Output as _zoekt_webserver_v1_RepoStats__Output } from '../../../zoekt/webserver/v1/RepoStats';

export interface RepoListEntry {
  'repository'?: (_zoekt_webserver_v1_仓库 | null);
  'index_metadata'?: (_zoekt_webserver_v1_IndexMetadata | null);
  'stats'?: (_zoekt_webserver_v1_RepoStats | null);
}

export interface RepoListEntry__Output {
  'repository': (_zoekt_webserver_v1_仓库__Output | null);
  'index_metadata': (_zoekt_webserver_v1_IndexMetadata__Output | null);
  'stats': (_zoekt_webserver_v1_RepoStats__Output | null);
}

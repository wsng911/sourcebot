import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from './google/protobuf/Duration';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from './google/protobuf/Timestamp';
import type { And as _zoekt_webserver_v1_And, And__Output as _zoekt_webserver_v1_And__Output } from './zoekt/webserver/v1/And';
import type { Boost as _zoekt_webserver_v1_Boost, Boost__Output as _zoekt_webserver_v1_Boost__Output } from './zoekt/webserver/v1/Boost';
import type { Branch as _zoekt_webserver_v1_Branch, Branch__Output as _zoekt_webserver_v1_Branch__Output } from './zoekt/webserver/v1/Branch';
import type { BranchRepos as _zoekt_webserver_v1_BranchRepos, BranchRepos__Output as _zoekt_webserver_v1_BranchRepos__Output } from './zoekt/webserver/v1/BranchRepos';
import type { BranchesRepos as _zoekt_webserver_v1_BranchesRepos, BranchesRepos__Output as _zoekt_webserver_v1_BranchesRepos__Output } from './zoekt/webserver/v1/BranchesRepos';
import type { ChunkMatch as _zoekt_webserver_v1_ChunkMatch, ChunkMatch__Output as _zoekt_webserver_v1_ChunkMatch__Output } from './zoekt/webserver/v1/ChunkMatch';
import type { FileMatch as _zoekt_webserver_v1_FileMatch, FileMatch__Output as _zoekt_webserver_v1_FileMatch__Output } from './zoekt/webserver/v1/FileMatch';
import type { File名称Set as _zoekt_webserver_v1_File名称Set, File名称Set__Output as _zoekt_webserver_v1_File名称Set__Output } from './zoekt/webserver/v1/File名称Set';
import type { IndexMetadata as _zoekt_webserver_v1_IndexMetadata, IndexMetadata__Output as _zoekt_webserver_v1_IndexMetadata__Output } from './zoekt/webserver/v1/IndexMetadata';
import type { Language as _zoekt_webserver_v1_Language, Language__Output as _zoekt_webserver_v1_Language__Output } from './zoekt/webserver/v1/Language';
import type { LineFragmentMatch as _zoekt_webserver_v1_LineFragmentMatch, LineFragmentMatch__Output as _zoekt_webserver_v1_LineFragmentMatch__Output } from './zoekt/webserver/v1/LineFragmentMatch';
import type { LineMatch as _zoekt_webserver_v1_LineMatch, LineMatch__Output as _zoekt_webserver_v1_LineMatch__Output } from './zoekt/webserver/v1/LineMatch';
import type { ListOptions as _zoekt_webserver_v1_ListOptions, ListOptions__Output as _zoekt_webserver_v1_ListOptions__Output } from './zoekt/webserver/v1/ListOptions';
import type { ListRequest as _zoekt_webserver_v1_ListRequest, ListRequest__Output as _zoekt_webserver_v1_ListRequest__Output } from './zoekt/webserver/v1/ListRequest';
import type { ListResponse as _zoekt_webserver_v1_ListResponse, ListResponse__Output as _zoekt_webserver_v1_ListResponse__Output } from './zoekt/webserver/v1/ListResponse';
import type { Location as _zoekt_webserver_v1_Location, Location__Output as _zoekt_webserver_v1_Location__Output } from './zoekt/webserver/v1/Location';
import type { Meta as _zoekt_webserver_v1_Meta, Meta__Output as _zoekt_webserver_v1_Meta__Output } from './zoekt/webserver/v1/Meta';
import type { MinimalRepoListEntry as _zoekt_webserver_v1_MinimalRepoListEntry, MinimalRepoListEntry__Output as _zoekt_webserver_v1_MinimalRepoListEntry__Output } from './zoekt/webserver/v1/MinimalRepoListEntry';
import type { Not as _zoekt_webserver_v1_Not, Not__Output as _zoekt_webserver_v1_Not__Output } from './zoekt/webserver/v1/Not';
import type { Or as _zoekt_webserver_v1_Or, Or__Output as _zoekt_webserver_v1_Or__Output } from './zoekt/webserver/v1/Or';
import type { Progress as _zoekt_webserver_v1_Progress, Progress__Output as _zoekt_webserver_v1_Progress__Output } from './zoekt/webserver/v1/Progress';
import type { Q as _zoekt_webserver_v1_Q, Q__Output as _zoekt_webserver_v1_Q__Output } from './zoekt/webserver/v1/Q';
import type { Range as _zoekt_webserver_v1_Range, Range__Output as _zoekt_webserver_v1_Range__Output } from './zoekt/webserver/v1/Range';
import type { RawConfig as _zoekt_webserver_v1_RawConfig, RawConfig__Output as _zoekt_webserver_v1_RawConfig__Output } from './zoekt/webserver/v1/RawConfig';
import type { Regexp as _zoekt_webserver_v1_Regexp, Regexp__Output as _zoekt_webserver_v1_Regexp__Output } from './zoekt/webserver/v1/Regexp';
import type { Repo as _zoekt_webserver_v1_Repo, Repo__Output as _zoekt_webserver_v1_Repo__Output } from './zoekt/webserver/v1/Repo';
import type { RepoIds as _zoekt_webserver_v1_RepoIds, RepoIds__Output as _zoekt_webserver_v1_RepoIds__Output } from './zoekt/webserver/v1/RepoIds';
import type { RepoListEntry as _zoekt_webserver_v1_RepoListEntry, RepoListEntry__Output as _zoekt_webserver_v1_RepoListEntry__Output } from './zoekt/webserver/v1/RepoListEntry';
import type { RepoRegexp as _zoekt_webserver_v1_RepoRegexp, RepoRegexp__Output as _zoekt_webserver_v1_RepoRegexp__Output } from './zoekt/webserver/v1/RepoRegexp';
import type { RepoSet as _zoekt_webserver_v1_RepoSet, RepoSet__Output as _zoekt_webserver_v1_RepoSet__Output } from './zoekt/webserver/v1/RepoSet';
import type { RepoStats as _zoekt_webserver_v1_RepoStats, RepoStats__Output as _zoekt_webserver_v1_RepoStats__Output } from './zoekt/webserver/v1/RepoStats';
import type { 仓库 as _zoekt_webserver_v1_仓库, 仓库__Output as _zoekt_webserver_v1_仓库__Output } from './zoekt/webserver/v1/仓库';
import type { 仓库Branch as _zoekt_webserver_v1_仓库Branch, 仓库Branch__Output as _zoekt_webserver_v1_仓库Branch__Output } from './zoekt/webserver/v1/仓库Branch';
import type { 搜索Options as _zoekt_webserver_v1_搜索Options, 搜索Options__Output as _zoekt_webserver_v1_搜索Options__Output } from './zoekt/webserver/v1/搜索Options';
import type { 搜索Request as _zoekt_webserver_v1_搜索Request, 搜索Request__Output as _zoekt_webserver_v1_搜索Request__Output } from './zoekt/webserver/v1/搜索Request';
import type { 搜索Response as _zoekt_webserver_v1_搜索Response, 搜索Response__Output as _zoekt_webserver_v1_搜索Response__Output } from './zoekt/webserver/v1/搜索Response';
import type { Stats as _zoekt_webserver_v1_Stats, Stats__Output as _zoekt_webserver_v1_Stats__Output } from './zoekt/webserver/v1/Stats';
import type { Stream搜索Request as _zoekt_webserver_v1_Stream搜索Request, Stream搜索Request__Output as _zoekt_webserver_v1_Stream搜索Request__Output } from './zoekt/webserver/v1/Stream搜索Request';
import type { Stream搜索Response as _zoekt_webserver_v1_Stream搜索Response, Stream搜索Response__Output as _zoekt_webserver_v1_Stream搜索Response__Output } from './zoekt/webserver/v1/Stream搜索Response';
import type { Substring as _zoekt_webserver_v1_Substring, Substring__Output as _zoekt_webserver_v1_Substring__Output } from './zoekt/webserver/v1/Substring';
import type { Symbol as _zoekt_webserver_v1_Symbol, Symbol__Output as _zoekt_webserver_v1_Symbol__Output } from './zoekt/webserver/v1/Symbol';
import type { SymbolInfo as _zoekt_webserver_v1_SymbolInfo, SymbolInfo__Output as _zoekt_webserver_v1_SymbolInfo__Output } from './zoekt/webserver/v1/SymbolInfo';
import type { Type as _zoekt_webserver_v1_Type, Type__Output as _zoekt_webserver_v1_Type__Output } from './zoekt/webserver/v1/Type';
import type { WebserverServiceClient as _zoekt_webserver_v1_WebserverServiceClient, WebserverServiceDefinition as _zoekt_webserver_v1_WebserverServiceDefinition } from './zoekt/webserver/v1/WebserverService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      Duration: MessageTypeDefinition<_google_protobuf_Duration, _google_protobuf_Duration__Output>
      Timestamp: MessageTypeDefinition<_google_protobuf_Timestamp, _google_protobuf_Timestamp__Output>
    }
  }
  zoekt: {
    webserver: {
      v1: {
        And: MessageTypeDefinition<_zoekt_webserver_v1_And, _zoekt_webserver_v1_And__Output>
        Boost: MessageTypeDefinition<_zoekt_webserver_v1_Boost, _zoekt_webserver_v1_Boost__Output>
        Branch: MessageTypeDefinition<_zoekt_webserver_v1_Branch, _zoekt_webserver_v1_Branch__Output>
        BranchRepos: MessageTypeDefinition<_zoekt_webserver_v1_BranchRepos, _zoekt_webserver_v1_BranchRepos__Output>
        BranchesRepos: MessageTypeDefinition<_zoekt_webserver_v1_BranchesRepos, _zoekt_webserver_v1_BranchesRepos__Output>
        ChunkMatch: MessageTypeDefinition<_zoekt_webserver_v1_ChunkMatch, _zoekt_webserver_v1_ChunkMatch__Output>
        FileMatch: MessageTypeDefinition<_zoekt_webserver_v1_FileMatch, _zoekt_webserver_v1_FileMatch__Output>
        File名称Set: MessageTypeDefinition<_zoekt_webserver_v1_File名称Set, _zoekt_webserver_v1_File名称Set__Output>
        FlushReason: EnumTypeDefinition
        IndexMetadata: MessageTypeDefinition<_zoekt_webserver_v1_IndexMetadata, _zoekt_webserver_v1_IndexMetadata__Output>
        Language: MessageTypeDefinition<_zoekt_webserver_v1_Language, _zoekt_webserver_v1_Language__Output>
        LineFragmentMatch: MessageTypeDefinition<_zoekt_webserver_v1_LineFragmentMatch, _zoekt_webserver_v1_LineFragmentMatch__Output>
        LineMatch: MessageTypeDefinition<_zoekt_webserver_v1_LineMatch, _zoekt_webserver_v1_LineMatch__Output>
        ListOptions: MessageTypeDefinition<_zoekt_webserver_v1_ListOptions, _zoekt_webserver_v1_ListOptions__Output>
        ListRequest: MessageTypeDefinition<_zoekt_webserver_v1_ListRequest, _zoekt_webserver_v1_ListRequest__Output>
        ListResponse: MessageTypeDefinition<_zoekt_webserver_v1_ListResponse, _zoekt_webserver_v1_ListResponse__Output>
        Location: MessageTypeDefinition<_zoekt_webserver_v1_Location, _zoekt_webserver_v1_Location__Output>
        Meta: MessageTypeDefinition<_zoekt_webserver_v1_Meta, _zoekt_webserver_v1_Meta__Output>
        MinimalRepoListEntry: MessageTypeDefinition<_zoekt_webserver_v1_MinimalRepoListEntry, _zoekt_webserver_v1_MinimalRepoListEntry__Output>
        Not: MessageTypeDefinition<_zoekt_webserver_v1_Not, _zoekt_webserver_v1_Not__Output>
        Or: MessageTypeDefinition<_zoekt_webserver_v1_Or, _zoekt_webserver_v1_Or__Output>
        Progress: MessageTypeDefinition<_zoekt_webserver_v1_Progress, _zoekt_webserver_v1_Progress__Output>
        Q: MessageTypeDefinition<_zoekt_webserver_v1_Q, _zoekt_webserver_v1_Q__Output>
        Range: MessageTypeDefinition<_zoekt_webserver_v1_Range, _zoekt_webserver_v1_Range__Output>
        RawConfig: MessageTypeDefinition<_zoekt_webserver_v1_RawConfig, _zoekt_webserver_v1_RawConfig__Output>
        Regexp: MessageTypeDefinition<_zoekt_webserver_v1_Regexp, _zoekt_webserver_v1_Regexp__Output>
        Repo: MessageTypeDefinition<_zoekt_webserver_v1_Repo, _zoekt_webserver_v1_Repo__Output>
        RepoIds: MessageTypeDefinition<_zoekt_webserver_v1_RepoIds, _zoekt_webserver_v1_RepoIds__Output>
        RepoListEntry: MessageTypeDefinition<_zoekt_webserver_v1_RepoListEntry, _zoekt_webserver_v1_RepoListEntry__Output>
        RepoRegexp: MessageTypeDefinition<_zoekt_webserver_v1_RepoRegexp, _zoekt_webserver_v1_RepoRegexp__Output>
        RepoSet: MessageTypeDefinition<_zoekt_webserver_v1_RepoSet, _zoekt_webserver_v1_RepoSet__Output>
        RepoStats: MessageTypeDefinition<_zoekt_webserver_v1_RepoStats, _zoekt_webserver_v1_RepoStats__Output>
        仓库: MessageTypeDefinition<_zoekt_webserver_v1_仓库, _zoekt_webserver_v1_仓库__Output>
        仓库Branch: MessageTypeDefinition<_zoekt_webserver_v1_仓库Branch, _zoekt_webserver_v1_仓库Branch__Output>
        搜索Options: MessageTypeDefinition<_zoekt_webserver_v1_搜索Options, _zoekt_webserver_v1_搜索Options__Output>
        搜索Request: MessageTypeDefinition<_zoekt_webserver_v1_搜索Request, _zoekt_webserver_v1_搜索Request__Output>
        搜索Response: MessageTypeDefinition<_zoekt_webserver_v1_搜索Response, _zoekt_webserver_v1_搜索Response__Output>
        Stats: MessageTypeDefinition<_zoekt_webserver_v1_Stats, _zoekt_webserver_v1_Stats__Output>
        Stream搜索Request: MessageTypeDefinition<_zoekt_webserver_v1_Stream搜索Request, _zoekt_webserver_v1_Stream搜索Request__Output>
        Stream搜索Response: MessageTypeDefinition<_zoekt_webserver_v1_Stream搜索Response, _zoekt_webserver_v1_Stream搜索Response__Output>
        Substring: MessageTypeDefinition<_zoekt_webserver_v1_Substring, _zoekt_webserver_v1_Substring__Output>
        Symbol: MessageTypeDefinition<_zoekt_webserver_v1_Symbol, _zoekt_webserver_v1_Symbol__Output>
        SymbolInfo: MessageTypeDefinition<_zoekt_webserver_v1_SymbolInfo, _zoekt_webserver_v1_SymbolInfo__Output>
        Type: MessageTypeDefinition<_zoekt_webserver_v1_Type, _zoekt_webserver_v1_Type__Output>
        WebserverService: SubtypeConstructor<typeof grpc.Client, _zoekt_webserver_v1_WebserverServiceClient> & { service: _zoekt_webserver_v1_WebserverServiceDefinition }
      }
    }
  }
}


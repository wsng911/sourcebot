// Original file: ../../vendor/zoekt/grpc/protos/zoekt/webserver/v1/webserver.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ListRequest as _zoekt_webserver_v1_ListRequest, ListRequest__Output as _zoekt_webserver_v1_ListRequest__Output } from '../../../zoekt/webserver/v1/ListRequest';
import type { ListResponse as _zoekt_webserver_v1_ListResponse, ListResponse__Output as _zoekt_webserver_v1_ListResponse__Output } from '../../../zoekt/webserver/v1/ListResponse';
import type { 搜索Request as _zoekt_webserver_v1_搜索Request, 搜索Request__Output as _zoekt_webserver_v1_搜索Request__Output } from '../../../zoekt/webserver/v1/搜索Request';
import type { 搜索Response as _zoekt_webserver_v1_搜索Response, 搜索Response__Output as _zoekt_webserver_v1_搜索Response__Output } from '../../../zoekt/webserver/v1/搜索Response';
import type { Stream搜索Request as _zoekt_webserver_v1_Stream搜索Request, Stream搜索Request__Output as _zoekt_webserver_v1_Stream搜索Request__Output } from '../../../zoekt/webserver/v1/Stream搜索Request';
import type { Stream搜索Response as _zoekt_webserver_v1_Stream搜索Response, Stream搜索Response__Output as _zoekt_webserver_v1_Stream搜索Response__Output } from '../../../zoekt/webserver/v1/Stream搜索Response';

export interface WebserverServiceClient extends grpc.Client {
  /**
   * List lists repositories. The query `q` can only contain
   * query.Repo atoms.
   */
  List(argument: _zoekt_webserver_v1_ListRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_zoekt_webserver_v1_ListResponse__Output>): grpc.ClientUnaryCall;
  List(argument: _zoekt_webserver_v1_ListRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_zoekt_webserver_v1_ListResponse__Output>): grpc.ClientUnaryCall;
  List(argument: _zoekt_webserver_v1_ListRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_zoekt_webserver_v1_ListResponse__Output>): grpc.ClientUnaryCall;
  List(argument: _zoekt_webserver_v1_ListRequest, callback: grpc.requestCallback<_zoekt_webserver_v1_ListResponse__Output>): grpc.ClientUnaryCall;
  /**
   * List lists repositories. The query `q` can only contain
   * query.Repo atoms.
   */
  list(argument: _zoekt_webserver_v1_ListRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_zoekt_webserver_v1_ListResponse__Output>): grpc.ClientUnaryCall;
  list(argument: _zoekt_webserver_v1_ListRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_zoekt_webserver_v1_ListResponse__Output>): grpc.ClientUnaryCall;
  list(argument: _zoekt_webserver_v1_ListRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_zoekt_webserver_v1_ListResponse__Output>): grpc.ClientUnaryCall;
  list(argument: _zoekt_webserver_v1_ListRequest, callback: grpc.requestCallback<_zoekt_webserver_v1_ListResponse__Output>): grpc.ClientUnaryCall;
  
  搜索(argument: _zoekt_webserver_v1_搜索Request, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_zoekt_webserver_v1_搜索Response__Output>): grpc.ClientUnaryCall;
  搜索(argument: _zoekt_webserver_v1_搜索Request, metadata: grpc.Metadata, callback: grpc.requestCallback<_zoekt_webserver_v1_搜索Response__Output>): grpc.ClientUnaryCall;
  搜索(argument: _zoekt_webserver_v1_搜索Request, options: grpc.CallOptions, callback: grpc.requestCallback<_zoekt_webserver_v1_搜索Response__Output>): grpc.ClientUnaryCall;
  搜索(argument: _zoekt_webserver_v1_搜索Request, callback: grpc.requestCallback<_zoekt_webserver_v1_搜索Response__Output>): grpc.ClientUnaryCall;
  search(argument: _zoekt_webserver_v1_搜索Request, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_zoekt_webserver_v1_搜索Response__Output>): grpc.ClientUnaryCall;
  search(argument: _zoekt_webserver_v1_搜索Request, metadata: grpc.Metadata, callback: grpc.requestCallback<_zoekt_webserver_v1_搜索Response__Output>): grpc.ClientUnaryCall;
  search(argument: _zoekt_webserver_v1_搜索Request, options: grpc.CallOptions, callback: grpc.requestCallback<_zoekt_webserver_v1_搜索Response__Output>): grpc.ClientUnaryCall;
  search(argument: _zoekt_webserver_v1_搜索Request, callback: grpc.requestCallback<_zoekt_webserver_v1_搜索Response__Output>): grpc.ClientUnaryCall;
  
  Stream搜索(argument: _zoekt_webserver_v1_Stream搜索Request, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_zoekt_webserver_v1_Stream搜索Response__Output>;
  Stream搜索(argument: _zoekt_webserver_v1_Stream搜索Request, options?: grpc.CallOptions): grpc.ClientReadableStream<_zoekt_webserver_v1_Stream搜索Response__Output>;
  stream搜索(argument: _zoekt_webserver_v1_Stream搜索Request, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_zoekt_webserver_v1_Stream搜索Response__Output>;
  stream搜索(argument: _zoekt_webserver_v1_Stream搜索Request, options?: grpc.CallOptions): grpc.ClientReadableStream<_zoekt_webserver_v1_Stream搜索Response__Output>;
  
}

export interface WebserverServiceHandlers extends grpc.UntypedServiceImplementation {
  /**
   * List lists repositories. The query `q` can only contain
   * query.Repo atoms.
   */
  List: grpc.handleUnaryCall<_zoekt_webserver_v1_ListRequest__Output, _zoekt_webserver_v1_ListResponse>;
  
  搜索: grpc.handleUnaryCall<_zoekt_webserver_v1_搜索Request__Output, _zoekt_webserver_v1_搜索Response>;
  
  Stream搜索: grpc.handleServerStreamingCall<_zoekt_webserver_v1_Stream搜索Request__Output, _zoekt_webserver_v1_Stream搜索Response>;
  
}

export interface WebserverServiceDefinition extends grpc.ServiceDefinition {
  List: MethodDefinition<_zoekt_webserver_v1_ListRequest, _zoekt_webserver_v1_ListResponse, _zoekt_webserver_v1_ListRequest__Output, _zoekt_webserver_v1_ListResponse__Output>
  搜索: MethodDefinition<_zoekt_webserver_v1_搜索Request, _zoekt_webserver_v1_搜索Response, _zoekt_webserver_v1_搜索Request__Output, _zoekt_webserver_v1_搜索Response__Output>
  Stream搜索: MethodDefinition<_zoekt_webserver_v1_Stream搜索Request, _zoekt_webserver_v1_Stream搜索Response, _zoekt_webserver_v1_Stream搜索Request__Output, _zoekt_webserver_v1_Stream搜索Response__Output>
}

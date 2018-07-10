import {DataProxy} from 'apollo-cache';
import {
  ApolloError,
  ApolloQueryResult,
  FetchMoreQueryOptions,
  SubscribeToMoreOptions,
  UpdateQueryOptions,
  NetworkStatus,
} from 'apollo-client';

export type GraphQLResultLoading<Data, Variables = {}> = {
  loading: true;
  error: undefined;
} & GraphQLDataProps<Data, Variables> &
  {[Name in keyof Data]: null};

export type GraphQLResultLoadedFailure<Data, Variables = {}> = {
  loading: false;
  error: ApolloError;
} & GraphQLDataProps<Data, Variables> &
  {[Name in keyof Data]: null};

export type GraphQLResultLoadedSuccess<Data, Variables = {}> = {
  loading: false;
  error: undefined;
} & GraphQLDataProps<Data, Variables> &
  Data;

export type GraphQLResult<Data, Variables = {}> =
  | GraphQLResultLoading<Data, Variables>
  | GraphQLResultLoadedFailure<Data, Variables>
  | GraphQLResultLoadedSuccess<Data, Variables>;

export function dataHasErrors<Data, Variables>(
  data: GraphQLResult<Data, Variables>,
): data is GraphQLResultLoadedFailure<Data, Variables> {
  return Boolean(data.error);
}

export type GraphQLQuery<
  Data,
  Variables = {},
  QueryName extends string = 'data'
> = {[data in QueryName]: GraphQLResult<Data, Variables>};

export interface FetchMoreOptions<Data, Variables = {}> {
  updateQuery(
    previousQueryResult: Data,
    options: {
      fetchMoreResult: Data;
      queryVariables: Variables;
    },
  ): Data;
}

export interface GraphQLDataProps<Data, Variables = {}> {
  error?: ApolloError;
  networkStatus: NetworkStatus;
  variables: Variables;
  fetchMore(
    fetchMoreOptions: FetchMoreQueryOptions<Variables, any> &
      FetchMoreOptions<Data, Variables>,
  ): Promise<ApolloQueryResult<Data>>;
  refetch(variables?: Variables): Promise<ApolloQueryResult<Data>>;
  startPolling(pollInterval: number): void;
  stopPolling(): void;
  subscribeToMore(options: SubscribeToMoreOptions): () => void;
  updateQuery(
    mapFn: (
      previousQueryResult: any,
      options: UpdateQueryOptions<Variables>,
    ) => any,
  ): void;
}

export interface MutationData<Data, Variables = {}> {
  data: GraphQLResultLoadedSuccess<Data, Variables>;
}

export interface MutationOptions<Data, Variables = {}> {
  variables: Variables;
  optimisticResponse?: Data;
  update?(proxy: DataProxy, mutationData: MutationData<Data, Variables>): void;
}

export interface GraphQLMutationFunction<Data, Variables = {}> {
  (options?: MutationOptions<Data, Variables>): Promise<{data: Data}>;
}

export type GraphQLMutation<
  Data,
  Variables = {},
  MutationName extends string = 'mutate'
> = {[data in MutationName]: GraphQLMutationFunction<Data, Variables>};

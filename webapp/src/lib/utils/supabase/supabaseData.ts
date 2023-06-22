import {
  PostgrestBuilder,
  PostgrestFilterBuilder,
  PostgrestQueryBuilder,
} from "@supabase/postgrest-js";
import { PostgrestError, PostgrestSingleResponse } from "@supabase/supabase-js";
import {
  GenericTable,
  GenericView,
} from "@supabase/supabase-js/dist/module/lib/types";
import {
  QueryKey,
  UseInfiniteQueryResult,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from "react-query";

export async function awaitData<T>(query: PostgrestBuilder<T>) {
  const a = await query;
  return a;
}

export function useInfiniteGetData<T>(
  queryName: QueryKey,
  query: PostgrestFilterBuilder<any, any, T[]>,
  itemsPerPage: number = 10
): UseInfiniteQueryResult<PostgrestSingleResponse<T[]>, PostgrestError> {
  return useInfiniteQuery({
    queryKey: queryName,
    queryFn: async ({ pageParam = 0 }) => {
      const res = await query.range(
        pageParam * itemsPerPage,
        pageParam * itemsPerPage + itemsPerPage + 1
      );
      let hasMore = false;
      if (res.data?.length === itemsPerPage + 1) {
        hasMore = true;
        res.data?.pop();
      }
      return { data: res.data, hasMore };
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.hasMore) {
        return pages.length;
      } else {
        return undefined;
      }
    },
  });
}

export function useGetData<T>(
  queryName: QueryKey,
  query: PostgrestBuilder<T>,
  useQueryOptions?: UseQueryOptions<any, any, any, any>
): UseQueryResult<PostgrestSingleResponse<T>, PostgrestError> {
  return useQuery<PostgrestSingleResponse<T>, PostgrestError>(
    queryName,
    () => {
      return awaitData(query);
    },
    useQueryOptions
  );
}

export function useUpsertData<
  Relation extends GenericTable | GenericView,
  Row extends Relation extends { Insert: unknown } ? Relation["Insert"] : never
>(
  query: PostgrestQueryBuilder<any, Relation>,
  useMutationOptions?: UseMutationOptions<
    PostgrestSingleResponse<null>,
    PostgrestError,
    Row
  >
): UseMutationResult<PostgrestSingleResponse<null>, PostgrestError, Row> {
  return useMutation<PostgrestSingleResponse<null>, PostgrestError, Row>(
    (data) => {
      return awaitData(query.upsert(data));
    },
    useMutationOptions
  );
}
export function useInsertData<
  Relation extends GenericTable | GenericView,
  Row extends Relation extends { Insert: unknown } ? Relation["Insert"] : never
>(
  query: PostgrestQueryBuilder<any, Relation>,
  useMutationOptions?: UseMutationOptions<
    PostgrestSingleResponse<null>,
    PostgrestError,
    Row
  >
): UseMutationResult<PostgrestSingleResponse<null>, PostgrestError, Row> {
  return useMutation<PostgrestSingleResponse<null>, PostgrestError, Row>(
    (data) => {
      return awaitData(query.insert(data));
    },
    useMutationOptions
  );
}

export function useInsertSelectData<
  Relation extends GenericTable | GenericView,
  Row extends Relation extends { Insert: unknown } ? Relation["Insert"] : never,
  RRow extends Relation extends { Row: unknown } ? Relation["Row"] : never
>(
  query: PostgrestQueryBuilder<any, Relation>,
  useMutationOptions?: UseMutationOptions<
    PostgrestSingleResponse<RRow[]>,
    PostgrestError,
    Row
  >
): UseMutationResult<PostgrestSingleResponse<RRow[]>, PostgrestError, Row> {
  return useMutation<PostgrestSingleResponse<RRow[]>, PostgrestError, Row>(
    (data) => {
      return awaitData(query.insert(data).select());
    },
    useMutationOptions
  );
}

export function useDeleteData<
  Relation extends GenericTable | GenericView,
  Row extends Relation extends { Delete: unknown } ? Relation["Delete"] : never,
  ColumnName extends string & keyof Row
>(
  query: PostgrestQueryBuilder<any, Relation>,
  useMutationOptions?: UseMutationOptions<
    PostgrestSingleResponse<null>,
    PostgrestError,
    { field: ColumnName; value: any }
  >
): UseMutationResult<
  PostgrestSingleResponse<null>,
  PostgrestError,
  { field: ColumnName; value: any }
> {
  return useMutation<
    PostgrestSingleResponse<null>,
    PostgrestError,
    { field: ColumnName; value: any }
  >(({ field, value }) => {
    return awaitData(query.delete().eq(field, value));
  }, useMutationOptions);
}

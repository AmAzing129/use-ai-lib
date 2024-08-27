import { useQuery } from '@tanstack/react-query';
import { streamObject } from 'ai';
import type { StreamObjectResult } from 'ai';

// use some of options
type Options = {
  enabled?: boolean;
};

export function useStreamObject(params: any, options?: Options) {
  const query = useQuery<StreamObjectResult<any, any, any>>({
    queryKey: ['streamObject'],
    queryFn: () => streamObject(params),
    ...options,
  });

  return { ...query, object: query.data?.object };
}

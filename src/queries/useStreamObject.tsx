import { useQuery } from '@tanstack/react-query';
import { streamObject } from 'ai';
import type { JSONValue } from 'ai';

// use some of options
type Options = {
  enabled?: boolean;
  onSuccess?: (data: any) => void;
};

export function useStreamObject(params: any, options?: Options) {
  const query = useQuery<JSONValue>({
    queryKey: ['streamObject', JSON.stringify(params.messages)],
    // @ts-ignore
    queryFn: async () => {
      const { partialObjectStream, object } = await streamObject(params);
      for await (const partialObject of partialObjectStream) {
        options?.onSuccess?.(partialObject);
      }
      return object;
    },
    ...options,
  });

  return { ...query };
}

import { useQuery } from '@tanstack/react-query';
import { streamObject } from 'ai';
import type { JSONValue } from 'ai';
import { useEffect } from 'react';

// use some of options
type Options = {
  enabled?: boolean;
  onSuccess?: (data: any) => void;
};

export function useStreamObject(params: any, options?: Options) {
  useEffect(() => {}, []);

  const query = useQuery<JSONValue>({
    queryKey: [
      'streamObject',
      params.system,
      params.prompt,
      JSON.stringify(params.messages),
    ],
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

import { useQuery } from '@tanstack/react-query';
import { generateObject } from 'ai';
import type { GenerateObjectResult } from 'ai';

// use some of options
type Options = {
  enabled?: boolean;
};

export function useGenerateObject(params: any, options?: Options) {
  const query = useQuery<GenerateObjectResult<any>>({
    queryKey: [
      'generateObject',
      params.system,
      params.prompt,
      JSON.stringify(params.messages),
    ],
    queryFn: () => generateObject(params),
    ...options,
  });

  return { ...query, object: query.data?.object };
}

import { useQuery } from '@tanstack/react-query';
import { generateText } from 'ai';
import type { GenerateTextResult } from 'ai';

// use some of options
type Options = {
  enabled?: boolean;
};

export function useGenerateText(
  params: Parameters<typeof generateText>[0],
  options?: Options
) {
  const query = useQuery<GenerateTextResult<any>>({
    queryKey: ['generateText'],
    queryFn: async (t) => {
      console.log('t', t);
      return generateText(params);
    },
    ...options,
  });

  return { ...query, text: query.data?.text };
}

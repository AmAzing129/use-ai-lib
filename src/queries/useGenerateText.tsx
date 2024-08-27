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
    queryKey: [
      'generateText',
      params.system,
      params.prompt,
      JSON.stringify(params.messages),
    ],
    queryFn: async () => generateText(params),
    ...options,
  });

  return { ...query, text: query.data?.text };
}

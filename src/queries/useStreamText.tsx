import { useQuery } from '@tanstack/react-query';
import { streamText } from 'ai';
import type { StreamTextResult } from 'ai';

// use some of options
type Options = {
  enabled?: boolean;
};

export function useStreamText(
  params: Parameters<typeof streamText>[0],
  options?: Options
) {
  const query = useQuery<StreamTextResult<any>>({
    queryKey: ['generateText', params.prompt, JSON.stringify(params.messages)],
    queryFn: async () => streamText(params),
    ...options,
  });

  return { ...query, text: query.data?.text };
}

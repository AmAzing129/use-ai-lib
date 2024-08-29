import { useQuery } from "@tanstack/react-query";
import { streamText } from "ai";
import type { StreamTextResult } from "ai";

// use some of options
type Options = {
	enabled?: boolean;
	onSuccess?: (data: string) => void;
};

export function useStreamText(
	params: Parameters<typeof streamText>[0],
	options?: Options,
) {
	// biome-ignore lint/suspicious/noExplicitAny: TODO
	const query = useQuery<StreamTextResult<any>>({
		queryKey: ["generateText", params.prompt, JSON.stringify(params.messages)],
		queryFn: async () => {
			const data = await streamText(params);
			for await (const partialText of data.textStream) {
				options?.onSuccess?.(partialText);
			}
			return data;
		},
		...options,
	});

	return { ...query, text: query.data?.text, usage: query.data?.usage };
}

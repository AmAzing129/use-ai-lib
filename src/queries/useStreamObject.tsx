import type { DeepPartial } from "@ai-sdk/ui-utils";
import { useQuery } from "@tanstack/react-query";
import { streamObject } from "ai";
import type { LanguageModel } from "ai";
import type { ZodTypeDef, Schema as zSchema } from "zod";
import type { CallSettings, Prompt, TelemetrySettings } from "../types";

// use some of options
type Options<OBJECT> = {
	enabled?: boolean;
	onSuccess?: (data: DeepPartial<OBJECT> | OBJECT) => void;
};

// There are three overloads, use this one currently.
type StreamObjectParams<OBJECT> = Omit<CallSettings, "stopSequences"> &
	Prompt & {
		output?: "object" | undefined;
		/**
The language model to use.
 */
		model: LanguageModel;
		/**
The schema of the object that the model should generate.
*/
		// biome-ignore lint/suspicious/noExplicitAny: TODO
		schema: zSchema<OBJECT, ZodTypeDef, any>;
		/**
Optional name of the output that should be generated.
Used by some providers for additional LLM guidance, e.g.
via tool or schema name.
 */
		schemaName?: string;
		/**
Optional description of the output that should be generated.
Used by some providers for additional LLM guidance, e.g.
via tool or schema description.
*/
		schemaDescription?: string;
		/**
The mode to use for object generation.

The schema is converted in a JSON schema and used in one of the following ways

- 'auto': The provider will choose the best mode for the model.
- 'tool': A tool with the JSON schema as parameters is is provided and the provider is instructed to use it.
- 'json': The JSON schema and an instruction is injected into the prompt. If the provider supports JSON mode, it is enabled. If the provider supports JSON grammars, the grammar is used.

Please note that most providers do not support all modes.

Default and recommended: 'auto' (best mode for the model).
 */
		mode?: "auto" | "json" | "tool";
		/**
Optional telemetry configuration (experimental).
 */
		experimental_telemetry?: TelemetrySettings;
		/**
Callback that is called when the LLM response and the final object validation are finished.
 */
		// TODO
		// onFinish?: OnFinishCallback<OBJECT>;
	};

export function useStreamObject<OBJECT>(
	params: StreamObjectParams<OBJECT>,
	options?: Options<OBJECT>,
) {
	const query = useQuery<OBJECT>({
		queryKey: ["streamObject", JSON.stringify(params.messages)],
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

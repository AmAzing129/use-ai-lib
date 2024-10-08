import type { DeepPartial } from "@ai-sdk/ui-utils";
import type { LanguageModel } from "ai";
import { useEffect, useMemo } from "react";
import type { z } from "zod";
import { useModelContext } from "../provider";
import {
	useGenerateObject,
	useGenerateText,
	useStreamObject,
	useStreamText,
} from "../queries";
import type { Prompt } from "../types";

interface Options<OBJECT> extends Prompt {
	/**
	 * The schema of the object that the model should generate. Use 'zod' to declare.
	 */
	// biome-ignore lint/suspicious/noExplicitAny:
	schema?: z.Schema<OBJECT, z.ZodTypeDef, any>;
	/**
	 * Streams the output or not.
	 */
	stream?: boolean;
	/**
	 * Do something when AI data is generated.
	 * Use this callback to get the data during streaming rather than through the final 'data'.
	 */
	onSuccess?: (
		data: OBJECT extends string ? string : DeepPartial<OBJECT> | OBJECT,
	) => void;
}

interface UseAIModel<D> {
	data: D;
	regenerate: unknown;
	isGenerating: boolean;
	isError: boolean;
	error: Error | null;
}

export function useAIModel<D>(options: Options<D>): UseAIModel<D>;
export function useAIModel<D>(
	aiModel: LanguageModel,
	options: Options<D>,
): UseAIModel<D>;
export function useAIModel<D = string>(
	aiModel: unknown,
	modelOptions?: Options<D>,
) {
	const { model: contextModel } = useModelContext();

	if (!(aiModel as LanguageModel).modelId && !contextModel) {
		throw new Error("Model is required");
	}

	const model = (aiModel as LanguageModel).modelId
		? (aiModel as LanguageModel)
		: contextModel;

	const options = (aiModel as LanguageModel).modelId
		? modelOptions
		: (aiModel as Options<D>);

	const { schema, onSuccess, stream, ...prompt } = options;

	// Empty input is not allowed to pass to the moedel, or it will throw an error
	const emptyInput =
		!prompt ||
		(!prompt.prompt && !prompt.messages) ||
		(prompt.prompt && prompt.prompt.length === 0) ||
		(prompt.messages && prompt.messages.length === 0);

	const {
		text,
		refetch: fetchText,
		isFetching: isTextFetching,
		isError: isTextError,
		error: textError,
	} = useGenerateText(
		{
			model,
			...prompt,
		},
		{
			enabled: !stream && !schema && !emptyInput,
		},
	);

	const {
		refetch: fetchStreamText,
		isFetching: isStreamTextFetching,
		isError: isStreamTextError,
		error: streamTextError,
	} = useStreamText(
		{
			model,
			...prompt,
		},
		{
			onSuccess: onSuccess as (data: string) => void,
			enabled: !!stream && !schema && !emptyInput,
		},
	);

	const {
		object,
		refetch: fetchObject,
		isFetching: isObjectFetching,
		isError: isObjectError,
		error: objectError,
	} = useGenerateObject<z.infer<typeof schema>>(
		{
			model,
			// biome-ignore lint/style/noNonNullAssertion:
			schema: schema!,
			...prompt,
		},
		{
			enabled: !stream && !!schema && !emptyInput,
		},
	);

	const {
		refetch: fetchStreamObject,
		isFetching: isStreamObjectFetching,
		isError: isStreamObjectError,
		error: streamObjectError,
	} = useStreamObject<z.infer<typeof schema>>(
		{
			model,
			// biome-ignore lint/style/noNonNullAssertion:
			schema: schema!,
			...prompt,
		},
		{
			onSuccess: onSuccess as (data: DeepPartial<D> | D) => void,
			enabled: !!stream && !!schema && !emptyInput,
		},
	);

	// TODO: figure out a great way to resolve stream data
	const data = useMemo(() => text ?? object, [text, object]);

	// biome-ignore lint: onSuccess usually won't change
	useEffect(() => {
		if (!data) return;
		(onSuccess as (data: string | D) => void)?.(data);
	}, [data]);

	return {
		data,
		regenerate:
			fetchText || fetchStreamText || fetchObject || fetchStreamObject,
		isGenerating:
			isTextFetching ||
			isStreamTextFetching ||
			isObjectFetching ||
			isStreamObjectFetching,
		isError:
			isTextError || isStreamTextError || isObjectError || isStreamObjectError,
		error: textError || streamTextError || objectError || streamObjectError,
	};
}

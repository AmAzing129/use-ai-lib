import type { DeepPartial, Schema } from "@ai-sdk/ui-utils";
import type { LanguageModel } from "ai";
import { useEffect, useMemo } from "react";
import type { ZodTypeDef, Schema as zSchema } from "zod";
import { useModelContext } from "./provider";
import {
	useGenerateObject,
	useGenerateText,
	useStreamObject,
	useStreamText,
} from "./queries";
import type { Prompt } from "./types";

interface Options<Data> extends Prompt {
	// TODO: handle messages
	// /**
	//  * A simple text prompt. It's required or meaningless.
	//  */
	// prompt: string;
	// /**
	//  * System message to include in the prompt.
	//  */
	// system?: string;
	/**
	 * The schema of the object that the model should generate. Use 'zod' to declare.
	 */
	schema?: zSchema<Data, ZodTypeDef, Data> | Schema<Data>;
	/**
	 * Streams the output or not.
	 */
	stream?: boolean;
	/**
	 * Do something when AI data is generated.
	 * Use this callback to get the data during streaming rather than through the final 'data'.
	 */
	onSuccess?: (data: DeepPartial<Data> | string | Data) => void;
}

interface UseAIModel<D> {
	data: D;
	// biome-ignore lint/suspicious/noExplicitAny: TODO
	generate: any;
	isFetching: boolean;
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
			enabled: !!stream && !schema && !emptyInput,
		},
	);

	const {
		object,
		refetch: fetchObject,
		isFetching: isObjectFetching,
		isError: isObjectError,
		error: objectError,
	} = useGenerateObject<D>(
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
	} = useStreamObject(
		{
			model,
			// biome-ignore lint/style/noNonNullAssertion:
			schema: schema!,
			...prompt,
		},
		{
			onSuccess,
			enabled: !!stream && !!schema && !emptyInput,
		},
	);

	// TODO: figure out a great way to resolve stream data
	const data = useMemo(() => text ?? object, [text, object]);

	// biome-ignore lint:
	useEffect(() => {
		if (!data) return;
		onSuccess?.(data);
	}, [data]);

	return {
		data,
		generate: fetchText ?? fetchStreamText ?? fetchObject ?? fetchStreamObject,
		isFetching:
			isTextFetching ??
			isStreamTextFetching ??
			isObjectFetching ??
			isStreamObjectFetching,
		isError:
			isTextError ?? isStreamTextError ?? isObjectError ?? isStreamObjectError,
		error: textError ?? streamTextError ?? objectError ?? streamObjectError,
	};
}

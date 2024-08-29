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

interface Options<D> extends Prompt {
	schema?: zSchema<D, ZodTypeDef, D> | Schema<D>;
	stream?: boolean;
	/**
	 * Do something when AI data is generated.
	 * Use this callback to get the stream data rather than through 'data'.
	 */
	onSuccess?: (data: DeepPartial<D> | string | D) => void;
}

function useAIModel<D = string>(
	aiModel: LanguageModel,
	options: Options<D> = {},
) {
	const { schema, onSuccess, stream, ...prompt } = options;

	const { model: contextModel } = useModelContext();

	if (!aiModel && !contextModel) {
		throw new Error("Model is required");
	}

	// Empty input is not allowed to pass to the moedel, or it will throw an error
	const emptyInput =
		!prompt ||
		(!prompt.prompt && !prompt.messages) ||
		(prompt.prompt && prompt.prompt.length === 0) ||
		(prompt.messages && prompt.messages.length === 0);

	const model = aiModel ?? contextModel;

	// TODO: add middleware if model is a request

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

export { useAIModel };

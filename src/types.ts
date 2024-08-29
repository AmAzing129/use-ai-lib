// Here are those types declared locally but not exported.

import type { AttributeValue } from "@opentelemetry/api";
import type { CoreMessage } from "ai";

export type CallSettings = {
	/**
Maximum number of tokens to generate.
   */
	maxTokens?: number;
	/**
Temperature setting. This is a number between 0 (almost no randomness) and
1 (very random).

It is recommended to set either `temperature` or `topP`, but not both.

@default 0
   */
	temperature?: number;
	/**
Nucleus sampling. This is a number between 0 and 1.

E.g. 0.1 would mean that only tokens with the top 10% probability mass
are considered.

It is recommended to set either `temperature` or `topP`, but not both.
   */
	topP?: number;
	/**
Only sample from the top K options for each subsequent token.

Used to remove "long tail" low probability responses.
Recommended for advanced use cases only. You usually only need to use temperature.
   */
	topK?: number;
	/**
Presence penalty setting. It affects the likelihood of the model to
repeat information that is already in the prompt.

The presence penalty is a number between -1 (increase repetition)
and 1 (maximum penalty, decrease repetition). 0 means no penalty.

@default 0
   */
	presencePenalty?: number;
	/**
Frequency penalty setting. It affects the likelihood of the model
to repeatedly use the same words or phrases.

The frequency penalty is a number between -1 (increase repetition)
and 1 (maximum penalty, decrease repetition). 0 means no penalty.

@default 0
   */
	frequencyPenalty?: number;
	/**
Stop sequences.
If set, the model will stop generating text when one of the stop sequences is generated.
Providers may have limits on the number of stop sequences.
   */
	stopSequences?: string[];
	/**
The seed (integer) to use for random sampling. If set and supported
by the model, calls will generate deterministic results.
   */
	seed?: number;
	/**
Maximum number of retries. Set to 0 to disable retries.

@default 2
   */
	maxRetries?: number;
	/**
Abort signal.
   */
	abortSignal?: AbortSignal;
	/**
Additional HTTP headers to be sent with the request.
Only applicable for HTTP-based providers.
   */
	headers?: Record<string, string | undefined>;
};

export type Prompt = {
	/**
    System message to include in the prompt. Can be used with `prompt` or `messages`.
   */
	system?: string;
	/**
    A simple text prompt. You can either use `prompt` or `messages` but not both.
   */
	prompt?: string;
	/**
    A list of messsages. You can either use `prompt` or `messages` but not both.
   */
	messages?: Array<CoreMessage>;
};

/**
 * Telemetry configuration.
 */
export type TelemetrySettings = {
	/**
	 * Enable or disable telemetry. Disabled by default while experimental.
	 */
	isEnabled?: boolean;
	/**
	 * Enable or disable input recording. Enabled by default.
	 *
	 * You might want to disable input recording to avoid recording sensitive
	 * information, to reduce data transfers, or to increase performance.
	 */
	recordInputs?: boolean;
	/**
	 * Enable or disable output recording. Enabled by default.
	 *
	 * You might want to disable output recording to avoid recording sensitive
	 * information, to reduce data transfers, or to increase performance.
	 */
	recordOutputs?: boolean;
	/**
	 * Identifier for this function. Used to group telemetry data by function.
	 */
	functionId?: string;
	/**
	 * Additional information to include in the telemetry data.
	 */
	metadata?: Record<string, AttributeValue>;
};
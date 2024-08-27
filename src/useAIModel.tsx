import type { LanguageModel, CoreMessage } from 'ai';
import type { Schema, DeepPartial } from '@ai-sdk/ui-utils';
import { z } from 'zod';
import { useModelContext } from './provider';
import {
  useGenerateObject,
  useStreamObject,
  useGenerateText,
  useStreamText,
} from './queries';
import { useEffect, useMemo } from 'react';

interface Options<D> extends Prompt {
  deps?: any[];
  schema?: z.Schema<D, z.ZodTypeDef, D> | Schema<D>;
  stream?: boolean;
  /**
   * Do something when AI data is generated.
   * Use this callback to get the stream data rather than 'data'.
   */
  onSuccess?: (data: DeepPartial<D> | string | D) => void | boolean;
}

type Prompt = {
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

function useAIModel<D = string>(
  aiModel: LanguageModel,
  options: Options<D> = {}
) {
  const { schema, onSuccess, stream, deps, ...prompt } = options;

  const { model: contextModel } = useModelContext();
  if (!aiModel && !contextModel) {
    throw new Error('Model is required');
  }
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
      enabled: !stream && !schema,
    }
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
      enabled: stream && !schema,
    }
  );

  const {
    object,
    refetch: fetchObject,
    isFetching: isObjectFetching,
    isError: isObjectError,
    error: objectError,
  } = useGenerateObject(
    {
      model,
      ...prompt,
    },
    {
      enabled: !stream && !!schema,
    }
  );

  const {
    refetch: fetchStreamObject,
    isFetching: isStreamObjectFetching,
    isError: isStreamObjectError,
    error: streamObjectError,
  } = useStreamObject(
    {
      model,
      ...prompt,
    },
    {
      onSuccess,
      enabled: stream && !!schema,
    }
  );

  // TODO: figure out a great way to resolve stream data
  const data = useMemo(() => text ?? object, [text, object]);

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

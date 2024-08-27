import type { LanguageModel, CoreMessage } from 'ai';
import type { Schema, DeepPartial } from '@ai-sdk/ui-utils';
import { z } from 'zod';

import {
  useGenerateObject,
  useStreamObject,
  useGenerateText,
  useStreamText,
} from './queries';

interface Options<D> extends Prompt {
  deps?: any[];
  schema?: z.Schema<D, z.ZodTypeDef, D> | Schema<D>;
  stream?: boolean;
  onSuccess?: (data: DeepPartial<D> | string | D) => void | boolean;
  enabled?: boolean;
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
  model: LanguageModel,
  options: Options<D> = {}
) {
  const {
    schema,
    onSuccess,
    stream,
    deps,
    enabled = true,
    ...prompt
  } = options;

  const { text, refetch: fetchText } = useGenerateText(
    {
      model,
      ...prompt,
    },
    {
      enabled: !stream && !schema,
    }
  );

  const { text: streamText, refetch: fetchStreamText } = useStreamText(
    {
      model,
      ...prompt,
    },
    {
      enabled: stream && !schema,
    }
  );

  const { object, refetch: fetchObject } = useGenerateObject(
    {
      model,
      ...prompt,
    },
    {
      enabled: !stream && !!schema,
    }
  );

  const { object: streamObject, refetch: fetchStreamObject } = useStreamObject(
    {
      model,
      ...prompt,
    },
    {
      enabled: stream && !!schema,
    }
  );

  // TODO: get model from context

  // TODO: add middleware if model is a request

  return {
    data: text ?? streamText ?? object ?? streamObject,
    generate: fetchText ?? fetchStreamText ?? fetchObject ?? fetchStreamObject,
  };
}

export { useAIModel };

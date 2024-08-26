import type { LanguageModel, CoreMessage } from 'ai';
import { generateText, streamText, streamObject, generateObject } from 'ai';
import type { Schema, DeepPartial } from '@ai-sdk/ui-utils';
import { useEffect, useState } from 'react';
import { z } from 'zod';

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

export const useAIModel = <D = string,>(
  model: LanguageModel,
  options: Options<D> = {}
) => {
  const { schema, onSuccess, stream, deps, enabled, ...prompt } = options;

  const [data, setData] = useState<D>();

  // TODO: get model from context

  // TODO: add middleware if model is a request

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // No input
    if (!prompt || (!prompt.prompt && !prompt.messages)) {
      return;
    }

    if (schema) {
      if (stream) {
        streamObject({
          model,
          schema,
          ...prompt,
        }).then(async ({ partialObjectStream }) => {
          for await (const partialObject of partialObjectStream) {
            onSuccess?.(partialObject);
          }
        });
      } else {
        generateObject({
          model,
          schema,
          ...prompt,
        }).then(({ object }) => {
          setData(object);
          onSuccess?.(object);
        });
      }
    } else {
      if (stream) {
        streamText({
          model,
          ...prompt,
        }).then(async ({ textStream }) => {
          for await (const textPart of textStream) {
            onSuccess?.(textPart);
          }
        });
      } else {
        generateText({
          model,
          ...prompt,
        }).then(({ text }) => {
          // @ts-ignore FIXME
          setData(text);
          onSuccess?.(text);
        });
      }
    }
    // TODO handle deps re-render
  }, [prompt.prompt, prompt.messages, enabled, stream, deps]);

  return {
    data,
  };
};

import type { LanguageModel, CoreMessage } from 'ai';
import { generateText } from 'ai';
import { useEffect } from 'react';

interface Options extends Prompt {
  schema?: any;
  onStreaming?: (data: any) => void;
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

export const useAIModel = (model: LanguageModel, options?: Options) => {
  let genFunc = generateText;

  useEffect(() => {
    // genFunc({
    //   model,
    //   prompt: options.prompt,
    // });
  }, []);

  return {
    generate: (messages: Array<CoreMessage>) =>
      genFunc({
        model,
        messages: messages || options.messages,
      }),
  };
};

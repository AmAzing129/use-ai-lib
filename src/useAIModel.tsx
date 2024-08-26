import type { LanguageModel, CoreMessage } from 'ai';

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

const useAIModel = (model: LanguageModel, options?: Options) => {
  // TODO
};

export default useAIModel;

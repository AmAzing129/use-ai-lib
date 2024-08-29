# use-ai-lib

A React hooks library for building AI-powered apps as simple as possible.

## Features

- [x] Support different language models by vercel [ai](https://github.com/vercel/ai).
- [x] Request status control by [@tanstack/react-query](https://github.com/tanstack/query).
- [x] Schema declaration and validation by [zod](https://github.com/colinhacks/zod)
- [x] Comprehensive type hints.
- [ ] Conversation development out-of-the-box.
- [ ] Support custom AI requests.

## Examples

Tell the hook which model you're using, what the prompt is, stream or not, schema or not, and then get the data generated from AI. That's simple!

Use AIModelProvider to get the default query client.

```js
import { AIModelProvider } from 'use-ai-lib';

const yourApp = () => {
  return (
    <AIModelProvider>
      <App />
    </AIModelProvider>
  );
};
```

Set your global model and custom query client.

```js
import { openai } from '@ai-sdk/openai';
import { yourQueryClient } from './yourQueryClient';

const yourApp = () => {
  return (
    <AIModelProvider
      model={openai('gpt-4-turbo')}
      queryClient={yourQueryClient}
    >
      <App />
    </AIModelProvider>
  );
};
```

Generate text as you're using a simple hook!

```js
import { useAIModel } from 'use-ai-lib';

const { data } = useAIModel({ prompt: 'How are you?' });
```

Generate object using zod schema.

```js
import { z } from 'zod';
import { chromeai } from 'chrome-ai';

const schema = z.object({
  name: z.string({ description: 'Name' }),
  address: z.string({ description: 'Address' }),
});

const {
  data, // get the right type
  isError,
  error,   // errors throwed by the model or query
} = useAIModel<{ name: string; address: string }>({
  model: chromeai(), // use different model from global
  messages, // instead of string, pass messages array
  schema,
})
```

Use stream

```js
const {
  data, // get the final text
  isGenerating, // isLoading
  usage, // the number of tokens used
} = useAIModel({
  prompt: 'Tell me about React.js',
  stream: true,
  onSuccess: (chunk) => { 
    // doSomething 
  }
})
```

## Contributing

Use pnpm and biome.

## The initial idea

https://github.com/AmAzing129/use-ai-lib/discussions/2

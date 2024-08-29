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

Tell the hook which model you're using, what the prompt is, stream or not, schema or not, and then get the data from AI. That's simple!
```js
import { useAIModel, AIModelProvider } from 'use-ai-lib';
import { chromeai } from 'chrome-ai';

// Use AIModelProvider to get the query client
// or set your global model, custom client, etc.
const yourApp = () => {
  return (
    <AIModelProvider model={chromeai()}>
      <App />
    </AIModelProvider>
  );
}

// Generate text
const { data } = useAIModel({
  model: chromeai(),
  prompt: 'hello',
})

// Use stream and schema
useAIModel({
  model: chromeai(),
  messages,
  schema,
  stream: true,
  onSuccess: (chunk) => { // doSomething }
})
```

## Contributing

Use pnpm and biome.

## The initial idea

https://github.com/AmAzing129/use-ai-lib/discussions/2


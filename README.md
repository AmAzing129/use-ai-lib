# use-ai-lib
A React hooks library for building AI-powered apps as simple as possible. Based on [@tanstack/react-query](https://github.com/tanstack/query) and vercel [ai](https://github.com/vercel/ai).

## Examples

Tell the hook which model you're using, what the prompt is, stream or not, schema or not, and then get the data from AI. That's simple!
```js
import { useAIModel } from 'use-ai-lib';
import { chromeai } from 'chrome-ai';

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



## The basic idea

Look at this awesome [smart-form](https://try-chromeai.vercel.app/smart-form) demo, [@Shinji-Li](https://github.com/ONLY-yours) and I think maybe we can create some UI components with built-in AI. Developers use <SmartForm> directly and users can benefit from it.

So how to do it? What' the meaning of bringing AI magic to components?

For LLM (Large Language Models), it takes an input, and returns an output. That's it. It is just a **function**, nothing more. I don't need to worry about how the function is implemented; I just need to call it at the right time.

Now I have a UI component. And I want to add AI capabilities to it. I select some data, give it to the model, then get the returns and render it. There is nothing different from fetching regular data from servers via HTTP.

If you look at it in this way, it is **a hook with side effects**.

So maybe I can build a hooks library to let developers use LLM as simple as possible.

Then, people can write some apps or components on top of this. **Form + useAIModel = SmartForm**.

There are currently many large models, and more may appear in the future. Thanks to [Vercel ai](https://sdk.vercel.ai/docs/introduction) we have an unified API.

More ideas are welcomed for further building.

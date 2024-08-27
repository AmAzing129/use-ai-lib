/**
 * Use hooks in openai and pro-chat.
 */
'use client';
import { useState, useEffect } from 'react';
import { ProChat } from '@ant-design/pro-chat';
import { useTheme } from 'antd-style';
import { useAIModel } from 'use-ai-lib';

import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({
  // baseURL: '',
  // apiKey: 'YOUR_API_KEY',
});

export default function Home() {
  const theme = useTheme();
  const [showComponent, setShowComponent] = useState(false);
  useEffect(() => setShowComponent(true), []);

  const { data } = useAIModel(openai('gpt-4-turbo'), {
    prompt: 'how are you?'
  });

  console.log('data', data);

  return (
    <div
      style={{
        backgroundColor: theme.colorBgLayout,
      }}
    >
      {showComponent && (
        <ProChat
          style={{
            height: '100vh',
            width: '100vw',
          }}
          helloMessage={
            '欢迎使用 ProChat ，我是你的专属机器人，这是我们的 Github：[ProChat](https://github.com/ant-design/pro-chat)'
          }
          request={async (messages) => {
            // @ts-ignore
            // const res = await generate(messages);
            // return new Response(res.text);
          }}
        />
      )}
    </div>
  );
}

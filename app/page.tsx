/**
 * Use hooks in chrome-ai and pro-chat.
 */
'use client';
import { useState, useEffect } from 'react';
import { ProChat } from '@ant-design/pro-chat';
import { useTheme } from 'antd-style';
import { useAIModel } from 'use-ai-lib';
import { chromeai } from 'chrome-ai';

const model = chromeai();

export default function Home() {
  const theme = useTheme();
  const [showComponent, setShowComponent] = useState(false);
  useEffect(() => setShowComponent(true), []);

  // @ts-ignore
  const { generate } = useAIModel(model, {
    prompt: '你好',
  });

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
            const res = await generate(messages);
            return new Response(res.text);
          }}
        />
      )}
    </div>
  );
}

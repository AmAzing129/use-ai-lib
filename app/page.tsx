/**
 * Use hooks in chrome-ai and pro-chat.
 */
'use client';
import { useState, useEffect } from 'react';
import { ProChat } from '@ant-design/pro-chat';
import { useTheme } from 'antd-style';
import { useAIModel, AIModelProvider } from 'use-ai-lib';
import { chromeai } from 'chrome-ai';

const model = chromeai();

export default function App() {
  return (
    <AIModelProvider>
      <Home />
    </AIModelProvider>
  );
}

function Home() {
  const theme = useTheme();
  const [showComponent, setShowComponent] = useState(false);
  useEffect(() => setShowComponent(true), []);
  const [msg, setMsg] = useState('');

  const { data } = useAIModel(model, {
    prompt: msg,
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
            setMsg(messages[messages.length - 1].content);
          }}
        />
      )}
    </div>
  );
}

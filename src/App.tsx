import React, {useState, useEffect, createContext} from 'react';
import generateMessage, {Message} from './Api';
import TypeMessages from './components/TypeMessages';
import {initialState, messageIds} from "./constants";
import {StopClearButton, StopClearContainer, Title, TypeMessagesContainer, Divider} from "./components/styled";

export interface IAppContext {
  messages: Messages;
  setMessages: React.Dispatch<React.SetStateAction<Messages>>;
}

export type Messages = {
  error: Message[],
  warning: Message[],
  info: Message[],
}

export const AppContext = createContext<IAppContext>({} as IAppContext);

const removeOldMessage = (set: React.Dispatch<React.SetStateAction<Messages>>, message: string, msgType: keyof Messages) =>
  setTimeout(() => {
    set((messages) => ({
      ...messages,
      [msgType]: messages[msgType].filter((na) => {
        return na.message !== message
      })
    }))
  }, 2000)

const App: React.FC = () => {
  const [messages, setMessages] = useState<Messages>(initialState);
  const [isStopped, setStop] = useState(false);

  useEffect(() => {
    const cleanUp = generateMessage((message: Message) => {
      setMessages((messages) => {
        const msgType = messageIds[message.priority] as keyof Messages;
        const newArray = {...messages, [msgType]: [message, ...messages[msgType]]}
        removeOldMessage(setMessages, messages[msgType]?.[0]?.message, msgType)
        return newArray
      })
    });
    if (isStopped) {
      cleanUp()
    }
    return cleanUp;
  }, [setMessages, isStopped]);

  const handleStop = () => {
    setStop((isStopped) => !isStopped)
  }

  const handleClearAll = () => {
    setMessages(initialState)
  }

  return (
    <>
      <Title>nuffsaid.com Coding Challenge</Title>
      <Divider />
      <StopClearContainer>
        <StopClearButton data-testid="stop-run" onClick={handleStop}>{isStopped ? 'Run' : 'Stop'}</StopClearButton>
        <StopClearButton data-testid="clear" onClick={handleClearAll}>Clear</StopClearButton>
      </StopClearContainer>
      <AppContext.Provider value={{
        messages,
        setMessages,
      }}>
        <TypeMessagesContainer>
          <TypeMessages id="error"/>
          <TypeMessages id="warning"/>
          <TypeMessages id="info"/>
        </TypeMessagesContainer>
      </AppContext.Provider>
    </>
  );
}

export default App;

import React from 'react';
import faker from "faker";
import {render, screen, waitFor, act, fireEvent} from '@testing-library/react';
import App, {Messages} from '../App';
import * as API from "../Api";
import * as constants from "../constants";

let interval: any;

const removeInterval = () => {
  clearInterval(interval)
}

const setupAPIMock = (message: string, priority: API.Priority, times: number = 1): void => {
  jest.spyOn(API, 'default').mockImplementation((callback: (message: API.Message) => void) => {
    let howManyTimes = times;
    interval = setInterval(() => {
      if (howManyTimes) {
        callback({message: message || faker.lorem.sentence(), priority})
      } else {
        removeInterval()
      }
      howManyTimes--
    })
    return () => {
      removeInterval()
    }
  });
}

const renderMessages = async (priority: API.Priority) => {
  setupAPIMock('New Message', priority)
  const {getByRole} = render(<App/>);
  const msgType = constants.messageIds[priority] as keyof Messages;
  await waitFor(() => {
    const alert = getByRole('alert');
    const titleElement = screen.getByText('New Message');
    expect(titleElement).toBeTruthy();
    expect(alert).toHaveStyle(`background-color: ${constants.colors[msgType]}`)
  })
}

const removeMessagesAutomatically = async (priority: API.Priority) => {
  jest.useFakeTimers();
  setupAPIMock('', priority, 2)
  const msgType = constants.messageIds[priority] as keyof Messages;
  const {getByTestId} = render(<App/>);
  const countElement = getByTestId(`count-${msgType}`)
  await waitFor(() => expect(countElement.textContent).toBe('Count 2'))
  act(() => {
    jest.runAllTimers();
  })
  await waitFor(() => expect(countElement.textContent).toBe('Count 1'))
}

const removeMessageByType = async (priority: API.Priority) => {
  jest.useFakeTimers();
  const message = 'NewMessage'
  // @ts-ignore
  setupAPIMock(message, priority, 1)
  const {container, getByTestId} = render(<App/>);
  const msgType = constants.messageIds[priority] as keyof Messages;
  const countElement = getByTestId(`count-${msgType}`)

  await waitFor(() =>{
    const Button = container.querySelector(`#${message}`) as HTMLElement
    expect(countElement.textContent).toBe('Count 1')
    fireEvent.click(Button);
  })

  await waitFor(() => expect(countElement.textContent).toBe('Count 0'))
}

describe('App.tsx', () =>  {

  afterEach(() => {
    removeInterval();
  })

  test('should render an error message', async () => {
    await renderMessages(0)
  });

  test('should render a warning message', async () => {
    await renderMessages(1)
  });

  test('should render an info message', async () => {
    await renderMessages(2)
  });

  test('should remove an error message after 2 seconds', async () => {
    await removeMessagesAutomatically(0);
  });

  test('should remove a warning message after 2 seconds', async () => {
    await removeMessagesAutomatically(1);
  });

  test('should remove an info message after 2 seconds', async () => {
    await removeMessagesAutomatically(2);
  });

  test('should remove an error message by clicking clear button', async () => {
    await removeMessageByType(0);
  });

  test('should remove an warning message by clicking clear button', async () => {
    await removeMessageByType(1);
  });

  test('should remove an info message by clicking clear button', async () => {
    await removeMessageByType(2);
  });

  test('should stop incoming messages', async () => {
    jest.useFakeTimers();
    setupAPIMock('', 0, 4)
    const {getByTestId} = render(<App />)
    const StopRunningButton = getByTestId('stop-run');
    const countElement = getByTestId(`count-error`)
    fireEvent.click(StopRunningButton);
    await waitFor(() => expect(countElement.textContent).toBe('Count 0'))
  });

  test('should clear all the messages', async () => {
    jest.useFakeTimers();
    setupAPIMock('', 0, 4)
    const {getByTestId} = render(<App />)
    const ClearAllButton = getByTestId('clear');
    const countElement = getByTestId(`count-error`)
    await waitFor(() => expect(countElement.textContent).toBe('Count 4'))
    fireEvent.click(ClearAllButton);
    await waitFor(() => expect(countElement.textContent).toBe('Count 0'))
  });
})

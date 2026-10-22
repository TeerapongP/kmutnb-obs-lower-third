import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { io, type Socket } from 'socket.io-client';
import { initialData, type Snapshot } from '../shared/types';

type Command = {
  type: 'select' | 'show' | 'hide' | 'next' | 'replay';
  speakerId?: string;
};
type LiveContextValue = {
  snapshot: Snapshot;
  connected: boolean;
  ready: boolean;
  connectionError: string | null;
  command: (command: Command) => Promise<void>;
};

const LiveContext = createContext<LiveContextValue | null>(null);
const socket: Socket = io({
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionDelayMax: 5000,
});

export function LiveProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<Snapshot>({
    ...initialData,
    live: { visible: false, cue: 0 },
  });
  const [connected, setConnected] = useState(socket.connected);
  const [ready, setReady] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const onConnect = () => {
      setConnected(true);
      setConnectionError(null);
    };
    const onDisconnect = () => setConnected(false);
    const onConnectError = (error: Error) => setConnectionError(error.message);
    const onSnapshot = (next: Snapshot) => {
      setSnapshot(next);
      setReady(true);
      setConnectionError(null);
    };
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('snapshot', onSnapshot);
    socket.connect();
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('snapshot', onSnapshot);
      socket.disconnect();
    };
  }, []);

  const value = useMemo<LiveContextValue>(
    () => ({
      snapshot,
      connected,
      ready,
      connectionError,
      command: (command) =>
        new Promise<void>((resolve, reject) => {
          if (!socket.connected) {
            reject(new Error('Connection lost. Wait for the server to reconnect.'));
            return;
          }
          socket
            .timeout(5000)
            .emit(
              'command',
              command,
              (error: Error | null, result?: { ok: boolean; error?: string }) => {
                if (error) reject(new Error('The server did not respond.'));
                else if (!result?.ok)
                  reject(new Error(result?.error || 'Command failed.'));
                else resolve();
              },
            );
        }),
    }),
    [snapshot, connected, ready, connectionError],
  );

  return <LiveContext.Provider value={value}>{children}</LiveContext.Provider>;
}

export function useLive() {
  const value = useContext(LiveContext);
  if (!value) throw new Error('LiveProvider is missing.');
  return value;
}

export async function api<T>(path: string, method: string, body?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error('Could not reach the server.');
  }
  if (!response.ok) {
    const result: unknown = await response.json().catch(() => null);
    const message =
      result &&
      typeof result === 'object' &&
      'error' in result &&
      typeof result.error === 'string'
        ? result.error
        : undefined;
    throw new Error(message || `Request failed (${response.status}).`);
  }
  return response.status === 204 ? (undefined as T) : (response.json() as Promise<T>);
}

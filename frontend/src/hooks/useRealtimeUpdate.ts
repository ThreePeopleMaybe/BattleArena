import * as signalR from '@microsoft/signalr';
import { useEffect, useRef } from 'react';
import { BATTLEARENA_API_URL } from '../api/config';
import type { ArenaMemberPayload, GameRealtimePayload } from '../types';

export type UseGameRealtimeOptions = {
  onPayload: (payload: GameRealtimePayload) => void;
  refetch: () => void | Promise<void>;
};

export function useGameRealtime(arenaId: number | undefined, options: UseGameRealtimeOptions) {
  const onPayloadRef = useRef(options.onPayload);
  const refetchRef = useRef(options.refetch);
  onPayloadRef.current = options.onPayload;
  refetchRef.current = options.refetch;

  useEffect(() => {
    if (arenaId == null || arenaId <= 0) return;
    const base = BATTLEARENA_API_URL?.trim();
    if (!base) return;

    const hubUrl = `${base.replace(/\/$/, '')}/hubs/battlearena`;
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    connection.on('GameChanged', (payload: unknown) => {
      if (payload != null && typeof payload === 'object' && 'arenaId' in payload) {
        onPayloadRef.current(payload as GameRealtimePayload);
        return;
      }
      void refetchRef.current();
    });

    connection.onreconnected(() => {
      void (async () => {
        try {
          await refetchRef.current();
          await connection.invoke('Join', arenaId);
        } catch { /* ignore */ }
      })();
    });

    let cancelled = false;
    void (async () => {
      try {
        await connection.start();
        if (cancelled) {
          await connection.stop();
          return;
        }
        await connection.invoke('Join', arenaId);
      } catch { /* hub unavailable */ }
    })();

    return () => {
      cancelled = true;
      void connection.stop();
    };
  }, [arenaId]);
}

  export type UseArenaRealtimeOptions = {
    onPayload: (payload: ArenaMemberPayload) => void;
    refetch: () => void | Promise<void>;
  };

  export function useArenaRealtime(arenaId: number | undefined, options: UseArenaRealtimeOptions) {
    const onPayloadRef = useRef(options.onPayload);
    const refetchRef = useRef(options.refetch);
    onPayloadRef.current = options.onPayload;
    refetchRef.current = options.refetch;

    useEffect(() => {
    if (arenaId == null || arenaId <= 0) return;
    const base = BATTLEARENA_API_URL?.trim();
    if (!base) return;

    const hubUrl = `${base.replace(/\/$/, '')}/hubs/battlearena`;
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    connection.on('ArenaMemberChanged', (payload: unknown) => {
      if (payload != null && typeof payload === 'object') {
        onPayloadRef.current(payload as ArenaMemberPayload);
        return;
      }
      void refetchRef.current();
    });

    connection.onreconnected(() => {
      void (async () => {
        try {
          await refetchRef.current();
          await connection.invoke('Join', arenaId);
        } catch { /* ignore */ }
      })();
    });

    let cancelled = false;
    void (async () => {
      try {
        await connection.start();
        if (cancelled) {
          await connection.stop();
          return;
        }
        await connection.invoke('Join', arenaId);
      } catch { /* hub unavailable */ }
    })();

    return () => {
      cancelled = true;
      void connection.stop();
    };
  }, [arenaId]);
}
export type LifecycleStatus =
  | 'draft'
  | 'queued'
  | 'claimed'
  | 'running'
  | 'review'
  | 'blocked'
  | 'approved'
  | 'merge-ready'
  | 'merged'
  | 'failed'
  | 'rebasing'
  | 'complete';

export interface TraceRecord {
  id: string;
  summary: string;
  status: LifecycleStatus;
  trace: string[];
  updatedAt: string;
}

export interface DomainSnapshot extends TraceRecord {
  domain: string;
}

export interface DevplatSuccess<T> {
  ok: true;
  value: T;
}

export interface DevplatFailure {
  ok: false;
  error: string;
}

export type DevplatResult<T> = DevplatSuccess<T> | DevplatFailure;

export type Exact<
  TExpected,
  TActual extends TExpected,
> = TExpected extends TActual ? true : never;

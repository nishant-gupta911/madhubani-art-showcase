declare module 'autocannon' {
  interface Options {
    url: string;
    connections?: number;
    duration?: number;
    pipelining?: number;
    bailout?: number;
    headers?: Record<string, string>;
  }

  interface Result {
    url: string;
    connections: number;
    pipelining: number;
    duration: number;
    start: Date;
    finish: Date;
    errors: number;
    timeouts: number;
    mismatches: number;
    non2xx: number;
    resets: number;
    requests: {
      average: number;
      mean: number;
      stddev: number;
      min: number;
      max: number;
      total: number;
      p99: number;
      p99_9: number;
    };
    latency: {
      average: number;
      mean: number;
      stddev: number;
      min: number;
      max: number;
      p50: number;
      p75: number;
      p90: number;
      p99: number;
      p99_9: number;
    };
    throughput: {
      average: number;
      mean: number;
      stddev: number;
      min: number;
      max: number;
      total: number;
    };
  }

  function autocannon(
    options: Options,
    cb?: (err: any, result: Result) => void
  ): Promise<Result>;

  export = autocannon;
}

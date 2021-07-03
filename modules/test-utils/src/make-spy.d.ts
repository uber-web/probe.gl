/**
 * Inspired by https://github.com/popomore/spy
 * Attach a spy to the function. The spy has the following methods and fields
 * - `restore()` - remove spy completely
 * - `reset()` - reset call count
 * - `callCount` - number of calls
 * - `called` - whether spy was called
 */ 

interface Spy {
  // (...args: any[]): any;
  restore(): void;
  reset(): void;
  returns(returnValue: any): void;
  callCount: number;
  called: boolean;
}

export function makeSpy(obj, func): Spy;

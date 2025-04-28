// Archivo: src/setup-jest.ts

import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
setupZoneTestEnv();

import * as jestExtended from 'jest-extended';
expect.extend(jestExtended);

import 'jest-extended';

// 3. Implementa jasmine.createSpyObj() con métodos .and.returnValue y .and.throwValue
const globalAny: any = globalThis;

globalAny.jasmine = globalAny.jasmine || {};
globalAny.jasmine.createSpyObj = <T>(
  baseName: string,
  methodNames: (keyof T)[]
): jasmine.SpyObj<T> => {
  const obj: Partial<Record<keyof T, any>> = {};
  methodNames.forEach((name) => {
    const spy: any = jest.fn();
    spy.and = {
      returnValue: (value: any) => { spy.mockReturnValue(value); return spy; },
      throwValue: (error: any) => { spy.mockImplementation(() => { throw error; }); return spy; },
      returnValues: (...values: any[]) => {
        values.forEach(val => spy.mockReturnValueOnce(val));
        return spy;
      }
    };
    obj[name] = spy;
  });
  return obj as jasmine.SpyObj<T>;
};

globalAny.spyOn = jest.spyOn;
globalAny.jasmine.spyOn = jest.spyOn;

globalAny.jasmine.any = expect.any;

globalAny.alert = jest.fn();
globalAny.window = globalAny.window || {};
globalAny.window.alert = jest.fn();

const confirmSpy: any = jest.fn();
confirmSpy.and = {
  returnValue: (value: any) => { confirmSpy.mockReturnValue(value); return confirmSpy; },
  throwValue: (error: any) => { confirmSpy.mockImplementation(() => { throw error; }); return confirmSpy; },
  returnValues: (...values: any[]) => {
    values.forEach(val => confirmSpy.mockReturnValueOnce(val));
    return confirmSpy;
  }
};
globalAny.window.confirm = confirmSpy;
globalAny.confirm = confirmSpy;


jest.spyOn(globalAny.console, 'error').mockImplementation(() => {});
jest.spyOn(globalThis.console, 'log').mockImplementation(() => {});
jest.spyOn(globalThis.console, 'warn').mockImplementation(() => {});

import { describe, expect, test } from 'vitest'
import { spyOn, spy } from '../src'

class Dep {
  run(): boolean {
    return false
  }
}

describe('class mock', () => {
  let dep1: Dep
  let dep2: Dep

  test('works with multiple instances', () => {
    dep1 = new Dep()
    const spy1 = spyOn(dep1, 'run')

    dep2 = new Dep()
    const spy2 = spyOn(dep2, 'run')

    dep1.run()
    dep2.run()

    expect(spy1.callCount).toBe(1)
    expect(spy2.callCount).toBe(1)
  })

  test('spy keeps instance', () => {
    const obj = {
      Test() {},
    }
    const fn = spyOn(obj, 'Test')
    const instance = new obj.Test()
    expect(fn.called).toBe(true)
    expect(instance).toBeInstanceOf(obj.Test)
  })

  // FIXME: https://github.com/tinylibs/tinyspy/issues/29
  describe.todo('spying on constructor', () => {
    test('throws error, if constructor is an arrow function', () => {
      const fnArrow = spy(() => {})
      expect(() => new fnArrow()).toThrowError()
    })

    test('respects new.target in a function', () => {
      let target: unknown = null
      let args: unknown[] = []
      const fnScoped = spy(function (...fnArgs: unknown[]) {
        target = new.target
        args = fnArgs
      })

      new fnScoped('some', 'text', 1)
      expect(target).toBeTypeOf('function')
      expect(args).toEqual(['some', 'text', 1])
      expect(fnScoped.calls).toEqual([['some', 'text', 1]])
    })

    test('respects new.target in a class', () => {
      let target: unknown = null
      let args: unknown[] = []
      const fnScoped = spy(
        class {
          constructor(...fnArgs: unknown[]) {
            target = new.target
            args = fnArgs
          }
        }
      )

      new fnScoped('some', 'text', 1)
      expect(target).toBeTypeOf('function')
      expect(args).toEqual(['some', 'text', 1])
      expect(fnScoped.calls).toEqual([['some', 'text', 1]])
    })
  })
})

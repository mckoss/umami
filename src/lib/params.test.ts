import { describe, expect, test } from 'vitest';
import { DATA_TYPE, OPERATORS } from './constants';
import {
  isPresenceOperator,
  parseFilterValue,
  parseSessionPropertyFilters,
  parseUniversalEventPropertyFilters,
  serializeSessionPropertyFilters,
  serializeUniversalEventPropertyFilters,
} from './params';

describe('session property filter params', () => {
  test('serializes and parses session property filters', () => {
    const filters = [
      {
        propertyName: 'user.id',
        dataType: DATA_TYPE.string,
        operator: OPERATORS.equals,
        value: 'abc.123,xyz',
      },
      {
        propertyName: 'created at',
        dataType: DATA_TYPE.date,
        operator: OPERATORS.before,
        value: '2026-07-01',
      },
    ];

    const params = serializeSessionPropertyFilters(filters);

    expect(params).toEqual({
      spf0: '1.eq.user%2Eid.abc.123,xyz',
      spf1: '4.bf.created%20at.2026-07-01',
    });
    expect(parseSessionPropertyFilters(params)).toEqual(filters);
  });

  test('ignores malformed session property filters', () => {
    expect(
      parseSessionPropertyFilters({
        spf0: 'eq.user%2Eid.value',
        spf1: '1.unknown.email.value',
        spf2: '1.eq',
      }),
    ).toEqual([]);
  });

  test('serializes and parses universal event property filters', () => {
    const filters = [
      {
        propertyName: 'plan.id',
        dataType: DATA_TYPE.string,
        operator: OPERATORS.equals,
        value: 'pro,team',
      },
    ];

    const params = serializeUniversalEventPropertyFilters(filters);

    expect(params).toEqual({
      epf0: '1.eq.plan%2Eid.pro,team',
    });
    expect(parseUniversalEventPropertyFilters(params)).toEqual(filters);
  });

  test('ignores malformed universal event property filters', () => {
    expect(
      parseUniversalEventPropertyFilters({
        epf0: 'eq.plan%2Eid.value',
        epf1: '1.unknown.email.value',
        epf2: '1.eq',
      }),
    ).toEqual([]);
  });
});

describe('presence operators', () => {
  test('parse with an empty value', () => {
    expect(parseFilterValue('ns.')).toEqual({ operator: OPERATORS.notSet, value: '' });
    expect(parseFilterValue('s.')).toEqual({ operator: OPERATORS.set, value: '' });
  });

  test('are the only operators that take no value', () => {
    expect(isPresenceOperator(OPERATORS.set)).toBe(true);
    expect(isPresenceOperator(OPERATORS.notSet)).toBe(true);
    expect(isPresenceOperator(OPERATORS.notEquals)).toBe(false);
  });
});

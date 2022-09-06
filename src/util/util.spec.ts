import { getAmount, addMinutesToDate } from './util';
describe('Get Amount', () => {
  test('Gets Amount in decimal', () => {
    const amount = '2345.678';
    expect(getAmount(amount)).toBe(2345.678);
  });
});

test('Add minutes to Date', () => {
  const date = new Date('2022-09-06T08:18:22.501Z');
  expect(addMinutesToDate(5, date)).toStrictEqual(
    new Date('2022-09-06T08:23:22.501Z'),
  );
});

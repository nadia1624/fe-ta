import { isAgendaPast } from '../../../app/lib/dateUtils';

describe('dateUtils', () => {
  const RealDate = Date;

  beforeAll(() => {
    const fixedNow = new RealDate('2026-04-22T12:00:00');
    global.Date = class extends RealDate {
      constructor(value?: string | number | Date) {
        if (value) {
          super(value);
        } else {
          super(fixedNow);
        }
      }

      static now() {
        return fixedNow.getTime();
      }
    } as DateConstructor;
  });

  afterAll(() => {
    global.Date = RealDate;
  });

  it('returns false when tanggal is missing', () => {
    expect(isAgendaPast('', '11:00')).toBe(false);
  });

  it('returns false when waktuSelesai is missing', () => {
    expect(isAgendaPast('2026-04-22', '')).toBe(false);
  });

  it('supports HH:mm format by appending seconds', () => {
    expect(isAgendaPast('2026-04-22', '11:59')).toBe(true);
  });

  it('supports HH:mm:ss format directly', () => {
    expect(isAgendaPast('2026-04-22', '12:30:00')).toBe(false);
  });
});

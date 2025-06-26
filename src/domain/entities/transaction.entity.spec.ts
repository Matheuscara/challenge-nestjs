import * as crypto from 'crypto';
import { Transaction } from '../../domain/entities/transaction.entity';
import { DomainError } from '../../domain/errors/domain-error';

describe('Transaction Entity', () => {
  const validTimestamp = new Date(Date.now() - 1000);
  let uuidSpy: jest.SpyInstance<string, [crypto.RandomUUIDOptions?]>;

  beforeAll(() => {
    uuidSpy = jest.spyOn(crypto, 'randomUUID');
  });

  afterAll(() => {
    uuidSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('static create()', () => {
    it('deve gerar um UUID quando id não for fornecido', () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';
      uuidSpy.mockReturnValue(fakeId);

      const tx = Transaction.create({ amount: 100, timestamp: validTimestamp });

      expect(tx.id).toBe(fakeId);
      expect(tx.amount).toBe(100);
      expect(tx.timestamp).toBe(validTimestamp);
      expect(uuidSpy).toHaveBeenCalled();
    });

    it('deve usar o id fornecido quando for um UUID válido', () => {
      const providedId = '11111111-1111-4111-8111-111111111111';
      uuidSpy.mockImplementation(() => {
        throw new DomainError('should not call randomUUID');
      });

      const tx = Transaction.create({
        id: providedId,
        amount: 50,
        timestamp: validTimestamp,
      });

      expect(tx.id).toBe(providedId);
      expect(tx.amount).toBe(50);
      expect(tx.timestamp).toBe(validTimestamp);
    });

    it('deve lançar DomainError se id for inválido', () => {
      expect(() =>
        Transaction.create({
          id: 'not-a-uuid',
          amount: 10,
          timestamp: validTimestamp,
        }),
      ).toThrow(DomainError);
    });

    it('deve lançar DomainError se timestamp não for um Date', () => {
      expect(() =>
        Transaction.create({
          amount: 10,
          timestamp: '2021-01-01' as any,
        }),
      ).toThrow(DomainError);
    });

    it('deve lançar DomainError se timestamp for no futuro', () => {
      const future = new Date(Date.now() + 10_000);
      expect(() =>
        Transaction.create({
          amount: 10,
          timestamp: future,
        }),
      ).toThrow(DomainError);
    });

    it('deve lançar DomainError se amount for negativo', () => {
      expect(() =>
        Transaction.create({
          amount: -5,
          timestamp: validTimestamp,
        }),
      ).toThrow(DomainError);
    });
  });

  describe('getters', () => {
    it('id, amount e timestamp devem retornar os valores corretos', () => {
      const fakeId = '22222222-2222-4222-8222-222222222222';
      uuidSpy.mockReturnValue(fakeId);

      const tx = Transaction.create({
        amount: 250,
        timestamp: validTimestamp,
      });

      expect(tx.id).toBe(fakeId);
      expect(tx.amount).toBe(250);
      expect(tx.timestamp).toBe(validTimestamp);
    });
  });

  describe('Invoice.Domain Validation', () => {
    it('deve lançar se timestamp não for instância de Date', () => {
      expect(() => {
        Transaction.create({
          timestamp: '2025-06-25' as any,
          amount: 100,
        });
      }).toThrow(
        new DomainError('Invalid timestamp. Must be a valid Date object.'),
      );
    });

    it('deve lançar se timestamp estiver no futuro', () => {
      const future = new Date(Date.now() + 1000 * 60 * 60);
      expect(() => {
        Transaction.create({
          timestamp: future,
          amount: 100,
        });
      }).toThrow(
        new DomainError('Invalid timestamp. Cannot be in the future.'),
      );
    });

    it('deve lançar se amount for negativo', () => {
      expect(() => {
        Transaction.create({
          timestamp: new Date(),
          amount: -1,
        });
      }).toThrow(new DomainError('Invalid amount. Amount cannot be negative.'));
    });
  });
});

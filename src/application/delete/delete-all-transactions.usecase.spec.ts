/* eslint-disable @typescript-eslint/unbound-method */

import { Test, TestingModule } from '@nestjs/testing';
import { ITransactionRepository } from '../../domain/repositories/transaction.repository';
import { DeleteAllTransactionsUseCase } from './delete-all-transactions.usecase';

describe('DeleteAllTransactionsUseCase', () => {
  let useCase: DeleteAllTransactionsUseCase;
  let repositoryMock: jest.Mocked<ITransactionRepository>;

  beforeAll(async () => {
    repositoryMock = {
      create: jest.fn(),
      listFrom: jest.fn(),
      deleteAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteAllTransactionsUseCase,
        { provide: ITransactionRepository, useValue: repositoryMock },
      ],
    }).compile();

    useCase = module.get<DeleteAllTransactionsUseCase>(
      DeleteAllTransactionsUseCase,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('deve chamar repository.deleteAll uma vez', () => {
      useCase.execute();

      expect(repositoryMock.deleteAll).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erro se repository.deleteAll lançar', () => {
      const err = new Error('falha ao deletar tudo');
      repositoryMock.deleteAll.mockImplementation(() => {
        throw err;
      });

      expect(() => useCase.execute()).toThrow(err);

      expect(repositoryMock.deleteAll).toHaveBeenCalledTimes(1);
    });
  });
});

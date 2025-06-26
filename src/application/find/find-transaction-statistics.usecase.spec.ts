/* eslint-disable @typescript-eslint/unbound-method */

import { Test, TestingModule } from '@nestjs/testing';
import { ITransactionRepository } from '../../domain/repositories/transaction.repository';
import { FindTransactionStatisticsUseCase } from './find-transaction-statistics.usecase';
import { TransactionStatisticsVO } from '../../domain/value-objects/transaction-statistics.vo';
import { FindTransactionStatisticsDto } from './find-transaction-statistics.dto';
import { Transaction } from '../../domain/entities/transaction.entity';

describe('FindTransactionStatisticsUseCase', () => {
  let useCase: FindTransactionStatisticsUseCase;
  let repositoryMock: jest.Mocked<ITransactionRepository>;

  beforeAll(async () => {
    repositoryMock = {
      create: jest.fn(),
      listFrom: jest.fn(),
      deleteAll: jest.fn(),
    } as jest.Mocked<ITransactionRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindTransactionStatisticsUseCase,
        { provide: ITransactionRepository, useValue: repositoryMock },
      ],
    }).compile();

    useCase = module.get<FindTransactionStatisticsUseCase>(
      FindTransactionStatisticsUseCase,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('execute', () => {
    it('deve chamar listFrom, VO.create e DTO.fromVO, e devolver o DTO retornado', () => {
      const fakeTxs = [
        { id: 't1', amount: 10, timestamp: new Date() },
        { id: 't2', amount: 20, timestamp: new Date() },
      ] as Transaction[];
      repositoryMock.listFrom.mockReturnValue(fakeTxs);

      const fakeVo = {
        count: 2,
        sum: 30,
        avg: 15,
        min: 10,
        max: 20,
      } as TransactionStatisticsVO;
      const voSpy = jest
        .spyOn(TransactionStatisticsVO, 'create')
        .mockReturnValue(fakeVo);

      const fakeDto = {
        count: 2,
        sum: 30,
        avg: 15,
        min: 10,
        max: 20,
      } as FindTransactionStatisticsDto;
      const dtoSpy = jest
        .spyOn(FindTransactionStatisticsDto, 'fromVO')
        .mockReturnValue(fakeDto);

      const result = useCase.execute();

      expect(repositoryMock.listFrom).toHaveBeenCalledWith(expect.any(Date));
      expect(voSpy).toHaveBeenCalledWith(fakeTxs);
      expect(dtoSpy).toHaveBeenCalledWith(fakeVo);
      expect(result).toBe(fakeDto);
    });

    it('deve propagar erro se repository.listFrom lançar', () => {
      const err = new Error('listFrom failure');
      repositoryMock.listFrom.mockImplementation(() => {
        throw err;
      });

      expect(() => useCase.execute()).toThrow(err);
      expect(repositoryMock.listFrom).toHaveBeenCalledTimes(1);
    });

    it('deve propagar erro se TransactionStatisticsVO.create lançar', () => {
      repositoryMock.listFrom.mockReturnValue([]);

      const err = new Error('VO.create failure');
      jest.spyOn(TransactionStatisticsVO, 'create').mockImplementation(() => {
        throw err;
      });

      expect(() => useCase.execute()).toThrow(err);
      expect(repositoryMock.listFrom).toHaveBeenCalledTimes(1);
      expect(TransactionStatisticsVO.create).toHaveBeenCalledWith([]);
    });
  });
});

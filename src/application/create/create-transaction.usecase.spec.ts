import { Test, TestingModule } from '@nestjs/testing';
import { ITransactionRepository } from '../../domain/repositories/transaction.repository';
import { Transaction } from '../../domain/entities/transaction.entity';
import { CreateTransactionUseCase } from './create-transaction.usecase';
import { ResponseMessages } from '../../utils/constants/response-messages';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;

  const repositoryMock: { create: (tx: Transaction) => void } = {
    create: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransactionUseCase,
        { provide: ITransactionRepository, useValue: repositoryMock },
      ],
    }).compile();

    useCase = module.get(CreateTransactionUseCase);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar a transação e chamar repository.create', () => {
    const dto = { amount: 123, timestamp: new Date() };
    const fakeTx = {
      amount: dto.amount,
      timestamp: dto.timestamp,
    } as Transaction;

    const createSpy = jest.spyOn(Transaction, 'create').mockReturnValue(fakeTx);

    useCase.execute(dto);

    expect(createSpy).toHaveBeenCalledWith({
      amount: dto.amount,
      timestamp: dto.timestamp,
    });
    expect(repositoryMock.create).toHaveBeenCalledWith(fakeTx);
  });

  it('deve propagar erro se Transaction.create lançar', () => {
    const dto = { amount: -50, timestamp: new Date() };
    const err = new Error(ResponseMessages.RULE_ENTITY_NOT_CORRECT);

    jest.spyOn(Transaction, 'create').mockImplementation(() => {
      throw err;
    });

    expect(() => useCase.execute(dto)).toThrow(err);
    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
});

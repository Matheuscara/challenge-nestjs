import { TransactionController } from './transaction-http';
import {
  CreateTransactionUseCase,
  CreateTransactionDto,
  DeleteAllTransactionsUseCase,
} from '../../application';
import { ResponseMessages } from '../../utils/constants/response-messages';

describe('TransactionController', () => {
  let controller: TransactionController;
  let createUseCase: jest.Mocked<CreateTransactionUseCase>;
  let deleteUseCase: jest.Mocked<DeleteAllTransactionsUseCase>;

  beforeEach(() => {
    createUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateTransactionUseCase>;
    deleteUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<DeleteAllTransactionsUseCase>;

    controller = new TransactionController(createUseCase, deleteUseCase);
  });

  describe('create', () => {
    it('should call createTransactionUseCase.execute with the provided DTO and return success message', () => {
      const dto: CreateTransactionDto = { timestamp: new Date(), amount: 100 };
      const result = controller.create(dto);

      expect(createUseCase.execute).toHaveBeenCalledTimes(1);
      expect(createUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toBe(ResponseMessages.TRANSACTION_CREATED);
    });
  });

  describe('deleteAll', () => {
    it('should call deleteAllTransactionsUseCase.execute and return cleared message', () => {
      const result = controller.deleteAll();

      expect(deleteUseCase.execute).toHaveBeenCalledTimes(1);
      expect(result).toBe(ResponseMessages.TRANSACTIONS_CLEARED);
    });
  });
});

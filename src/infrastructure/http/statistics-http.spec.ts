import { StatisticsController } from './statistics-http';
import {
  FindTransactionStatisticsUseCase,
  FindTransactionStatisticsDto,
} from '../../application';

describe('StatisticsController', () => {
  let controller: StatisticsController;
  let useCase: jest.Mocked<FindTransactionStatisticsUseCase>;

  beforeEach(() => {
    useCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<FindTransactionStatisticsUseCase>;

    controller = new StatisticsController(useCase);
  });

  it('should call useCase.execute once and return its result', () => {
    const mockDto: FindTransactionStatisticsDto = {
      count: 3,
      sum: 60,
      avg: 20,
      min: 10,
      max: 30,
    };
    useCase.execute.mockReturnValue(mockDto);

    const result = controller.get();

    expect(useCase.execute).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockDto);
  });

  it('should propagate whatever execute() returns', () => {
    const dtoList = [
      { count: 0, sum: 0, avg: 0, min: 0, max: 0 },
      { count: 5, sum: 100, avg: 20, min: 5, max: 50 },
    ] as FindTransactionStatisticsDto[];

    for (const mockDto of dtoList) {
      useCase.execute.mockReturnValueOnce(mockDto);
      expect(controller.get()).toBe(mockDto);
    }

    expect(useCase.execute).toHaveBeenCalledTimes(dtoList.length);
  });
});

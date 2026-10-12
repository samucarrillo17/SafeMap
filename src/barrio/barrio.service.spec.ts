import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BarrioService } from './barrio.service';
import { Barrio } from './entities/barrio.entity';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  readFileSync: jest.fn(),
}));


describe('BarrioService', () => {
  let service: BarrioService;
  let repository: Repository<Barrio>;

  const mockBarriosRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BarrioService,
        {
          provide: getRepositoryToken(Barrio),
          useValue: mockBarriosRepository,
        },
      ],
    }).compile();

    service = module.get<BarrioService>(BarrioService);
    repository = module.get<Repository<Barrio>>(getRepositoryToken(Barrio));
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe estar definido el servicio', () => {
    expect(service).toBeDefined();
  });

  
});

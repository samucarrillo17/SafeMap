import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { readFileSync } from 'fs';
import { BarrioService } from './barrio.service';
import { Barrio } from './entities/barrio.entity';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  readFileSync: jest.fn(),
}));

const mockReadFileSync = jest.mocked(readFileSync);

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

  describe('seedBarrios', () => {
    const geometry = {
      type: 'Polygon',
      coordinates: [
        [
          [-74.8, 11.0],
          [-74.7, 11.0],
          [-74.7, 11.1],
          [-74.8, 11.0],
        ],
      ],
    };

    const geojsonFixture = {
      features: [
        {
          properties: { nombre_barrio: 'Centro' },
          geometry,
        },
        {
          properties: { NOMBRE: 'El Prado' },
          geometry,
        },
        {
          properties: { nombre_barrio: 'Sin geometría' },
          geometry: null,
        },
        {
          properties: {},
          geometry,
        },
      ],
    };

    it('lee el GeoJSON, prepara barrios válidos y guarda el lote', async () => {
      mockReadFileSync.mockReturnValue(JSON.stringify(geojsonFixture));
      mockBarriosRepository.create.mockImplementation((barrio) => barrio);
      mockBarriosRepository.save.mockResolvedValue([]);

      const result = await service.seedBarrios();

      expect(mockReadFileSync).toHaveBeenCalledWith(
        expect.stringContaining('barrios_barranquilla.json'),
        'utf8',
      );
      expect(repository.create).toHaveBeenCalledTimes(2);
      expect(repository.create).toHaveBeenNthCalledWith(1, {
        nombre: 'Centro',
        geometria: geometry,
      });
      expect(repository.create).toHaveBeenNthCalledWith(2, {
        nombre: 'El Prado',
        geometria: geometry,
      });
      expect(repository.save).toHaveBeenCalledWith([
        { nombre: 'Centro', geometria: geometry },
        { nombre: 'El Prado', geometria: geometry },
      ]);
      expect(result).toEqual({
        message: 'Se registraron 2 barrios con éxito.',
      });
    });

    it('propaga el error si falla el guardado del lote', async () => {
      mockReadFileSync.mockReturnValue(JSON.stringify(geojsonFixture));
      mockBarriosRepository.create.mockImplementation((barrio) => barrio);
      const databaseError = Object.assign(new Error('Database unavailable'), {
        code: 'ECONNREFUSED',
      });
      mockBarriosRepository.save.mockRejectedValue(databaseError);

      await expect(service.seedBarrios()).rejects.toBe(databaseError);
      expect(repository.save).toHaveBeenCalledTimes(1);
    });

    it('propaga el error si no puede leer el archivo de barrios', async () => {
      const fileError = new Error('File not found');
      mockReadFileSync.mockImplementation(() => {
        throw fileError;
      });

      await expect(service.seedBarrios()).rejects.toBe(fileError);
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { CalificacionService } from './calificacion.service';
import { Calificacion } from './entities/calificacion.entity';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { Barrio } from '../barrio/entities/barrio.entity';

describe('CalificacionService', () => {
  let service: CalificacionService;
  let repository: Repository<Calificacion>;

  const mockCalificacionesRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockBarriosRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalificacionService,
        {
          provide: getRepositoryToken(Calificacion),
          useValue: mockCalificacionesRepository,
        },
        {
          provide: getRepositoryToken(Barrio), 
          useValue: mockBarriosRepository,
        },
        {
          provide: ConfigService, 
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<CalificacionService>(CalificacionService);
    repository = module.get<Repository<Calificacion>>(
      getRepositoryToken(Calificacion),
    );

    jest.clearAllMocks();
  });

  it('debe estar definido el servicio', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const barrioId = 'uuid-barrio-123';
    const usuarioId = 'uuid-usuario-456';
    const createCalificacionDto: CreateCalificacionDto = {
      estrellas: 5,
      comentario: 'Barrio muy seguro de noche',
      fue_victima: false,
    } as CreateCalificacionDto;

    const mockCalificacionCreada = {
      id: 'uuid-calificacion-789',
      ...createCalificacionDto,
      barrio: { id: barrioId },
      usuario: { id: usuarioId },
      etiqueta: 'Zona Segura y Tranquila',
    };

    it('debe crear y guardar una calificación exitosamente (Camino Feliz)', async () => {
      // 1. ARRANGE (Simular respuestas del repositorio)
      mockCalificacionesRepository.create.mockReturnValue(
        mockCalificacionCreada,
      );
      mockCalificacionesRepository.save.mockResolvedValue(
        mockCalificacionCreada,
      );

      // 2. SIMULAR MÉTODOS INTERNOS (Evitamos llamadas HTTP reales y lógica secundaria)
      jest
        .spyOn(service as any, 'obtenerClasificacionDeIA')
        .mockResolvedValue('Zona Segura y Tranquila');
      jest
        .spyOn(service as any, 'updateBarrioMetrics')
        .mockResolvedValue(undefined);

      // 3. ACT
      const result = await service.create(
        createCalificacionDto,
        barrioId,
        usuarioId,
      );

      // 4. ASSERT
      expect(repository.create).toHaveBeenCalledWith({
        ...createCalificacionDto,
        barrio: { id: barrioId },
        usuario: { id: usuarioId },
        etiqueta: 'Zona Segura y Tranquila',
      });

      expect(repository.save).toHaveBeenCalledWith(mockCalificacionCreada);
      expect(result).toEqual(mockCalificacionCreada);
    });

    it('debe capturar errores de base de datos y pasarlos a handleDBException', async () => {
      const dbError = new Error('Database connection failed');
      mockCalificacionesRepository.create.mockReturnValue(
        mockCalificacionCreada,
      );
      mockCalificacionesRepository.save.mockRejectedValue(dbError);

      // También simulamos las llamadas secundarias aquí
      jest
        .spyOn(service as any, 'obtenerClasificacionDeIA')
        .mockResolvedValue('General');

      await expect(
        service.create(createCalificacionDto, barrioId, usuarioId),
      ).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    const barrioId = 'uuid-barrio-123';

    const mockCalificaciones = [
      {
        id: 'uuid-calificacion-789',
        usuario: {
          id: 'uuid-usuario-657',
          correo: 'correo@gmail.com',
          nombre: 'Juanito Pérez',
        },
        estrellas: 4,
        fue_victima: false,
        comentario: 'buen barrio',
        created_at: new Date('2026-09-24T01:56:00.168Z'),
      },
    ];

    it('debe retornar las calificaciones del barrio', async () => {
      mockCalificacionesRepository.find.mockResolvedValue(mockCalificaciones);

      const result = await service.findAll(barrioId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { barrio: { id: barrioId } },
        relations: { usuario: true },
      });
      expect(result).toEqual(mockCalificaciones);
    });
  });
});

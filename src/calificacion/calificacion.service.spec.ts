import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalificacionService } from './calificacion.service';
import { Calificacion } from './entities/calificacion.entity';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';


describe('CalificacionService', () => {
  let service: CalificacionService;
  let repository: Repository<Calificacion>;

  // 1. MOCK DEL REPOSITORIO DE TYPEORM
  // Creamos un objeto falso con Jest functions (jest.fn()) para simular la BD
  const mockCalificacionesRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    // 2. CONFIGURACIÓN DEL MÓDULO DE PRUEBA DE NESTJS
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalificacionService,
        {
          // Reemplazamos la conexión real a TypeORM por nuestro mock
          provide: getRepositoryToken(Calificacion),
          useValue: mockCalificacionesRepository,
        },
      ],
    }).compile();

    service = module.get<CalificacionService>(CalificacionService);
    repository = module.get<Repository<Calificacion>>(
      getRepositoryToken(Calificacion),
    );

    // Limpiamos los contadores e historiales de llamadas entre prueba y prueba
    jest.clearAllMocks();
  });

  it('debe estar definido el servicio', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    // Datos de prueba (Fixtures)
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
    };

    it('debe crear y guardar una calificación exitosamente (Camino Feliz)', async () => {
      // 1. ARRANGE (Preparar respuestas del Mock)
      mockCalificacionesRepository.create.mockReturnValue(
        mockCalificacionCreada,
      );
      mockCalificacionesRepository.save.mockResolvedValue(
        mockCalificacionCreada,
      );

      // 2. ACT (Ejecutar el método real)
      const result = await service.create(
        createCalificacionDto,
        barrioId,
        usuarioId,
      );

      // 3. ASSERT (Verificaciones)
      // A. Verificar que el repositorio invocó create con el DTO y los IDs de relación
      expect(repository.create).toHaveBeenCalledWith({
        ...createCalificacionDto,
        barrio: { id: barrioId },
        usuario: { id: usuarioId },
      });

      // B. Verificar que save fue llamado con el objeto retornado por create
      expect(repository.save).toHaveBeenCalledWith(mockCalificacionCreada);

      // C. Verificar que la función retorna exactamente lo esperado
      expect(result).toEqual(mockCalificacionCreada);
    });

    it('debe capturar errores de base de datos y pasarlos a handleDBException', async () => {
      // 1. ARRANGE (Simular que TypeORM falla en el save, por ejemplo por violación de llave foránea)
      const dbError = new Error('Database connection failed');
      mockCalificacionesRepository.create.mockReturnValue(
        mockCalificacionCreada,
      );
      mockCalificacionesRepository.save.mockRejectedValue(dbError);

      // 2. ACT & 3. ASSERT
      // Esperamos que la promesa sea rechazada cuando salta la excepción
      await expect(
        service.create(createCalificacionDto, barrioId, usuarioId),
      ).rejects.toThrow();
    });
  });
});

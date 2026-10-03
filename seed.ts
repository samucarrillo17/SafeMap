
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { BarrioService } from './src/barrio/barrio.service';


async function runSeed() {
  console.log('🌱 Inicializando contexto de NestJS para Seeding...');

  // 1. Crea la app en modo 'Contexto Standalone' (sin servidor HTTP)
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // 2. Inyecta el BarrioService desde el contenedor de dependencias
    const barrioService = app.get(BarrioService);

    console.log('⏳ Insertando barrios en la base de datos...');
    const result = await barrioService.seedBarrios();

    console.log('✅ Seeding completado con éxito:', result);
  } catch (error) {
    console.error('❌ Error crítico durante el proceso de Seeding:', error);
    process.exitCode = 1;
  } finally {
    // 3. Cierra conexiones a la BD y destruye el contexto de la app
    await app.close();
    console.log('👋 Proceso finalizado.');
  }
}

runSeed();

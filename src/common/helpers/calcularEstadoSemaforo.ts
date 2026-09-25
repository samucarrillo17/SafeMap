import { EstadoSemaforo } from "../../barrio/interfaces/estado-semaforo.interface";


export function calcularEstadoSemaforo(
  promedio: number,
  totalCalificaciones: number,
): EstadoSemaforo {
  if (totalCalificaciones === 0) {
    return EstadoSemaforo.SIN_CALIFICAR;
  }

  if (promedio >= 4.0) {
    return EstadoSemaforo.VERDE;
  }

  if (promedio >= 2.5) {
    return EstadoSemaforo.AMARILLO;
  }

  return EstadoSemaforo.ROJO;
}

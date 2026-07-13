import { Injectable } from '@angular/core';

// TODO: DolarService orquesta la obtención del valor del dólar con caché
// diaria en SQLite (una sola llamada HTTP por día):
//   1. Inyectar BdService y ApiService.
//   2. obtenerValorDolar(): Promise<number>
//      a. const hoy = new Date().toISOString().slice(0, 10);
//      b. const cacheado = await this.bdService.obtenerValorDolar(hoy);
//      c. Si existe, retornar cacheado.valor sin llamar a la API.
//      d. Si no existe, llamar a firstValueFrom(this.apiService.get<{ valor: number }>('dolar'))
//         (endpoint expuesto por la API en Python).
//      e. Persistir el resultado con this.bdService.guardarValorDolar({ fecha: hoy, valor }).
//      f. Retornar valor.

@Injectable({
  providedIn: 'root'
})
export class DolarService {
}

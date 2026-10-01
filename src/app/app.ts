import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  busqueda: string = 'Arrabiata';
  recetaActual: any = null;

  constructor(private http: HttpClient) {}

  mostrarModal(titulo: string, texto: string, icono: 'success' | 'info' | 'error' = 'info') {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: icono,
      confirmButtonText: 'Aceptar'
    });
  }

  // MÉTODO 1: Buscar por Nombre
  metodo1_BuscarPorNombre() {
    if (!this.busqueda) return;
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${this.busqueda}`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        if (data.meals && data.meals.length > 0) {
          this.recetaActual = data.meals[0];
          this.mostrarModal('¡Receta Encontrada!', `Platillo: ${this.recetaActual.strMeal}`, 'success');
        } else {
          this.mostrarModal('Sin resultados', 'No se encontró la receta con ese nombre.', 'error');
        }
      },
      error: () => this.mostrarModal('Error', 'Fallo al conectar con la API', 'error')
    });
  }

  // MÉTODO 2: Obtener Receta Aleatoria
  metodo2_RecetaAleatoria() {
    const url = 'https://www.themealdb.com/api/json/v1/1/random.php';
    this.http.get<any>(url).subscribe({
      next: (data) => {
        if (data.meals && data.meals.length > 0) {
          this.recetaActual = data.meals[0];
          this.mostrarModal('¡Receta Aleatoria!', `Te tocó: ${this.recetaActual.strMeal}`, 'info');
        } else {
          this.mostrarModal('Sin resultados', 'No se pudo obtener la receta aleatoria.', 'error');
        }
      },
      error: () => this.mostrarModal('Error', 'Fallo al obtener la receta aleatoria', 'error')
    });
  }

  // MÉTODO 3: Buscar por ID
  metodo3_BuscarPorId(id?: string) {
    const idABuscar = id || this.busqueda || '52772';
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idABuscar}`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        if (data.meals && data.meals.length > 0) {
          this.recetaActual = data.meals[0];
          this.mostrarModal('¡Receta Encontrada!', `Platillo: ${this.recetaActual.strMeal}`, 'success');
        } else {
          this.mostrarModal('Sin resultados', `No se encontró receta con el ID ${idABuscar}.`, 'error');
        }
      },
      error: () => this.mostrarModal('Error', 'Fallo al buscar por ID', 'error')
    });
  }

  // MÉTODO 4: Buscar por Categoría
  metodo4_BuscarPorCategoria(cat?: string) {
    const categoria = cat || this.busqueda || 'Seafood';
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        if (data.meals && data.meals.length > 0) {
          const primerId = data.meals[0].idMeal;
          this.metodo3_BuscarPorId(primerId);
        } else {
          this.mostrarModal('Sin resultados', `No se encontraron platillos en la categoría ${categoria}.`, 'error');
        }
      },
      error: () => this.mostrarModal('Error', 'Fallo al consultar por categoría', 'error')
    });
  }
}
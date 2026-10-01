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
  categoriaSeleccionada: string = 'Seafood'; // Categoría por defecto
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
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${this.busqueda.trim()}`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        if (data.meals && data.meals.length > 0) {
          this.recetaActual = data.meals[0];
          this.mostrarModal('¡Receta Encontrada!', `Platillo: ${this.recetaActual.strMeal}`, 'success');
        } else {
          this.mostrarModal('Sin resultados', 'No se encontró receta con ese nombre.', 'error');
        }
      },
      error: () => this.mostrarModal('Error', 'Fallo al conectar con la API', 'error')
    });
  }

  // MÉTODO 2: Receta Aleatoria
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
    const idABuscar = id || this.busqueda.trim() || '52772';
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

  // MÉTODO 4: Buscar por Categoría (Corregido y optimizado)
  metodo4_BuscarPorCategoria() {
    // Si el usuario escribió en la caja de texto usamos eso, sino la selección desplegable
    let cat = this.busqueda.trim() || this.categoriaSeleccionada;
    
    // Formatear: Primera letra mayúscula, el resto minúsculas (ej: "seafood" -> "Seafood")
    cat = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();

    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`;
    
    this.http.get<any>(url).subscribe({
      next: (data) => {
        if (data.meals && data.meals.length > 0) {
          // Tomamos el primer platillo de la categoría y buscamos su receta completa por ID
          const primerId = data.meals[0].idMeal;
          this.obtenerDetalleCompleto(primerId, cat);
        } else {
          this.mostrarModal('Sin resultados', `No hay platillos para la categoría "${cat}". Intenta con: Seafood, Beef, Chicken, Dessert, Pasta.`, 'error');
        }
      },
      error: () => this.mostrarModal('Error', 'Fallo al consultar por categoría', 'error')
    });
  }

  // Función auxiliar para traer la receta completa con foto e instrucciones
  private obtenerDetalleCompleto(id: string, categoria: string) {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        if (data.meals && data.meals.length > 0) {
          this.recetaActual = data.meals[0];
          this.mostrarModal('Categoría Cargada', `Mostrando el primer platillo de ${categoria}: ${this.recetaActual.strMeal}`, 'success');
        }
      }
    });
  }
}
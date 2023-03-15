import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { LocalstorageService } from '../localstorage.service';

/**
 * @title Basic use of `<table mat-table>`
 */

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})


export class DashboardComponent {
  observaciones:string='';
  detenciones: any = null;
  total_detenciones: number = 0;
  total_menores: number = 0;
  show:boolean= false;
  activo:boolean= true;
  m_edad:number= 0;
  pintar:boolean=false;
  detencion_reciente: Date | undefined;
  total_dependencia9: number = 0;
  total_dependencia23: number = 0;
  total_dependencia24: number = 0;
  edad: any[]= [];
  detenciones_ordenado: any[] = [];
  columnsToDisplay = ['ID', 'FECHA', 'APELLIDO Y NOMBRE', 'DIAS', 'DEPENDENCIA', 'DELITO', 'expand'];
  dataSource:any []= [];
  columnsToDisplayWithExpand = [...this.columnsToDisplay,];
  expandedElement!: Detenciones | null;


  constructor(private httpApiService: ApiService, private LocalstorageService: LocalstorageService) {
  }

  ngOnInit() {
    (document.getElementById('obs') as HTMLInputElement).style.display = "none";
    this.cargarDetenciones();
  }
  //consumir servicio
  cargarDetenciones() {
    this.httpApiService.getDetenciones()
      .subscribe((response) => {
        this.detenciones = response;
      })
  }
  //cargar datos en tabla
  listDetenciones() {
    //this.cargarDetenciones();
    this.dataSource = this.detenciones;
    this.show = true;
    this.detenciones_ordenado = this.detenciones.sort(function (a: any, b: any) {
      if (a.fecha > b.fecha) { return -1; }
      if (a.fecha < b.fecha) { return 1; }
      return 0;
    })
    //this.mostrar(this.detenciones)

  }
  //funcion que invoca al campo observaciones
  grabarReporte() {
    (document.getElementById('obs') as HTMLInputElement).style.display = "block";
    (document.getElementById('grabar') as HTMLInputElement).style.display = "block";
    this.activo = false;
    //localStorage.clear();
  }
  //funcion que graba los datos en el localStorage
  grabar() {
    var x = (document.getElementById("obser") as HTMLInputElement).value;
    if (!x.trim()) {
      alert('Complete el Campo');
      (document.getElementById("obser") as HTMLInputElement).focus();
    } else {
      this.LocalstorageService.almacenar('REP_DET', ({ Total_Detenidos: this.total_detenciones, Total_Menores: this.total_menores, Detención_Reciente: this.detencion_reciente , Observaciones: this.observaciones }))
      window.location.reload();
    }
  }
  //funcion que calcula totales y los muestra en pantalla
  calcularReporte() {
    this.show = false;
    (document.getElementById('botonG') as HTMLInputElement).style.display = "block";
    //console.log('calcular Reporte Totales');
    this.total_detenciones = this.detenciones.length;
    this.calcularEdad();
    this.totalPorDependencia();
    this.detencion_reciente = this.detenciones_ordenado[length].fecha
  }

  //funcion que calcula edad para calculat total de menores
  calcularEdad() {
    for (var i = 0; i < this.detenciones.length; i++) {
      var fc = new Date().getFullYear();
      var fn = new Date(this.detenciones[i].persona.fecha_nacimiento).getFullYear();
      var fn1 = (fc - fn);
      this.edad[i] = fn1
      //console.log(this.edad)
      if (fn1 < 18) {
        this.total_menores = this.total_menores + 1;
      }
    }
    //console.log(this.edad)
  }
  //calcular edad para destacar filas
  mostrar(x: string) {
    this.m_edad = new Date().getFullYear() - new Date(x).getFullYear();
    if(this.m_edad < 18){
    return this.pintar=true;
    }else{
      return this.pintar=false;
    }
  }

  //funcion que calcula total por dependencia
  totalPorDependencia() {
    for (var i = 0; i < this.detenciones.length; i++) {
      if (this.detenciones[i].dependencia?.dependencia_id == 9) {
        this.total_dependencia9 = this.total_dependencia9 + 1;
      } else
        if (this.detenciones[i].dependencia?.dependencia_id == 23) {
          this.total_dependencia23 = this.total_dependencia23 + 1;
        } else
          if (this.detenciones[i].dependencia?.dependencia_id == 24) {
            this.total_dependencia24 = this.total_dependencia24 + 1;
          }
    }
  }
}

export interface Detenciones {
  detencion_id: number
  fecha: string,
  cantidad_dias: number
  persona: {
    numero_documento: number
    apellido: string
    nombre: string
    fecha_nacimiento: string
  },
  dependencia: {
    dependencia_id: number
    descripcion: string
  },
  delito: string
}

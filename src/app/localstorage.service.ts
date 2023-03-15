import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor(private _snackBar: MatSnackBar) { }
  almacenar(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      this.openSnackBar_exito()
    } catch (e) {
      this.openSnackBar_error()
      console.log(e)

    }
  }

  openSnackBar_error() {
    this._snackBar.open('ERROR!!! No se pudo completar la operación.', '', {
      duration:5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'error'
    }
    );
  }
  openSnackBar_exito() {
    this._snackBar.open('Exito!!! Se guardo correctamente.', '',{
      duration:5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'exito'
    }
    );
  }
}

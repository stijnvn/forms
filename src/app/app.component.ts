import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { concatWith, defer, delay, Observable, of, tap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    MatCheckbox,
    JsonPipe,
    ReactiveFormsModule,
  ],
})
export class AppComponent {
  title = 'forms';

  form = new FormGroup({
    isBlueEnabled: new FormControl<boolean>(false),
    blue: new FormGroup({
      blueInput: new FormControl<string>(''),
      isGreenEnabled: new FormControl<boolean>(false),
      green: new FormGroup({
        greenInput: new FormControl<string>(''),
        isYellowEnabled: new FormControl<boolean>(false),
        yellow: new FormGroup({
          yellowInput: new FormControl<string>(''),
        }),
      }),
    }),
  });

  constructor() {
    valueChanges(this.form.controls.isBlueEnabled).subscribe((value) => {
      if (value) {
        console.log('🟦 valueChanges checkbox: enable blue');
        this.form.controls.blue.enable();
      } else {
        console.log('🟦 valueChanges checkbox: disable blue');
        this.form.controls.blue.disable();
      }
    });

    valueChanges(this.form.controls.blue.controls.isGreenEnabled)
      .pipe(
        delay(0),
        tap((value) => {
          if (!this.form.controls.blue.enabled) {
            return;
          }
          if (value) {
            console.log('🟩 valueChanges checkbox: enable green');
            this.form.controls.blue.controls.green.enable();
          } else {
            console.log('🟩 valueChanges checkbox: disable green');
            this.form.controls.blue.controls.green.disable();
          }
        })
      )
      .subscribe();

    valueChanges(
      this.form.controls.blue.controls.green.controls.isYellowEnabled
    )
      .pipe(
        delay(0),
        tap((value) => {
          if (!this.form.controls.blue.controls.green.enabled) {
            return;
          }
          if (value) {
            console.log('🟨 valueChanges checkbox: enable yellow');
            this.form.controls.blue.controls.green.controls.yellow.enable();
          } else {
            console.log('🟨 valueChanges checkbox: disable yellow');
            this.form.controls.blue.controls.green.controls.yellow.disable();
          }
        })
      )
      .subscribe();

    this.form.valueChanges.subscribe((value) => {
      console.log('🟥 valueChanges formGroup: red', value);
    });

    this.form.controls.blue.valueChanges.subscribe((value) => {
      console.log('🟦 valueChanges formGroup: blue', value);
    });

    this.form.controls.blue.controls.green.valueChanges.subscribe((value) => {
      console.log('🟩 valueChanges formGroup: green', value);
    });

    this.form.controls.blue.controls.green.controls.yellow.valueChanges.subscribe(
      (value) => {
        console.log('🟨 valueChanges formGroup: yellow', value);
      }
    );
  }
}

export function valueChanges<T>(control: FormControl<T>): Observable<T> {
  return defer(() => {
    return of(control.value).pipe(concatWith(control.valueChanges));
  });
}

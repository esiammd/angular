import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormUtils } from '../../../utils/form.util';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  imports: [JsonPipe, ReactiveFormsModule],
})
export class RegisterPageComponent {
  private fb = inject(FormBuilder);
  formUtil = FormUtils;

  myForm = this.fb.group(
    {
      name: [
        '',
        [Validators.required, Validators.pattern(this.formUtil.namePattern)],
      ],
      email: [
        '',
        [Validators.required, Validators.pattern(this.formUtil.emailPattern)],
        this.formUtil.checkingServerResponse,
      ],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(this.formUtil.notOnlySpacesPattern),
          this.formUtil.notStrider,
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: [
        this.formUtil.isFieldOneEqualFieldTwo('password', 'confirmPassword'),
      ],
    },
  );

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    console.log(this.myForm.value);
  }
}

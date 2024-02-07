import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-modalfiscal',
  standalone: true,
  imports: [],
  templateUrl: './modalfiscal.component.html',
  styleUrl: './modalfiscal.component.scss'
})

export class ModalfiscalComponent {
  constructor(public modalRef: MdbModalRef<ModalfiscalComponent>) {}
}

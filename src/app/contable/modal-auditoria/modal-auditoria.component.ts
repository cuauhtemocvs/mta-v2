import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-modal-auditoria',
  standalone: true,
  imports: [],
  templateUrl: './modal-auditoria.component.html',
  styleUrl: './modal-auditoria.component.scss'
})
export class ModalAuditoriaComponent {
  constructor(public modalRef: MdbModalRef<ModalAuditoriaComponent>) {}
}

import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-modal-contable',
  standalone: true,
  imports: [],
  templateUrl: './modal-contable.component.html',
  styleUrl: './modal-contable.component.scss'
})
export class ModalContableComponent {
  constructor(public modalRef: MdbModalRef<ModalContableComponent>) {}
}

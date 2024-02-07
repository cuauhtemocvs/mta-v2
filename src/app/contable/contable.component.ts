import { Component } from '@angular/core';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ModalAuditoriaComponent } from './modal-auditoria/modal-auditoria.component';
import { ModalfiscalComponent } from './modalfiscal/modalfiscal.component';
import { ModalContableComponent } from './modal-contable/modal-contable.component';

@Component({
  selector: 'app-contable',
  templateUrl: './contable.component.html',
  styleUrls: ['./contable.component.scss']
})
export class ContableComponent {
  modalRefAuditoria: MdbModalRef<ModalAuditoriaComponent> | null = null;
  modalRefFiscal: MdbModalRef<ModalfiscalComponent> | null = null;
  modalRefContable: MdbModalRef<ModalContableComponent> | null = null;

  constructor(private modalService: MdbModalService) {}

  openModal(tipo:string) {
    console.log(tipo);
    if(tipo == 'fiscales') this.modalRefFiscal = this.modalService.open(ModalfiscalComponent);
    if(tipo == 'auditoria') this.modalRefAuditoria = this.modalService.open(ModalAuditoriaComponent);
    if(tipo == 'contables') this.modalRefContable = this.modalService.open(ModalContableComponent);
  }
  
  scrollToElement(html:any): void {
    console.log(html);
    html.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }
}

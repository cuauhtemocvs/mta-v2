import { Component } from '@angular/core';

@Component({
  selector: 'app-juridico',
  templateUrl: './juridico.component.html',
  styleUrls: ['./juridico.component.scss']
})
export class JuridicoComponent {
  scrollToElement(html:any): void {
    console.log(html);
    html.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }
}

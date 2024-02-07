import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-arquitectura',
  templateUrl: './arquitectura.component.html',
  styleUrls: ['./arquitectura.component.scss']
})
export class ArquitecturaComponent {

  scrollToElement(html:any): void {
    console.log(html);
    html.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

}

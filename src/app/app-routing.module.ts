import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ArquitecturaComponent } from './arquitectura/arquitectura.component';
import { ContableComponent } from './contable/contable.component';
import { JuridicoComponent } from './juridico/juridico.component';

const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'arquitectura', component: ArquitecturaComponent},
  {path:'contable', component: ContableComponent},
  {path:'juridico', component: JuridicoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

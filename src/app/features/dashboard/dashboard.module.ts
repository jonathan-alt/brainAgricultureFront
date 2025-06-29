import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "../../pages/home/home.component";

@NgModule({
  declarations: [],
  imports: [CommonModule, HomeComponent],
  exports: [HomeComponent],
})
export class DashboardModule {}

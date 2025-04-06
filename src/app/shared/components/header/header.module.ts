import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';


@NgModule({
    declarations: [
        HeaderComponent
    ],
    imports: [
        CommonModule,
        MatToolbarModule,
        MatIconModule,
    ]
})
export class HeaderModule { }

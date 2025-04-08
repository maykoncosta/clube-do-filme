import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeModule } from './views/home/home.module';
import { HeaderComponent } from './shared/components/header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { InviteComponent } from './views/invite/invite.component';
import { LoginComponent } from './views/login/login.component';
import { FormsModule } from '@angular/forms';
import { SignupComponent } from './views/signup/signup.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { HeaderModule } from './shared/components/header/header.module';
import { CreateGroupComponent } from './views/create-group/create-group.component';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { GroupComponent } from './views/group/group.component';
import { MyGroupsComponent } from './views/my-groups/my-groups.component';
import { PerfilComponent } from './views/perfil/perfil.component';
import { getStorage, provideStorage } from '@angular/fire/storage';



@NgModule({
  declarations: [
    AppComponent,
    InviteComponent,
    LoginComponent,
    SignupComponent,
    CreateGroupComponent,
    GroupComponent,
    MyGroupsComponent,
    PerfilComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HomeModule,
    HeaderModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()), 

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
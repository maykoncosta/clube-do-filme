import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { SignupComponent } from './views/signup/signup.component';
import { AuthRedirectGuard } from './core/guards/auth-redirect.guard';
import { HomeComponent } from './views/home/home.component';
import { CreateGroupComponent } from './views/create-group/create-group.component';
import { GroupComponent } from './views/group/group.component';
import { MyGroupsComponent } from './views/my-groups/my-groups.component';
import { InviteComponent } from './views/invite/invite.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthRedirectGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [AuthRedirectGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'criar-grupo', component: CreateGroupComponent },
  { path: 'grupo/:id', component: GroupComponent },
  { path: 'meus-grupos', component: MyGroupsComponent },
  { path: 'convite/:id', component: InviteComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  },
  {
    path: 'selecMode/:players',
    loadChildren: () => import('./hotseat/hotseat.module').then( m => m.HotseatPageModule)
  },
  {
    path: 'selecMode/:players',
    loadChildren: () => import('./hotseat/hotseat.module').then( m => m.HotseatPageModule)
  },
  {
    path: 'rules',
    loadChildren: () => import('./rules/rules.module').then( m => m.RulesPageModule)
  },
  {//2 player advanced
    path: 'advanced',
    loadChildren: () => import('./advanced/advanced.module').then( m => m.AdvancedPageModule)
  },
  {//2 player basic
    path: 'basic',
    loadChildren: () => import('./basic/basic.module').then( m => m.BasicPageModule)
  },
  {
    path: 'tutorial',
    loadChildren: () => import('./tutorial/tutorial.module').then( m => m.TutorialPageModule)
  },
  {
    path: 'units',
    loadChildren: () => import('./units/units.module').then( m => m.UnitsPageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./help/help.module').then( m => m.HelpPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'credits',
    loadChildren: () => import('./credits/credits.module').then( m => m.CreditsPageModule)
  },
  {//1 player basic
    path: 'solo',
    loadChildren: () => import('./solo/solo.module').then( m => m.SoloPageModule)
  },
  {
    path: 'solo-base',
    loadChildren: () => import('./solo-base/solo-base.module').then( m => m.SoloBasePageModule)
  },
  {//1 player advanced
    path: 'solo-advanced',
    loadChildren: () => import('./solo-advanced/solo-advanced.module').then( m => m.SoloAdvancedPageModule)
  },
  {
    path: 'test',
    loadChildren: () => import('./test/test.module').then( m => m.TestPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

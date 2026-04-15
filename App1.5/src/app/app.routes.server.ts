import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'editar/:id',
    renderMode: RenderMode.Client 
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender 
  }
];
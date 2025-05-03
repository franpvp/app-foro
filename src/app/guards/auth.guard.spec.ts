import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        AuthGuard
      ]
    });

    guard = TestBed.inject(AuthGuard);
    localStorage.clear(); // limpia antes de cada test

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/test' } as RouterStateSnapshot;
  });

  it('debería permitir el acceso si token y userId están presentes en localStorage', () => {
    localStorage.setItem('token', 'abc123');
    localStorage.setItem('userId', '1');

    const result = guard.canActivate(mockRoute, mockState);
    expect(result).toBeTrue();
  });

  it('debería redirigir si no hay token o userId en localStorage', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    const result = guard.canActivate(mockRoute, mockState);
    expect(result).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});

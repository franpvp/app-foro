import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'isLoggedIn',
      'logout',
      'getUsername',
      'getUserRole' // agregado para evitar error en la plantilla
    ]);

    mockAuthService.getUserRole.and.returnValue('ADMIN'); // valor por defecto

    spyOn(console, 'log'); // evita logs en consola de test

    await TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges(); // dispara ngOnInit y detección de cambios
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the menu open state', () => {
    expect(component.isMenuOpen).toBeFalse();
    component.toggleMenu();
    expect(component.isMenuOpen).toBeTrue();
    component.toggleMenu();
    expect(component.isMenuOpen).toBeFalse();
  });

  it('should call logout and navigate to /login on success', () => {
    mockAuthService.getUsername.and.returnValue('fran');
    mockAuthService.logout.and.returnValue(of('Logout exitoso'));

    component.logout();

    expect(mockAuthService.logout).toHaveBeenCalledWith('fran');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should retry logout on error and still navigate to /login', () => {
    mockAuthService.getUsername.and.returnValue('fran');
    mockAuthService.logout.and.returnValues(
      throwError(() => new Error('Error logout')),
      of('Retry logout')
    );

    component.logout();

    expect(mockAuthService.logout).toHaveBeenCalledTimes(2);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should return the username from localStorage', () => {
    localStorage.setItem('username', 'fran');
    expect(component.getUsername()).toBe('fran');
  });

  it('should get the role from AuthService', () => {
    expect(mockAuthService.getUserRole).toHaveBeenCalled();
    expect(mockAuthService.getUserRole()).toBe('ADMIN');
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [AuthService]
        });
        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
        router = TestBed.inject(Router);

        localStorage.clear();
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should login and set user state', () => {
        const mockResponse = {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            role: 'JOB_SEEKER',
            token: 'fake-token',
            refreshToken: 'fake-refresh'
        };

        service.login({ email: 'test@example.com', password: 'password' }).subscribe();

        const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);

        expect(service.isAuthenticated()).toBeTrue();
        expect(service.currentUser()?.email).toBe('test@example.com');
        expect(localStorage.getItem('revhire_token')).toBe('fake-token');
    });

    it('should logout and clear session', () => {
        spyOn(router, 'navigate');

        // Setup state
        localStorage.setItem('revhire_token', 'token');

        service.logout();

        const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
        req.flush({});

        expect(service.isAuthenticated()).toBeFalse();
        expect(localStorage.getItem('revhire_token')).toBeNull();
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
});

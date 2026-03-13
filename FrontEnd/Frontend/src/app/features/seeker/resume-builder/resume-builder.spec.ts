import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResumeBuilderComponent } from './resume-builder';
import { ResumeService } from '../../../core/services/resume.service';
import { SeekerService } from '../../../core/services/seeker.service';
import { AuthService } from '../../../core/services/auth.service';
import { of } from 'rxjs';
import { signal } from '@angular/core';

describe('ResumeBuilderComponent', () => {
    let component: ResumeBuilderComponent;
    let fixture: ComponentFixture<ResumeBuilderComponent>;
    let mockResumeService: any;
    let mockSeekerService: any;
    let mockAuthService: any;

    beforeEach(async () => {
        mockResumeService = {
            getResume: jasmine.createSpy('getResume').and.returnValue(of({})),
            saveResume: jasmine.createSpy('saveResume').and.returnValue(of({}))
        };
        mockSeekerService = {
            getProfile: jasmine.createSpy('getProfile').and.returnValue(of({}))
        };
        mockAuthService = {
            currentUser: jasmine.createSpy('currentUser').and.returnValue(signal({ name: 'Test User', email: 'test@example.com' })())
        };

        await TestBed.configureTestingModule({
            imports: [ResumeBuilderComponent, HttpClientTestingModule, RouterTestingModule],
            providers: [
                { provide: ResumeService, useValue: mockResumeService },
                { provide: SeekerService, useValue: mockSeekerService },
                { provide: AuthService, useValue: mockAuthService }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ResumeBuilderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form with user data from AuthService', () => {
        expect(component.resumeForm.get('fullName')?.value).toBe('Test User');
        expect(component.resumeForm.get('email')?.value).toBe('test@example.com');
    });

    it('should zoom in and out', () => {
        const initialZoom = component.zoomScale();
        component.zoomIn();
        expect(component.zoomScale()).toBeGreaterThan(initialZoom);
        component.zoomOut();
        expect(component.zoomScale()).toBe(initialZoom);
    });
});
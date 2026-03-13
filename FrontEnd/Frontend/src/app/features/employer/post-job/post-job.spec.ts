import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostJobComponent } from './post-job';
import { JobService } from '../../../core/services/job.service';
import { CompanyService } from '../../../core/services/company.service';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Component, signal } from '@angular/core';

describe('PostJobComponent', () => {
    let component: PostJobComponent;
    let fixture: ComponentFixture<PostJobComponent>;
    let mockJobService: any;
    let mockCompanyService: any;
    let mockAuthService: any;

    beforeEach(async () => {
        mockJobService = {
            getJobById: jasmine.createSpy('getJobById').and.returnValue(of({
                id: 1,
                title: 'Existing Job',
                description: 'Desc',
                jobType: 'FULL_TIME',
                location: 'Remote',
                salary: '₹50000 - ₹80000',
                experienceYears: 3,
                deadline: '2025-12-31'
            })),
            postJob: jasmine.createSpy('postJob').and.returnValue(of({})),
            updateJob: jasmine.createSpy('updateJob').and.returnValue(of({}))
        };
        mockCompanyService = {
            getCompany: jasmine.createSpy('getCompany').and.returnValue(of({ name: 'Test Corp' }))
        };
        mockAuthService = {
            currentUser: jasmine.createSpy('currentUser').and.returnValue({ name: 'User', companyName: 'Test Corp' })
        };

        await TestBed.configureTestingModule({
            imports: [PostJobComponent, HttpClientTestingModule, RouterTestingModule],
            providers: [
                { provide: JobService, useValue: mockJobService },
                { provide: CompanyService, useValue: mockCompanyService },
                { provide: AuthService, useValue: mockAuthService },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { params: { id: null } }
                    }
                }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PostJobComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display company name from service', () => {
        expect(component.companyDisplayName()).toBe('Test Corp');
    });

    it('should navigate through steps when form is valid', () => {
        expect(component.currentStep()).toBe(1);

        // Fill step 1 fields
        component.jobForm.patchValue({
            title: 'Software Engineer',
            location: 'Remote',
            deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
            openings: 5
        });

        component.nextStep();
        expect(component.currentStep()).toBe(2);

        component.prevStep();
        expect(component.currentStep()).toBe(1);
    });

    it('should not proceed to next step if form is invalid', () => {
        expect(component.currentStep()).toBe(1);
        component.jobForm.patchValue({ title: '' });
        component.nextStep();
        expect(component.currentStep()).toBe(1);
    });
});
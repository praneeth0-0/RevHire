import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { JobApplicantsComponent } from './job-applicants';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { SavedResumeService } from '../../../core/services/saved-resume.service';
import { SeekerService } from '../../../core/services/seeker.service';
import { ToastService } from '../../../core/services/toast.service';
import { ActivatedRoute } from '@angular/router';

describe('JobApplicantsComponent', () => {
    let component: JobApplicantsComponent;
    let fixture: ComponentFixture<JobApplicantsComponent>;
    let mockAppService: any;
    let mockAuthService: any;
    let mockSavedResumeService: any;
    let mockSeekerService: any;
    let mockToastService: any;

    beforeEach(async () => {
        mockAppService = {
            getApplicationsByEmployer: jasmine.createSpy('getApplicationsByEmployer').and.returnValue(of([])),
            updateStatus: jasmine.createSpy('updateStatus').and.returnValue(of({})),
            downloadResume: jasmine.createSpy('downloadResume').and.returnValue(of(new Blob()))
        };
        mockAuthService = {
            currentUser: jasmine.createSpy('currentUser').and.returnValue({ id: 1, role: 'EMPLOYER' })
        };
        mockSavedResumeService = {
            getSavedResumes: jasmine.createSpy('getSavedResumes').and.returnValue(of([]))
        };
        mockSeekerService = {
            getProfile: jasmine.createSpy('getProfile').and.returnValue(of({}))
        };
        mockToastService = {
            success: jasmine.createSpy('success'),
            error: jasmine.createSpy('error')
        };

        await TestBed.configureTestingModule({
            imports: [JobApplicantsComponent, RouterTestingModule, HttpClientTestingModule, FormsModule],
            providers: [
                { provide: ApplicationService, useValue: mockAppService },
                { provide: AuthService, useValue: mockAuthService },
                { provide: SavedResumeService, useValue: mockSavedResumeService },
                { provide: SeekerService, useValue: mockSeekerService },
                { provide: ToastService, useValue: mockToastService },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ jobId: '123' })
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(JobApplicantsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set currentJobId from query params', () => {
        expect(component.currentJobId()).toBe(123);
    });

    it('should filter applicants by search term', () => {
        const mockApps = [
            { id: 1, jobSeekerName: 'Alice', jobSeekerEmail: 'alice@test.com', status: 'PENDING', jobId: 123 },
            { id: 2, jobSeekerName: 'Bob', jobSeekerEmail: 'bob@test.com', status: 'PENDING', jobId: 123 }
        ];
        component.applicants.set(mockApps as any);

        component.searchTerm.set('Alice');
        fixture.detectChanges();

        expect(component.filteredApplicants().length).toBe(1);
        expect(component.filteredApplicants()[0].jobSeekerName).toBe('Alice');
    });

    it('should reset filters', () => {
        component.searchTerm.set('Alice');
        component.statusFilter.set('PENDING');
        component.resetFilters();

        expect(component.searchTerm()).toBe('');
        expect(component.statusFilter()).toBe('ALL');
    });
});
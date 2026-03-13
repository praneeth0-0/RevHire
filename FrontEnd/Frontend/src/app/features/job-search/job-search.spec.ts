import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { JobSearchComponent } from './job-search';
import { JobService } from '../../core/services/job.service';
import { ToastService } from '../../core/services/toast.service';
import { ActivatedRoute } from '@angular/router';

describe('JobSearchComponent', () => {
    let component: JobSearchComponent;
    let fixture: ComponentFixture<JobSearchComponent>;
    let mockJobService: any;
    let mockToastService: any;

    beforeEach(async () => {
        mockJobService = {
            getAllJobs: jasmine.createSpy('getAllJobs').and.returnValue(of([
                { id: 1, title: 'Software Engineer', companyName: 'Test Corp', location: 'New York', category: 'TECHNOLOGY', jobType: 'FULL_TIME', experienceYears: 3 },
                { id: 2, title: 'Product Manager', companyName: 'Test Corp', location: 'San Francisco', category: 'TECHNOLOGY', jobType: 'FULL_TIME', experienceYears: 5 }
            ])),
            toggleSave: jasmine.createSpy('toggleSave').and.returnValue(of(true)),
            isSaved: jasmine.createSpy('isSaved').and.returnValue(false)
        };
        mockToastService = {
            error: jasmine.createSpy('error'),
            success: jasmine.createSpy('success')
        };

        await TestBed.configureTestingModule({
            imports: [JobSearchComponent, RouterTestingModule, HttpClientTestingModule, FormsModule],
            providers: [
                { provide: JobService, useValue: mockJobService },
                { provide: ToastService, useValue: mockToastService },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ keyword: 'Software' })
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(JobSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with keyword from query params', () => {
        expect(component.keyword).toBe('Software');
    });

    it('should filter jobs locally', () => {
        component.keyword = 'Software';
        component.doSearch();
        expect(component.filteredJobs().length).toBe(1);
        expect(component.filteredJobs()[0].title).toBe('Software Engineer');
    });

    it('should clear all filters', () => {
        component.keyword = 'Software';
        component.selectedCategory = 'TECHNOLOGY';
        component.clearFilters();

        expect(component.keyword).toBe('');
        expect(component.selectedCategory).toBe('');
    });
});